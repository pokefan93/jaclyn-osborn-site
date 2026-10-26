import type { APIRoute } from 'astro';
import { env } from 'cloudflare:workers';
import { z } from 'zod';
import {
  authorizePortal,
  portalOrigins,
  type ControlFetcher,
} from '../../../lib/portal/auth';
import { savePortalBook } from '../../../lib/portal/books';
import { enforceEditorLimit, editorActorKey, type EditorRateLimiter } from '../../../lib/portal/rate-limit';
import { listBooks, listSeries } from '../../../lib/catalog/repository';
import { resolveCoverImagePath } from '../../../lib/catalog/covers';
import { contentSchema, getSiteContent } from '../../../lib/content';
import { POST as uploadImage } from '../admin/media';
import { PUT as saveSeries } from '../admin/series';

export const prerender = false;
const json = (data: unknown, status = 200) =>
  new Response(JSON.stringify(data), {
    status,
    headers: { 'Content-Type': 'application/json; charset=utf-8' },
  });
const portalBook = (b: Awaited<ReturnType<typeof listBooks>>[number]) => ({
  ...b,
  id: String(b.id),
  coverUrl: resolveCoverImagePath(b),
});

export const ALL: APIRoute = async (context) => {
  const { request, url } = context;
  const origin = request.headers.get('Origin');
  const allowed =
    !origin ||
    origin === url.origin ||
    portalOrigins.has(origin) ||
    (import.meta.env.DEV &&
      /^http:\/\/(localhost|127\.0\.0\.1):\d+$/.test(origin));
  const finish = async (response: Response) => {
    // Drain rejected request bodies before reusing the connection (also needed
    // by the local Workers proxy). Never read more than the normal upload limit.
    if (request.body && !request.bodyUsed) {
      const reader=request.body.getReader();let size=0;
      try { while(true){const chunk=await reader.read();if(chunk.done)break;size+=chunk.value.byteLength;if(size>1_100_000){await reader.cancel();break;}} }
      catch { await reader.cancel().catch(()=>{}); }
    }
    const headers = new Headers(response.headers);
    headers.set('Cache-Control', 'no-store');
    headers.set('X-Robots-Tag', 'noindex, nofollow');
    headers.set('Vary', 'Origin');
    if (origin && allowed) headers.set('Access-Control-Allow-Origin', origin);
    headers.set(
      'Access-Control-Allow-Methods',
      'GET, POST, PUT, DELETE, OPTIONS',
    );
    headers.set('Access-Control-Allow-Headers', 'Authorization, Content-Type');
    return new Response(response.body, { status: response.status, headers });
  };
  try {
    if (!allowed)
      return finish(json({ error: 'This origin is not allowed.' }, 403));
    if (request.method === 'OPTIONS')
      return finish(new Response(null, { status: 204 }));
    const limits=env as unknown as {EDITOR_REQUEST_LIMITER?:EditorRateLimiter;EDITOR_WRITE_LIMITER?:EditorRateLimiter};
    const ip=request.headers.get('CF-Connecting-IP') || 'local';
    await enforceEditorLimit(limits.EDITOR_REQUEST_LIMITER,await editorActorKey('ip',ip));
    const user = await authorizePortal(
      request,
      (env as unknown as { CONTROL?: ControlFetcher }).CONTROL,
    );
    const path = (context.params.path ?? '').replace(/\/+$/, '');
    const method = request.method;
    if (!['GET','HEAD'].includes(method)) await enforceEditorLimit(limits.EDITOR_WRITE_LIMITER,await editorActorKey('user',user.uid));
    if (path === 'me' && method === 'GET')
      return finish(
        json({
          ...user,
          tenant: 'jaclyn',
          isOwner: user.role === 'owner',
          canEdit: user.role !== 'viewer',
          claimable: false,
        }),
      );
    if (!['GET', 'HEAD'].includes(method)) {
      // Check actual bytes too, including requests without Content-Length.
      const reader = request.body?.getReader();
      const chunks: Uint8Array[] = [];
      let total = 0;
      if (reader)
        while (true) {
          const chunk = await reader.read();
          if (chunk.done) break;
          total += chunk.value.byteLength;
          if (total > 1_100_000) {
            await reader.cancel();
            return finish(json({ error: 'Keep uploads under 1 MB.' }, 413));
          }
          chunks.push(chunk.value);
        }
      const bytes = new Uint8Array(total);
      let offset = 0;
      for (const c of chunks) {
        bytes.set(c, offset);
        offset += c.length;
      }
      // Delegate handlers receive a fresh, bounded body.
      context = {
        ...context,
        request: new Request(request.url, {
          method,
          headers: request.headers,
          body: bytes,
        }),
      };
    }
    if (path === 'uploads/image' && method === 'POST') {
      const result = await uploadImage(context);
      const body = (await result.json()) as { url?: string; error?: string };
      return finish(
        json(result.ok ? { imageUrl: body.url } : body, result.status),
      );
    }
    if (path === 'settings' || path === 'faqs') {
      const content = await getSiteContent();
      if (method === 'GET') {
        const { faqs, ...settings } = content;
        return finish(json(path === 'faqs' ? faqs : settings));
      }
      if (method === 'PUT') {
        const input = await context.request.json();
        if (
          path === 'settings' &&
          (!input || typeof input !== 'object' || Array.isArray(input))
        )
          return finish(json({ error: 'Settings must be an object.' }, 400));
        const next = contentSchema.parse(
          path === 'faqs'
            ? { ...content, faqs: input }
            : {
                ...content,
                ...(input as Record<string, unknown>),
                faqs: content.faqs,
              },
        );
        await env.DB.prepare(
          "INSERT INTO site_settings (key,value) VALUES ('site_content',?) ON CONFLICT(key) DO UPDATE SET value=excluded.value,updated_at=CURRENT_TIMESTAMP",
        )
          .bind(JSON.stringify(next))
          .run();
        const { faqs, ...settings } = await getSiteContent();
        return finish(json(path === 'faqs' ? faqs : settings));
      }
    }
    if (path === 'series') {
      if (method === 'GET') return finish(json(await listSeries(true)));
      if (method === 'PUT') return finish(await saveSeries(context));
    }
    if (path === 'public/catalog' && method === 'GET')
      return finish(
        json({
          books: (await listBooks(true)).map(portalBook),
          series: await listSeries(true),
        }),
      );
    if (path === 'books' && method === 'GET')
      return finish(json((await listBooks(true)).map(portalBook)));
    const match = path.match(/^books\/(\d+)$/);
    if (
      (path === 'books' && method === 'POST') ||
      (match && method === 'PUT')
    ) {
      const id = await savePortalBook(
        env.DB,
        await context.request.json(),
        match ? Number(match[1]) : undefined,
      );
      const saved = (await listBooks(true)).find((b) => b.id === id);
      return finish(
        json(saved ? portalBook(saved) : null, method === 'POST' ? 201 : 200),
      );
    }
    if (match && method === 'DELETE') {
      if (user.role !== 'owner')
        return finish(
          json(
            {
              error:
                'Only the site owner can delete books. Editors can hide them.',
            },
            403,
          ),
        );
      await env.DB.prepare('DELETE FROM books WHERE id=?')
        .bind(Number(match[1]))
        .run();
      return finish(json({ ok: true }));
    }
    return finish(json({ error: 'This operation is not supported.' }, 404));
  } catch (error) {
    if (error instanceof Response) {
      const response=json({ error: await error.text() }, error.status);
      const retry=error.headers.get('Retry-After');
      if(retry) response.headers.set('Retry-After',retry);
      return finish(response);
    }
    if (error instanceof z.ZodError)
      return finish(
        json(
          {
            error: 'Please check the highlighted values.',
            details: error.issues.map(
              (i) => `${i.path.join('.')}: ${i.message}`,
            ),
          },
          400,
        ),
      );
    if (error instanceof SyntaxError)
      return finish(json({ error: 'The request could not be read.' }, 400));
    console.error('Portal request failed.');
    return finish(
      json(
        { error: 'Could not complete this request. Please try again.' },
        500,
      ),
    );
  }
};

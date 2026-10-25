import { defineMiddleware } from 'astro:middleware';
import { env } from 'cloudflare:workers';
import { verifyAccess } from './lib/auth';
import { getSiteContent } from './lib/content';
import { canonicalRedirectUrl } from './lib/canonical';

export const onRequest = defineMiddleware(async (context, next) => {
  const path = context.url.pathname;
  const canonical = canonicalRedirectUrl(context.request, context.site);
  if (canonical) return Response.redirect(canonical, 308);
  const portalRoute = /^\/api\/portal(?:\/|$)/.test(path);
  const unsafeMethod = !['GET', 'HEAD', 'OPTIONS'].includes(context.request.method);
  if (unsafeMethod && !portalRoute) {
    const origin = context.request.headers.get('Origin');
    const fetchSite = context.request.headers.get('Sec-Fetch-Site');
    if (
      (origin && origin !== context.url.origin) ||
      (fetchSite && !['same-origin', 'none'].includes(fetchSite))
    ) {
      // Rejected uploads still need bounded draining before the underlying
      // connection is reused by the Workers proxy or another request.
      const reader = context.request.body?.getReader();
      if (reader) {
        let size = 0;
        while (true) {
          const chunk = await reader.read();
          if (chunk.done) break;
          size += chunk.value.byteLength;
          if (size > 1_100_000) { await reader.cancel(); break; }
        }
      }
      return new Response('This request must come from the site editor.', { status: 403 });
    }
  }
  const privateRoute = /^\/(?:admin|api\/admin)(?:\/|$)/.test(path);
  if (privateRoute) {
    const config = env as unknown as Record<string, string>;
    const localDev =
      import.meta.env.DEV &&
      ['localhost', '127.0.0.1', '[::1]'].includes(context.url.hostname);
    if (
      !localDev &&
      !(await verifyAccess(
        context.request,
        config.ACCESS_TEAM_DOMAIN,
        config.ACCESS_AUD,
      ))
    ) {
      return new Response(
        'Sign in through the protected site editor. Access is required.',
        {
          status: 401,
          headers: {
            'Cache-Control': 'no-store',
            'X-Robots-Tag': 'noindex, nofollow',
          },
        },
      );
    }
    if (!['GET', 'HEAD'].includes(context.request.method)) {
      if (
        Number(context.request.headers.get('Content-Length') ?? 0) > 1_100_000
      )
        return new Response('Upload is too large.', { status: 413 });
      if (context.request.headers.get('Origin') !== context.url.origin) {
        // Drain a bounded request before rejecting it so keep-alive connections
        // cannot carry unread request bytes into a subsequent request.
        const reader = context.request.body?.getReader();
        if (reader) {
          let size = 0;
          while (true) {
            const chunk = await reader.read();
            if (chunk.done) break;
            size += chunk.value.byteLength;
            if (size > 1_100_000) {
              await reader.cancel();
              break;
            }
          }
        }
        return new Response('This request must come from the site editor.', {
          status: 403,
        });
      }
    }
  }
  if (!path.startsWith('/api/') && !/\.(?:xml|txt)$/.test(path))
    context.locals.content = await getSiteContent();
  const response = await next();
  response.headers.set('X-Content-Type-Options', 'nosniff');
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
  response.headers.set('Strict-Transport-Security', 'max-age=31536000');
  if (privateRoute || /^\/login(?:\/|$)/.test(path)) {
    response.headers.set('Cache-Control', 'no-store');
    response.headers.set('X-Robots-Tag', 'noindex, nofollow');
    if(!response.headers.has('Content-Security-Policy')) response.headers.set('Content-Security-Policy', "frame-ancestors 'none'");
  }
  return response;
});

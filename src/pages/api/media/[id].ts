import type { APIRoute } from 'astro';
import { env } from 'cloudflare:workers';
export const GET: APIRoute = async ({ params }) => {
  if (!/^[\da-f-]{36}$/.test(params.id ?? ''))
    return new Response('Not found', { status: 404 });
  const row = await env.DB.prepare(
    'SELECT content_type,data FROM media WHERE id=?',
  )
    .bind(params.id)
    .first<{ content_type: string; data: number[] }>();
  if (!row) return new Response('Not found', { status: 404 });
  return new Response(new Uint8Array(row.data), {
    headers: {
      'Content-Type': row.content_type,
      'Cache-Control': 'public, max-age=31536000, immutable',
      'X-Content-Type-Options': 'nosniff',
    },
  });
};

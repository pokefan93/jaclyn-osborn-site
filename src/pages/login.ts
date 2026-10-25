import type { APIRoute } from 'astro';
import editor from '../editor/portal.html?raw';

export const prerender = false;
export const GET: APIRoute = () => new Response(editor, {
  headers: {
    'Content-Type': 'text/html; charset=utf-8',
    'Cache-Control': 'no-store',
    'X-Robots-Tag': 'noindex, nofollow',
    'Content-Security-Policy': "frame-ancestors 'none'",
  },
});

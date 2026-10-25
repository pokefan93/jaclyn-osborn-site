import type { APIRoute } from 'astro';
import editor from '../editor/portal.html?raw';

export const prerender = false;
export const GET: APIRoute = () => {
  const nonce=crypto.randomUUID().replaceAll('-','');
  const html=editor.replace('<script type="module">',`<script type="module" nonce="${nonce}">`);
  const policy=[
    "default-src 'none'", "base-uri 'none'", "object-src 'none'", "form-action 'self'", "frame-ancestors 'none'",
    `script-src 'self' 'nonce-${nonce}' https://www.gstatic.com https://www.google.com/recaptcha/ https://www.recaptcha.net/recaptcha/`,
    "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com", "font-src 'self' https://fonts.gstatic.com",
    "img-src 'self' https: data: blob:",
    "connect-src 'self' https://identitytoolkit.googleapis.com https://securetoken.googleapis.com https://www.googleapis.com https://www.gstatic.com https://www.google.com/recaptcha/ https://www.recaptcha.net/recaptcha/",
    "frame-src 'self' https://taylorstechsite-5982d.firebaseapp.com https://www.google.com/recaptcha/ https://www.recaptcha.net/recaptcha/",
  ].join('; ');
  return new Response(html, {
  headers: {
    'Content-Type': 'text/html; charset=utf-8',
    'Cache-Control': 'no-store',
    'X-Robots-Tag': 'noindex, nofollow',
    'Content-Security-Policy': policy,
    'Permissions-Policy': 'camera=(), microphone=(), geolocation=()',
  },
  });
};

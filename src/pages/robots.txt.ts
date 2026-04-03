// Prerendered at build time using the SITE_URL configured in astro.config.mjs.
// When SITE_URL is updated to the production domain and the site is rebuilt,
// the Sitemap reference here will reflect the new domain automatically.
export const prerender = true;

import type { APIRoute } from 'astro';

export const GET: APIRoute = ({ site }) => {
  const base = site?.toString().replace(/\/$/, '') ?? '';
  const body = [
    'User-agent: *',
    'Allow: /',
    'Disallow: /admin/',
    'Disallow: /api/',
    '',
    `Sitemap: ${base}/sitemap.xml`,
  ].join('\n');

  return new Response(body, {
    headers: { 'Content-Type': 'text/plain; charset=utf-8' },
  });
};

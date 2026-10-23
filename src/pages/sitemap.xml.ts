// Prerendered at build time using the SITE_URL configured in astro.config.mjs.
// Lists the public-facing pages only. Admin and API routes are excluded.
// When SITE_URL is updated to the production domain and the site is rebuilt,
// all loc entries here will reference the new domain automatically.
export const prerender = false;

import type { APIRoute } from 'astro';
import { getPublicCatalogData } from '../lib/catalog/repository';

const publicPages = [
  '',
  'books/',
  'series/',
  'about/',
  'contact/',
  'faq/',
  'newsletter/',
];

export const GET: APIRoute = async ({ site }) => {
  const {books} = await getPublicCatalogData();
  const base = site?.toString().replace(/\/$/, '') ?? '';
  const urls = [...publicPages, ...books.map(book => `books/${book.slug}/`)]
    .map((p) => `  <url>\n    <loc>${base}/${p}</loc>\n  </url>`)
    .join('\n');

  const xml =
    `<?xml version="1.0" encoding="UTF-8"?>\n` +
    `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n` +
    `${urls}\n` +
    `</urlset>`;

  return new Response(xml, {
    headers: { 'Content-Type': 'application/xml; charset=utf-8' },
  });
};

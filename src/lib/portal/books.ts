import { z } from 'zod';
import { slugify } from '../catalog/shared';
const text = (max = 200) => z.string().trim().max(max);
const link = text(2000).refine(
  (v) =>
    !v ||
    (() => {
      try {
        const u = new URL(v);
        return u.protocol === 'https:' && !u.username && !u.password;
      } catch {
        return false;
      }
    })(),
  'Use a full HTTPS link.',
);
const image = text(2000).refine(
  (v) => !v || /^\/(?!\/)[^\\\s]*$/.test(v) || link.safeParse(v).success,
  'Use an HTTPS image URL or /path.',
);
const format = z.enum(['ebook', 'paperback', 'hardcover', 'audiobook']);
const tags = z.array(text(80).min(1)).max(20);
const direct = z
  .object({
    id: text().optional(),
    label: text(),
    format: format.optional(),
    purchaseMode: z.enum([
      'payhip',
      'external_retailer',
      'stripe_payment_link',
      'stripe_buy_button',
      'unavailable',
    ]),
    purchaseUrl: link.optional(),
    stripeBuyButtonId: text().optional(),
    displayPrice: text(50).optional(),
  })
  .refine(
    (v) =>
      v.purchaseMode === 'unavailable' ||
      !!v.purchaseUrl ||
      (v.purchaseMode === 'stripe_buy_button' && !!v.stripeBuyButtonId),
    'Add a checkout link or choose unavailable.',
  );
export const portalBookSchema = z.object({
  title: text().min(1),
  slug: text().optional(),
  seriesSlug: text().default(''),
  seriesLabel: text().default(''),
  seriesOrder: z.coerce.number().min(0).max(9999),
  releaseDate: text(10).refine(
    (v) => !v || /^\d{4}-\d{2}-\d{2}$/.test(v),
    'Use YYYY-MM-DD.',
  ),
  shortHook: text(600).min(1),
  description: text(5000),
  genres: tags,
  vibes: tags,
  tropes: tags,
  formats: z.array(format).max(4),
  featured: z.boolean(),
  coverUrl: image,
  coverAlt: text(240).optional(),
  coverPalette: z
    .enum(['rose', 'plum', 'teal', 'gold', 'cobalt', 'sage', 'ember'])
    .default('plum'),
  catalogStatus: text().optional(),
  visible: z.boolean().optional(),
  sortPriority: z.coerce.number().int().min(-999999).max(999999).optional(),
  purchase: z.object({
    availabilityStatus: z.enum(['in_stock', 'limited', 'sold_out', 'preorder']),
    availabilityLabel: text(120).optional(),
    displayPrice: text(50).optional(),
    priceNote: text(600).optional(),
    priceSnapshotDate: text(30).optional(),
    merchandisingFlags: z
      .array(
        z.enum([
          'signed_copy',
          'direct_from_author',
          'new_release',
          'audiobook_available',
          'preorder',
        ]),
      )
      .max(5),
    signedCopy: z.boolean(),
    directFromAuthor: z.boolean(),
    signedCopyNote: text(600).optional(),
    shippingNote: text(600).optional(),
    fulfillmentNote: text(600).optional(),
    whereToBuyNote: text(600).optional(),
    directSaleFormats: z.array(direct).max(12),
    retailerLinks: z
      .array(
        z.object({
          id: text().optional(),
          retailer: text().min(1),
          label: text(),
          format: format.optional(),
          purchaseMode: z.literal('external_retailer'),
          purchaseUrl: link.refine(Boolean, 'Add a store link.'),
        }),
      )
      .max(20),
  }),
});

export async function savePortalBook(
  db: D1Database,
  raw: unknown,
  id?: number,
) {
  const b = portalBookSchema.parse(raw);
  const existing = id
    ? await db
        .prepare(
          'SELECT slug,visible,sort_priority,cover_alt FROM books WHERE id=?',
        )
        .bind(id)
        .first<{
          slug: string;
          visible: number;
          sort_priority: number;
          cover_alt: string;
        }>()
    : null;
  if (id && !existing) throw new Response('Book not found.', { status: 404 });
  const series = b.seriesSlug
    ? await db
        .prepare('SELECT id FROM series WHERE slug=?')
        .bind(b.seriesSlug)
        .first<{ id: number }>()
    : null;
  if (b.seriesSlug && !series)
    throw new Response('Select an existing series.', { status: 400 });
  const slug = existing?.slug || slugify(b.slug || b.title);
  if (!slug)
    throw new Response('Enter a title containing letters or numbers.', {
      status: 400,
    });
  if (
    !id &&
    (await db.prepare('SELECT id FROM books WHERE slug=?').bind(slug).first())
  )
    throw new Response('A book with that address already exists.', {
      status: 409,
    });
  const columns = [
    'title',
    'series_id',
    'series_label_override',
    'series_order',
    'release_date',
    'publish_year',
    'cover_image_url',
    'cover_alt',
    'short_blurb',
    'description',
    'availability_status',
    'availability_label',
    'display_price',
    'signed_copy',
    'direct_from_author',
    'visible',
    'sort_priority',
    'cover_palette',
    'featured',
    'catalog_status',
    'genres_json',
    'formats_json',
    'amazon_link',
    'retailer_link',
    'stripe_payment_link',
    'portal_details',
  ];
  const retailers = b.purchase.retailerLinks;
  const values = [
    b.title,
    series?.id ?? null,
    b.seriesLabel,
    b.seriesOrder,
    b.releaseDate,
    b.releaseDate ? Number(b.releaseDate.slice(0, 4)) : null,
    b.coverUrl,
    b.coverAlt ?? existing?.cover_alt ?? '',
    b.shortHook,
    b.description,
    b.purchase.availabilityStatus,
    b.purchase.availabilityLabel ?? '',
    b.purchase.displayPrice ?? '',
    Number(b.purchase.signedCopy),
    Number(b.purchase.directFromAuthor),
    Number(b.visible ?? (existing ? Boolean(existing.visible) : true)),
    b.sortPriority ?? existing?.sort_priority ?? 0,
    b.coverPalette,
    Number(b.featured),
    b.catalogStatus ?? '',
    JSON.stringify(b.genres),
    JSON.stringify(b.formats),
    retailers.find((r) => r.retailer.toLowerCase() === 'amazon')?.purchaseUrl ??
      '',
    retailers.find((r) => r.retailer.toLowerCase() !== 'amazon')?.purchaseUrl ??
      '',
    b.purchase.directSaleFormats[0]?.purchaseUrl ?? '',
    JSON.stringify({ purchase: b.purchase, vibes: b.vibes, tropes: b.tropes }),
  ];
  if (id)
    await db
      .prepare(
        `UPDATE books SET ${columns.map((c) => c + '=?').join(',')},updated_at=CURRENT_TIMESTAMP WHERE id=?`,
      )
      .bind(...values, id)
      .run();
  else {
    const result = await db
      .prepare(
        `INSERT INTO books (slug,${columns.join(',')}) VALUES (${['slug', ...columns].map(() => '?').join(',')})`,
      )
      .bind(slug, ...values)
      .run();
    id = Number(result.meta.last_row_id);
  }
  return id;
}

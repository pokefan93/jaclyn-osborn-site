import { env } from 'cloudflare:workers';
import type {
  AdminBookRecord,
  AdminCatalogSnapshot,
  AdminSeriesOption,
  Book,
  BooksBySeries,
  CatalogStats,
  CoverPalette,
  DirectSaleFormat,
  RetailerLink,
  Series,
} from '../../types/catalog';
import type { AdminBookInput, ReorderBookInput } from './validation';
import {
  buildCatalogStats,
  groupBooksBySeries,
  optionalText,
  parseJsonTextArray,
  releaseDateForYear,
  slugify,
  stringifyJsonArray,
  toBoolean,
} from './shared';

interface SeriesRow {
  id: number;
  slug: string;
  name: string;
  lane: string;
  tagline: string;
  description: string;
  entry_point: string;
  gradient_start: string;
  gradient_mid: string;
  gradient_end: string;
  text_color: string;
  visible: number;
  sort_priority: number;
}

interface BookRow {
  id: number;
  slug: string;
  title: string;
  series_id: number | null;
  series_label_override: string | null;
  series_order: number;
  publish_year: number | null;
  release_date: string | null;
  cover_image_url: string | null;
  cover_alt: string | null;
  short_blurb: string;
  description: string;
  availability_status: Book['purchase']['availabilityStatus'];
  availability_label: string | null;
  amazon_link: string | null;
  retailer_link: string | null;
  stripe_payment_link: string | null;
  display_price: string | null;
  signed_copy: number;
  direct_from_author: number;
  visible: number;
  sort_priority: number;
  cover_palette: CoverPalette;
  featured: number;
  catalog_status: string | null;
  genres_json: string | null;
  formats_json: string | null;
  series_slug: string | null;
  series_name: string | null;
}

function getDb() {
  if (!env.DB) {
    throw new Error('The Cloudflare D1 binding "DB" is missing.');
  }

  return env.DB;
}

function mapSeriesRow(row: SeriesRow): Series {
  return {
    id: Number(row.id),
    slug: row.slug,
    name: row.name,
    lane: row.lane,
    tagline: row.tagline,
    description: row.description,
    status: 'Series',
    entryPoint: row.entry_point,
    gradient: [row.gradient_start, row.gradient_mid, row.gradient_end],
    textColor: row.text_color,
    highlight: [],
    visible: toBoolean(row.visible),
    sortPriority: Number(row.sort_priority ?? 0),
  };
}

function buildRetailerLinks(row: BookRow): RetailerLink[] {
  const links: RetailerLink[] = [];
  const amazonLink = optionalText(row.amazon_link);
  const retailerLink = optionalText(row.retailer_link);

  if (amazonLink) {
    links.push({
      id: `${row.slug}-amazon`,
      retailer: 'Amazon',
      label: 'Amazon',
      purchaseMode: 'external_retailer',
      purchaseUrl: amazonLink,
    });
  }

  if (retailerLink) {
    links.push({
      id: `${row.slug}-retailer`,
      retailer: 'Retailer',
      label: 'More stores',
      purchaseMode: 'external_retailer',
      purchaseUrl: retailerLink,
    });
  }

  return links;
}

function buildDirectLinks(row: BookRow, formats: Book['formats']): DirectSaleFormat[] {
  const directUrl = optionalText(row.stripe_payment_link);
  if (!directUrl) {
    return [];
  }

  const preferredFormat = formats.find((format) => format !== 'audiobook');
  const displayPrice = optionalText(row.display_price);
  const signedCopy = toBoolean(row.signed_copy);
  const directFromAuthor = toBoolean(row.direct_from_author);

  return [
    {
      id: `${row.slug}-direct`,
      label: signedCopy
        ? 'Signed copy'
        : directFromAuthor
          ? 'Direct from Jaclyn'
          : 'Buy direct',
      purchaseMode: 'stripe_payment_link',
      purchaseUrl: directUrl,
      format: preferredFormat,
      displayPrice: displayPrice || undefined,
    },
  ];
}

function mapBookRow(row: BookRow): Book {
  const publishYear = row.publish_year ? Number(row.publish_year) : null;
  const releaseDate = releaseDateForYear(
    publishYear,
    optionalText(row.release_date),
  );
  const genres = parseJsonTextArray<Book['genres'][number]>(row.genres_json);
  const formats = parseJsonTextArray<Book['formats'][number]>(row.formats_json);

  return {
    id: Number(row.id),
    slug: row.slug,
    title: row.title,
    seriesId: row.series_id ? Number(row.series_id) : null,
    seriesSlug: optionalText(row.series_slug),
    seriesLabel: optionalText(row.series_name) || optionalText(row.series_label_override) || undefined,
    seriesOrder: Number(row.series_order ?? 0),
    releaseDate,
    publishYear,
    shortHook: row.short_blurb,
    description: row.description || row.short_blurb,
    genres,
    vibes: [],
    tropes: [],
    formats,
    featured: toBoolean(row.featured),
    coverPalette: row.cover_palette,
    coverImageUrl: optionalText(row.cover_image_url) || undefined,
    coverAlt: optionalText(row.cover_alt) || undefined,
    visible: toBoolean(row.visible),
    sortPriority: Number(row.sort_priority ?? 0),
    catalogStatus: optionalText(row.catalog_status) || undefined,
    purchase: {
      availabilityStatus: row.availability_status,
      availabilityLabel: optionalText(row.availability_label) || undefined,
      displayPrice: optionalText(row.display_price) || undefined,
      merchandisingFlags: [],
      signedCopy: toBoolean(row.signed_copy),
      directFromAuthor: toBoolean(row.direct_from_author),
      retailerLinks: buildRetailerLinks(row),
      directSaleFormats: buildDirectLinks(row, formats),
    },
  };
}

function mapAdminBookRow(row: BookRow): AdminBookRecord {
  const book = mapBookRow(row);

  return {
    id: book.id,
    slug: book.slug,
    title: book.title,
    seriesId: book.seriesId,
    seriesName: optionalText(row.series_name) || undefined,
    seriesSlug: optionalText(row.series_slug) || undefined,
    seriesOrder: book.seriesOrder,
    publishYear: book.publishYear ?? null,
    coverImageUrl: book.coverImageUrl ?? '',
    coverAlt: book.coverAlt ?? '',
    shortBlurb: book.shortHook,
    description: book.description,
    availabilityStatus: book.purchase.availabilityStatus,
    availabilityLabel: book.purchase.availabilityLabel ?? '',
    amazonLink: optionalText(row.amazon_link),
    retailerLink: optionalText(row.retailer_link),
    stripePaymentLink: optionalText(row.stripe_payment_link),
    displayPrice: book.purchase.displayPrice ?? '',
    signedCopy: book.purchase.signedCopy,
    directFromAuthor: book.purchase.directFromAuthor,
    visible: book.visible,
    sortPriority: book.sortPriority,
    coverPalette: book.coverPalette,
    featured: book.featured,
    seriesLabelOverride: optionalText(row.series_label_override),
    catalogStatus: book.catalogStatus ?? '',
    genres: book.genres,
    formats: book.formats,
    releaseDate: book.releaseDate,
  };
}

async function listSeries(includeHidden = false) {
  const db = getDb();
  const { results } = await db
    .prepare(
      `SELECT
        id,
        slug,
        name,
        lane,
        tagline,
        description,
        entry_point,
        gradient_start,
        gradient_mid,
        gradient_end,
        text_color,
        visible,
        sort_priority
      FROM series
      ${includeHidden ? '' : 'WHERE visible = 1'}
      ORDER BY sort_priority ASC, name ASC`,
    )
    .all<SeriesRow>();

  return (results ?? []).map(mapSeriesRow);
}

async function listBooks(includeHidden = false) {
  const db = getDb();
  const { results } = await db
    .prepare(
      `SELECT
        b.id,
        b.slug,
        b.title,
        b.series_id,
        b.series_label_override,
        b.series_order,
        b.publish_year,
        b.release_date,
        b.cover_image_url,
        b.cover_alt,
        b.short_blurb,
        b.description,
        b.availability_status,
        b.availability_label,
        b.amazon_link,
        b.retailer_link,
        b.stripe_payment_link,
        b.display_price,
        b.signed_copy,
        b.direct_from_author,
        b.visible,
        b.sort_priority,
        b.cover_palette,
        b.featured,
        b.catalog_status,
        b.genres_json,
        b.formats_json,
        s.slug AS series_slug,
        s.name AS series_name
      FROM books b
      LEFT JOIN series s ON s.id = b.series_id
      ${includeHidden ? '' : 'WHERE b.visible = 1'}
      ORDER BY
        CASE WHEN s.sort_priority IS NULL THEN 1 ELSE 0 END ASC,
        s.sort_priority ASC,
        b.sort_priority ASC,
        b.series_order ASC,
        b.title ASC`,
    )
    .all<BookRow>();

  return (results ?? []).map(mapBookRow);
}

async function listAdminBooks() {
  const db = getDb();
  const { results } = await db
    .prepare(
      `SELECT
        b.id,
        b.slug,
        b.title,
        b.series_id,
        b.series_label_override,
        b.series_order,
        b.publish_year,
        b.release_date,
        b.cover_image_url,
        b.cover_alt,
        b.short_blurb,
        b.description,
        b.availability_status,
        b.availability_label,
        b.amazon_link,
        b.retailer_link,
        b.stripe_payment_link,
        b.display_price,
        b.signed_copy,
        b.direct_from_author,
        b.visible,
        b.sort_priority,
        b.cover_palette,
        b.featured,
        b.catalog_status,
        b.genres_json,
        b.formats_json,
        s.slug AS series_slug,
        s.name AS series_name
      FROM books b
      LEFT JOIN series s ON s.id = b.series_id
      ORDER BY b.sort_priority ASC, b.title ASC`,
    )
    .all<BookRow>();

  return (results ?? []).map(mapAdminBookRow);
}

async function getAdminBookById(id: number) {
  const db = getDb();
  const row = await db
    .prepare(
      `SELECT
        b.id,
        b.slug,
        b.title,
        b.series_id,
        b.series_label_override,
        b.series_order,
        b.publish_year,
        b.release_date,
        b.cover_image_url,
        b.cover_alt,
        b.short_blurb,
        b.description,
        b.availability_status,
        b.availability_label,
        b.amazon_link,
        b.retailer_link,
        b.stripe_payment_link,
        b.display_price,
        b.signed_copy,
        b.direct_from_author,
        b.visible,
        b.sort_priority,
        b.cover_palette,
        b.featured,
        b.catalog_status,
        b.genres_json,
        b.formats_json,
        s.slug AS series_slug,
        s.name AS series_name
      FROM books b
      LEFT JOIN series s ON s.id = b.series_id
      WHERE b.id = ?`,
    )
    .bind(id)
    .first<BookRow>();

  return row ? mapAdminBookRow(row) : null;
}

async function ensureSeriesExists(seriesId: number | null) {
  if (!seriesId) {
    return null;
  }

  const db = getDb();
  const result = await db
    .prepare('SELECT id FROM series WHERE id = ?')
    .bind(seriesId)
    .first<{ id: number }>();

  if (!result) {
    throw new Error('Please choose a valid series.');
  }

  return result.id;
}

async function slugExists(slug: string) {
  const db = getDb();
  const result = await db
    .prepare('SELECT id FROM books WHERE slug = ?')
    .bind(slug)
    .first<{ id: number }>();

  return Boolean(result);
}

async function createUniqueSlug(title: string) {
  const baseSlug = slugify(title) || 'book';
  let candidate = baseSlug;
  let counter = 2;

  while (await slugExists(candidate)) {
    candidate = `${baseSlug}-${counter}`;
    counter += 1;
  }

  return candidate;
}

async function getFallbackCoverPalette(seriesId: number | null): Promise<CoverPalette> {
  const db = getDb();

  if (seriesId) {
    const row = await db
      .prepare(
        'SELECT cover_palette FROM books WHERE series_id = ? ORDER BY series_order ASC, sort_priority ASC LIMIT 1',
      )
      .bind(seriesId)
      .first<{ cover_palette: CoverPalette }>();

    if (row?.cover_palette) {
      return row.cover_palette;
    }
  }

  return 'plum';
}

function normalizeDatabaseError(error: unknown) {
  const message = error instanceof Error ? error.message : 'Something went wrong.';

  if (message.includes('UNIQUE constraint failed')) {
    return 'That book already exists in the catalog.';
  }

  return message;
}

export async function getPublicCatalogData(): Promise<{
  books: Book[];
  series: Series[];
  booksBySeries: BooksBySeries[];
  catalogStats: CatalogStats;
}> {
  const [books, series] = await Promise.all([listBooks(false), listSeries(false)]);
  const booksBySeries = groupBooksBySeries(books, series).filter(
    (seriesEntry) => seriesEntry.books.length > 0,
  );

  return {
    books,
    series,
    booksBySeries,
    catalogStats: buildCatalogStats(books, series),
  };
}

export async function getAdminCatalogSnapshot(): Promise<AdminCatalogSnapshot> {
  const [books, series] = await Promise.all([
    listAdminBooks(),
    listSeries(true),
  ]);

  const adminSeries: AdminSeriesOption[] = series.map((seriesEntry) => ({
    id: seriesEntry.id,
    slug: seriesEntry.slug,
    name: seriesEntry.name,
  }));

  return {
    books,
    series: adminSeries,
  };
}

export async function createBook(input: AdminBookInput) {
  const db = getDb();

  try {
    const seriesId = await ensureSeriesExists(input.seriesId);
    const slug = await createUniqueSlug(input.title);
    const coverPalette = await getFallbackCoverPalette(seriesId);
    const description = input.description && input.description.length > 0
      ? input.description
      : input.shortBlurb;

    const result = await db
      .prepare(
        `INSERT INTO books (
          slug,
          title,
          series_id,
          series_order,
          publish_year,
          release_date,
          cover_image_url,
          cover_alt,
          short_blurb,
          description,
          availability_status,
          availability_label,
          amazon_link,
          retailer_link,
          stripe_payment_link,
          display_price,
          signed_copy,
          direct_from_author,
          visible,
          sort_priority,
          cover_palette,
          catalog_status,
          genres_json,
          formats_json
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      )
      .bind(
        slug,
        input.title,
        seriesId,
        input.seriesOrder,
        input.publishYear,
        releaseDateForYear(input.publishYear),
        input.coverImageUrl || null,
        input.coverAlt || null,
        input.shortBlurb,
        description,
        input.availabilityStatus,
        input.availabilityLabel || null,
        input.amazonLink || null,
        input.retailerLink || null,
        input.stripePaymentLink || null,
        input.displayPrice || null,
        input.signedCopy ? 1 : 0,
        input.directFromAuthor ? 1 : 0,
        input.visible ? 1 : 0,
        input.sortPriority,
        coverPalette,
        'Core title',
        stringifyJsonArray([]),
        stringifyJsonArray([]),
      )
      .run();

    return await getAdminBookById(Number(result.meta.last_row_id));
  } catch (error) {
    throw new Error(normalizeDatabaseError(error));
  }
}

export async function updateBook(id: number, input: AdminBookInput) {
  const db = getDb();
  const existing = await db
    .prepare(
      `SELECT
        id,
        slug,
        title,
        series_id,
        series_label_override,
        series_order,
        publish_year,
        release_date,
        cover_image_url,
        cover_alt,
        short_blurb,
        description,
        availability_status,
        availability_label,
        amazon_link,
        retailer_link,
        stripe_payment_link,
        display_price,
        signed_copy,
        direct_from_author,
        visible,
        sort_priority,
        cover_palette,
        featured,
        catalog_status,
        genres_json,
        formats_json,
        '' AS series_slug,
        '' AS series_name
      FROM books
      WHERE id = ?`,
    )
    .bind(id)
    .first<BookRow>();

  if (!existing) {
    throw new Error('That book could not be found.');
  }

  try {
    const seriesId = await ensureSeriesExists(input.seriesId);
    const description = input.description && input.description.length > 0
      ? input.description
      : existing.description || input.shortBlurb;

    await db
      .prepare(
        `UPDATE books
        SET
          title = ?,
          series_id = ?,
          series_order = ?,
          publish_year = ?,
          release_date = ?,
          cover_image_url = ?,
          cover_alt = ?,
          short_blurb = ?,
          description = ?,
          availability_status = ?,
          availability_label = ?,
          amazon_link = ?,
          retailer_link = ?,
          stripe_payment_link = ?,
          display_price = ?,
          signed_copy = ?,
          direct_from_author = ?,
          visible = ?,
          sort_priority = ?,
          updated_at = CURRENT_TIMESTAMP
        WHERE id = ?`,
      )
      .bind(
        input.title,
        seriesId,
        input.seriesOrder,
        input.publishYear,
        releaseDateForYear(input.publishYear),
        input.coverImageUrl || null,
        input.coverAlt || null,
        input.shortBlurb,
        description,
        input.availabilityStatus,
        input.availabilityLabel || null,
        input.amazonLink || null,
        input.retailerLink || null,
        input.stripePaymentLink || null,
        input.displayPrice || null,
        input.signedCopy ? 1 : 0,
        input.directFromAuthor ? 1 : 0,
        input.visible ? 1 : 0,
        input.sortPriority,
        id,
      )
      .run();

    return await getAdminBookById(id);
  } catch (error) {
    throw new Error(normalizeDatabaseError(error));
  }
}

export async function deleteBook(id: number) {
  const db = getDb();
  await db.prepare('DELETE FROM books WHERE id = ?').bind(id).run();
}

export async function reorderBook(input: ReorderBookInput) {
  const db = getDb();
  const { results } = await db
    .prepare('SELECT id, sort_priority, title FROM books ORDER BY sort_priority ASC, title ASC, id ASC')
    .all<{ id: number; sort_priority: number; title: string }>();

  const orderedBooks = results ?? [];
  const currentIndex = orderedBooks.findIndex((book) => Number(book.id) === input.bookId);

  if (currentIndex === -1) {
    throw new Error('That book could not be found.');
  }

  const swapIndex = input.direction === 'up' ? currentIndex - 1 : currentIndex + 1;
  const currentBook = orderedBooks[currentIndex];
  const swapBook = orderedBooks[swapIndex];

  if (!swapBook) {
    return await getAdminBookById(input.bookId);
  }

  await db.batch([
    db
      .prepare('UPDATE books SET sort_priority = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?')
      .bind(Number(swapBook.sort_priority), Number(currentBook.id)),
    db
      .prepare('UPDATE books SET sort_priority = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?')
      .bind(Number(currentBook.sort_priority), Number(swapBook.id)),
  ]);

  return await getAdminBookById(input.bookId);
}

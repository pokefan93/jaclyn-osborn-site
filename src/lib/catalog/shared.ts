import type {
  AvailabilityStatus,
  Book,
  BooksBySeries,
  CatalogStats,
  CoverPalette,
  FormatKey,
  Series,
} from '../../types/catalog';

export const formatLabels: Record<FormatKey, string> = {
  ebook: 'eBook',
  paperback: 'Paperback',
  hardcover: 'Hardcover',
  audiobook: 'Audiobook',
};

export const availabilityOptions: Array<{
  value: AvailabilityStatus;
  label: string;
}> = [
  { value: 'in_stock', label: 'In stock' },
  { value: 'limited', label: 'Limited stock' },
  { value: 'sold_out', label: 'Sold out' },
  { value: 'preorder', label: 'Preorder' },
];

export const coverPaletteOptions: CoverPalette[] = [
  'rose',
  'plum',
  'teal',
  'gold',
  'cobalt',
  'sage',
  'ember',
];

export function toBoolean(value: unknown) {
  if (typeof value === 'boolean') {
    return value;
  }

  if (typeof value === 'number') {
    return value === 1;
  }

  if (typeof value === 'string') {
    return ['1', 'true', 'yes', 'on'].includes(value.trim().toLowerCase());
  }

  return false;
}

export function optionalText(value: unknown) {
  return typeof value === 'string' ? value.trim() : '';
}

export function releaseDateForYear(year?: number | null, releaseDate = '') {
  if (releaseDate) {
    return releaseDate;
  }

  return year ? `${year}-01-01` : '';
}

export function parseJsonTextArray<T extends string>(value: unknown): T[] {
  if (Array.isArray(value)) {
    return value.filter((item): item is T => typeof item === 'string' && item.length > 0);
  }

  if (typeof value !== 'string' || value.trim().length === 0) {
    return [];
  }

  try {
    const parsed = JSON.parse(value);
    return Array.isArray(parsed)
      ? parsed.filter((item): item is T => typeof item === 'string' && item.length > 0)
      : [];
  } catch {
    return [];
  }
}

export function stringifyJsonArray(values: string[]) {
  return JSON.stringify(
    values
      .map((value) => value.trim())
      .filter(Boolean),
  );
}

export function slugify(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/&/g, ' and ')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

export function getBookCollectionLabel(book: Book) {
  return (
    book.seriesLabel ??
    (book.catalogStatus === 'Shared / anthology'
      ? 'Anthology'
      : book.catalogStatus === 'Contributed / co-authored'
        ? 'Contributed work'
        : 'Standalone')
  );
}

export function sortBooksForCatalog(books: Book[]) {
  return [...books].sort((left, right) => {
    const collectionCompare = getBookCollectionLabel(left).localeCompare(
      getBookCollectionLabel(right),
    );

    if (collectionCompare !== 0) {
      return collectionCompare;
    }

    const seriesCompare = left.seriesOrder - right.seriesOrder;
    if (seriesCompare !== 0) {
      return seriesCompare;
    }

    const priorityCompare = left.sortPriority - right.sortPriority;
    if (priorityCompare !== 0) {
      return priorityCompare;
    }

    return left.title.localeCompare(right.title);
  });
}

export function groupBooksBySeries(books: Book[], series: Series[]): BooksBySeries[] {
  return series.map((seriesEntry) => ({
    ...seriesEntry,
    books: books
      .filter((book) => book.seriesSlug === seriesEntry.slug)
      .sort((left, right) => {
        const seriesOrderCompare = left.seriesOrder - right.seriesOrder;
        if (seriesOrderCompare !== 0) {
          return seriesOrderCompare;
        }

        const priorityCompare = left.sortPriority - right.sortPriority;
        if (priorityCompare !== 0) {
          return priorityCompare;
        }

        return left.title.localeCompare(right.title);
      }),
  }));
}

export function buildCatalogStats(books: Book[], series: Series[]): CatalogStats {
  const allFormats = new Set(
    books.flatMap((book) => book.formats),
  );

  return {
    bookCount: books.length,
    seriesCount: series.length,
    formatCount: allFormats.size,
  };
}

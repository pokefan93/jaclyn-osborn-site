import type { Book, CatalogFilterTag, FormatKey, Series } from '../types/catalog';
import { generatedBooks, generatedSeries } from './catalog-data';

export const formatLabels: Record<FormatKey, string> = {
  ebook: 'eBook',
  paperback: 'Paperback',
  hardcover: 'Hardcover',
  audiobook: 'Audiobook',
};

export const genreVibeTags: CatalogFilterTag[] = [
  { slug: 'contemporary', label: 'Contemporary', kind: 'genre' },
  { slug: 'fantasy', label: 'Fantasy', kind: 'genre' },
  { slug: 'paranormal', label: 'Paranormal', kind: 'genre' },
  { slug: 'historical', label: 'Historical', kind: 'genre' },
];

export const series = generatedSeries as unknown as Series[];
export const books = generatedBooks as unknown as Book[];

export const seriesMap = new Map(series.map((item) => [item.slug, item]));

export const booksBySeries = series.map((item) => ({
  ...item,
  books: books
    .filter((book) => book.seriesSlug === item.slug)
    .sort((a, b) => a.seriesOrder - b.seriesOrder),
}));

export const featuredBooks = books
  .filter((book) => book.featured)
  .sort(
    (a, b) =>
      new Date(b.releaseDate).getTime() - new Date(a.releaseDate).getTime(),
  );

export const catalogStats = {
  bookCount: books.length,
  seriesCount: series.length,
  formatCount: Object.keys(formatLabels).length,
};

export function getBookCollectionLabel(book: Book) {
  return (
    seriesMap.get(book.seriesSlug)?.name ??
    book.seriesLabel ??
    (book.catalogStatus === 'Shared / anthology'
      ? 'Anthology'
      : book.catalogStatus === 'Contributed / co-authored'
        ? 'Contributed work'
        : 'Standalone')
  );
}

import type {
  Book,
  CatalogFilterTag,
  DirectSaleFormat,
  FormatKey,
  Series,
} from '../types/catalog';
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

const directSalePlaceholderBase = 'https://example.com/direct-sale-placeholder/';
const directSaleFormats: FormatKey[] = ['paperback', 'hardcover'];

function buildPlaceholderDirectSaleFormats(book: Book): DirectSaleFormat[] {
  return book.formats
    .filter((format): format is FormatKey => directSaleFormats.includes(format))
    .map((format) => ({
      id: `${book.slug}-signed-${format}`,
      label: 'Signed',
      format,
      purchaseMode: 'stripe_payment_link',
      purchaseUrl: `${directSalePlaceholderBase}${book.slug}-${format}`,
    }));
}

function withPlaceholderDirectSales(book: Book): Book {
  if (book.purchase.directSaleFormats.length > 0) {
    return book;
  }

  const placeholderFormats = buildPlaceholderDirectSaleFormats(book);

  if (placeholderFormats.length === 0) {
    return book;
  }

  return {
    ...book,
    purchase: {
      ...book.purchase,
      signedCopy: true,
      directSaleFormats: placeholderFormats,
      signedCopyNote:
        book.purchase.signedCopyNote ??
        'Signed-copy checkout links will appear here when direct sales are ready.',
      whereToBuyNote:
        book.purchase.whereToBuyNote ??
        'Retailer links are live now. Direct signed-copy checkout links will be added here when available.',
    },
  };
}

export const books = (generatedBooks as unknown as Book[]).map(withPlaceholderDirectSales);

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

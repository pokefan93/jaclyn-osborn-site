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
const directSalePlaceholderFormats: FormatKey[] = ['paperback', 'hardcover'];

type DirectSaleOverride = Partial<Book['purchase']> & {
  directSaleFormats: DirectSaleFormat[];
};

const directSaleLinkOverrides: Record<string, DirectSaleOverride> = {
  raiden: {
    directFromAuthor: true,
    directSaleFormats: [
      {
        id: 'raiden-direct-ebook',
        label: 'Direct',
        format: 'ebook',
        purchaseMode: 'stripe_payment_link',
        purchaseUrl: 'https://buy.stripe.com/test_5kQeVd0BSayt2A97KDcs800',
      },
    ],
  },
  'sent-to-a-fantasy-world-and-now-all-the-men-want-me-volume-1': {
    directFromAuthor: true,
    directSaleFormats: [
      {
        id: 'sent-to-a-fantasy-world-and-now-all-the-men-want-me-volume-1-direct-ebook',
        label: 'Direct',
        format: 'ebook',
        purchaseMode: 'stripe_payment_link',
        purchaseUrl: 'https://buy.stripe.com/test_5kQ28r4S87mhcaJ1mfcs801',
      },
    ],
  },
  'sent-to-a-fantasy-world-and-now-all-the-men-want-me-volume-2': {
    directFromAuthor: true,
    directSaleFormats: [
      {
        id: 'sent-to-a-fantasy-world-and-now-all-the-men-want-me-volume-2-direct-ebook',
        label: 'Direct',
        format: 'ebook',
        purchaseMode: 'stripe_payment_link',
        purchaseUrl: 'https://buy.stripe.com/test_28EcN5acs5e9caJfd5cs802',
      },
    ],
  },
  'sent-to-a-fantasy-world-and-now-all-the-men-want-me-volume-3': {
    directFromAuthor: true,
    directSaleFormats: [
      {
        id: 'sent-to-a-fantasy-world-and-now-all-the-men-want-me-volume-3-direct-ebook',
        label: 'Direct',
        format: 'ebook',
        purchaseMode: 'stripe_payment_link',
        purchaseUrl: 'https://buy.stripe.com/test_cNi7sL4S8eOJb6F4yrcs803',
      },
    ],
  },
  'sent-to-a-fantasy-world-and-now-all-the-men-want-me-volume-4': {
    directFromAuthor: true,
    directSaleFormats: [
      {
        id: 'sent-to-a-fantasy-world-and-now-all-the-men-want-me-volume-4-direct-ebook',
        label: 'Direct',
        format: 'ebook',
        purchaseMode: 'stripe_payment_link',
        purchaseUrl: 'https://buy.stripe.com/test_6oUcN50BScGB2A9d4Xcs804',
      },
    ],
  },
  'sent-to-a-fantasy-world-and-now-all-the-men-want-me-volume-5': {
    directFromAuthor: true,
    directSaleFormats: [
      {
        id: 'sent-to-a-fantasy-world-and-now-all-the-men-want-me-volume-5-direct-ebook',
        label: 'Direct',
        format: 'ebook',
        purchaseMode: 'stripe_payment_link',
        purchaseUrl: 'https://buy.stripe.com/test_dRm5kD1FW21XgqZ8OHcs805',
      },
    ],
  },
  'the-ghost-of-ellwood': {
    directFromAuthor: true,
    directSaleFormats: [
      {
        id: 'the-ghost-of-ellwood-direct-paperback',
        label: 'Direct',
        format: 'paperback',
        purchaseMode: 'stripe_payment_link',
        purchaseUrl: 'https://buy.stripe.com/test_14AaEXacs21Xa2B0ibcs806',
      },
    ],
  },
};

function buildPlaceholderDirectSaleFormats(book: Book): DirectSaleFormat[] {
  return book.formats
    .filter((format): format is FormatKey =>
      directSalePlaceholderFormats.includes(format),
    )
    .map((format) => ({
      id: `${book.slug}-direct-${format}`,
      label: 'Direct',
      format,
      purchaseMode: 'stripe_payment_link',
      purchaseUrl: `${directSalePlaceholderBase}${book.slug}-${format}`,
    }));
}

function withDirectSaleOptions(book: Book): Book {
  const directSaleOverride = directSaleLinkOverrides[book.slug];
  const existingDirectSaleFormats =
    directSaleOverride?.directSaleFormats ?? book.purchase.directSaleFormats;
  const existingFormats = new Set(
    existingDirectSaleFormats.map((format) => format.format),
  );
  const placeholderFormats = buildPlaceholderDirectSaleFormats(book).filter(
    (format) => !existingFormats.has(format.format),
  );
  const mergedDirectSaleFormats = [
    ...existingDirectSaleFormats,
    ...placeholderFormats,
  ];

  if (mergedDirectSaleFormats.length === 0) {
    return book;
  }

  return {
    ...book,
    purchase: {
      ...book.purchase,
      ...directSaleOverride,
      directSaleFormats: mergedDirectSaleFormats,
      whereToBuyNote:
        directSaleOverride?.whereToBuyNote ??
        book.purchase.whereToBuyNote ??
        'Retailer links are live now. Direct checkout links will be added here when available.',
    },
  };
}

export const books = (generatedBooks as unknown as Book[]).map(withDirectSaleOptions);

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

import type { Book, BooksBySeries, CatalogStats, Series } from '../types/catalog';
import {
  buildCatalogStats,
  formatLabels,
  getBookCollectionLabel,
  groupBooksBySeries,
  sortBooksForCatalog,
} from '../lib/catalog/shared';

export { formatLabels, getBookCollectionLabel };

export function buildBooksBySeries(books: Book[], series: Series[]): BooksBySeries[] {
  return groupBooksBySeries(books, series);
}

export function buildStats(books: Book[], series: Series[]): CatalogStats {
  return buildCatalogStats(books, series);
}

export function sortCatalogBooks(books: Book[]) {
  return sortBooksForCatalog(books);
}

import type {
  AvailabilityStatus,
  Book,
  BookPurchase,
  DirectSaleFormat,
  MerchandisingFlag,
} from '../types/catalog';

export interface DirectSalesDefaults {
  signedCopyNote?: string;
  shippingNote?: string;
  fulfillmentNote?: string;
  whereToBuyNote?: string;
}

export const availabilityLabels: Record<AvailabilityStatus, string> = {
  in_stock: 'In stock',
  limited: 'Limited availability',
  sold_out: 'Sold out',
  preorder: 'Preorder',
};

export const merchandisingFlagLabels: Record<MerchandisingFlag, string> = {
  signed_copy: 'Signed copy',
  direct_from_author: 'Direct from author',
  new_release: 'New release',
  audiobook_available: 'Audiobook available',
  preorder: 'Preorder',
};

export function getAvailabilityLabel(purchase: BookPurchase) {
  return purchase.availabilityLabel ?? availabilityLabels[purchase.availabilityStatus];
}

export function getMerchandisingFlags(book: Book) {
  const flags = [...book.purchase.merchandisingFlags];

  if (book.purchase.signedCopy && !flags.includes('signed_copy')) {
    flags.push('signed_copy');
  }

  if (book.purchase.directFromAuthor && !flags.includes('direct_from_author')) {
    flags.push('direct_from_author');
  }

  if (book.purchase.availabilityStatus === 'preorder' && !flags.includes('preorder')) {
    flags.push('preorder');
  }

  if (book.formats.includes('audiobook') && !flags.includes('audiobook_available')) {
    flags.push('audiobook_available');
  }

  return flags;
}

export function hasAvailableDirectSale(book: Book) {
  return book.purchase.directSaleFormats.some(
    (format) => format.purchaseMode !== 'unavailable',
  );
}

export function hasRetailerLinks(book: Book) {
  return book.purchase.retailerLinks.length > 0;
}

export function isDirectSaleDisabled(format: DirectSaleFormat) {
  return format.purchaseMode === 'unavailable';
}

export function getPurchaseSupportNotes(
  book: Book,
  defaults: DirectSalesDefaults = {},
) {
  const notes: string[] = [];
  const hasDirect = book.purchase.directSaleFormats.length > 0;
  const hasRetailers = book.purchase.retailerLinks.length > 0;

  if (book.purchase.signedCopy) {
    notes.push(book.purchase.signedCopyNote ?? defaults.signedCopyNote ?? '');
  }

  if (hasDirect) {
    notes.push(book.purchase.shippingNote ?? defaults.shippingNote ?? '');
    notes.push(book.purchase.fulfillmentNote ?? defaults.fulfillmentNote ?? '');
  }

  if (hasDirect && hasRetailers) {
    notes.push(book.purchase.whereToBuyNote ?? defaults.whereToBuyNote ?? '');
  }

  return [...new Set(notes.filter(Boolean))];
}

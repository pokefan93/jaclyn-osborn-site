export type FormatKey = 'ebook' | 'paperback' | 'hardcover' | 'audiobook';

export type CoverPalette =
  | 'rose'
  | 'plum'
  | 'teal'
  | 'gold'
  | 'cobalt'
  | 'sage'
  | 'ember';

export type AvailabilityStatus =
  | 'in_stock'
  | 'limited'
  | 'sold_out'
  | 'preorder';

export type MerchandisingFlag =
  | 'signed_copy'
  | 'direct_from_author'
  | 'new_release'
  | 'audiobook_available'
  | 'preorder';

export type PurchaseMode =
  | 'external_retailer'
  | 'stripe_payment_link'
  | 'stripe_buy_button'
  | 'unavailable';

export interface Series {
  id: number;
  slug: string;
  name: string;
  lane: string;
  tagline: string;
  description: string;
  status: string;
  entryPoint: string;
  gradient: [string, string, string];
  textColor: string;
  highlight: string[];
  visible: boolean;
  sortPriority: number;
}

export interface RetailerLink {
  id: string;
  retailer: string;
  label: string;
  purchaseMode: 'external_retailer';
  purchaseUrl: string;
}

export interface DirectSaleFormat {
  id: string;
  label: string;
  purchaseMode: 'stripe_payment_link' | 'stripe_buy_button' | 'unavailable';
  purchaseUrl?: string;
  stripeBuyButtonId?: string;
  format?: FormatKey;
  displayPrice?: string;
}

export interface BookPurchase {
  availabilityStatus: AvailabilityStatus;
  availabilityLabel?: string;
  displayPrice?: string;
  merchandisingFlags: MerchandisingFlag[];
  signedCopy: boolean;
  directFromAuthor: boolean;
  signedCopyNote?: string;
  shippingNote?: string;
  fulfillmentNote?: string;
  whereToBuyNote?: string;
  retailerLinks: RetailerLink[];
  directSaleFormats: DirectSaleFormat[];
}

export interface Book {
  id: number;
  slug: string;
  title: string;
  seriesId: number | null;
  seriesSlug: string;
  seriesLabel?: string;
  seriesOrder: number;
  releaseDate: string;
  publishYear?: number | null;
  shortHook: string;
  description: string;
  genres: string[];
  vibes: string[];
  tropes: string[];
  formats: FormatKey[];
  featured: boolean;
  coverPalette: CoverPalette;
  coverImageUrl?: string;
  coverAlt?: string;
  visible: boolean;
  sortPriority: number;
  catalogStatus?: string;
  purchase: BookPurchase;
}

export interface BooksBySeries extends Series {
  books: Book[];
}

export interface CatalogStats {
  bookCount: number;
  seriesCount: number;
  formatCount: number;
}

export interface AdminSeriesOption {
  id: number;
  slug: string;
  name: string;
}

export interface AdminBookRecord {
  id: number;
  slug: string;
  title: string;
  seriesId: number | null;
  seriesName?: string;
  seriesSlug?: string;
  seriesOrder: number;
  publishYear: number | null;
  coverImageUrl: string;
  coverAlt: string;
  shortBlurb: string;
  description: string;
  availabilityStatus: AvailabilityStatus;
  availabilityLabel: string;
  amazonLink: string;
  retailerLink: string;
  stripePaymentLink: string;
  displayPrice: string;
  signedCopy: boolean;
  directFromAuthor: boolean;
  visible: boolean;
  sortPriority: number;
  coverPalette: CoverPalette;
  featured: boolean;
  seriesLabelOverride: string;
  catalogStatus: string;
  genres: string[];
  formats: FormatKey[];
  releaseDate: string;
}

export interface AdminCatalogSnapshot {
  books: AdminBookRecord[];
  series: AdminSeriesOption[];
}

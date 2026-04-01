export type FormatKey = 'ebook' | 'paperback' | 'hardcover' | 'audiobook';

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

export interface CatalogFilterTag {
  slug: string;
  label: string;
  kind: 'genre' | 'vibe';
}

export interface Series {
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
}

export interface RetailerLink {
  id: string;
  retailer: string;
  label: string;
  format?: FormatKey;
  purchaseMode: 'external_retailer';
  purchaseUrl: string;
}

export interface DirectSaleFormat {
  id: string;
  label: string;
  format: FormatKey;
  purchaseMode: 'stripe_payment_link' | 'stripe_buy_button' | 'unavailable';
  purchaseUrl?: string;
  stripeBuyButtonId?: string;
}

export interface BookPurchase {
  availabilityStatus: AvailabilityStatus;
  availabilityLabel?: string;
  priceNote?: string;
  priceSnapshotDate?: string;
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
  id: string;
  slug: string;
  title: string;
  seriesSlug: string;
  seriesLabel?: string;
  seriesOrder: number;
  releaseDate: string;
  shortHook: string;
  description: string;
  genres: string[];
  vibes: string[];
  tropes: string[];
  formats: FormatKey[];
  featured: boolean;
  coverPalette: 'rose' | 'plum' | 'teal' | 'gold' | 'cobalt' | 'sage' | 'ember';
  catalogStatus?: string;
  purchase: BookPurchase;
}

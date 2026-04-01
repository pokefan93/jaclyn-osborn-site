export type FormatKey = 'ebook' | 'paperback' | 'hardcover' | 'audiobook';

export type BadgeKey =
  | 'new-release'
  | 'signed-copy'
  | 'audiobook'
  | 'sold-out';

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
  status: 'Ongoing' | 'Complete';
  entryPoint: string;
  gradient: [string, string, string];
  textColor: string;
  highlight: string[];
}

export interface Book {
  id: string;
  slug: string;
  title: string;
  seriesSlug: string;
  seriesOrder: number;
  releaseDate: string;
  shortHook: string;
  description: string;
  genres: string[];
  vibes: string[];
  tropes: string[];
  formats: FormatKey[];
  badges: BadgeKey[];
  featured: boolean;
  coverPalette: 'rose' | 'plum' | 'teal' | 'gold' | 'cobalt' | 'sage' | 'ember';
}

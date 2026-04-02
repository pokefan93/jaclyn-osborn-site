PRAGMA foreign_keys = ON;

CREATE TABLE IF NOT EXISTS series (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  slug TEXT NOT NULL UNIQUE,
  name TEXT NOT NULL,
  lane TEXT NOT NULL DEFAULT '',
  tagline TEXT NOT NULL DEFAULT '',
  description TEXT NOT NULL DEFAULT '',
  entry_point TEXT NOT NULL DEFAULT '',
  gradient_start TEXT NOT NULL DEFAULT '#241920',
  gradient_mid TEXT NOT NULL DEFAULT '#6f425e',
  gradient_end TEXT NOT NULL DEFAULT '#c48273',
  text_color TEXT NOT NULL DEFAULT '#fff5f0',
  visible INTEGER NOT NULL DEFAULT 1 CHECK (visible IN (0, 1)),
  sort_priority INTEGER NOT NULL DEFAULT 0,
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS books (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  slug TEXT NOT NULL UNIQUE,
  title TEXT NOT NULL,
  series_id INTEGER REFERENCES series(id) ON DELETE SET NULL,
  series_label_override TEXT,
  series_order REAL NOT NULL DEFAULT 0,
  publish_year INTEGER,
  release_date TEXT,
  cover_image_url TEXT,
  short_blurb TEXT NOT NULL DEFAULT '',
  description TEXT NOT NULL DEFAULT '',
  availability_status TEXT NOT NULL DEFAULT 'in_stock' CHECK (
    availability_status IN ('in_stock', 'limited', 'sold_out', 'preorder')
  ),
  availability_label TEXT,
  amazon_link TEXT,
  retailer_link TEXT,
  stripe_payment_link TEXT,
  display_price TEXT,
  signed_copy INTEGER NOT NULL DEFAULT 0 CHECK (signed_copy IN (0, 1)),
  direct_from_author INTEGER NOT NULL DEFAULT 0 CHECK (direct_from_author IN (0, 1)),
  visible INTEGER NOT NULL DEFAULT 1 CHECK (visible IN (0, 1)),
  sort_priority INTEGER NOT NULL DEFAULT 0,
  cover_palette TEXT NOT NULL DEFAULT 'plum' CHECK (
    cover_palette IN ('rose', 'plum', 'teal', 'gold', 'cobalt', 'sage', 'ember')
  ),
  catalog_status TEXT NOT NULL DEFAULT '',
  featured INTEGER NOT NULL DEFAULT 0 CHECK (featured IN (0, 1)),
  genres_json TEXT NOT NULL DEFAULT '[]',
  formats_json TEXT NOT NULL DEFAULT '[]',
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_series_visible_sort
  ON series(visible, sort_priority, name);

CREATE INDEX IF NOT EXISTS idx_books_visible_sort
  ON books(visible, sort_priority, title);

CREATE INDEX IF NOT EXISTS idx_books_series_sort
  ON books(series_id, series_order, sort_priority, title);

CREATE TABLE IF NOT EXISTS site_settings (
  key TEXT PRIMARY KEY,
  value TEXT NOT NULL,
  updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);

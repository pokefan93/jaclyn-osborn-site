-- Additional portal fields share the same book record as the public website.
ALTER TABLE books ADD COLUMN portal_details TEXT NOT NULL DEFAULT '{}';

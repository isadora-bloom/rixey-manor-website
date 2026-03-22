-- ─────────────────────────────────────────────────────────────────────────────
-- Rixey Manor — Required Tables Setup
-- Run this entire file in Supabase SQL Editor if you are seeing image issues.
-- All statements use IF NOT EXISTS so it is safe to run multiple times.
-- ─────────────────────────────────────────────────────────────────────────────


-- ── 1. site_images ────────────────────────────────────────────────────────────
-- Stores one image per named slot (hero, spaces, rooms, etc.)
CREATE TABLE IF NOT EXISTS site_images (
  id               TEXT        PRIMARY KEY,   -- slot name e.g. 'hero-homepage'
  url              TEXT,
  alt_text         TEXT        DEFAULT '',
  object_position  TEXT        DEFAULT 'center center',
  label            TEXT,
  created_at       TIMESTAMPTZ DEFAULT NOW(),
  updated_at       TIMESTAMPTZ DEFAULT NOW()
);

-- Drop NOT NULL on label if it was created that way
ALTER TABLE site_images ALTER COLUMN label DROP NOT NULL;

ALTER TABLE site_images ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "site_images_public_read" ON site_images;
CREATE POLICY "site_images_public_read"
  ON site_images FOR SELECT
  TO anon, authenticated
  USING (true);


-- ── 2. site_image_extras ──────────────────────────────────────────────────────
-- Extra/additional images per slot (enables carousel on room cards etc.)
CREATE TABLE IF NOT EXISTS site_image_extras (
  id          BIGSERIAL   PRIMARY KEY,
  slot_id     TEXT        NOT NULL,
  url         TEXT        NOT NULL,
  alt_text    TEXT        DEFAULT '',
  sort_order  INT         DEFAULT 0,
  created_at  TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS site_image_extras_slot_idx ON site_image_extras(slot_id);

ALTER TABLE site_image_extras ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "site_image_extras_public_read" ON site_image_extras;
CREATE POLICY "site_image_extras_public_read"
  ON site_image_extras FOR SELECT
  TO anon, authenticated
  USING (true);


-- ── 3. booked_dates ───────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS booked_dates (
  id          UUID        DEFAULT gen_random_uuid() PRIMARY KEY,
  start_date  DATE        NOT NULL,
  end_date    DATE        NOT NULL,
  notes       TEXT,
  created_at  TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE booked_dates ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "booked_dates_public_read" ON booked_dates;
CREATE POLICY "booked_dates_public_read"
  ON booked_dates FOR SELECT
  TO anon, authenticated
  USING (true);


-- ── 4. site_content ───────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS site_content (
  key        TEXT PRIMARY KEY,
  value      TEXT DEFAULT '',
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE site_content ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "site_content_public_read" ON site_content;
CREATE POLICY "site_content_public_read"
  ON site_content FOR SELECT
  TO anon, authenticated
  USING (true);


-- ── 5. page_seo ───────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS page_seo (
  page_key      TEXT PRIMARY KEY,
  og_image_url  TEXT,
  updated_at    TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE page_seo ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "page_seo_public_read" ON page_seo;
CREATE POLICY "page_seo_public_read"
  ON page_seo FOR SELECT
  TO anon, authenticated
  USING (true);


-- ─────────────────────────────────────────────────────────────────────────────
-- Done. Verify with:
--   SELECT id FROM site_images LIMIT 5;
--   SELECT id FROM site_image_extras LIMIT 5;
--   SELECT id FROM booked_dates LIMIT 5;
-- ─────────────────────────────────────────────────────────────────────────────

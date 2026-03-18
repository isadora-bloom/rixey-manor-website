-- Multi-image support for named site image slots (e.g. room galleries)
CREATE TABLE IF NOT EXISTS site_image_extras (
  id         BIGSERIAL PRIMARY KEY,
  slot_id    TEXT    NOT NULL,
  url        TEXT    NOT NULL,
  alt_text   TEXT    DEFAULT '',
  sort_order INT     DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS site_image_extras_slot_idx ON site_image_extras(slot_id);

ALTER TABLE site_image_extras ENABLE ROW LEVEL SECURITY;

-- Public can read (needed for getSiteImages on the frontend)
CREATE POLICY "Public read extras" ON site_image_extras
  FOR SELECT USING (true);

-- Only service role can write (admin API uses service role key)
CREATE POLICY "Service role write extras" ON site_image_extras
  FOR ALL USING (auth.role() = 'service_role');

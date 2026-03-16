-- ─────────────────────────────────────────────────────────────
-- Rixey Manor: Wedding Availability Table
-- Run this in your Supabase SQL editor
-- ─────────────────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS booked_dates (
  id          uuid    DEFAULT gen_random_uuid() PRIMARY KEY,
  start_date  date    NOT NULL,
  end_date    date    NOT NULL,
  notes       text,                         -- admin-only, never shown publicly
  created_at  timestamptz DEFAULT now()
);

-- Public read, no public write
ALTER TABLE booked_dates ENABLE ROW LEVEL SECURITY;

CREATE POLICY "booked_dates_public_read"
  ON booked_dates FOR SELECT
  TO anon, authenticated
  USING (true);

-- ─────────────────────────────────────────────────────────────
-- Site images for the availability page
-- Upload images in Supabase Storage then set the url field
-- ─────────────────────────────────────────────────────────────

INSERT INTO site_images (id, label, alt_text, object_position) VALUES
  ('availability-spring', 'Availability — Spring', 'Rixey Manor grounds in spring — wildflowers along the lake path, soft Virginia light', 'center 60%'),
  ('availability-summer', 'Availability — Summer', 'Rixey Manor terrace at golden hour in summer, long evening light', 'center 40%'),
  ('availability-fall',   'Availability — Fall',   'View from the Rixey Manor rooftop toward Blue Ridge Mountains in autumn foliage', 'center 50%'),
  ('availability-winter', 'Availability — Winter', 'Rixey Manor manor house exterior in winter, warm interior light through windows', 'center 40%')
ON CONFLICT (id) DO NOTHING;

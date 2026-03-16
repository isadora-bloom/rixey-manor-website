-- Run this in the Supabase SQL editor before running tag-and-upload-weddings.mjs

ALTER TABLE media
  ADD COLUMN IF NOT EXISTS same_sex       boolean     DEFAULT false,
  ADD COLUMN IF NOT EXISTS cultural_style text        DEFAULT 'western',
  ADD COLUMN IF NOT EXISTS scene_type     text        DEFAULT 'other',
  ADD COLUMN IF NOT EXISTS manor_visible  boolean     DEFAULT false,
  ADD COLUMN IF NOT EXISTS quality        integer     DEFAULT 3,
  ADD COLUMN IF NOT EXISTS couple_names   text,
  ADD COLUMN IF NOT EXISTS photographer   text,
  ADD COLUMN IF NOT EXISTS wedding_month  text,
  ADD COLUMN IF NOT EXISTS wedding_year   integer;

-- Index for gallery filtering
CREATE INDEX IF NOT EXISTS idx_media_same_sex        ON media(same_sex);
CREATE INDEX IF NOT EXISTS idx_media_cultural_style  ON media(cultural_style);
CREATE INDEX IF NOT EXISTS idx_media_scene_type      ON media(scene_type);
CREATE INDEX IF NOT EXISTS idx_media_quality         ON media(quality);
CREATE INDEX IF NOT EXISTS idx_media_wedding_month   ON media(wedding_month);

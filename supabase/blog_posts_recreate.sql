-- Drop and recreate the table cleanly
-- Safe to run because no seed data has successfully loaded yet

DROP TABLE IF EXISTS blog_posts CASCADE;

CREATE TABLE blog_posts (
  id           uuid        DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at   timestamptz DEFAULT now(),
  title        text        NOT NULL,
  slug         text        NOT NULL UNIQUE,
  post_date    date        NOT NULL,
  category     text        NOT NULL,
  excerpt      text,
  content      text        NOT NULL,
  featured     boolean     DEFAULT false,
  published    boolean     DEFAULT false,
  author       text        DEFAULT 'Isadora Martin-Dye',
  cover_image  text,
  old_url      text
);

ALTER TABLE blog_posts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public read published posts"
  ON blog_posts FOR SELECT
  USING (published = true);

CREATE POLICY "Service role full access"
  ON blog_posts FOR ALL
  USING (auth.role() = 'service_role');

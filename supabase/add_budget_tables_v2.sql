-- ─────────────────────────────────────────────────────────────────────────────
-- Rixey Manor — "What it costs" / Budget Calculator (v2 schema)
-- Run in Supabase SQL Editor.
--
-- v2 reshapes the budget feature into a build-your-own calculator that mirrors
-- /pricing. Drops the v1 tables (no real data populated yet, safe). The new
-- shape is:
--
--   budget_categories   → the numbered sections on the page
--   budget_options      → the per-category choices (e.g. food trucks / plated)
--                          each option carries its own range
--   budget_vendors      → linked to options, not categories. The info button
--                          on an option reveals 1–2 vendors who fit THAT
--                          option's price + vibe
--   budget_calculator_submissions → couples' saved estimates (mirrors
--                                    calculator_submissions for /pricing)
-- ─────────────────────────────────────────────────────────────────────────────

-- Drop v1 tables. RLS policies are dropped automatically with the table.
DROP TABLE IF EXISTS budget_priority_categories CASCADE;
DROP TABLE IF EXISTS budget_priorities          CASCADE;
DROP TABLE IF EXISTS budget_vendors             CASCADE;
DROP TABLE IF EXISTS budget_categories          CASCADE;

-- ─── Categories (sections of the calculator) ─────────────────────────────────
CREATE TABLE budget_categories (
  id              BIGSERIAL   PRIMARY KEY,
  slug            TEXT        UNIQUE NOT NULL,
  name            TEXT        NOT NULL,
  description     TEXT        DEFAULT '',          -- one-line note shown under the section heading
  required        BOOLEAN     DEFAULT false,        -- if true, couple must pick an option to submit
  sort_order      INT         DEFAULT 0,
  active          BOOLEAN     DEFAULT true,
  created_at      TIMESTAMPTZ DEFAULT NOW()
);

-- ─── Options (per-category choices, each with its own range) ─────────────────
CREATE TABLE budget_options (
  id              BIGSERIAL   PRIMARY KEY,
  category_slug   TEXT        NOT NULL REFERENCES budget_categories(slug) ON DELETE CASCADE ON UPDATE CASCADE,
  slug            TEXT        NOT NULL,            -- unique within category, e.g. "food-trucks"
  label           TEXT        NOT NULL,            -- displayed name, e.g. "Food trucks"
  description     TEXT        DEFAULT '',          -- one-line vibe descriptor
  range_low       INT,                             -- dollars, NULL until populated
  range_high      INT,                             -- dollars, NULL until populated
  range_note      TEXT        DEFAULT '',          -- e.g. "for 100 guests"
  sort_order      INT         DEFAULT 0,
  active          BOOLEAN     DEFAULT true,
  created_at      TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE (category_slug, slug)
);

-- ─── Vendors (per option) ────────────────────────────────────────────────────
CREATE TABLE budget_vendors (
  id              BIGSERIAL   PRIMARY KEY,
  option_id       BIGINT      NOT NULL REFERENCES budget_options(id) ON DELETE CASCADE,
  name            TEXT        NOT NULL,
  descriptor      TEXT        DEFAULT '',          -- one short line about why they fit this option
  sort_order      INT         DEFAULT 0,
  active          BOOLEAN     DEFAULT true,
  consent_on      DATE,                            -- vendor's consent to be listed publicly. NULL = not shown.
  created_at      TIMESTAMPTZ DEFAULT NOW()
);

-- ─── Submissions ─────────────────────────────────────────────────────────────
CREATE TABLE budget_calculator_submissions (
  id            BIGSERIAL   PRIMARY KEY,
  selections    JSONB       NOT NULL DEFAULT '{}'::jsonb, -- { category_slug: { option_id, option_label, range_low, range_high } }
  total_low     INT,
  total_high    INT,
  next_steps    TEXT,
  wedding_date  TEXT,
  p1_name       TEXT        NOT NULL,
  p1_email      TEXT        NOT NULL,
  p1_phone      TEXT,
  p2_name       TEXT,
  p2_phone      TEXT,
  notes         TEXT,
  source        TEXT,
  medium        TEXT,
  campaign      TEXT,
  referrer      TEXT,
  visitor_id    TEXT,
  created_at    TIMESTAMPTZ DEFAULT NOW()
);

-- ─── RLS ─────────────────────────────────────────────────────────────────────
ALTER TABLE budget_categories             ENABLE ROW LEVEL SECURITY;
ALTER TABLE budget_options                ENABLE ROW LEVEL SECURITY;
ALTER TABLE budget_vendors                ENABLE ROW LEVEL SECURITY;
ALTER TABLE budget_calculator_submissions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "budget_categories_public_read"
  ON budget_categories FOR SELECT TO anon, authenticated USING (active = true);

CREATE POLICY "budget_options_public_read"
  ON budget_options FOR SELECT TO anon, authenticated USING (active = true);

CREATE POLICY "budget_vendors_public_read"
  ON budget_vendors FOR SELECT TO anon, authenticated
  USING (active = true AND consent_on IS NOT NULL);

-- Submissions: clients write via the service-role API only. No client-side read.
-- (No public policies; service role bypasses RLS.)

-- ─────────────────────────────────────────────────────────────────────────────
-- Seed: structure only. No prices, no vendors.
-- Categories and options only — Isadora populates ranges, descriptors, and
-- vendors from real Rixey data.
-- ─────────────────────────────────────────────────────────────────────────────

INSERT INTO budget_categories (slug, name, description, sort_order) VALUES
  ('catering',       'Catering',              '', 10),
  ('bar',            'Bar / alcohol',         'You bring it. We pour it.', 20),
  ('photography',    'Photography',           '', 30),
  ('music',          'Music',                 '', 40),
  ('florals',        'Florals',               'The borrow shed covers a lot. The florist adds on top.', 50),
  ('cake',           'Cake / dessert',        '', 60),
  ('hairmakeup',     'Hair & makeup',         '', 70),
  ('officiant',      'Officiant',             '', 80),
  ('transportation', 'Transportation',        '', 90),
  ('stationery',     'Stationery & signage',  'The borrow shed covers signage. Save-the-dates, invitations, day-of paper are the spend.', 100)
ON CONFLICT (slug) DO NOTHING;

-- Option seeds: structural only. Labels chosen to be neutral and editable.
-- Ranges are deliberately NULL — populated via /admin/budgets when ready.

INSERT INTO budget_options (category_slug, slug, label, sort_order) VALUES
  -- Catering
  ('catering', 'food-trucks',     'Food trucks',                10),
  ('catering', 'family-style',    'Family-style buffet',         20),
  ('catering', 'plated',          'Plated dinner',               30),
  ('catering', 'multi-course',    'Multi-course plated',         40),

  -- Bar
  ('bar', 'beer-wine',            'Beer + wine, BYO',            10),
  ('bar', 'full-byo',             'Full BYO bar',                20),
  ('bar', 'signature-cocktails',  'Full BYO + signature cocktails', 30),

  -- Photography
  ('photography', 'six-hour',     '6 hours, photo only',         10),
  ('photography', 'eight-hour',   '8 hours, photo only',         20),
  ('photography', 'photo-video',  'Photo + videographer',        30),

  -- Music
  ('music', 'dj',                  'DJ',                         10),
  ('music', 'dj-ceremony',         'DJ + live ceremony musicians', 20),
  ('music', 'live-band',           'Live band',                  30),

  -- Florals
  ('florals', 'borrow-only',       'Borrow shed only',           10),
  ('florals', 'florist-accent',    'Florist with the borrow shed as foundation', 20),
  ('florals', 'full-installation', 'Full floral installation',    30),

  -- Cake / dessert
  ('cake', 'cake-only',            'Cake only',                  10),
  ('cake', 'cake-dessert-table',   'Cake + small dessert table', 20),
  ('cake', 'full-spread',          'Full dessert spread or food-truck dessert', 30),

  -- Hair & makeup
  ('hairmakeup', 'couple-only',    'Couple only',                10),
  ('hairmakeup', 'couple-parents', 'Couple + parents',           20),
  ('hairmakeup', 'full-party',     'Full wedding party',         30),

  -- Officiant
  ('officiant', 'byo',             'Bringing our own',           10),
  ('officiant', 'recommended',     'Use a Rixey recommendation', 20),

  -- Transportation
  ('transportation', 'none',       'Not needed',                 10),
  ('transportation', 'hotel-shuttle', 'Hotel shuttle',           20),
  ('transportation', 'multi-stop', 'Multi-stop shuttle',         30),

  -- Stationery
  ('stationery', 'minimal',        'Digital invites + day-of borrow shed', 10),
  ('stationery', 'classic',        'Printed invitations + day-of paper',   20),
  ('stationery', 'custom-suite',   'Full custom suite',                    30)
ON CONFLICT (category_slug, slug) DO NOTHING;

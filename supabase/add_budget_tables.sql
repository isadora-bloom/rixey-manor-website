-- ─────────────────────────────────────────────────────────────────────────────
-- Rixey Manor — "What it costs" / Budget Explorer tables
-- Run in Supabase SQL Editor.
--
-- Seeds the STRUCTURE only: category names, priority labels, and the
-- priority-to-category mapping. Every dollar range, every vendor name, and
-- every trade-off claim is left empty for Isadora to populate from real Rixey
-- data. The /what-it-costs page renders cleanly when these are empty —
-- categories show "Pricing coming soon" and vendor reveal icons stay hidden
-- until at least one active vendor exists for that category.
-- ─────────────────────────────────────────────────────────────────────────────

-- ─── Categories ──────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS budget_categories (
  id              BIGSERIAL   PRIMARY KEY,
  slug            TEXT        UNIQUE NOT NULL,
  name            TEXT        NOT NULL,
  description     TEXT        DEFAULT '',                 -- 1-2 sentence honest description
  range_low       INT,                                    -- dollars, NULL until populated
  range_high      INT,                                    -- dollars, NULL until populated
  range_note      TEXT        DEFAULT '',                 -- "for 100 guests" / "varies widely" etc.
  trade_off_note  TEXT        DEFAULT '',                 -- "the place couples most often go big or trim back"
  sort_order      INT         DEFAULT 0,
  active          BOOLEAN     DEFAULT true,
  last_reviewed   DATE,                                   -- shown on the page; signals decay honestly
  created_at      TIMESTAMPTZ DEFAULT NOW()
);

-- ─── Priorities (chips at the top of the page) ───────────────────────────────
CREATE TABLE IF NOT EXISTS budget_priorities (
  id           BIGSERIAL   PRIMARY KEY,
  slug         TEXT        UNIQUE NOT NULL,
  label        TEXT        NOT NULL,
  description  TEXT        DEFAULT '',                    -- shown when chip is selected, optional
  sort_order   INT         DEFAULT 0,
  active       BOOLEAN     DEFAULT true,
  created_at   TIMESTAMPTZ DEFAULT NOW()
);

-- ─── Priority → Category mapping ─────────────────────────────────────────────
-- Defines which categories get visual emphasis when a priority is selected,
-- and optionally a "couples who prioritize X typically..." line per category.
-- The line is only rendered when populated — never fabricated.
CREATE TABLE IF NOT EXISTS budget_priority_categories (
  id              BIGSERIAL   PRIMARY KEY,
  priority_slug   TEXT        NOT NULL,
  category_slug   TEXT        NOT NULL,
  emphasis        TEXT        NOT NULL DEFAULT 'up',      -- 'up' (spend more), 'down' (spend less), 'flag' (just emphasize)
  note            TEXT        DEFAULT '',                 -- e.g. "couples who prioritize food typically push catering toward the upper end"
  sort_order      INT         DEFAULT 0,
  UNIQUE (priority_slug, category_slug)
);

-- ─── Vendors per category ────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS budget_vendors (
  id              BIGSERIAL   PRIMARY KEY,
  category_slug   TEXT        NOT NULL,
  name            TEXT        NOT NULL,
  descriptor      TEXT        DEFAULT '',                 -- one short line — "knows exactly how the light moves at the lake at 5pm in October"
  sort_order      INT         DEFAULT 0,
  active          BOOLEAN     DEFAULT true,
  consent_on      DATE,                                   -- when the vendor agreed to be listed; NULL = no consent yet, do not show
  created_at      TIMESTAMPTZ DEFAULT NOW()
);

-- ─── Total page-level disclosure (shown at the bottom of the page) ───────────
-- Stored in site_content rather than its own table.
-- Keys consumed by the page:
--   what_it_costs_total_low        e.g. 30000
--   what_it_costs_total_high       e.g. 60000
--   what_it_costs_total_note       e.g. "for 100 guests, spring Saturday. Tuesday and off-peak run lower."
--   what_it_costs_total_caveat     e.g. "Plan for ~10% in vendor tips on top of these ranges."
--   what_it_costs_last_reviewed    YYYY-MM-DD

-- ─── RLS ─────────────────────────────────────────────────────────────────────
ALTER TABLE budget_categories          ENABLE ROW LEVEL SECURITY;
ALTER TABLE budget_priorities          ENABLE ROW LEVEL SECURITY;
ALTER TABLE budget_priority_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE budget_vendors             ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "budget_categories_public_read"          ON budget_categories;
DROP POLICY IF EXISTS "budget_priorities_public_read"          ON budget_priorities;
DROP POLICY IF EXISTS "budget_priority_categories_public_read" ON budget_priority_categories;
DROP POLICY IF EXISTS "budget_vendors_public_read"             ON budget_vendors;

CREATE POLICY "budget_categories_public_read"
  ON budget_categories FOR SELECT TO anon, authenticated USING (active = true);

CREATE POLICY "budget_priorities_public_read"
  ON budget_priorities FOR SELECT TO anon, authenticated USING (active = true);

CREATE POLICY "budget_priority_categories_public_read"
  ON budget_priority_categories FOR SELECT TO anon, authenticated USING (true);

CREATE POLICY "budget_vendors_public_read"
  ON budget_vendors FOR SELECT TO anon, authenticated
  USING (active = true AND consent_on IS NOT NULL);

-- ─────────────────────────────────────────────────────────────────────────────
-- Seed: structure only. No prices, no vendors, no claims.
-- ─────────────────────────────────────────────────────────────────────────────

INSERT INTO budget_categories (slug, name, sort_order, description) VALUES
  ('venue',          'Venue',                  10, 'Rixey itself. The venue calculator handles this in detail.'),
  ('bartender',      'Bartender service',      20, 'Required, billed separately, paid directly to the bartenders. Rixey takes no markup.'),
  ('catering',       'Catering',               30, ''),
  ('bar',            'Bar / alcohol',          40, 'You bring your own. We pour it. Most couples spend less here than they expect.'),
  ('photography',    'Photography',            50, ''),
  ('music',          'DJ or band',             60, ''),
  ('florals',        'Florals',                70, 'The borrow shed covers a lot of the foundation. Couples typically spend on what their florist adds on top.'),
  ('cake',           'Cake / dessert',         80, ''),
  ('hairmakeup',     'Hair & makeup',          90, ''),
  ('officiant',      'Officiant',             100, 'About half of couples bring their own (clergy, family friend, ordained online). The other half use someone we know.'),
  ('transportation', 'Transportation',        110, ''),
  ('stationery',     'Stationery & signage',  120, 'The borrow shed covers signage. Save-the-dates, invitations, and day-of paper are the real spend here.')
ON CONFLICT (slug) DO NOTHING;

INSERT INTO budget_priorities (slug, label, sort_order) VALUES
  ('food',         'Food',           10),
  ('photography',  'Photography',    20),
  ('atmosphere',   'Atmosphere',     30),
  ('music',        'Music',          40),
  ('florals',      'Florals',        50),
  ('weekend',      'The weekend',    60)
ON CONFLICT (slug) DO NOTHING;

-- Priority → category mapping. Just emphasis, no claims.
-- The "note" field stays empty; trade-off copy is added by Isadora when she
-- has real Rixey data to back the statement.
INSERT INTO budget_priority_categories (priority_slug, category_slug, emphasis) VALUES
  ('food',        'catering',       'up'),
  ('food',        'bar',            'up'),
  ('food',        'cake',           'up'),
  ('photography', 'photography',    'up'),
  ('atmosphere',  'florals',        'up'),
  ('atmosphere',  'stationery',     'up'),
  ('music',       'music',          'up'),
  ('florals',     'florals',        'up'),
  ('weekend',     'venue',          'up'),
  ('weekend',     'transportation', 'up'),
  ('weekend',     'hairmakeup',     'up')
ON CONFLICT (priority_slug, category_slug) DO NOTHING;

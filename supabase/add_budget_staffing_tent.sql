-- ─────────────────────────────────────────────────────────────────────────────
-- Rixey Manor — Budget calculator: add Staffing + Tent categories
-- Run in Supabase SQL Editor.
--
-- Additive migration on top of add_budget_tables_v2.sql. No drops, no destructive
-- changes. Inserts two new categories and starter options. Sort orders place
-- Staffing right after Catering (food → service flows naturally) and Tent right
-- before Stationery (logistics group). All ranges are NULL — Isadora populates
-- them in /admin/budgets.
-- ─────────────────────────────────────────────────────────────────────────────

INSERT INTO budget_categories (slug, name, description, sort_order) VALUES
  ('staffing', 'Staffing',
    'Servers, runners, and kitchen hands. Some caterers bring their own; others charge separately.', 15),
  ('tent', 'Tent',
    'For guest counts approaching 100+, the patio extension uses a rental tent.', 95)
ON CONFLICT (slug) DO NOTHING;

INSERT INTO budget_options (category_slug, slug, label, description, sort_order) VALUES
  -- Staffing
  ('staffing', 'caterer-supplied', 'Caterer brings their own staff',
    'Already included in the catering quote.', 10),
  ('staffing', 'plus-runners',     'Plus runners and hosts',
    'Extra hands for setup, bar runners, light hosting.', 20),
  ('staffing', 'full-service',     'Dedicated service team',
    'A separate staffing company. Servers, captains, kitchen support.', 30),

  -- Tent
  ('tent', 'none',         'No tent needed',
    'Under ~100 guests, indoor and patio space handles it.', 10),
  ('tent', 'standard',     'Standard rental tent',
    'Patio extension for the full guest count.', 20),
  ('tent', 'premium',      'Premium tent',
    'Sailcloth or framed structure with sides, lighting, and flooring.', 30)
ON CONFLICT (category_slug, slug) DO NOTHING;

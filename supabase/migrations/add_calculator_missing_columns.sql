-- Fill gaps in calculator_submissions: UTM attribution, visitor tracking,
-- structured pricing fields, and partner 2 email.
--
-- All idempotent (ADD COLUMN IF NOT EXISTS). Safe to apply at any time;
-- existing rows get NULL for the new columns.

-- Partner 2 email (needed on the contract alongside her name)
alter table calculator_submissions
  add column if not exists p2_email text;

-- UTM attribution — source/medium/campaign come from the URL the couple
-- arrived on; referrer is the HTTP referrer. All four feed Bloom's
-- discovery-source attribution pipeline.
alter table calculator_submissions
  add column if not exists source   text,
  add column if not exists medium   text,
  add column if not exists campaign text,
  add column if not exists referrer text;

-- Visitor tracking — links this submission to the anonymous site_visitors
-- row so prior pageviews and calculator sessions stitch to the same couple.
alter table calculator_submissions
  add column if not exists visitor_id text;

-- Structured pricing fields — the legacy `season` and `guests` text columns
-- concatenate everything into one string. These split them out cleanly so
-- Bloom can query by package, season, or price tier without string-parsing.
alter table calculator_submissions
  add column if not exists package_key   text,   -- e.g. 'estate-weekend'
  add column if not exists package_label text,   -- e.g. 'The Estate Weekend'
  add column if not exists season_key    text,   -- e.g. 'peak'
  add column if not exists season_label  text,   -- e.g. 'Peak season'
  add column if not exists tax           integer, -- 6% Virginia sales tax amount
  add column if not exists subtotal_pre_tax integer; -- total after discounts, before tax

-- Full itemised breakdown as JSON — everything the venue email shows,
-- queryable without re-parsing the flat text columns.
alter table calculator_submissions
  add column if not exists breakdown jsonb;

-- Structured add-ons — mirrors the ContractHouse handoff payload so we
-- have a record of exactly what was sent.
alter table calculator_submissions
  add column if not exists addons jsonb;

-- Next-step keys alongside the existing next_steps label string.
alter table calculator_submissions
  add column if not exists next_step_keys text; -- comma-separated keys

-- "How did you find us?" — added by an earlier migration; included here
-- as a safety net in case that migration was never applied.
alter table calculator_submissions
  add column if not exists heard_about text;

-- ─────────────────────────────────────────────────────────────────────────────
-- Rixey Manor — Budget calculator: capture venue snapshot
-- Run in Supabase SQL Editor.
--
-- Additive migration. Lets a /what-it-costs submission carry forward the
-- couple's venue calculator selections from /pricing (via localStorage on the
-- client). No drops, no changes to existing rows.
-- ─────────────────────────────────────────────────────────────────────────────

ALTER TABLE budget_calculator_submissions
  ADD COLUMN IF NOT EXISTS venue_snapshot JSONB;

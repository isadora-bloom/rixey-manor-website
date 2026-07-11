-- "How did you find us?" capture on the pricing calculator.
-- Stores the verbatim answer from the calculator's discovery-source
-- dropdown. The route also includes the answer in the venue notification
-- email, which Bloom ingests and maps to a canonical acquisition channel
-- (discovery_sources / attribution_events) via the discovery-source writer.
--
-- Idempotent. Apply before (or with) the website deploy that adds the
-- field; the submit route degrades gracefully if this hasn't run yet.

alter table calculator_submissions
  add column if not exists heard_about text;

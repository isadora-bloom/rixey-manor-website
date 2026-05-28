-- Tour intents.
-- One row per Calendly interaction that signals "this couple is thinking
-- about a tour." Two kinds of rows are written:
--
--   1. An OPEN — the couple clicked a "Book a tour" button or the Calendly
--      iframe surfaced its event-type page. opened_at is set.
--   2. A SCHEDULE — the couple actually picked a date and completed the
--      booking. scheduled_at gets stamped onto the existing open row (same
--      visitor_id + calendly_url + day), or a fresh row if no matching open
--      was logged (rare: direct deep link).
--
-- The point of this table is to bridge the website→tour gap. Until now
-- tours lived only in Calendly's own dashboard, which means we couldn't
-- ask "which source produced tour bookings, not just calculator submits?"
--
-- Each row carries the visitor's first-touch attribution stamped at the
-- time of the click, so even if site_visitors.last_source moves later we
-- still know what drove this specific tour-intent.

create table if not exists tour_intents (
  id                uuid primary key default gen_random_uuid(),
  created_at        timestamptz default now(),

  -- Who
  visitor_id        uuid,                         -- joins to site_visitors
  email             text,                         -- pulled from Calendly invitee when available
  first_name        text,
  partner_name      text,

  -- Where in the funnel
  opened_at         timestamptz default now(),    -- when the Calendly widget was opened
  scheduled_at     timestamptz,                  -- when a date was actually picked (null = opened-but-didn't-book)
  scheduled_event_uri text,                       -- Calendly event URI when a booking completes (debug aid)

  -- Context at time of click — frozen so later attribution shifts don't lose it
  calendly_url      text,                         -- the destination URL they were sent to
  source            text,                         -- first-touch utm_source
  medium            text,                         -- first-touch utm_medium
  campaign          text,                         -- first-touch utm_campaign
  referrer          text,                         -- first-touch document.referrer
  landing_page      text,                         -- first-touch path
  trigger_path      text                          -- which page the button was on when clicked
);

create index if not exists tour_intents_visitor_id_idx on tour_intents (visitor_id);
create index if not exists tour_intents_created_at_idx on tour_intents (created_at desc);
create index if not exists tour_intents_source_idx     on tour_intents (source);
create index if not exists tour_intents_scheduled_idx  on tour_intents (scheduled_at desc) where scheduled_at is not null;

-- Contains visitor PII (emails from Calendly invitees). Lock it down — only
-- the service role (used by the API routes) reads or writes.
alter table tour_intents enable row level security;

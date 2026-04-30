-- Visitor identity + journey tracking.
-- One row per browser in site_visitors, one row per pageview in site_visits.
-- All submission tables get a visitor_id column so an inquiry can be joined
-- back to the full journey that led to it.

-- ── site_visitors ────────────────────────────────────────────────────────────

create table if not exists site_visitors (
  visitor_id            uuid primary key,
  first_seen_at         timestamptz default now(),
  last_seen_at          timestamptz default now(),
  visit_count           integer default 1,
  pageview_count        integer default 0,

  -- First-touch attribution (set once, never overwritten)
  first_source          text,
  first_medium          text,
  first_campaign        text,
  first_content         text,
  first_term            text,
  first_referrer        text,
  first_landing_page    text,

  -- Last-touch attribution (updated each visit when there's a new signal)
  last_source           text,
  last_medium           text,
  last_campaign         text,
  last_referrer         text,
  last_landing_page     text,

  -- Identity (set when the visitor gives their name)
  first_name            text,
  partner_name          text,
  email                 text,
  phone                 text,
  role                  text,           -- 'couple' | 'parent' | 'friend_family' | 'planner' | 'browsing'
  identified_at         timestamptz,

  -- Diagnostic
  user_agent            text,
  ip_country            text
);

create index if not exists site_visitors_email_idx       on site_visitors (lower(email));
create index if not exists site_visitors_first_name_idx  on site_visitors (lower(first_name));
create index if not exists site_visitors_last_seen_idx   on site_visitors (last_seen_at desc);

alter table site_visitors enable row level security;

create policy "service role only — site_visitors"
  on site_visitors using (false) with check (false);

-- ── site_visits (pageview log) ───────────────────────────────────────────────

create table if not exists site_visits (
  id           bigserial primary key,
  visitor_id   uuid references site_visitors(visitor_id) on delete cascade,
  session_id   uuid,
  path         text not null,
  query        text,
  referrer     text,
  ts           timestamptz default now()
);

create index if not exists site_visits_visitor_idx  on site_visits (visitor_id, ts desc);
create index if not exists site_visits_session_idx  on site_visits (session_id);
create index if not exists site_visits_ts_idx       on site_visits (ts desc);

alter table site_visits enable row level security;

create policy "service role only — site_visits"
  on site_visits using (false) with check (false);

-- ── visitor_id on submission tables ──────────────────────────────────────────

-- Role column for already-existing site_visitors tables (idempotent re-run safe)
alter table site_visitors add column if not exists role text;

alter table calculator_submissions add column if not exists visitor_id uuid;
alter table contact_submissions    add column if not exists visitor_id uuid;
alter table quiz_submissions       add column if not exists visitor_id uuid;

create index if not exists calculator_submissions_visitor_idx on calculator_submissions (visitor_id);
create index if not exists contact_submissions_visitor_idx    on contact_submissions    (visitor_id);
create index if not exists quiz_submissions_visitor_idx       on quiz_submissions       (visitor_id);

-- Tracked email links.
-- One row per personalized link generated in /admin/track-link. The link is
-- handed to a known client (name + email already known) and embeds a short
-- `code`. When the client clicks it and lands on the site, the Tracker calls
-- /api/track/link-claim, which (a) stamps that client's identity onto the
-- browser's site_visitors row and (b) records the open here.
--
-- click_count counts DISTINCT browsers that opened the link — the Tracker
-- claims each code at most once per browser, so email security scanners
-- (which don't run JS) can't inflate it.

create table if not exists tracked_links (
  code              text primary key,
  label             text,                       -- admin's own note, e.g. "Jane & Tom — pricing follow-up"
  destination       text default 'pricing',     -- 'pricing' | 'tour' | path — which page the link points at

  -- Known client identity, stamped onto the visitor on first click
  first_name        text,
  partner_name      text,
  email             text,
  phone             text,
  role              text,

  created_at        timestamptz default now(),

  -- Open tracking
  click_count       integer default 0,
  first_clicked_at  timestamptz,
  last_clicked_at   timestamptz,
  last_visitor_id   uuid
);

create index if not exists tracked_links_email_idx      on tracked_links (email);
create index if not exists tracked_links_created_at_idx on tracked_links (created_at desc);

-- Contains client PII. Lock it down — only the service role (used by the
-- API routes) may read or write. No anon/public policies.
alter table tracked_links enable row level security;

create table if not exists quiz_submissions (
  id         uuid primary key default gen_random_uuid(),
  created_at timestamptz default now(),
  name       text not null,
  partner    text,
  email      text not null,
  wedding_date text,
  notes      text,
  tier       integer,
  path       text,
  answers    text
);

alter table quiz_submissions enable row level security;

create policy "service role only"
  on quiz_submissions
  using (false)
  with check (false);

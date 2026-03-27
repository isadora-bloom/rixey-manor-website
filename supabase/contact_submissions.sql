create table if not exists contact_submissions (
  id         uuid primary key default gen_random_uuid(),
  created_at timestamptz default now(),
  name       text not null,
  email      text not null,
  message    text not null
);

alter table contact_submissions enable row level security;

create policy "service role only"
  on contact_submissions
  using (false)
  with check (false);

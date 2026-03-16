create table if not exists calculator_submissions (
  id            uuid primary key default gen_random_uuid(),
  created_at    timestamptz default now(),

  -- Calculator selections
  season        text,
  guests        text,
  nights        text,
  upgrades      text,
  discounts     text,
  estimate      integer,
  per_payment   integer,

  -- Contact
  next_steps    text,
  wedding_date  text,
  p1_name       text not null,
  p1_email      text not null,
  p1_phone      text,
  p2_name       text,
  p2_phone      text,
  notes         text
);

-- Only the service role can insert/read (no public access)
alter table calculator_submissions enable row level security;

create policy "service role only"
  on calculator_submissions
  using (false)
  with check (false);

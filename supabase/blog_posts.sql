-- Blog posts table
-- Run this in the Supabase SQL editor

create table if not exists blog_posts (
  id           uuid        default gen_random_uuid() primary key,
  created_at   timestamptz default now(),
  title        text        not null,
  slug         text        not null unique,
  date         date        not null,
  category     text        not null,
  excerpt      text,
  content      text        not null,
  featured     boolean     default false,
  published    boolean     default false,
  author       text        default 'Isadora Martin-Dye',
  cover_image  text,
  old_url      text
);

alter table blog_posts enable row level security;

-- Anyone can read published posts
create policy "Public read published posts"
  on blog_posts for select
  using (published = true);

-- Service role has full access (for seeding + future admin)
create policy "Service role full access"
  on blog_posts for all
  using (auth.role() = 'service_role');

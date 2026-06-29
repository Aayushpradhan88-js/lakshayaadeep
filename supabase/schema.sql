-- Enable extensions
create extension if not exists "uuid-ossp";

--------------------------------------------------
-- 1. POSTS (Blogs + News)
--------------------------------------------------
create table posts (
  id uuid primary key default uuid_generate_v4(),
  title text not null,
  content text,
  type text check (type in ('blog', 'news')) not null,
  image_url text,
  published boolean default true,
  created_at timestamp with time zone default now()
);

--------------------------------------------------
-- 2. GALLERY
--------------------------------------------------
create table gallery (
  id uuid primary key default uuid_generate_v4(),
  image_url text not null,
  caption text,
  created_at timestamp with time zone default now()
);

--------------------------------------------------
-- 3. EVENTS
--------------------------------------------------
create table events (
  id uuid primary key default uuid_generate_v4(),
  title text not null,
  description text,
  type text check (type in ('physical', 'virtual')) not null,
  location text,
  event_date timestamp with time zone,
  image_url text,
  created_at timestamp with time zone default now()
);

--------------------------------------------------
-- 4. TEAM MEMBERS
--------------------------------------------------
create table team_members (
  id uuid primary key default uuid_generate_v4(),
  name text not null,
  role text,
  image_url text,
  bio text,
  is_active boolean not null default true,
  display_order integer not null default 0,
  updated_at timestamp with time zone default now(),
  created_at timestamp with time zone default now()
);

--------------------------------------------------
-- 5. PAGES (About, Vision, Terms etc)
--------------------------------------------------
create table pages (
  id uuid primary key default uuid_generate_v4(),
  slug text unique not null,
  title text,
  content text
);

--------------------------------------------------
-- 6. DONATIONS
--------------------------------------------------
create table donations (
  id uuid primary key default uuid_generate_v4(),
  full_name text not null,
  email text not null,
  phone text not null,
  amount numeric not null,
  payment_method text not null,
  status text default 'pending' check (status in ('pending', 'completed', 'failed', 'cancelled')),
  message text,
  transaction_id text,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

--------------------------------------------------
-- 7. CONTACTS
--------------------------------------------------
create table contacts (
  id uuid primary key default uuid_generate_v4(),
  name text,
  email text,
  message text,
  created_at timestamp with time zone default now()
);

--------------------------------------------------
-- 🔐 ENABLE ROW LEVEL SECURITY
--------------------------------------------------
alter table posts enable row level security;
alter table gallery enable row level security;
alter table events enable row level security;
alter table team_members enable row level security;
alter table pages enable row level security;
alter table donations enable row level security;
alter table contacts enable row level security;

--------------------------------------------------
-- 📖 PUBLIC READ ACCESS
--------------------------------------------------
create policy "Public read posts"
on posts for select
using (true);

create policy "Public read gallery"
on gallery for select
using (true);

create policy "Public read events"
on events for select
using (true);

create policy "Public read team"
on team_members for select
using (true);

create policy "Public read pages"
on pages for select
using (true);

--------------------------------------------------
-- ✍️ PUBLIC INSERT (forms)
--------------------------------------------------
create policy "Anyone can insert contacts"
on contacts for insert
with check (true);

create policy "Anyone can insert donations"
on donations for insert
with check (true);

--------------------------------------------------
-- 🔒 ADMIN ONLY (authenticated users)
--------------------------------------------------
create policy "Auth users manage posts"
on posts for all
using (auth.role() = 'authenticated')
with check (auth.role() = 'authenticated');

create policy "Auth users manage gallery"
on gallery for all
using (auth.role() = 'authenticated')
with check (auth.role() = 'authenticated');

create policy "Auth users manage events"
on events for all
using (auth.role() = 'authenticated')
with check (auth.role() = 'authenticated');

create policy "Auth users manage team"
on team_members for all
using (auth.role() = 'authenticated')
with check (auth.role() = 'authenticated');

create policy "Auth users manage pages"
on pages for all
using (auth.role() = 'authenticated')
with check (auth.role() = 'authenticated');

create policy "Auth users manage donations"
on donations for all
using (auth.role() = 'authenticated')
with check (auth.role() = 'authenticated');

create policy "Auth users manage contacts"
on contacts for all
using (auth.role() = 'authenticated')
with check (auth.role() = 'authenticated');

--------------------------------------------------
-- 🔄 AUTOMATIC UPDATED_AT
-- Reusable function to set updated_at column
--------------------------------------------------
create or replace function update_updated_at_column()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger team_members_updated_at
  before update on team_members
  for each row execute function update_updated_at_column();

create trigger contacts_updated_at
  before update on contacts
  for each row execute function update_updated_at_column();


-------------
-- Project
------------
create table location (
  id            uuid primary key default uuid_generate_v4(),
  province      text,
  district      text,
  municipality  text
);

create table project (
  id                    uuid primary key default uuid_generate_v4(),
  project_title         text not null,
  description           text,
  category              text check (category in ('Education','Health','Environment','Social','Other')),
  cover_image_url       text,
  location_id           uuid references location(id) on delete set null,
  start_date            date,
  end_date              date,
  status                text default 'Draft' check (status in ('Draft','Ongoing','Completed','Cancelled')),
  target_budget         numeric(12,2),
  actual_budget         numeric(12,2),
  target_beneficiaries  integer,
  project_organizer     text,
  created_at            timestamp with time zone default now()
);

create table project_gallery (
  id          uuid primary key default uuid_generate_v4(),
  project_id  uuid references project(id) on delete cascade,
  image_url   text not null,
  created_at  timestamp with time zone default now()
);

-----------------------------------
-- event
-----------------------------------

create TYPE event_category AS ENUM (
  'health',
  'education',
  'environment',
  'disaster_relief',
  'community',
  'other'
);

create table event_gallery (
  id          uuid primary key default uuid_generate_v4(),
  event_id    uuid references event(id) on delete cascade,
  image_url   text not null,
  created_at  timestamp with time zone default now()
);

create table event (
  id                    uuid primary key default uuid_generate_v4(),EE
  event_title                 text not null,
  description           text,
  category              event_category NOT NULL,
  organizer             text,
  location              uuid references location(id) on delete set null,
  start_date            date,
  end_date              date,
  cover_event_image_url text,
  status                text default 'published' check (status in ('published','draft','cancelled')),
  created_at            timestamp with time zone default now()
);

-----------------
-- article
------------------
create table article (
  id          uuid primary key default uuid_generate_v4(),
  title       text not null,
  content     text,
  author      text,
  article_image_url text,
  status      text default 'published' check (status in ('published','draft','cancelled')),
  published_at timestamp with time zone,
  created_at  timestamp with time zone default now()
);

create table blog {
  id          uuid primary key default uuid_generate_v4(),
  title       text not null,
  content     text,
  author      text,
  blog_image_url text,
  status      text default 'published' check (status in ('published','draft','cancelled')),
  published_at timestamp with time zone,
  created_at  timestamp with time zone default now()
}
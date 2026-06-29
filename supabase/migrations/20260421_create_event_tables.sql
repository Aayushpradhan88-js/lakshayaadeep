-- Create event_category enum type
create type event_category as enum (
  'health',
  'education',
  'environment',
  'disaster_relief',
  'community',
  'other'
);

create table event_location (
  id            uuid primary key default gen_random_uuid(),
  province      text,
  district      text,
  municipality  text
);

-- Create event table
create table event (
  id                    uuid primary key default gen_random_uuid(),
  event_title           text not null,
  description           text,
  category              event_category(id) not null,
  organizer             text,
  location              uuid references event_location(id) on delete set null,
  start_date            date,
  end_date              date,
  cover_event_image_url text,
  status                text default 'draft' check (status in ('published','draft','cancelled')),
  created_at            timestamp with time zone default now()
);

-- Create event_gallery table
create table event_gallery (
  id          uuid primary key default gen_random_uuid(),
  event_id    uuid references event(id) on delete cascade,
  image_url   text not null,
  is_cover    boolean default false,
  created_at  timestamp with time zone default now()
);

-- Create index for faster cover image queries
create index idx_event_gallery_cover 
on event_gallery(event_id, is_cover) 
where is_cover = true;

-- Enable RLS on event tables
alter table event enable row level security;
alter table event_gallery enable row level security;

-- Policies for event table
create policy "Public read events"
on event for select
using (true);

create policy "Auth users manage events"
on event for all
using (auth.role() = 'authenticated')
with check (auth.role() = 'authenticated');

-- Policies for event_gallery table
create policy "Public read event_gallery"
on event_gallery for select
using (true);

create policy "Auth users manage event_gallery"
on event_gallery for all
using (auth.role() = 'authenticated')
with check (auth.role() = 'authenticated');

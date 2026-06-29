create table project_location (
  id            uuid primary key default gen_random_uuid(),
  province      text,
  district      text,
  municipality  text
);

create table project (
  id                    uuid primary key default gen_random_uuid(),
  project_title         text not null,
  description           text,
  category              text check (category in ('Education','Health','Environment','Social','Other')),
  cover_image_url       text,
  location_id           uuid references project_location(id) on delete set null,
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
  id          uuid primary key default gen_random_uuid(),
  project_id  uuid references project(id) on delete cascade,
  image_url   text not null,
  created_at  timestamp with time zone default now()
);
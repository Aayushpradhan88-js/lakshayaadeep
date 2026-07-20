-- Our Story section: carousel images (files live in storage bucket `story_images`)
create table if not exists story_images (
  id uuid primary key default gen_random_uuid(),
  image_url text not null,
  storage_path text,
  alt_text text,
  display_order integer not null default 0,
  is_active boolean not null default true,
  created_at timestamp with time zone not null default now(),
  updated_at timestamp with time zone not null default now()
);

create index if not exists story_images_display_order_idx
  on story_images (display_order asc);

create index if not exists story_images_active_order_idx
  on story_images (is_active, display_order);

alter table story_images enable row level security;

-- Site visitors: only active images (About page carousel)
create policy "Public read active story images"
  on story_images
  for select
  using (is_active = true);

-- Dashboard admins (authenticated): full CRUD
create policy "Auth users manage story images"
  on story_images
  for all
  using (auth.role() = 'authenticated')
  with check (auth.role() = 'authenticated');

-- Reuse shared trigger helper (create if missing)
create or replace function update_updated_at_column()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

drop trigger if exists story_images_updated_at on story_images;
create trigger story_images_updated_at
  before update on story_images
  for each row execute function update_updated_at_column();

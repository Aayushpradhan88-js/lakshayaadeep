-- Create hero_settings table
create table if not exists hero_settings (
  id uuid primary key default uuid_generate_v4(),
  video_url text,
  is_embed boolean default false,
  title text,
  subtitle text,
  updated_at timestamp with time zone default now()
);

-- Insert initial record if not exists
insert into hero_settings (video_url, is_embed, title, subtitle)
select '/Homepage%20video.mp4', false, 'Welcome to Lakshyadeep', 'Uplifting humanity through compassion and action'
where not exists (select 1 from hero_settings);

-- Enable RLS
alter table hero_settings enable row level security;

-- Public read access
create policy "Public read hero_settings"
on hero_settings for select
using (true);

-- Admin manage access
create policy "Auth users manage hero_settings"
on hero_settings for all
using (auth.role() = 'authenticated')
with check (auth.role() = 'authenticated');

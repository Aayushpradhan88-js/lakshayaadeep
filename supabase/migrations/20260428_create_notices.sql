-- Create notices table
create table if not exists notices (
  id uuid primary key default uuid_generate_v4(),
  title text,
  description text,
  image_url text,
  is_active boolean default true,
  display_duration integer default 10,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

-- Enable RLS
alter table notices enable row level security;

-- Public read access
create policy "Public read notices"
on notices for select
using (true);

-- Admin manage access
create policy "Auth users manage notices"
on notices for all
using (auth.role() = 'authenticated')
with check (auth.role() = 'authenticated');

-- Auto update updated_at
create trigger notices_updated_at
  before update on notices
  for each row execute function update_updated_at_column();

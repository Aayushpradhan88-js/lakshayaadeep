-- Add updated_at to donations if missing (safe for existing databases)
alter table public.donations
  add column if not exists updated_at timestamp with time zone default now();

create or replace function update_updated_at_column()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

drop trigger if exists donations_updated_at on public.donations;

create trigger donations_updated_at
  before update on public.donations
  for each row execute function update_updated_at_column();

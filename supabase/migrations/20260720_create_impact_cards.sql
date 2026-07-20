-- About page "Our Impact" overlay cards
create table if not exists impact_cards (
  id uuid primary key default gen_random_uuid(),
  stat_value text not null,
  label text not null,
  tag text,
  image_url text,
  storage_path text,
  is_featured boolean not null default false,
  display_order integer not null default 0,
  is_active boolean not null default true,
  created_at timestamp with time zone not null default now(),
  updated_at timestamp with time zone not null default now()
);

create index if not exists impact_cards_display_order_idx
  on impact_cards (display_order asc);

create index if not exists impact_cards_active_order_idx
  on impact_cards (is_active, display_order);

alter table impact_cards enable row level security;

create policy "Public read active impact cards"
  on impact_cards
  for select
  using (is_active = true);

create policy "Auth users manage impact cards"
  on impact_cards
  for all
  using (auth.role() = 'authenticated')
  with check (auth.role() = 'authenticated');

create or replace function update_updated_at_column()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

drop trigger if exists impact_cards_updated_at on impact_cards;
create trigger impact_cards_updated_at
  before update on impact_cards
  for each row execute function update_updated_at_column();

-- Default content (matches current About page copy)
insert into impact_cards (stat_value, label, tag, is_featured, display_order, is_active)
select v.stat_value, v.label, v.tag, v.is_featured, v.display_order, true
from (values
  ('1200+'::text, 'Lives changed through your support'::text, null::text, true, 0),
  ('1200+'::text, 'Lives Impacted'::text, 'Education'::text, false, 1),
  ('85+'::text, 'Active Volunteers'::text, 'Community'::text, false, 2),
  ('48'::text, 'Health Camps'::text, 'Healthcare'::text, false, 3),
  ('120'::text, 'Green Initiatives'::text, 'Sustainability'::text, false, 4)
) as v(stat_value, label, tag, is_featured, display_order)
where not exists (select 1 from impact_cards limit 1);

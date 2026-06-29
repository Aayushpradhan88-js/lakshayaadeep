-- Create blogs table
create table blogs (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  content text,
  excerpt text,
  author text not null,
  category text,
  tags text[],
  status text default 'draft' check (status in ('draft', 'published', 'archived')),
  blog_image_url text,
  published_at timestamp with time zone,
  read_time integer, -- in minutes
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

-- Create articles table
create table articles (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  content text,
  excerpt text,
  author text not null,
  article_no integer unique not null,
  category text,
  tags text[],
  status text default 'draft' check (status in ('draft', 'published', 'archived')),
  article_image_url text,
  published_at timestamp with time zone,
  read_time integer, -- in minutes
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

-- Create indexes for better performance
create index idx_blogs_status on blogs(status);
create index idx_blogs_published_at on blogs(published_at);
create index idx_blogs_category on blogs(category);

create index idx_articles_status on articles(status);
create index idx_articles_published_at on articles(published_at);
create index idx_articles_article_no on articles(article_no);
create index idx_articles_category on articles(category);

-- Enable Row Level Security
alter table blogs enable row level security;
alter table articles enable row level security;

-- RLS Policies for blogs
create policy "Public read published blogs"
on blogs for select
using (status = 'published');

create policy "Auth users manage blogs"
on blogs for all
using (auth.role() = 'authenticated')
with check (auth.role() = 'authenticated');

-- RLS Policies for articles
create policy "Public read published articles"
on articles for select
using (status = 'published');

create policy "Auth users manage articles"
on articles for all
using (auth.role() = 'authenticated')
with check (auth.role() = 'authenticated');

-- Create function to update updated_at timestamp
create or replace function update_updated_at_column()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

-- Create triggers for updated_at
create trigger update_blogs_updated_at
  before update on blogs
  for each row execute function update_updated_at_column();

create trigger update_articles_updated_at
  before update on articles
  for each row execute function update_updated_at_column();</content>
<parameter name="filePath">c:\Users\AAYUS\OneDrive\Desktop\DP\Products\Lakshya-deep\lakshya-deep\supabase\migrations\20260423_create_blogs_articles_tables.sql
-- Founder visual page editor: published layouts + asset metadata
-- Run after 20260813_hall_codes_socials.sql
-- page_id: 'hub' | wolf | viking | eagle | phenix | holm | atoll | olympus | aether | demeter | njord | aeolus | corvus

create table if not exists public.page_layouts (
  page_id text primary key,
  layout jsonb not null default '{"version":1,"enabled":false,"blocks":[]}'::jsonb,
  updated_at timestamptz not null default now(),
  updated_by text not null default ''
);

create table if not exists public.page_assets (
  id uuid primary key default gen_random_uuid(),
  page_id text not null,
  path text not null,
  public_url text not null default '',
  content_type text not null default '',
  byte_size integer not null default 0,
  created_at timestamptz not null default now(),
  created_by text not null default ''
);

create index if not exists page_assets_page_id_idx on public.page_assets (page_id);

alter table public.page_layouts enable row level security;
alter table public.page_assets enable row level security;

-- No anon/authenticated policies — service role only (API uses SUPABASE_SERVICE_ROLE_KEY).

-- Storage bucket (run in SQL Editor if Storage API UI is preferred, create bucket named page-assets instead):
-- insert into storage.buckets (id, name, public)
-- values ('page-assets', 'page-assets', true)
-- on conflict (id) do nothing;
--
-- Public read policy for the bucket (optional if bucket is marked public):
-- create policy "page_assets_public_read"
-- on storage.objects for select
-- using (bucket_id = 'page-assets');
--
-- Writes go through the service role from /api/admin/pages/upload — no anon insert policy needed.

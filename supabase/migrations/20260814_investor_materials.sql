-- Editable fundraising materials for /investors (single-row JSON pack).
-- Run after investor_codes migration. Service role only (no anon policies).

create table if not exists public.investor_materials (
  id text primary key default 'default',
  content jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now(),
  updated_by text not null default ''
);

alter table public.investor_materials enable row level security;
-- No anon/authenticated policies — service role only.

insert into public.investor_materials (id, content, updated_by)
values ('default', '{}'::jsonb, 'migration-seed')
on conflict (id) do nothing;

-- Optional Storage bucket for PDF / markdown overrides (create in Dashboard if preferred):
-- insert into storage.buckets (id, name, public)
-- values ('investor-assets', 'investor-assets', true)
-- on conflict (id) do nothing;

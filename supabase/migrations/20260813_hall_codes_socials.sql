-- Hall unlock codes (wave 2 Instagram) + company social links
-- Run after 20260813_valhalla_empire.sql

create table if not exists public.hall_codes (
  hall_id text primary key,
  code text not null,
  note text not null default '',
  updated_at timestamptz not null default now()
);

create table if not exists public.company_socials (
  company_id text primary key,
  linkedin text not null default '',
  instagram text not null default '',
  x text not null default '',
  discord text not null default '',
  follower_notes text not null default '',
  last_checked timestamptz,
  updated_at timestamptz not null default now()
);

alter table public.hall_codes enable row level security;
alter table public.company_socials enable row level security;

-- No anon/authenticated policies — service role only.

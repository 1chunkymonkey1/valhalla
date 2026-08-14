-- Investor access codes (P = small, E = elephant)
-- Run after prior Valhalla migrations. Service role only (no anon policies).

create table if not exists public.investor_codes (
  id uuid primary key default gen_random_uuid(),
  code text not null unique,
  tier text not null check (tier in ('p', 'e')),
  sequence_number integer not null,
  created_at timestamptz not null default now(),
  created_by text not null default '',
  redeemed_at timestamptz,
  redeemer_note text not null default '',
  active boolean not null default true,
  unique (tier, sequence_number)
);

create index if not exists investor_codes_active_code_idx
  on public.investor_codes (code)
  where active = true;

alter table public.investor_codes enable row level security;
-- No anon/authenticated policies — service role only.

-- Starter codes (idempotent). App also auto-seeds these on first list/redeem.
insert into public.investor_codes (code, tier, sequence_number, created_by, active)
values
  ('e81821', 'e', 1, 'migration-seed', true),
  ('p35891', 'p', 1, 'migration-seed', true)
on conflict (code) do nothing;

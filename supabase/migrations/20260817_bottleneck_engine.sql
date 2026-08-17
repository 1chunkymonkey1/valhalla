-- Bottleneck engine findings + founder queue (filtered view of founder-required keys).
-- Server uses SUPABASE_SERVICE_ROLE_KEY only.

create table if not exists public.bottlenecks (
  id text primary key,
  dedupe_key text not null unique,
  surface text not null,
  kind text not null,
  slug text not null,
  title text not null,
  body text not null default '',
  status text not null default 'open',
  founder_required boolean not null default false,
  automation text not null default 'none',
  evidence jsonb not null default '{}'::jsonb,
  seen_count int not null default 1,
  first_seen_at timestamptz not null default now(),
  last_seen_at timestamptz not null default now(),
  resolved_at timestamptz,
  resolved_by text,
  snooze_until timestamptz
);

create index if not exists bottlenecks_status_idx on public.bottlenecks (status);
create index if not exists bottlenecks_surface_idx on public.bottlenecks (surface);

create table if not exists public.founder_queue (
  id text primary key,
  bottleneck_id text not null,
  hall text,
  title text not null,
  body text not null default '',
  status text not null default 'needs_eason',
  automatable boolean not null default false,
  resolution text not null default '',
  source text not null default 'sweep',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  resolved_at timestamptz,
  resolved_by text
);

create index if not exists founder_queue_status_idx on public.founder_queue (status);
create index if not exists founder_queue_hall_idx on public.founder_queue (hall);
create index if not exists founder_queue_bottleneck_idx on public.founder_queue (bottleneck_id);

create unique index if not exists founder_queue_open_bottleneck
  on public.founder_queue (bottleneck_id)
  where status in ('open', 'needs_eason');

create table if not exists public.bottleneck_sweeps (
  id text primary key,
  ran_at timestamptz not null default now(),
  actor text,
  findings int not null default 0,
  queued int not null default 0,
  automated int not null default 0,
  deduped int not null default 0,
  report jsonb not null default '{}'::jsonb
);

create index if not exists bottleneck_sweeps_ran_idx on public.bottleneck_sweeps (ran_at desc);

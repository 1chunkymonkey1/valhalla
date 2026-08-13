-- Valhalla empire durable store (run in Supabase SQL Editor)
-- Server uses SUPABASE_SERVICE_ROLE_KEY only — never expose to the browser.

create extension if not exists "pgcrypto";

-- Team seats
create table if not exists public.team_users (
  id text primary key,
  email text not null unique,
  name text not null default '',
  role text not null default 'hall_lead',
  halls text[] not null default '{}',
  password_hash text,
  active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists team_users_email_idx on public.team_users (email);

-- Invites
create table if not exists public.invites (
  id text primary key,
  email text not null,
  name text not null default '',
  role text not null default 'hall_lead',
  halls text[] not null default '{}',
  token text not null unique,
  invited_by text,
  created_at timestamptz not null default now(),
  expires_at timestamptz not null,
  accepted_at timestamptz
);

create index if not exists invites_token_idx on public.invites (token);
create index if not exists invites_email_idx on public.invites (email);

-- Tasks
create table if not exists public.tasks (
  id text primary key,
  title text not null,
  body text not null default '',
  hall text,
  status text not null default 'todo',
  assignee text,
  created_by text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists tasks_hall_idx on public.tasks (hall);
create index if not exists tasks_status_idx on public.tasks (status);

-- Hall notes
create table if not exists public.notes (
  id text primary key,
  hall text not null,
  body text not null,
  author text,
  created_at timestamptz not null default now()
);

create index if not exists notes_hall_idx on public.notes (hall);

-- Activity feed
create table if not exists public.activity (
  id text primary key,
  type text not null,
  actor text,
  email text,
  role text,
  hall text,
  title text,
  task_id text,
  status text,
  at timestamptz not null default now(),
  meta jsonb not null default '{}'::jsonb
);

create index if not exists activity_at_idx on public.activity (at desc);

-- Public email signups
create table if not exists public.signups (
  id text primary key,
  email text not null,
  name text,
  audience text,
  source text,
  company_id text,
  received_at timestamptz not null default now(),
  payload jsonb not null default '{}'::jsonb
);

create index if not exists signups_received_idx on public.signups (received_at desc);
create index if not exists signups_email_idx on public.signups (email);

-- Refundable reservations / money-capture holds
create table if not exists public.reservations (
  id text primary key,
  company_id text,
  company_name text,
  product text,
  name text,
  email text,
  phone text,
  zip text,
  interest_group text,
  reservation_type text,
  refundable boolean not null default true,
  payment_captured boolean not null default false,
  pay_link_id text,
  amount_estimate_usd numeric,
  status text,
  submitted_at timestamptz,
  received_at timestamptz not null default now(),
  imported boolean not null default false,
  source text,
  payload jsonb not null default '{}'::jsonb
);

create index if not exists reservations_received_idx on public.reservations (received_at desc);
create index if not exists reservations_company_idx on public.reservations (company_id);
create index if not exists reservations_email_idx on public.reservations (email);

-- Lock down: only service role (server) should access these tables
alter table public.team_users enable row level security;
alter table public.invites enable row level security;
alter table public.tasks enable row level security;
alter table public.notes enable row level security;
alter table public.activity enable row level security;
alter table public.signups enable row level security;
alter table public.reservations enable row level security;

-- No policies for anon/authenticated → denied by default.
-- Service role bypasses RLS.

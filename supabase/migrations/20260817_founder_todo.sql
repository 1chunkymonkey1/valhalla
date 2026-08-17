-- Founder-only act queue. Not team tasks. Not inbox. Sweep closes junk; it does not create.
-- Server uses SUPABASE_SERVICE_ROLE_KEY only.

create table if not exists public.founder_todos (
  id text primary key,
  dedupe_key text not null,
  title text not null,
  bottleneck_id text not null,
  hall text not null,
  kind text not null,
  why_eason text not null,
  decision text not null,
  options jsonb not null default '[]'::jsonb,
  failed_lane text not null,
  source text not null,
  evidence_ref text not null default '',
  status text not null default 'open',
  due_at timestamptz,
  expires_at timestamptz not null,
  waiting_on text not null default '',
  decision_record text not null default '',
  created_at timestamptz not null default now(),
  created_by text,
  updated_at timestamptz not null default now(),
  closed_at timestamptz,
  closed_reason text not null default ''
);

create index if not exists founder_todos_status_idx on public.founder_todos (status);
create index if not exists founder_todos_expires_idx on public.founder_todos (expires_at);

create unique index if not exists founder_todos_open_dedupe
  on public.founder_todos (dedupe_key)
  where status in ('open', 'waiting');

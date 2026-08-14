-- Valhalla Council: founder ↔ agents + agent↔agent threads
-- Service role only (no anon policies).

create table if not exists public.council_threads (
  id text primary key,
  kind text not null default 'direct',
  title text not null default '',
  agent_id text,
  participants jsonb not null default '[]'::jsonb,
  status text not null default 'open',
  goal text not null default '',
  preview text not null default '',
  last_round_at timestamptz,
  round_count integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  last_message_at timestamptz not null default now()
);

create index if not exists council_threads_last_msg_idx
  on public.council_threads (last_message_at desc);
create index if not exists council_threads_agent_idx
  on public.council_threads (agent_id);

create table if not exists public.council_messages (
  id text primary key,
  thread_id text not null references public.council_threads (id) on delete cascade,
  from_id text not null default '',
  to_id text not null default '',
  body text not null,
  kind text not null default 'chat',
  model text not null default '',
  meta jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create index if not exists council_messages_thread_idx
  on public.council_messages (thread_id, created_at);

alter table public.council_threads enable row level security;
alter table public.council_messages enable row level security;

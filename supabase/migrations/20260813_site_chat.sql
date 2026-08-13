-- Visitor ↔ founder hall chat (human relay)
-- Run after 20260813_hall_codes_socials.sql (and page_layouts if used)

create table if not exists public.chat_threads (
  id text primary key,
  page_id text not null,
  visitor_token text not null,
  visitor_name text not null default '',
  visitor_email text not null default '',
  status text not null default 'open',
  unread_admin integer not null default 0,
  unread_visitor integer not null default 0,
  preview text not null default '',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  last_message_at timestamptz not null default now()
);

create index if not exists chat_threads_page_idx on public.chat_threads (page_id);
create index if not exists chat_threads_token_idx on public.chat_threads (visitor_token);
create index if not exists chat_threads_last_msg_idx on public.chat_threads (last_message_at desc);
create index if not exists chat_threads_unread_admin_idx on public.chat_threads (unread_admin)
  where unread_admin > 0;

create table if not exists public.chat_messages (
  id text primary key,
  thread_id text not null references public.chat_threads (id) on delete cascade,
  sender text not null,
  body text not null,
  created_at timestamptz not null default now()
);

create index if not exists chat_messages_thread_idx
  on public.chat_messages (thread_id, created_at);

alter table public.chat_threads enable row level security;
alter table public.chat_messages enable row level security;

-- No anon/authenticated policies — service role only.

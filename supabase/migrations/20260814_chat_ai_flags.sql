-- AI chat fields: needs_human escalation + message model/meta
-- Run after 20260813_site_chat.sql

alter table public.chat_threads
  add column if not exists needs_human boolean not null default false,
  add column if not exists needs_human_reason text not null default '',
  add column if not exists is_test boolean not null default false,
  add column if not exists last_ai_model text not null default '',
  add column if not exists last_ai_status text not null default '';

create index if not exists chat_threads_needs_human_idx
  on public.chat_threads (needs_human, last_message_at desc)
  where needs_human = true;

create index if not exists chat_threads_is_test_idx
  on public.chat_threads (is_test)
  where is_test = true;

alter table public.chat_messages
  add column if not exists model text not null default '',
  add column if not exists meta jsonb not null default '{}'::jsonb;

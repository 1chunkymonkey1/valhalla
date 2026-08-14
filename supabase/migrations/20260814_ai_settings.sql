-- Valhalla AI provider prefs (Council + hall Ask). Service role only.

create table if not exists public.ai_settings (
  id text primary key default 'default',
  provider text not null default 'auto',
  cursor_model text not null default 'composer-2.5',
  chat_model text not null default 'openai/gpt-5.4-mini',
  updated_at timestamptz not null default now(),
  updated_by text not null default ''
);

alter table public.ai_settings enable row level security;

insert into public.ai_settings (id)
values ('default')
on conflict (id) do nothing;

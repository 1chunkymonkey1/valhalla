-- Founder outbound dispatch: drafts, approvals, send log.
-- Server uses SUPABASE_SERVICE_ROLE_KEY only.

create table if not exists public.dispatch_items (
  id text primary key,
  status text not null default 'draft',
  held boolean not null default false,
  recipient text not null default '',
  subject text not null default '',
  body text not null default '',
  apply_url text not null default '',
  approved_at timestamptz,
  approved_by text,
  sent_at timestamptz,
  sent_by text,
  updated_at timestamptz not null default now(),
  updated_by text
);

create index if not exists dispatch_items_status_idx on public.dispatch_items (status);

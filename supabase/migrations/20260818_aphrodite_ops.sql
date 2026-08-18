-- Aphrodite operational tables: messages, blocks, reports.
-- Safe to re-run. Requires 20260815_aphrodite.sql.

create table if not exists public.aphrodite_blocks (
  id uuid primary key default gen_random_uuid(),
  from_profile_id uuid not null references public.aphrodite_profiles (id) on delete cascade,
  to_profile_id uuid not null references public.aphrodite_profiles (id) on delete cascade,
  created_at timestamptz not null default now(),
  unique (from_profile_id, to_profile_id),
  check (from_profile_id <> to_profile_id)
);

create index if not exists aphrodite_blocks_from_idx
  on public.aphrodite_blocks (from_profile_id);

create index if not exists aphrodite_blocks_to_idx
  on public.aphrodite_blocks (to_profile_id);

comment on table public.aphrodite_blocks is
  'One-way blocks. Either direction hides the pair from deck, matches, and messages.';

create table if not exists public.aphrodite_reports (
  id uuid primary key default gen_random_uuid(),
  from_profile_id uuid not null references public.aphrodite_profiles (id) on delete cascade,
  to_profile_id uuid not null references public.aphrodite_profiles (id) on delete cascade,
  reason text not null check (reason in ('harassment', 'fake', 'underage', 'spam', 'other')),
  details text default '',
  created_at timestamptz not null default now()
);

create index if not exists aphrodite_reports_to_idx
  on public.aphrodite_reports (to_profile_id, created_at desc);

comment on table public.aphrodite_reports is
  'Safety reports. Review is manual; reporting does not auto-ban.';

create table if not exists public.aphrodite_messages (
  id uuid primary key default gen_random_uuid(),
  match_id uuid not null references public.aphrodite_matches (id) on delete cascade,
  from_profile_id uuid not null references public.aphrodite_profiles (id) on delete cascade,
  body text not null,
  created_at timestamptz not null default now()
);

create index if not exists aphrodite_messages_match_idx
  on public.aphrodite_messages (match_id, created_at);

comment on table public.aphrodite_messages is
  'In-match messages. Only the two matched profiles may read or write.';

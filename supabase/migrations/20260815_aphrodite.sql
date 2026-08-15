-- Aphrodite: competition dating (Valhalla ecosystem)
-- Safe to re-run. Server uses service_role; RLS optional for future client reads.

create table if not exists public.aphrodite_profiles (
  id uuid primary key default gen_random_uuid(),
  auth_user_id uuid not null unique,
  email text,
  display_name text,
  bio text default '',
  birth_date date,
  intents text[] default '{}',
  competitions text[] default '{}',
  chess_com text default '',
  maxpreps text default '',
  instagram text default '',
  clash_royale text default '',
  avatar_url text default '',
  signed_up_at timestamptz not null default now(),
  approved_at timestamptz,
  subscription_status text not null default 'none'
    check (subscription_status in ('none', 'active', 'past_due', 'canceled', 'trialing')),
  stripe_customer_id text,
  stripe_subscription_id text,
  subscription_current_period_end timestamptz,
  auth_providers text[] default '{}',
  active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists aphrodite_profiles_email_idx
  on public.aphrodite_profiles (lower(email));

create index if not exists aphrodite_profiles_sub_idx
  on public.aphrodite_profiles (subscription_status)
  where active = true;

comment on table public.aphrodite_profiles is
  'Aphrodite member profiles: competition links, signup/approval dates, Stripe subscription.';

create table if not exists public.aphrodite_swipes (
  id uuid primary key default gen_random_uuid(),
  from_profile_id uuid not null references public.aphrodite_profiles (id) on delete cascade,
  to_profile_id uuid not null references public.aphrodite_profiles (id) on delete cascade,
  direction text not null check (direction in ('like', 'pass')),
  created_at timestamptz not null default now(),
  unique (from_profile_id, to_profile_id)
);

create index if not exists aphrodite_swipes_from_idx
  on public.aphrodite_swipes (from_profile_id);

create table if not exists public.aphrodite_matches (
  id uuid primary key default gen_random_uuid(),
  profile_a uuid not null references public.aphrodite_profiles (id) on delete cascade,
  profile_b uuid not null references public.aphrodite_profiles (id) on delete cascade,
  created_at timestamptz not null default now(),
  check (profile_a < profile_b),
  unique (profile_a, profile_b)
);

create index if not exists aphrodite_matches_a_idx
  on public.aphrodite_matches (profile_a);

create index if not exists aphrodite_matches_b_idx
  on public.aphrodite_matches (profile_b);

comment on table public.aphrodite_matches is
  'Mutual likes between Aphrodite members.';

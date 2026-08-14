-- Link Valhalla team seats to Supabase Auth users (Google SSO).
-- Safe to re-run. Does not enable RLS — server uses service_role.

alter table public.team_users
  add column if not exists auth_user_id uuid;

create unique index if not exists team_users_auth_user_id_uidx
  on public.team_users (auth_user_id)
  where auth_user_id is not null;

comment on column public.team_users.auth_user_id is
  'Supabase Auth user id when the seat signed in or joined via Google/SSO';

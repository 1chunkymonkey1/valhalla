-- Investor code send / next-step tracker (a5861 editor tables).
-- 12 rows × E (elephant) and 12 rows × P (small). Service role only.

create table if not exists public.investor_code_tracking (
  id uuid primary key default gen_random_uuid(),
  tier text not null check (tier in ('p', 'e')),
  row_index integer not null check (row_index >= 1 and row_index <= 12),
  code text not null default '',
  recipient text not null default '',
  sent_at text not null default '',
  next_step text not null default '',
  updated_at timestamptz not null default now(),
  unique (tier, row_index)
);

create index if not exists investor_code_tracking_tier_idx
  on public.investor_code_tracking (tier, row_index);

alter table public.investor_code_tracking enable row level security;
-- No anon/authenticated policies — service role only.

-- Prefill codes for sequences 1–12 (same π/e generator as investorCodes.js).
-- Recipient / sent_at / next_step stay empty until edited in the a5861 UI.
insert into public.investor_code_tracking (tier, row_index, code)
values
  ('e', 1, 'e81821'),
  ('e', 2, 'e84592'),
  ('e', 3, 'e04523'),
  ('e', 4, 'e35364'),
  ('e', 5, 'e02875'),
  ('e', 6, 'e47136'),
  ('e', 7, 'e52667'),
  ('e', 8, 'e24978'),
  ('e', 9, 'e75729'),
  ('e', 10, 'e470910'),
  ('e', 11, 'e369911'),
  ('e', 12, 'e959512'),
  ('p', 1, 'p35891'),
  ('p', 2, 'p79322'),
  ('p', 3, 'p38463'),
  ('p', 4, 'p26434'),
  ('p', 5, 'p38325'),
  ('p', 6, 'p79506'),
  ('p', 7, 'p28847'),
  ('p', 8, 'p19718'),
  ('p', 9, 'p69399'),
  ('p', 10, 'p937510'),
  ('p', 11, 'p105811'),
  ('p', 12, 'p209712')
on conflict (tier, row_index) do nothing;

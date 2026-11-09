-- savings_locks (Stage 3): the append-only cushion ledger.
--
-- One row per completed cycle, recording the savings that survived that cycle's
-- spending. The cumulative cushion is the sum of these rows plus the current
-- cycle's provisional savings. Append-only (insert and select only), so past
-- cycles are frozen and a rule change only affects future cycles (ADR 0006, 0011).
-- The unique (user_id, cycle_start) makes locking idempotent: a cycle is locked
-- once, never twice. The lock is virtual; no real bank money moves.

create table public.savings_locks (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  cycle_start date not null,
  amount_cents bigint not null,
  created_at timestamptz not null default now(),
  unique (user_id, cycle_start)
);
create index savings_locks_user_id_idx on public.savings_locks (user_id);

alter table public.savings_locks enable row level security;
create policy savings_locks_select_own on public.savings_locks
  for select using (user_id = auth.uid());
create policy savings_locks_insert_own on public.savings_locks
  for insert with check (user_id = auth.uid());
-- Append-only: no update or delete is granted.
grant select, insert on public.savings_locks to authenticated;

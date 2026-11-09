-- Cushion locking and reading (Stage 3).
--
-- lock_completed_cycles(): compute-on-open. Appends a savings lock for each
-- completed cycle (earlier than the current one) that has survived savings and is
-- not already locked. Idempotent via the unique (user_id, cycle_start), so it is
-- safe to call on every app open, and it catches up any cycles missed while away.
--
-- savings_cushion(): the cumulative cushion on read = the sum of locked cycles plus
-- the current cycle's provisional (not-yet-locked) savings.
--
-- Both run as the calling user (security invoker + auth.uid() + RLS). The lock uses
-- the bucket rules in force when it runs; snapshotting per-cycle rules is a later
-- refinement.

create or replace function public.lock_completed_cycles()
returns integer
language plpgsql
security invoker
set search_path = public
as $$
declare
  freq text;
  current_start date;
  n integer := 0;
begin
  select coalesce(pay_frequency, 'monthly') into freq
  from public.profiles where id = auth.uid();
  if freq is null then
    freq := 'monthly';
  end if;
  current_start := (case when freq = 'weekly'
                         then date_trunc('week', now())
                         else date_trunc('month', now()) end)::date;

  insert into public.savings_locks (user_id, cycle_start, amount_cents)
  select auth.uid(), cs.cycle_start, cs.savings_left
  from public.cycle_summary() cs
  where cs.cycle_start < current_start
    and cs.savings_left > 0
  on conflict (user_id, cycle_start) do nothing;

  get diagnostics n = row_count;
  return n;
end;
$$;

grant execute on function public.lock_completed_cycles() to authenticated;

create or replace function public.savings_cushion()
returns bigint
language sql
stable
security invoker
set search_path = public
as $$
  with
  freq as (
    select coalesce(
      (select pay_frequency from public.profiles where id = auth.uid()),
      'monthly'
    ) as f
  ),
  current_start as (
    select (case when (select f from freq) = 'weekly'
                 then date_trunc('week', now())
                 else date_trunc('month', now()) end)::date as d
  )
  select
    coalesce(
      (select sum(amount_cents) from public.savings_locks where user_id = auth.uid()),
      0
    )
    + coalesce(
      (select cs.savings_left from public.cycle_summary() cs
       where cs.cycle_start = (select d from current_start)),
      0
    );
$$;

grant execute on function public.savings_cushion() to authenticated;

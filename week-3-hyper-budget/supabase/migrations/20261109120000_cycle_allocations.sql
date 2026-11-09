-- Cycle allocations (Stage 1 wiring): run the waterfall on real cycle income.
--
-- Groups the person's income (money-in transactions) into cycles the length of
-- their pay frequency (weekly or monthly), sums each cycle's income, and runs
-- allocate_cycle on it. Returns one row per cycle with the full split.
--
-- Reads only this person's own rows (security invoker + auth.uid() + RLS). Money
-- is whole cents. Computed on read, so it always matches the current transactions
-- and bucket amounts (ADR 0005). The per-cycle split is the foundation the later
-- locking stage builds on.
--
-- Note: cycle boundaries use date_trunc, which follows the database session's time
-- zone. Good enough for the MVP; a per-user time zone can refine it later.

create or replace function public.cycle_allocations()
returns table (
  cycle_start date,
  income_cents bigint,
  essentials_funded bigint,
  bills_funded bigint,
  fun_floor_funded bigint,
  savings_funded bigint,
  safe_to_spend bigint
)
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
  targets as (
    select
      coalesce(max(target_cents) filter (where type = 'essentials'), 0) as essentials,
      coalesce(max(target_cents) filter (where type = 'bills'), 0) as bills,
      coalesce(max(target_cents) filter (where type = 'fun'), 0) as fun_floor,
      coalesce(max(target_cents) filter (where type = 'savings'), 0) as savings
    from public.buckets
    where user_id = auth.uid()
  ),
  income as (
    select
      (case when (select f from freq) = 'weekly'
            then date_trunc('week', occurred_at)
            else date_trunc('month', occurred_at)
       end)::date as cycle_start,
      -- sum() over bigint returns numeric, so cast back to bigint to match
      -- allocate_cycle's signature.
      sum(amount_cents)::bigint as income_cents
    from public.transactions
    where user_id = auth.uid()
      and amount_cents > 0
    group by 1
  )
  select
    i.cycle_start,
    i.income_cents,
    a.essentials_funded,
    a.bills_funded,
    a.fun_floor_funded,
    a.savings_funded,
    a.safe_to_spend
  from income i
  cross join targets t
  cross join lateral public.allocate_cycle(
    i.income_cents, t.essentials, t.bills, t.fun_floor, t.savings
  ) a
  order by i.cycle_start;
$$;

grant execute on function public.cycle_allocations() to authenticated;

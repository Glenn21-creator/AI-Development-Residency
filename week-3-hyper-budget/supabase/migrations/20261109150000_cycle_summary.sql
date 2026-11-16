-- Cycle summary (Stage 2 reconciliation): the real safe-to-spend after spending.
--
-- For each cycle it: allocates the cycle's income into buckets (allocate_cycle),
-- sorts that cycle's spending into buckets by the bank's own label (label_buckets,
-- unknown labels count as fun), lets each protected bucket absorb its own spending,
-- and then runs the cascade (apply_spending) on the fun-side draw: discretionary
-- spending plus any bucket's overflow (spending beyond its budget). The cascade
-- eats fun money (the floor plus the discretionary remainder), then savings, then
-- leftover bills, then leftover food & rent, and reports amount_overspent for
-- anything beyond all of it.
--
-- safe_to_spend here is the WHOLE of fun money as one number; the fun floor is not
-- reported separately, because it is not a separate bucket (ADR 0010). (An earlier
-- version exposed a separate fun_floor_left column, which was confusing to read.)
--
-- Computed on read from transactions, buckets, and the label map (ADR 0005). Only
-- the person's own rows (security invoker + auth.uid() + RLS). Money is whole cents.

drop function if exists public.cycle_summary();

create or replace function public.cycle_summary()
returns table (
  cycle_start date,
  income_cents bigint,
  spend_cents bigint,
  essentials_left bigint,
  bills_left bigint,
  savings_left bigint,
  safe_to_spend bigint,
  amount_overspent bigint
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
  cycles as (
    select
      (case when (select f from freq) = 'weekly'
            then date_trunc('week', t.occurred_at)
            else date_trunc('month', t.occurred_at)
       end)::date as cycle_start,
      coalesce(sum(t.amount_cents) filter (where t.amount_cents > 0), 0)::bigint as income_cents,
      coalesce(sum(-t.amount_cents) filter (where t.amount_cents < 0), 0)::bigint as spend_cents,
      coalesce(sum(-t.amount_cents) filter (where t.amount_cents < 0 and lb.bucket = 'essentials'), 0)::bigint as ess_spend,
      coalesce(sum(-t.amount_cents) filter (where t.amount_cents < 0 and lb.bucket = 'bills'), 0)::bigint as bills_spend,
      coalesce(sum(-t.amount_cents) filter (where t.amount_cents < 0 and lb.bucket = 'savings'), 0)::bigint as sav_spend,
      coalesce(sum(-t.amount_cents) filter (where t.amount_cents < 0 and (lb.bucket = 'fun' or lb.bucket is null)), 0)::bigint as fun_spend
    from public.transactions t
    left join public.label_buckets lb on lb.label = lower(trim(t.category))
    where t.user_id = auth.uid()
    group by 1
  )
  select
    c.cycle_start,
    c.income_cents,
    c.spend_cents,
    sp.essentials_left,
    sp.bills_left,
    sp.savings_left,
    sp.safe_to_spend_left,
    sp.amount_overspent
  from cycles c
  cross join targets tg
  cross join lateral public.allocate_cycle(
    c.income_cents, tg.essentials, tg.bills, tg.fun_floor, tg.savings
  ) a
  cross join lateral public.apply_spending(
    greatest(0, a.essentials_funded - c.ess_spend),   -- food & rent left after its own spending
    greatest(0, a.bills_funded - c.bills_spend),      -- bills left after its own spending
    a.fun_floor_funded,                               -- fun floor (a separate input)
    greatest(0, a.savings_funded - c.sav_spend),      -- savings left after its own spending
    a.safe_to_spend,                                  -- discretionary fun allowance
    c.fun_spend                                       -- the fun-side draw:
      + greatest(0, c.ess_spend - a.essentials_funded)   -- + food & rent overflow
      + greatest(0, c.bills_spend - a.bills_funded)      -- + bills overflow
      + greatest(0, c.sav_spend - a.savings_funded)      -- + savings overflow
  ) sp
  order by c.cycle_start;
$$;

grant execute on function public.cycle_summary() to authenticated;

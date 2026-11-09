-- The per-cycle funding waterfall (Stage 1 of the allocation engine).
--
-- Given one cycle's income and the bucket amounts, split the income in fixed
-- order: food & rent, then bills, then the fun floor, then savings, and whatever
-- is left over is safe-to-spend.
--
-- Savings uses "save what fits": it takes what remains after the earlier buckets,
-- up to its target, so a lean cycle simply saves less. An empty cycle (no income)
-- funds nothing.
--
-- This is a pure function: it reads no tables and depends only on its inputs, so
-- it is easy to test with plain numbers and cannot drift. Money is whole cents.
-- Later stages feed it the real cycle income and record the result.

create or replace function public.allocate_cycle(
  income_cents bigint,
  essentials_cents bigint,
  bills_cents bigint,
  fun_floor_cents bigint,
  savings_cents bigint
)
returns table (
  essentials_funded bigint,
  bills_funded bigint,
  fun_floor_funded bigint,
  savings_funded bigint,
  safe_to_spend bigint
)
language sql
immutable
as $$
  with
  start as (
    select greatest(0, income_cents) as remaining
  ),
  ess as (
    select least((select remaining from start), greatest(0, essentials_cents)) as funded
  ),
  after_ess as (
    select (select remaining from start) - (select funded from ess) as remaining
  ),
  bil as (
    select least((select remaining from after_ess), greatest(0, bills_cents)) as funded
  ),
  after_bil as (
    select (select remaining from after_ess) - (select funded from bil) as remaining
  ),
  fun as (
    select least((select remaining from after_bil), greatest(0, fun_floor_cents)) as funded
  ),
  after_fun as (
    select (select remaining from after_bil) - (select funded from fun) as remaining
  ),
  sav as (
    select least((select remaining from after_fun), greatest(0, savings_cents)) as funded
  ),
  after_sav as (
    select (select remaining from after_fun) - (select funded from sav) as remaining
  )
  select
    (select funded from ess),
    (select funded from bil),
    (select funded from fun),
    (select funded from sav),
    (select remaining from after_sav);
$$;

grant execute on function public.allocate_cycle(bigint, bigint, bigint, bigint, bigint) to authenticated;

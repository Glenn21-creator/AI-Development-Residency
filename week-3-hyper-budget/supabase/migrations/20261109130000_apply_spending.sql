-- The overspend cascade (Stage 2 of the allocation engine).
--
-- Given one cycle's funded buckets (from allocate_cycle) and that cycle's total
-- spending, draw the spending down in reverse priority: fun money first, then
-- savings, then bills, and food & rent protected the very longest. Returns what is
-- left in each bucket, plus amount_overspent: the money spent beyond everything the
-- cycle had (0 when spending stayed within it).
--
-- Fun money is ONE pot: the discretionary safe-to-spend plus the guaranteed fun
-- floor, drained together, and returned as a single safe_to_spend_left (there is no
-- separate fun_floor_left). The floor is fun money, not a separate bucket, so showing
-- it apart read as a contradiction (safe_to_spend 0 next to fun_floor_left 50). The
-- call signature still takes fun_floor_cents, so callers are unchanged.
--
-- All spending draws the single pot down in this order; we do not guess which
-- category a purchase belongs to (ADR 0010). Pure function: reads no tables,
-- depends only on its inputs, so it is easy to test with plain numbers. Money is
-- whole cents.

-- Dropped first because the returned columns changed (no fun_floor_left).
drop function if exists public.apply_spending(bigint, bigint, bigint, bigint, bigint, bigint);

create or replace function public.apply_spending(
  essentials_cents bigint,
  bills_cents bigint,
  fun_floor_cents bigint,
  savings_cents bigint,
  safe_to_spend_cents bigint,
  spend_cents bigint
)
returns table (
  essentials_left bigint,
  bills_left bigint,
  savings_left bigint,
  safe_to_spend_left bigint,
  amount_overspent bigint
)
language sql
immutable
as $$
  with
  start as (select greatest(0, spend_cents) as d),
  -- fun money is one pot: discretionary safe-to-spend plus the fun floor, drained first
  fun_pot as (
    select greatest(0, safe_to_spend_cents) + greatest(0, fun_floor_cents) as amt
  ),
  take_fun as (select least((select d from start), (select amt from fun_pot)) as t),
  rem_fun as (select (select d from start) - (select t from take_fun) as d),
  -- then savings
  take_sav as (select least((select d from rem_fun), greatest(0, savings_cents)) as t),
  rem_sav as (select (select d from rem_fun) - (select t from take_sav) as d),
  -- then bills
  take_bil as (select least((select d from rem_sav), greatest(0, bills_cents)) as t),
  rem_bil as (select (select d from rem_sav) - (select t from take_bil) as d),
  -- food & rent last of all
  take_ess as (select least((select d from rem_bil), greatest(0, essentials_cents)) as t),
  rem_ess as (select (select d from rem_bil) - (select t from take_ess) as d)
  select
    greatest(0, essentials_cents) - (select t from take_ess),
    greatest(0, bills_cents) - (select t from take_bil),
    greatest(0, savings_cents) - (select t from take_sav),
    (select amt from fun_pot) - (select t from take_fun),
    (select d from rem_ess);
$$;

grant execute on function public.apply_spending(bigint, bigint, bigint, bigint, bigint, bigint) to authenticated;

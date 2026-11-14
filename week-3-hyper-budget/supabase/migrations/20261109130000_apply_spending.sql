-- The overspend cascade (Stage 2 of the allocation engine).
--
-- Given one cycle's funded buckets (from allocate_cycle) and that cycle's total
-- spending, draw the spending down in reverse priority: fun money first, then
-- savings, then bills, and food & rent protected the very longest. Returns what is
-- left in each bucket, plus amount_overspent: the money spent beyond everything the
-- cycle had (0 when spending stayed within it).
--
-- The fun floor stays a separate INPUT (it is 0 when the user sets no floor), but it
-- is NOT reported separately. Fun money is one thing to the user: the guaranteed
-- floor plus the discretionary remainder. So the floor and safe-to-spend are drained
-- together as one pot and returned as a single safe_to_spend_left, i.e.
-- safe_to_spend_left = (fun_floor left) + (discretionary left). This avoids the
-- confusing QA reading where safe_to_spend_left was 0 next to a separate
-- fun_floor_left of 5000 (ADR 0010).
--
-- All spending draws the single fun pot down first; we do not guess which category a
-- purchase belongs to (ADR 0010). Pure function: reads no tables, depends only on its
-- inputs, so it is easy to test with plain numbers. Money is whole cents.

-- Dropped first so the change to the RETURN columns applies cleanly on a re-run.
-- (The input signature is unchanged: still six bigints.)
drop function if exists public.apply_spending(bigint, bigint, bigint, bigint, bigint, bigint);
drop function if exists public.apply_spending(bigint, bigint, bigint, bigint, bigint);

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
  safe_to_spend_left bigint,  -- the fun floor left + the discretionary left, as one number
  amount_overspent bigint
)
language sql
immutable
as $$
  with
  start as (select greatest(0, spend_cents) as d),
  -- fun money = the guaranteed floor plus the discretionary remainder, one pot,
  -- drained first.
  fun as (select greatest(0, fun_floor_cents) + greatest(0, safe_to_spend_cents) as pot),
  take_fun as (select least((select d from start), (select pot from fun)) as t),
  rem_fun as (select (select d from start) - (select t from take_fun) as d),
  -- then savings
  take_sav as (select least((select d from rem_fun), greatest(0, savings_cents)) as t),
  rem_sav as (select (select d from rem_fun) - (select t from take_sav) as d),
  -- then bills
  take_bil as (select least((select d from rem_sav), greatest(0, bills_cents)) as t),
  rem_bil as (select (select d from rem_sav) - (select t from take_bil) as d),
  -- food & rent protected the very longest
  take_ess as (select least((select d from rem_bil), greatest(0, essentials_cents)) as t),
  rem_ess as (select (select d from rem_bil) - (select t from take_ess) as d)
  select
    greatest(0, essentials_cents) - (select t from take_ess),
    greatest(0, bills_cents) - (select t from take_bil),
    greatest(0, savings_cents) - (select t from take_sav),
    (select pot from fun) - (select t from take_fun),  -- combined fun money left
    (select d from rem_ess);
$$;

grant execute on function public.apply_spending(bigint, bigint, bigint, bigint, bigint, bigint) to authenticated;

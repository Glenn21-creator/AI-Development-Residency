-- Safe-to-spend, computed on read (ADR 0005), in SQL (ADR 0004).
--
-- safe_to_spend = spendable balance - protected buckets, never below zero.
--   spendable balance = the total of the person's transaction (non-savings)
--     account balances.
--   protected buckets = the total they chose to set aside (food and rent, bills,
--     savings).
--
-- Money is in whole cents. The function runs as the calling user (security
-- invoker), so auth.uid() and Row-Level Security both apply: it only ever sees
-- that person's own rows.

create or replace function public.get_safe_to_spend()
returns bigint
language sql
stable
security invoker
set search_path = public
as $$
  select greatest(
    0,
    coalesce((
      select sum(balance_cents)
      from public.accounts
      where user_id = auth.uid()
        and upper(coalesce(type, '')) <> 'SAVINGS'
    ), 0)
    -
    coalesce((
      select sum(target_cents)
      from public.buckets
      where user_id = auth.uid()
    ), 0)
  );
$$;

grant execute on function public.get_safe_to_spend() to authenticated;

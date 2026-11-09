-- current_cycle_summary (Stage 4): just the current cycle's row from cycle_summary.
--
-- Home needs the real safe-to-spend and overspend for the cycle happening now. This
-- picks that one row, with the current-cycle date worked out in SQL so it matches
-- how cycle_summary groups (no timezone mismatch with the app). Returns 0 rows when
-- nothing has happened this cycle yet. Computed on read, calling user only.

create or replace function public.current_cycle_summary()
returns table (
  cycle_start date,
  income_cents bigint,
  spend_cents bigint,
  essentials_left bigint,
  bills_left bigint,
  fun_floor_left bigint,
  savings_left bigint,
  safe_to_spend bigint,
  amount_overspent bigint
)
language sql
stable
security invoker
set search_path = public
as $$
  select *
  from public.cycle_summary() cs
  where cs.cycle_start = (
    select (case when coalesce(
                   (select pay_frequency from public.profiles where id = auth.uid()),
                   'monthly'
                 ) = 'weekly'
                 then date_trunc('week', now())
                 else date_trunc('month', now()) end)::date
  );
$$;

grant execute on function public.current_cycle_summary() to authenticated;

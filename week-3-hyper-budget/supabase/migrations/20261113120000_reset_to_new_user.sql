-- reset_to_new_user (testing): put the signed-in person back to a brand-new state so
-- the onboarding flow can be tested end to end. Deletes their buckets, bank
-- connection, accounts, transactions, and savings cushion. Keeps their login and
-- profile row, so they stay signed in.
--
-- After this runs the person has no buckets, so Home sends them to the first-run
-- welcome (/onboarding), then bucket setup, then the empty Home with the Connect
-- card: exactly the new-user path.
--
-- Scoped strictly to auth.uid(), so a person can only ever reset their own account.
-- security definer because savings_locks is append-only (no delete grant); the
-- strict auth.uid() scope keeps that safe. search_path is pinned.
--
-- This differs from clear_my_data, which keeps the bank connected and the buckets
-- set (a clean cycle, not a clean account).

create or replace function public.reset_to_new_user()
returns void
language plpgsql
security definer
set search_path = public
as $$
declare
  uid uuid := auth.uid();
begin
  if uid is null then
    raise exception 'Not signed in';
  end if;

  -- Children before parents to respect foreign keys.
  delete from public.transactions where user_id = uid;
  delete from public.savings_locks where user_id = uid;
  delete from public.accounts where user_id = uid;
  delete from public.bank_connections where user_id = uid;
  delete from public.buckets where user_id = uid;
end;
$$;

grant execute on function public.reset_to_new_user() to authenticated;

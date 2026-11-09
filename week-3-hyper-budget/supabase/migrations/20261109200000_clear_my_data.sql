-- clear_my_data (testing): wipe the signed-in person's synced and logged data so
-- they can re-test the engine from a clean slate. Removes their transactions,
-- accounts, bank connection, and the append-only savings cushion ledger. Keeps
-- their own settings (profile, buckets, savings goal), so they do not have to set
-- those up again after clearing.
--
-- It is "security definer" because savings_locks is append-only (ADR 0006, 0011):
-- it grants no delete to normal users, so an ordinary delete cannot touch it. The
-- function runs with the owner's rights to get past that, but it is scoped strictly
-- to auth.uid(), so a person can only ever clear their OWN data, never anyone
-- else's. "set search_path = public" pins the schema so the definer rights cannot
-- be abused by shadowing a table name.
--
-- Transactions are deleted explicitly (not just via the bank_connection cascade),
-- because manually logged spends and income are not tied to a bank connection and
-- would otherwise survive.

create or replace function public.clear_my_data()
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

  delete from public.transactions where user_id = uid;
  delete from public.accounts where user_id = uid;
  delete from public.bank_connections where user_id = uid;
  delete from public.savings_locks where user_id = uid;
end;
$$;

grant execute on function public.clear_my_data() to authenticated;

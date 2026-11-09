-- clear_my_data (testing), revised: clean ALL transaction history (synced from the
-- sandbox AND logged by hand) and reset the savings cushion, but KEEP the bank
-- connection and accounts.
--
-- Why: the TrueLayer sandbox re-imports the same fixed mock transactions every time
-- a bank is connected. The first version deleted the accounts and connection, which
-- forced a reconnect, and the reconnect brought all the sandbox data back, so a clean
-- slate was impossible. Keeping the connection (and not reconnecting) means nothing
-- re-imports: the history stays empty, the person stays on Home, and manually logged
-- income and spends land on a genuinely clean cycle.
--
-- Scoped strictly to auth.uid(), so a person can only clear their own history. It
-- stays security definer because savings_locks is append-only (no delete grant). To
-- fully unlink a bank instead, use the Disconnect bank action.

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

  -- Remove ALL transactions: sandbox-synced and hand-logged alike.
  delete from public.transactions where user_id = uid;

  -- Reset the savings cushion ledger.
  delete from public.savings_locks where user_id = uid;

  -- Accounts and bank_connections are intentionally KEPT, so the bank stays
  -- connected and the sandbox does not re-import.
end;
$$;

grant execute on function public.clear_my_data() to authenticated;

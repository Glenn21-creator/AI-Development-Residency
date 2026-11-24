-- delete_my_account: the real "delete my account" (GDPR right to erasure). Removes
-- the signed-in person's auth user, which cascades to all of their data, because
-- every app table references auth.users(id) ON DELETE CASCADE (profiles, consents,
-- bank_connections, accounts, transactions, buckets, allocation_events, bills,
-- savings_goals, push_subscriptions, notifications_sent, savings_locks). So one
-- delete removes the login (email, password) and everything tied to it.
--
-- Different from reset_to_new_user, which keeps the login and only clears data.
--
-- security definer because deleting from auth.users needs owner rights; scoped
-- strictly to auth.uid(), so a person can only ever delete their own account.

create or replace function public.delete_my_account()
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

  delete from auth.users where id = uid;
end;
$$;

grant execute on function public.delete_my_account() to authenticated;

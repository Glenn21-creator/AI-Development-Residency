-- delete_my_account (FR-14): the GDPR "delete my account and all my data" action.
--
-- Deletes the signed-in person's auth user. Every table in the app references
-- auth.users(id) with ON DELETE CASCADE, so removing the auth user cascades to all of
-- their data: profile, buckets, bank connection, accounts, transactions, savings
-- locks, savings goals, consents, and the rest. After this the account no longer
-- exists and the person is fully removed.
--
-- security definer so it can delete from the auth schema; scoped strictly to
-- auth.uid(), so a person can only ever delete their OWN account, never anyone
-- else's. search_path is pinned for safety.

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

  -- One delete; the ON DELETE CASCADE foreign keys remove all of this user's data.
  delete from auth.users where id = uid;
end;
$$;

grant execute on function public.delete_my_account() to authenticated;

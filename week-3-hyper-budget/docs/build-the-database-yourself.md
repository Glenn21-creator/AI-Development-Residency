# Build the database yourself: Supabase, auth, and Row-Level Security

A do-it-yourself walkthrough of everything that went into Hyper Budget's database,
so you can do it on your own next time. It explains the method and the reasoning,
then gives you a small project to build from scratch and a way to prove your
security actually works.

Pair this with `sql-practice-guide.md` (that one drills the SQL commands; this one
is about setting up a real, secure, multi-user database).

---

## 1. The big picture: what Supabase actually is

Supabase is four things bundled together:

1. **A PostgreSQL database** - your tables live here. This is plain Postgres; all
   the SQL you practised works.
2. **Auth** - sign-up, login, and sessions, managed for you. It keeps a built-in
   table called `auth.users` that you do not create or edit directly.
3. **An auto API** - Supabase exposes your tables over HTTPS automatically (a tool
   called PostgREST), so the app can read and write without you writing a backend.
4. **Row-Level Security (RLS)** - the rules that decide *which rows* each person
   can touch. This is what makes the auto API safe to expose.

The mental model: **the database is the backend.** Instead of writing server code
to guard each request, you write security *rules in the database itself* (RLS), and
every path in or out obeys them.

---

## 2. How auth connects to your tables

- When someone signs up, Supabase Auth creates a row in `auth.users` with a unique
  `id` (a UUID). You never write to `auth.users` yourself.
- **`auth.uid()`** is a function that returns the id of the **currently signed-in
  user**, read from their login token. Inside a query run for that user, it is
  their id; for a logged-out visitor it is null.
- Your own tables link to a person by storing that id, usually as a column named
  `user_id` (or, for a one-row-per-person table, as the primary key `id`):

```sql
user_id uuid not null references auth.users (id) on delete cascade
```

That `references ... on delete cascade` means: this row belongs to a real user,
and if that user is deleted, their rows go too.

**The core pattern of the whole app:** every table has a `user_id`, and every
security rule is "you may touch a row only when its `user_id` equals
`auth.uid()`." That one idea, repeated, is what keeps each person's money data
private.

---

## 3. Create a project (one-time, in the dashboard)

1. Sign in at supabase.com and **New project**. Pick a name, a strong database
   password (save it in your password manager), and a region near your users.
2. Wait for it to provision. You now have an empty Postgres database plus Auth.
3. In **Project Settings -> API** you will find two things the app needs:
   - **Project URL** (e.g. `https://abcd.supabase.co`).
   - **anon public key** - a key the app ships with. It is safe to expose *because
     RLS protects the data*; without RLS it would be dangerous.
   - There is also a **service_role key**. It **bypasses RLS**. Treat it like a
     master password: never put it in the app, in git, or in the browser. We do not
     use it at all in this project.
4. Under **Authentication -> Providers**, enable the sign-in methods you want
   (email, Google, etc.). This is where you set redirect URLs later for the live
   site.

---

## 4. How migrations work (and why)

A **migration** is just a `.sql` file that makes a change to the database. Two
rules make them trustworthy:

1. **Each file runs once, in order.** The files are named with a timestamp
   (`20261107120000_init_schema.sql`), so sorting by name is the order they run.
2. **Never edit a migration after it has run.** To change something, write a *new*
   migration. This way the full history is a replayable record, and everyone's
   database ends up identical.

You have been applying them by pasting the SQL into the Supabase **SQL Editor** and
running it. That is perfectly valid. (The Supabase CLI can also push the
`supabase/migrations` folder automatically, but the SQL Editor is fine for
learning and for a solo project.) The folder is the source of truth; running the
file is what applies it.

Look at `supabase/migrations/20261107120000_init_schema.sql` in this repo: that one
file creates every table, turns on RLS, and adds every policy. It is the complete
worked example for everything below.

---

## 5. Create a table (the shape)

Decide the columns, the types, and the rules. For money, always `bigint` whole
cents. Give every row an id, a `user_id` link, and timestamps.

```sql
create table public.notes (
  id         uuid primary key default gen_random_uuid(),
  user_id    uuid not null references auth.users (id) on delete cascade,
  title      text not null,
  body       text,
  created_at timestamptz not null default now()
);

-- A lookup shortcut, because we will always filter by user_id.
create index notes_user_id_idx on public.notes (user_id);
```

(`gen_random_uuid()` needs the pgcrypto add-on: `create extension if not exists
pgcrypto;` once per database. Supabase usually has it on already.)

---

## 6. Turn on Row-Level Security and write policies

This is the part that makes it safe. Three things to understand:

- **RLS is off by default** on a new table. With it off, anyone holding the anon
  key could read every row. So you must turn it on.
- **With RLS on but no policies, nobody can read anything** (deny by default).
  Policies are how you *grant back* carefully scoped access.
- A policy says: *for this action, a row is allowed only when this condition is
  true.* `using (...)` controls which existing rows you may **read or delete**;
  `with check (...)` controls what you may **insert or update**.

```sql
-- 1. Turn RLS on.
alter table public.notes enable row level security;

-- 2. Owner-only policies: you only ever touch rows that are yours.
create policy notes_select_own on public.notes
  for select using (user_id = auth.uid());

create policy notes_insert_own on public.notes
  for insert with check (user_id = auth.uid());

create policy notes_update_own on public.notes
  for update using (user_id = auth.uid()) with check (user_id = auth.uid());

create policy notes_delete_own on public.notes
  for delete using (user_id = auth.uid());

-- 3. Let the logged-in role use those actions at all (policies then narrow it).
grant select, insert, update, delete on public.notes to authenticated;
```

Two roles matter: **`anon`** (not logged in) and **`authenticated`** (logged in).
We grant to `authenticated`, and the policies limit each person to their own rows.

**Append-only tables** (a history you never change, like transactions) are the same
but you only grant and police `select` and `insert` - no update, no delete:

```sql
grant select, insert on public.transactions to authenticated;
-- and only create select + insert policies
```

---

## 7. Keeping `updated_at` fresh (a trigger)

A **trigger** runs a function automatically on a change. We use one so we never
forget to bump `updated_at`:

```sql
create or replace function public.set_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger notes_set_updated_at before update on public.notes
  for each row execute function public.set_updated_at();
```

(Add an `updated_at timestamptz not null default now()` column first if you want
this.)

---

## 8. Functions that respect (or carefully bypass) RLS

When you put logic in a database function, you choose whose rights it runs with:

- **`security invoker`** (prefer this) - runs as the caller, so RLS still applies.
  All our read functions use it, so a function can never show one person another
  person's rows.
- **`security definer`** (rare, careful) - runs as the function's owner, which can
  bypass RLS. Use only when you must do something the caller cannot, and then scope
  it strictly to `auth.uid()` so it can only act on their own data. We used it once,
  for Clear my data, to delete from an append-only table.
- Always add **`set search_path = public`** to a definer function so it cannot be
  tricked by a look-alike table.

```sql
create or replace function public.my_note_count()
returns bigint
language sql stable security invoker
set search_path = public
as $$ select count(*) from public.notes where user_id = auth.uid(); $$;

grant execute on function public.my_note_count() to authenticated;
```

---

## 9. How the app connects (briefly)

The app needs just two values, kept in `.env.local` (git-ignored), never in code:

- `NEXT_PUBLIC_SUPABASE_URL` - the Project URL.
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` - the anon public key.

The `NEXT_PUBLIC_` prefix means the value is allowed in the browser. That is fine
for these two *because RLS is doing the protecting*. The app uses the
`@supabase/ssr` helpers to attach the signed-in user's token to each request, which
is what makes `auth.uid()` work. The service_role key is never used here.

---

## 10. Build-it-yourself exercise

Create a brand-new Supabase project (or a fresh one) and build a tiny two-table
app **entirely yourself**, from memory where you can:

1. `profiles` - one row per person: `id` (primary key, references `auth.users`),
   `display_name text`, `created_at`. Owner-only policies for all four actions.
2. `notes` - many per person: as in section 5. Owner-only policies.

Then, for each table, in order:

- create the table with a `user_id` link (or `id` link for `profiles`),
- `enable row level security`,
- write the four policies (`select` / `insert` / `update` / `delete`),
- `grant` the matching actions to `authenticated`,
- add an index on `user_id`.

Stretch goals:

- Make `notes` append-only (select + insert only) and see how that changes the
  grants and policies.
- Add the `set_updated_at` trigger to `profiles`.
- Write a `security invoker` function `my_latest_note()` that returns your most
  recent note, and `grant execute` it to `authenticated`.

---

## 11. Prove your security works (do not skip this)

Writing RLS is not enough; you must verify it. Two honest ways:

**The caveat you already met:** in the **SQL Editor**, `auth.uid()` is null, because
the editor runs as an admin that **bypasses RLS**. So a `select * from notes` there
shows everything and tells you nothing about your policies. Do not test RLS in the
SQL Editor.

**Real test A (recommended): two accounts in the app.**
1. Sign up as user A, create a couple of notes.
2. Sign out, sign up as user B, create different notes.
3. Confirm B sees only B's notes, and A sees only A's. If either sees the other's,
   a policy is wrong or RLS is off.

**Real test B: the API with each user's token.** Using the anon key plus a signed-in
user's token (for example from the app's network tab, or a Supabase client script),
query the table; you should get back only that user's rows. Swapping the token to
the other user returns only theirs.

A quick structural check you *can* run in the SQL Editor (it inspects setup, not
behaviour):

```sql
-- Is RLS enabled on your tables?
select relname, relrowsecurity
from pg_class
where relname in ('notes', 'profiles');

-- What policies exist, and on what?
select tablename, policyname, cmd, qual, with_check
from pg_policies
where schemaname = 'public'
order by tablename, policyname;
```

If `relrowsecurity` is false, RLS is off - fix it. If a table has RLS on but no
rows in `pg_policies`, nobody can read it.

---

## 12. The checklist for every new table

1. Columns and types decided (money in `bigint` cents).
2. `user_id uuid not null references auth.users (id) on delete cascade`
   (or `id` as the link for a one-row-per-person table).
3. Index on `user_id`.
4. `alter table ... enable row level security;`
5. Policies for each action you allow (`using` for read/delete, `with check` for
   insert/update), all scoped to `user_id = auth.uid()`.
6. `grant` the matching actions to `authenticated` (append-only = select + insert
   only).
7. Trigger for `updated_at` if the table has one.
8. Test with two real accounts.

Follow those eight steps and you have reproduced, correctly and safely, everything
that went into this database. When you have built your two tables, paste your SQL
and I will review it the way you reviewed mine.

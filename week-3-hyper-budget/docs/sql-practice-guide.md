# Hyper Budget: SQL practice guide

A plain-English review of every SQL command and concept used to build Hyper
Budget, plus a self-contained practice database and five case studies to work
through in PostgreSQL. No solutions are included on purpose: the point is to
write them yourself.

The SQL you already knew (from data exploration and analysis) was mostly
`select`, `where`, `group by`, `order by`, and joins. This project adds the
"building" side of SQL: creating tables, writing functions, controlling access,
and doing careful money math. Those are the new parts, explained below.

---

## Part A. The concepts, in plain English

Each item: what it is, and a tiny example. Terms are paired with a plain-English
translation the first time they appear.

### A1. Setting up tables

- **`create extension if not exists pgcrypto;`** - switches on an add-on (extra
  built-in toolkit). `pgcrypto` gives us `gen_random_uuid()` for random IDs.
- **`create table ... ( ... );`** - makes a new table (a spreadsheet-like grid
  of rows and columns).
- **Column types** (what kind of value a column holds):
  - `uuid` - a long random ID like `6f1c...`.
  - `bigint` - a whole number. We store money as **whole cents** in `bigint`, so
    there is never a rounding error (never use decimals for money).
  - `text` - any text.
  - `boolean` - true/false.
  - `date` - a calendar day. `timestamptz` - a date and time with timezone.
  - `time` - a time of day. `jsonb` - a block of JSON (structured data).
- **`default <value>`** - the value used when you do not supply one. Example:
  `currency text not null default 'EUR'`.

```sql
create table example (
  id uuid primary key default gen_random_uuid(),
  amount_cents bigint not null,
  created_at timestamptz not null default now()
);
```

### A2. Keys and constraints (rules the data must obey)

- **`primary key`** - the column that uniquely identifies each row. No two rows
  share it, and it is never empty.
- **`not null`** - this column must always have a value.
- **`references other_table (col)`** - a **foreign key** (a pointer to a row in
  another table). It stops you linking to something that does not exist.
- **`on delete cascade`** - if the pointed-to row is deleted, delete this row
  too. (In our app, deleting a bank connection cascades to its accounts and their
  transactions.)
- **`on delete set null`** - instead of deleting, just blank the pointer.
- **`unique (a, b)`** - no two rows may share the same combination of these
  columns. We use `unique (user_id, cycle_start)` so a cycle is locked only once.
- **`check ( ... )`** - a condition every row must satisfy. Example:
  `check (bucket in ('essentials','bills','savings','fun'))` blocks typos.

### A3. Indexes (speed-up lookups)

- **`create index ... on table (col);`** - a lookup shortcut so queries on that
  column are fast (like a book index).
- **Partial / unique index** - an index with a condition. We dedupe bank
  transactions with:

```sql
create unique index transactions_dedupe_idx
  on transactions (account_id, provider_txn_id)
  where provider_txn_id is not null;
```

That means: the same provider transaction id can appear only once per account,
but rows without one are not constrained.

### A4. Putting data in and taking it out

- **`insert into t (cols) values (...), (...);`** - add one or many rows.
- **`insert into t (...) select ...;`** - add rows built from a query.
- **`on conflict (cols) do nothing`** - if a row with those key columns already
  exists, skip it quietly (used to make locking idempotent, i.e. safe to run
  again without duplicating).
- **`delete from t where ...;`** - remove rows that match. (Our Clear my data
  does `delete from transactions where user_id = ...`.)

### A5. Reading data (the familiar part)

- **`select cols from t where ... order by ... limit n;`** - the everyday query.
- **`order by col desc`** - sort, newest/biggest first. **`limit`** - cap rows.

### A6. Grouping and aggregates (summarising)

- **`group by col`** - collapse rows that share a value into one, so you can
  summarise each group.
- **Aggregates**: `sum()`, `count()`, `max()`, `min()`, `avg()`.
- **`coalesce(x, 0)`** - "use x, but if it is null use 0". Guards against empty
  sums showing as null.
- **Filtered aggregate: `sum(x) filter (where cond)`** - sum only the rows that
  match, inside one query. We use it constantly to split money in vs money out:

```sql
select
  sum(amount_cents) filter (where amount_cents > 0) as money_in,
  sum(-amount_cents) filter (where amount_cents < 0) as money_out
from transactions;
```

### A7. Casting and safe math helpers

- **`value::type`** - convert a value to a type. `sum(...)::bigint` turns a
  numeric sum back into a whole number; `now()::date` drops the time part.
  (A real bug we hit: `sum()` returns `numeric`, so a function expecting `bigint`
  did not match until we added `::bigint`.)
- **`least(a, b)`** - the smaller of the two. **`greatest(a, b)`** - the larger.
  These are the heart of the funding waterfall: "fund a bucket by the smaller of
  what it wants and what money is left", and "never go below zero" with
  `greatest(0, x)`.

### A8. Dates

- **`now()`** - current date and time.
- **`date_trunc('month', ts)`** - round a timestamp down to the start of its
  month (`'week'` for the start of its week). This is how we group transactions
  into pay cycles. Cast with `::date` to drop the time.

### A9. Joins

- **`left join b on b.key = a.key`** - attach matching rows from `b`; where there
  is no match, the `b` columns come back null (so you keep every `a` row). We
  left-join transactions to the label map so unlabelled spends are kept and
  treated as fun.
- **`cross join`** - pair every row on the left with the single row on the right
  (used to attach one-row settings, like bucket targets, to each cycle).
- **`cross join lateral fn(...)`** - call a function for each left row, using that
  row's values as arguments, and spread its returned columns out. This is how one
  query runs `allocate_cycle(...)` per cycle.

### A10. CTEs (named steps)

- **`with step1 as ( ... ), step2 as ( ... ) select ...`** - a **CTE** (Common
  Table Expression) is a named temporary result you build on. It turns one giant
  query into readable steps. Our waterfall is a chain of CTEs, each taking what
  the previous one left:

```sql
with
start     as (select greatest(0, 300000) as remaining),
ess       as (select least((select remaining from start), 90000) as funded),
after_ess as (select (select remaining from start) - (select funded from ess) as remaining)
select * from after_ess;  -- 210000 left after funding essentials
```

### A11. `case when` (if/else inside SQL)

- **`case when cond then x else y end`** - choose a value by a condition.
  We pick the cycle length with it:

```sql
case when freq = 'weekly' then date_trunc('week', now())
     else date_trunc('month', now()) end
```

### A12. Functions (reusable saved logic)

- **`create or replace function name(args) returns ... as $$ ... $$;`** - save a
  named routine in the database. `create or replace` makes it, or overwrites the
  existing one with the same name and arguments.
- **`$$ ... $$`** - **dollar quoting**: a way to wrap the function body so you do
  not have to escape every quote inside it.
- **Return shapes**: `returns bigint` (one value), `returns void` (nothing),
  `returns table ( col type, ... )` (a small result grid).
- **`language sql`** vs **`language plpgsql`** - a plain-SQL function is a single
  query; a plpgsql function is a mini-program with variables, `if`, and loops.
- **Volatility promises** (how the result behaves): `immutable` (same inputs
  always give the same output, reads nothing else - our pure math functions),
  `stable` (does not change within one query, may read tables), `volatile` (can
  change anything; the default).
- **`security invoker`** vs **`security definer`** - who the function runs as.
  *Invoker* = the person calling it (so row-level security still applies to them).
  *Definer* = the function's owner (used to do something the caller normally
  cannot, like delete from an append-only table). A definer function must be
  tightly scoped so it cannot be abused.
- **`set search_path = public`** - pin which schema (table namespace) names
  resolve to, so a definer function cannot be tricked by a look-alike table.

```sql
create or replace function add_cents(a bigint, b bigint)
returns bigint
language sql
immutable
as $$ select a + b; $$;
```

### A13. plpgsql specifics (the mini-program language)

- **`declare ... begin ... end;`** - declare variables, then the body.
- **`var := value;`** - assign to a variable. **`select col into var from ...;`**
  - run a query and store one value in a variable.
- **`if cond then ... end if;`** - branch.
- **`raise exception 'message';`** - stop with an error (we use it to refuse when
  nobody is signed in).
- **`get diagnostics n = row_count;`** - how many rows the last statement
  affected. **`return x;`** - hand back the result.

### A14. Triggers (run code automatically on a change)

- A **trigger** fires a function automatically when a row is inserted/updated.
  We keep `updated_at` fresh with one:

```sql
create or replace function set_updated_at()
returns trigger language plpgsql as $$
begin new.updated_at = now(); return new; end; $$;

create trigger t_set_updated_at before update on some_table
  for each row execute function set_updated_at();
```

### A15. Row-Level Security (each person sees only their rows)

*(This is Supabase/Postgres access control. You will not use it in the local
practice DB below, but it is core to the app, so know what it does.)*

- **`alter table t enable row level security;`** - turn on per-row access rules.
- **`create policy p on t for select using ( user_id = auth.uid() );`** - a rule
  that limits which rows an action can touch. `using` filters what you can read or
  delete; `with check` limits what you can insert or update. `auth.uid()` is the
  signed-in user's id.
- **`grant select, insert on t to authenticated;`** - allow the logged-in role to
  use those actions at all (policies then narrow it to their own rows).

### A16. Operational bits

- **`notify pgrst, 'reload schema';`** - tell Supabase's API layer to refresh its
  list of functions (fixes "could not find the function ... in the schema cache").
- **`select proname, pg_get_function_identity_arguments(oid) from pg_proc where
  proname = '...';`** - query the system catalog (Postgres's own records) to list
  functions by name.

---

## Part B. A practice database (run this once)

This is a simplified, self-contained version of Hyper Budget with **no Supabase
pieces** (no auth, no RLS), so it runs in any plain PostgreSQL. `user_id` is just
a number here. Create a database, then paste and run all of this.

```sql
-- Clean start (safe to re-run the whole script)
drop table if exists transactions;
drop table if exists buckets;
drop table if exists label_buckets;
drop table if exists profiles;

-- One row per person, with how often they are paid.
create table profiles (
  user_id      int primary key,
  display_name text not null,
  pay_frequency text not null default 'monthly'
    check (pay_frequency in ('weekly', 'monthly'))
);

-- Each person's bucket targets, in whole cents.
create table buckets (
  user_id      int not null references profiles (user_id),
  type         text not null check (type in ('essentials','bills','fun','savings')),
  target_cents bigint not null,
  primary key (user_id, type)
);

-- The append-only money ledger. Positive = money in, negative = money out.
create table transactions (
  id          bigint generated always as identity primary key,
  user_id     int not null references profiles (user_id),
  amount_cents bigint not null,
  category    text,               -- the bank's label (may be null)
  occurred_at date not null
);

-- The label-to-bucket map (same idea as the app's). Anything not listed = fun.
create table label_buckets (
  label  text primary key,
  bucket text not null check (bucket in ('essentials','bills','savings','fun'))
);

-- ---- Seed data ----

insert into profiles (user_id, display_name, pay_frequency) values
  (1, 'Ama', 'monthly'),
  (2, 'Ben', 'weekly');

-- Ama's targets: food & rent 900, bills 200, fun floor 100, savings 300 (euros).
insert into buckets (user_id, type, target_cents) values
  (1, 'essentials', 90000),
  (1, 'bills',      20000),
  (1, 'fun',        10000),
  (1, 'savings',    30000),
  (2, 'essentials', 40000),
  (2, 'bills',      10000),
  (2, 'fun',         5000),
  (2, 'savings',    10000);

insert into label_buckets (label, bucket) values
  ('rent', 'essentials'),
  ('groceries', 'essentials'),
  ('utilities', 'bills'),
  ('insurance', 'bills'),
  ('subscription', 'bills'),
  ('savings', 'savings');
  -- dining, shopping, cash, etc. are intentionally absent => fun.

-- Ama, November 2026: one salary and a handful of spends.
insert into transactions (user_id, amount_cents, category, occurred_at) values
  (1,  300000, 'credit',    date '2026-11-01'),  -- +3000 salary
  (1,  -80000, 'rent',      date '2026-11-03'),  -- -800
  (1,  -15000, 'utilities', date '2026-11-05'),  -- -150
  (1,   -5000, 'groceries', date '2026-11-06'),  -- -50
  (1,  -12000, 'dining',    date '2026-11-08'),  -- -120 (no label => fun)
  (1,   -3000,  null,       date '2026-11-09');  -- -30  (null => fun)

-- Ama also got paid in October, to give you a second cycle.
insert into transactions (user_id, amount_cents, category, occurred_at) values
  (1,  280000, 'credit',    date '2026-10-01'),
  (1,  -80000, 'rent',      date '2026-10-03'),
  (1,  -20000, 'utilities', date '2026-10-04'),
  (1,  -40000, 'shopping',  date '2026-10-20');  -- no label => fun

-- Ben, two weekly cycles.
insert into transactions (user_id, amount_cents, category, occurred_at) values
  (2,  120000, 'credit',    date '2026-11-02'),
  (2,  -45000, 'rent',      date '2026-11-03'),
  (2,   -8000, 'dining',    date '2026-11-04'),
  (2,  110000, 'credit',    date '2026-11-09'),
  (2,  -10000, 'utilities', date '2026-11-10');
```

Quick check it loaded: `select * from transactions order by user_id, occurred_at;`

---

## Part C. Five case studies (simple to hard)

Work them in order. Each gives the goal and a hint or two, but not the query.
Check your own results against the seed data by hand (the numbers are small on
purpose). All amounts are whole cents.

### Case study 1 (easy): money in and money out per person

List each `user_id` with two totals: `money_in` (sum of positive amounts) and
`money_out` (sum of the negatives, shown as a positive number).

- Concepts: `group by`, filtered aggregate `sum(...) filter (where ...)`,
  `coalesce`.
- Hint: for money out, summing `-amount_cents` turns the negatives positive.
- Sanity check: Ama's money in is 300000 + 280000.

### Case study 2 (easy-medium): income per cycle

For each person and each **cycle**, show the total income (money in only). Use the
person's `pay_frequency`: monthly people grouped by month, weekly people by week.

- Concepts: `date_trunc`, `case when`, join `transactions` to `profiles`,
  `group by`, `filter`.
- Hint: group by `case when pay_frequency = 'weekly' then date_trunc('week',
  occurred_at) else date_trunc('month', occurred_at) end`.
- Stretch: also show money out per cycle beside it.

### Case study 3 (medium): spending by bucket, using the label map

For Ama, total her **spending** (money out) grouped by bucket, where the bucket
comes from `label_buckets`. Any category not in the map (or null) must count as
`fun`.

- Concepts: `left join`, `coalesce(lb.bucket, 'fun')`, `lower(trim(...))` to match
  labels safely, `group by`, `where amount_cents < 0`.
- Hint: join on `label_buckets.label = lower(trim(transactions.category))`.
- Sanity check (November): essentials = rent 80000 + groceries 5000; bills =
  utilities 15000; fun = dining 12000 + null 3000.

### Case study 4 (medium-hard): write the funding waterfall as a function

Write a function `allocate(income, essentials, bills, fun_floor, savings)` that
splits income in fixed order - food & rent, then bills, then fun floor, then
savings ("save what fits") - and returns each funded amount plus `safe_to_spend`
(whatever is left). It must never fund more than is left or go negative.

- Concepts: `create or replace function ... returns table (...)`, `language sql`,
  `immutable`, chained CTEs, `least`, `greatest`.
- Hint: fund each bucket with `least(remaining, greatest(0, target))`, then
  subtract to get the new remaining, step by step.
- Test: `select * from allocate(300000, 90000, 20000, 10000, 30000);` should give
  90000 / 20000 / 10000 / 30000 and safe_to_spend 150000. Then try a lean income
  like `allocate(100000, 90000, 20000, 10000, 30000)` and reason about why savings
  and safe-to-spend shrink.

### Case study 5 (hard): current-month safe-to-spend for one person

Put it together. For Ama (monthly), for November 2026: compute her income for the
month, feed it and her four bucket targets into your `allocate` function from case
4, and return that month's funded buckets and safe-to-spend in one query.

- Concepts: a CTE for the month's income (`date_trunc` + `filter`), a CTE (or
  subquery) that pulls her four targets into one row, and `cross join lateral
  allocate(...)` to run the waterfall per row.
- Hint for the targets row: `max(target_cents) filter (where type = 'essentials')`
  and the same for the others, from `buckets where user_id = 1`.
- Stretch (closest to the real app): also total November's **spending**, then
  subtract it from safe-to-spend (and, when spending is larger, from the fun floor
  next, then savings) to get the real after-spending number. This is exactly what
  `apply_spending` and `cycle_summary` do in the codebase, so compare your version
  with `supabase/migrations/20261109150000_cycle_summary.sql` once you have tried
  it.

---

When you want them checked, write your query and your result, and I will tell you
whether it is right and why, without handing you the answer first.

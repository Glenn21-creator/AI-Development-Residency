# Software patterns in Hyper Budget

A plain-language, detailed guide to the software patterns this app is built on.

First, the big idea, because it clears up a common confusion:

- A **pattern** is a reusable, named, proven shape of a solution. You did not
  invent these; professionals use them everywhere. They are as established as the
  "design patterns" from textbooks, they just belong to a different family.
- A **rule** is your own product decision about how the app should behave (the
  funding order, the fun floor, the overspend cascade). You invented those.

So the honest summary of this app is: **standard patterns, holding your own
rules.** The pattern is the container; your rule is what goes inside it.

Hyper Budget is mostly a database plus functions plus a thin screen layer, not a
big object-oriented program, so the classic object-oriented patterns (Factory,
Observer, Singleton, and so on) do not really apply here. The patterns below come
from the data-and-systems family, which is the right toolbox for this kind of app.

---

## 1. Compute-on-read (derived state)

**Plain English:** do not store the answers; store the facts and work out the
answers each time you need them.

**In this app:** we never save a bucket balance or a safe-to-spend number
anywhere. We store only raw transactions (money in and money out). Functions
compute everything on demand:

- `supabase/migrations/20261109150000_cycle_summary.sql` turns a cycle's
  transactions into the real after-spending figures.
- `supabase/migrations/20261109190000_current_cycle_summary.sql` returns just the
  current cycle's row for Home.
- `supabase/migrations/20261109180000_savings_cushion.sql` computes the cushion.

**Why we chose it:** there is one source of truth (the transactions), so the
displayed numbers can never drift out of sync with reality. If a stored balance
and the transactions ever disagreed, which do you trust? With compute-on-read the
question cannot arise.

**The trade-off:** you recompute every time someone opens the screen, which costs
a little work. At this app's size that cost is tiny, so the safety is well worth
it. (If the data ever grew huge, you might cache or store snapshots, which is
exactly what pattern 2 starts to do for finished cycles.)

**The alternative we rejected:** storing each bucket's balance and adjusting it on
every transaction. Faster to read, but one missed update and the number is wrong
forever, which is unacceptable for a money app.

---

## 2. Append-only ledger (immutable history)

**Plain English:** some tables are write-once. You may add a row and read rows,
but never change or delete one. History becomes a permanent record.

**In this app:** `transactions`, `allocation_events`, `savings_locks`, and
`notifications_sent` are all append-only. In
`supabase/migrations/20261107120000_init_schema.sql` you can see we grant only
`select` and `insert` on them, never `update` or `delete`. The savings cushion
(`supabase/migrations/20261109170000_savings_locks.sql`) locks each finished cycle
as a frozen row that is never edited.

**Why we chose it:** this is how real accounting works. You do not erase a ledger
entry; you add a correcting one. It makes the past trustworthy and auditable, and
it pairs naturally with compute-on-read: the append-only facts are the input, the
computed numbers are the output.

**The trade-off:** to "change" something you add a new row rather than editing in
place, so the tables only grow. For a personal budget that is fine.

**Related idea:** this is the gentle version of "event sourcing," where the list
of things that happened is the real database and current state is always derived
from it.

---

## 3. Pure functions for the money math (functional core)

**Plain English:** the math functions take numbers in and give numbers out, and
touch nothing else. No reading tables, no side effects.

**In this app:**

- `supabase/migrations/20261108130000_allocate_cycle.sql` (the funding waterfall)
- `supabase/migrations/20261109130000_apply_spending.sql` (the overspend cascade)

Both are marked `immutable`, which is a promise that the same inputs always give
the same output and that they read nothing outside their arguments.

**Why we chose it:** pure functions are the easiest code in the world to trust and
to test. You can check them with plain numbers ("income 3000, targets X, Y, Z,
expect this split") and they can never be broken by something elsewhere in the
app. The risky logic (the money math) is kept pure and simple; the messy work
(reading transactions, grouping by cycle) happens around it in other functions.

**The name for this shape:** "functional core, imperative shell." Pure core, with
the input and output handled at the edges.

---

## 4. Policy-based authorization at the data layer (Row-Level Security)

**Plain English:** the rules about who may see what live in the database itself,
in one place, instead of being scattered through the app code.

**In this app:** every table has Row-Level Security turned on, with policies
scoped to `auth.uid()` (the signed-in user), so each person can only ever touch
their own rows. See the policies throughout
`supabase/migrations/20261107120000_init_schema.sql`.

**Why we chose it:** it is defense in depth. Even if the app code had a bug and
asked for the wrong rows, the database would still refuse to hand over another
person's data. For a money app that guarantee belongs as close to the data as
possible, not only in the screens.

**The trade-off:** you must write and test the policies carefully, and remember
that an admin connection (like the SQL Editor) bypasses them, so you test access
with real user accounts, not in the editor.

---

## 5. Database-as-API (thin client)

**Plain English:** the app talks to the database directly through small named
functions, instead of a separate hand-written backend server in the middle.

**In this app:** the Next.js code calls database functions directly, for example
`supabase.rpc("current_cycle_summary")` in `src/app/home/page.tsx`, and reads
tables through the Supabase client. There is no custom API layer we maintain; the
database and its functions are the API, protected by the Row-Level Security from
pattern 4.

**Why we chose it:** far less code to build and keep in sync. The logic lives once,
in the database, and both the security and the computation are right next to the
data they act on.

**The trade-off:** your database and your app are more tightly coupled, and you
lean on the database's features (functions, policies) a lot. For a solo project
this is a big win in speed and simplicity.

---

## 6. Data-driven configuration (lookup table, not hardcoding)

**Plain English:** behaviour that is likely to change is stored as data you can
edit, rather than baked into the code.

**In this app:** `supabase/migrations/20261109140000_label_buckets.sql` is a table
that maps bank labels ("rent", "miete", "utilities", "groceries") to our four
buckets. To support a new bank or a new language, you add rows. You do not touch
any code, and you do not redeploy the app.

**Why we chose it:** banks and languages use many words for the same thing, and the
list will keep growing. Keeping it as data means growth is a quick, safe insert,
and anything not listed safely falls back to "fun."

**The name for this shape:** table-driven logic, or "strategy as data." The
decision is looked up, not written as a long chain of if-statements in code.

---

## 7. Idempotent operations

**Plain English:** doing the same action twice has the same effect as doing it
once. Running it again does not double anything.

**In this app:** `lock_completed_cycles` in
`supabase/migrations/20261109180000_savings_cushion.sql` uses
`insert ... on conflict (user_id, cycle_start) do nothing`. It is safe to call on
every app open: a cycle gets locked once and never twice, and it quietly catches
up any cycles missed while the user was away.

**Why we chose it:** real apps retry, reload, and double-tap. An operation that is
safe to repeat removes a whole category of bugs (double charges, duplicate rows).

**The trade-off:** you have to design the uniqueness up front (here, the unique
pair of user and cycle start). That small bit of planning buys a lot of safety.

---

## 8. Versioned migrations

**Plain English:** every change to the database is a numbered file that runs once
and is kept forever, in order.

**In this app:** the `supabase/migrations` folder. Each file is timestamped, so
sorting by name is the order they run. The rule is: never edit a migration after it
has run; to change something, write a new migration.

**Why we chose it:** it makes the database's history a replayable, shared record.
Anyone can rebuild the exact same database by running the files in order, and you
can always see when and why each change happened.

**The trade-off:** more files over time, and the discipline of never editing old
ones. Both are small prices for a trustworthy, repeatable schema.

---

## 9. Server components and server actions (the app layer)

**Plain English:** the private work (fetching data, checking who is logged in,
running the money logic) happens on the server, and only the interactive parts are
sent to the browser.

**In this app:** the Home page (`src/app/home/page.tsx`) runs on the server, reads
the data, and hands a ready result to the browser part (`HomeView.tsx`). Logging a
spend or income runs as a "server action" (`src/app/home/actions.ts`): the browser
asks, the server does the work against the database, then the screen refreshes.

**Why we chose it:** secrets and data access stay on the server where they are
safe, the browser only gets what it needs to show and interact, and there is no
separate backend to build. This is a pattern of the Next.js framework rather than
something we invented, but it is the shape the whole app is organised around.

---

## How a pattern and a rule combine (one worked example)

Take `cycle_summary`. In one function you can see both families meet:

- The **patterns** (standard): it is compute-on-read (it derives the numbers from
  transactions), it uses the pure functions from pattern 3, and it runs as the
  calling user so Row-Level Security applies.
- The **rules** (yours): the order it funds buckets, "save what fits" for lean
  cycles, and the cascade order when there is an overspend.

The pattern is the shape of the solution. Your rules are the meaning you poured
into it. Swap the rules and the patterns stay the same; that is exactly what makes
them reusable.

---

## One-line recap of each

1. Compute-on-read: store facts, calculate answers on demand.
2. Append-only ledger: write-once history, never edited.
3. Pure functions: money math with no side effects, easy to trust.
4. Row-Level Security: access rules in the database, per user.
5. Database-as-API: the app talks to the database directly, no middle server.
6. Data-driven config: changeable behaviour lives in a table, not in code.
7. Idempotent operations: safe to run twice.
8. Versioned migrations: numbered, run-once, kept forever.
9. Server components and actions: private work on the server, interaction in the
   browser.

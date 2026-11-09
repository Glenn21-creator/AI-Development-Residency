# What every file is, in plain words

You are new to development, so this guide explains the files and folders in this
project without jargon. It is a reference. Skim the part you need.

No file here is something you have to memorise. Most of them, the tools created
for you, and you rarely touch them.

---

## Part 1: The Git words (how code gets to GitHub)

Git is the tool that tracks changes to your files. GitHub is the website that
stores a copy online. A few words you keep hearing:

- **Repository (repo):** the whole project folder that Git is tracking.
- **Commit:** a saved snapshot of your changes, with a short message. Like
  hitting "save" with a note about what changed.
- **Push:** send your commits up to GitHub, so the online copy matches yours.
- **Pull:** the opposite of push. Download the latest commits from GitHub to your
  computer, so your copy matches the online one.
- **Branch:** a separate line of work. "main" is the real, official version.
  Other branches are side workspaces where changes are made before they join main.
- **Merge:** take the changes from one branch and fold them into another (usually
  into main). After a merge, main has those changes.
- **Pull request (PR):** a request to merge one branch into another on GitHub. It
  is the reviewed, recorded way to merge.
- **Worktree:** an extra folder on your computer that is linked to the same repo
  but checked out to a different branch. This matters for you, and Part 7 explains
  it fully.

---

## Part 2: Secrets and settings files

- **.gitignore:** a list of files Git should ignore and never upload to GitHub.
  It keeps junk and secrets out of the online copy. For example it ignores
  `node_modules` (huge, rebuildable) and `.env` files (secrets).
- **.env.local:** where your real secret values live on your computer (your
  Supabase keys, for example). It is git-ignored, so it never goes to GitHub.
  This file is private to your machine.
- **.env.example:** a committed template with blank values. It shows which keys
  are needed, without showing any real secret. You copy it to `.env.local` and
  fill in the real values there.
- **In short:** ".env" means "environment variables," which are settings and
  secrets kept outside the code so they never end up on GitHub.

---

## Part 3: The project's config files

These tell the tools how to behave. You rarely edit them by hand.

- **package.json:** the project's ID card. Lists what the app is called and which
  outside code libraries it uses (its "dependencies").
- **package-lock.json:** an exact, detailed record of every library version, so
  the app installs the same way on every computer. Auto-managed. Do not hand-edit.
- **next.config.ts:** settings for Next.js (the web framework).
- **tsconfig.json:** settings for TypeScript (the typed version of JavaScript the
  app is written in).
- **eslint.config.mjs:** settings for ESLint, a tool that checks your code for
  mistakes and style issues.
- **README.md:** the welcome note for anyone opening the project.
- **AGENTS.md:** a note Next.js writes for AI assistants. Next.js manages it.

---

## Part 4: The app's actual code (the part that matters)

Inside `src/`:

- **src/app/:** the pages and layout of the app. Next.js turns folders here into
  web pages.
  - **layout.tsx:** the shared frame wrapped around every page (fonts, the theme,
    the page title).
  - **page.tsx:** an actual page. The one at the top is the welcome screen.
  - **globals.css:** styling that applies to the whole app.
  - **providers.tsx:** wiring that makes the Material UI theme and styles work on
    every page.
  - **favicon.ico:** the little icon shown on the browser tab.
- **src/theme.ts:** the app's look and feel (the calm colours, fonts, rounded
  corners). This is the Hyper Budget theme.
- **public/:** static files served as-is, like images and the small `.svg` logos.

"tsx" means a file that mixes TypeScript with the layout of a screen. "css" is
styling. You will spend most of your building time in `src/`.

---

## Part 5: Files the tools generate (you can ignore these)

These appear on your computer but are not uploaded to GitHub, because they can
always be rebuilt:

- **node_modules/:** the actual downloaded code of every library. Large, and
  rebuilt any time with one install command. Never edited, never uploaded.
- **.next/:** the app after Next.js builds it, ready to run. Rebuilt every time.
- **next-env.d.ts:** a small file Next.js keeps up to date for TypeScript.

If you ever see these missing, that is fine. The tools recreate them.

---

## Part 6: Our planning documents (what we wrote together)

- **ARCHITECTURE.md:** the blueprint of the whole app: the screens, the server
  rules, and the database, and how they fit.
- **docs/adr/:** the Architecture Decision Records. One short file per big
  decision, explaining why we chose it. `README.md` in that folder lists them.
- **supabase/migrations/:** the database history. Each `.sql` file is one change
  to the database (the first one creates all the tables). They run in order, and
  you never edit one that has already run; you add a new one instead.
- **CLAUDE.md** (at the repo root): the house rules for how Claude should build
  this project, including a note to read the ADRs first.

---

## Part 7: What a worktree is, and how it works

This is the one that confused you, and it is worth understanding, because it
explains why new files did not show up in your usual folder.

### The short version

A worktree is an extra folder on your computer that belongs to the same repo but
is checked out to a different branch. One repo, but more than one folder you can
work in at the same time, each on its own branch.

### A picture to hold onto

Think of your repo as a project with one shared filing cabinet of history (that
is the `.git` data). Normally you have one desk in front of that cabinet: your
main project folder, showing the `main` branch.

A worktree gives you a second desk in front of the same cabinet. On that second
desk you lay out a different branch and work on it, without touching or disturbing
what is on your first desk. Both desks pull from and file back into the same
cabinet, so the history is shared, but each desk shows a different version of the
work.

### Why use one

- You can work on a side branch in its own folder while your main folder stays on
  `main`, clean and untouched.
- You can have several branches open as real folders at once, instead of
  constantly switching one folder back and forth between branches.
- If the side work is thrown away, your main folder never saw it.

### How it worked in this project

The tool building your app made a worktree for the work and put it here:

`.claude/worktrees/adhd-budget-app-setup-106074/`

That folder was checked out to the branch `claude/adhd-budget-app-setup-106074`.
Every file we created first appeared in that worktree folder, on that branch, not
in your main project folder (which stays on `main`). That is normal and by design.

### Why the files were not in your main folder

Two separate things were going on:

1. The files lived in the worktree folder, not the main folder you open.
2. Even after the work was merged into `main` on GitHub, your main folder on your
   computer had not downloaded that merge yet. A folder only updates when you
   **pull**.

So to see everything in your normal folder, you pull `main`:

```
cd "D:/Github_Repo/AI-Development-Residency"
git pull
```

After that, your main folder matches GitHub and shows all the merged work. The
worktree folder can be cleaned up later by the tool; you do not need to manage it
yourself.

---

## Part 8: Setting up Supabase and Google sign-in

Before the login screen could work, two outside services had to be set up. Here is
what each one is and what we did, in plain words.

### Supabase (your database and login service)

Supabase is an online service that does two jobs for the app: it stores your data,
and it handles who is logged in. Think of it as the back room where the records are
kept and the door is guarded.

What we set up:

1. Created a free Supabase project (the back room).
2. Ran the migration (the one big SQL file) in Supabase's SQL Editor. That created
   all the tables and switched on the privacy wall, so each person can only ever
   see their own data.
3. Copied two values from Supabase (Settings, then API) into a file on your
   computer called `.env.local`:
   - the Project URL (the back room's address), and
   - the anon key (a public key that is safe to share, because the privacy wall
     guards everything behind it).
   These live in `.env.local` only, never in the code and never on GitHub.
4. The app reads those two values to talk to Supabase.

### Google sign-in (the "Continue with Google" button)

This lets people sign in with their Google account instead of making a new
password. Google checks who they are; we never see their Google password.

Setting it up has two sides that talk to each other.

On the Google side (Google Cloud):

1. Created an "OAuth client," which is basically an ID card for our app so Google
   recognises it.
2. Told Google where to send people back after it checks them. That address is
   Supabase's callback, which looks like
   `https://yourref.supabase.co/auth/v1/callback`.
3. Google gave us two values: a Client ID (public) and a Client Secret (private).

On the Supabase side:

4. Turned on the Google provider and pasted in that Client ID and Client Secret.
   The Secret lives only here, inside Supabase, never in the code, never on GitHub,
   never in chat.
5. Set the Site URL and allowed the `http://localhost:3000` address, so the trip
   back to our app is permitted.

The whole flow in one sentence: you tap "Continue with Google," Google checks you
on its own page, Google hands you back through Supabase to our app, and you are
logged in. The only part we control is the button and what happens after you come
back.

---

## Part 9: The errors we saw, in plain words

While building the login screen, three technical-looking messages popped up. None
meant the app was broken. Here is what each one actually means, without jargon.

### "Hydration mismatch"

First, what hydration is. When you open a page, it is built twice:

1. The server sends a ready-made picture of the page so it shows up instantly.
2. Then the code wakes that picture up in your browser so buttons and typing work.

That second step, waking the page up, is called hydration. Think of a dried
sponge: the server sends the flat dry sponge (fast), and the browser pours water
on it to make it springy and usable.

A "hydration mismatch" means the dry sponge the server sent and the one the
browser expected did not match exactly, so the code complained.

In our case, the mismatch was caused by a browser extension you have installed. It
quietly edited the page before our code could wake it up, so the two no longer
matched. It was not our code's fault.

The fix: we told the code "it is fine if that one top element differs a little,"
because we know the extension harmlessly tweaks it. That is what
`suppressHydrationWarning` does.

### "Date.now() while prerendering"

"Prerendering" means building a page ahead of time, before anyone visits, so it is
ready to show the instant someone arrives.

There was an experimental, still-maturing feature switched on (called
`cacheComponents`) that tried to build pages ahead of time and insisted that
everything on them be fixed and predictable. But something on the page asked "what
is the exact time right now?" (`Date.now()`), and the time changes every moment, so
it is not fixed. The feature flagged that as a problem.

The fix: we turned that experimental feature off. We do not need it for the app,
and it was being overly strict and clashing with Material UI. With it off, the
page builds normally.

### "Changing an uncontrolled input to be controlled"

A text box can work in one of two ways: either the code is the boss of what is in
it ("controlled"), or the browser is the boss ("uncontrolled"). You should pick
one and stick with it for a given box.

This message said a box switched from one way to the other. In our case it was not
a real problem at all: it only appeared because the page was reloading itself live
while I was editing the code (a developer convenience called hot reload). On a
normal, clean page load it does not happen.

### The takeaway

Two of these came from outside our control (a browser extension, and a live-reload
quirk), and one came from an experimental setting we simply did not need. None of
them meant the app was wrong. This is normal: a lot of "errors" while building are
warnings about edge cases, not signs that something is broken.

---

## Part 10: How your bank data got into the database

When you looked at the `accounts` table in Supabase, it already had rows in it (the
fake accounts, with balances like 1800 and 2700, which are 18 and 27 pounds in
whole pence). You asked three good questions about that. Here they are, answered.

### Why were the rows already filled in?

Those rows are the fake accounts from the TrueLayer sandbox (the mock bank you
logged into with john and doe). When you tapped "Connect your bank" and finished
the login, our code fetched those accounts and wrote them into the table for you.

The column `is_manual` says FALSE on every row. That is the proof of where they
came from: FALSE means "this account arrived from a bank sync," not typed by hand.
If you ever added an account manually, that column would say TRUE instead.

### Is Supabase connected to TrueLayer?

No, and that is on purpose. Supabase and TrueLayer never talk to each other
directly. Your Next.js server sits in the middle and is the only thing that talks
to both. The path is:

```
Your browser
   -> Next.js server (our code)
        -> TrueLayer   (asks: "give me this person's accounts")
        -> Supabase    (says: "save these accounts")
```

TrueLayer hands the data to our server, and our server hands it to Supabase. This
is the "bank glue" decision written into the ADRs: the server is the trusted middle
layer, so the bank token never touches the browser or the database.

### Why do you not see any SQL for those rows?

Because those rows were not created by SQL you wrote. They were created by a line
of code in `src/app/callback/route.ts` that looks like this:

```ts
await supabase.from("accounts").insert({ ...the account... });
```

The Supabase library quietly turns that `insert` into a database write for you
behind the scenes, so there is no hand-written `INSERT INTO accounts ...` anywhere
in the project.

The only hand-written SQL in Hyper Budget lives in the migration files in
`supabase/migrations/`: one creates the tables and the privacy rules, another
creates the safe-to-spend function. Those run once to build the structure. After
that, the everyday data (accounts, transactions, buckets) all flows in through
`.insert()` and `.select()` calls in the app, never as SQL you type. That split is
normal and healthy: you write SQL for the shape of the database, and the app code
fills it with data.

### Why does the currency say GBP when home shows euros?

The sandbox bank reports pounds (GBP), and we store the value exactly as the bank
gave it. The euro symbol on the home screen is only a display choice, since these
are fake test amounts we are not really converting. When a real European bank is
added later, the place to do proper currency conversion is that same callback file,
where the data comes in.

---

## Part 11: Where code lives versus where it runs

You asked whether "the TypeScript is stored in the Next.js server." That mixes two
different ideas that are worth keeping apart: where the code lives (stored), and
where it runs.

### TypeScript is a language, not a place

TypeScript is just the language the code is written in. The files
(`callback/route.ts`, `home/page.tsx`, and so on) are documents written in that
language. They are stored in your project folder on your computer, and a copy is
stored on GitHub. They are not sitting "inside" a server somewhere.

### Next.js decides where each file runs

When the app runs, Next.js runs each file in one of two places:

- On the server (a computer running your app). Route handlers like
  `callback/route.ts` and the server pages run here. This code never reaches the
  user's browser, which is why it can safely hold the TrueLayer secret and talk to
  the bank.
- In the browser (on the person's phone or laptop). Files that start with
  `"use client"`, like `HomeView.tsx`, run here, so the person can tap buttons and
  watch things change.

So the accurate way to say it is: the bank code runs on the Next.js server, but it
is stored as TypeScript files in your project.

### What is "the server" right now?

A server is just a computer running your app. Right now the server is your own
computer, because `npm run dev` runs the app at `localhost:3000`. There is no
mystery machine involved yet. When we deploy to Vercel, the server becomes Vercel's
computer: the same files get uploaded there, and the server-side parts run on
Vercel instead of your laptop. That is the whole point of deploying, moving the
"runs on the server" part onto a computer that is always on, so other people can
reach it.

### One last detail

The browser and the server both actually run JavaScript, not TypeScript. Before
your code runs, a build step quietly translates your TypeScript into JavaScript. You
write TypeScript because it catches mistakes early; the machine runs the JavaScript
version. This happens automatically, so you never do it by hand.

In one line: you write and store TypeScript files; Next.js runs some of them on the
server and some in the browser; and the server is your laptop today, Vercel after
we deploy.

---

## Part 12: How the safe-to-spend number is worked out

Safe-to-spend is the heart of the app: the one honest number that says "this is
what is actually yours to spend right now." Here is the rule, in plain words.

### The formula

```
safe to spend = spendable balance - money you set aside, never below zero
```

- Spendable balance = the total in your everyday (transaction) accounts. Savings
  accounts are left out on purpose, because that money is not meant for spending.
- Money you set aside = your buckets added up (food and rent, bills, savings).
- Never below zero = if your set-aside is bigger than your balance, the number
  stops at zero instead of showing a scary minus figure.

That last rule is deliberate and kind. The app never tells someone they are "minus
369 euros to spend," because that is exactly the shame moment that makes people with
ADHD quit a budgeting app. It shows zero and keeps the essentials marked safe.

### How we checked it was right

Because this is money, we did not just trust it. We tested it both ways with the
sandbox data, where the spendable accounts total about 81 euros:

- Big buckets (450 euros set aside): the result correctly showed 0, because the
  set-aside was larger than the balance.
- Small buckets (65 euros set aside): the result correctly showed 16, because
  81 minus 65 is 16.

Both matched the formula by hand, so we know the calculation is trustworthy.

### Where this calculation lives

We chose to do this math in the database, in SQL, rather than in the app code. The
function is called `get_safe_to_spend` and it lives in a migration file. The app
just asks the database "what is the safe-to-spend?" and shows the answer. Part 13
explains why we chose that.

---

## Part 13: The two big "how" decisions behind the number

These are the decisions you made yourself after we talked through the trade-offs.
They are recorded formally in the ADRs, but here they are in plain words, because
they were real learning moments.

### Compute-on-read versus a cached value

There are two ways to show a number like safe-to-spend:

- Cached: work the number out once, save it, and show the saved copy. Fast, but
  risky. If a transaction is ever missed, or counted twice, the saved number
  quietly drifts away from the truth and nobody notices.
- Compute-on-read: work the number out fresh from the raw accounts and buckets
  every time the page loads. A tiny bit more work for the computer, but the number
  is always correct, because it is rebuilt from the real data each time.

You chose compute-on-read, for the reason you put very well yourself: with a cached
value the system keeps trusting a saved number that might already be wrong, while
computing on read always rechecks against reality. For a money app, being correct
beats being a few milliseconds faster.

### Append-only allocation (never rewrite history)

When money is split into buckets, there are two ways to record it:

- Overwrite: keep one running figure per bucket and change it in place. Simpler,
  but you lose the story of how it got there, and a repeated tap can double-count.
- Append-only: write down each allocation as its own event and never edit or delete
  the old ones. The current total is worked out by adding the events up. Nothing is
  ever rewritten.

You chose append-only. It means the history is always honest: you can see every
move, a mistake can be traced, and an accidental repeat does not silently corrupt
the total. It fits the same principle as compute-on-read: keep the raw truth, and
work the summary out from it.

### The one-line takeaway

Both decisions come from the same idea: for money, keep the real, raw records and
calculate the friendly number from them each time, rather than trusting a stored
summary that could drift. Correct and trustworthy first, fast second.

---

## Part 14: How your money gets split each cycle (the allocation engine)

This is the heart of the app, and we designed it together over a long back and
forth. Here it is in plain words.

### Virtual buckets: one real pot, labels on top

The app never moves real money at the bank. Your money stays as one real pot. The
app just lays **labels** over it: this much is food & rent, this much is bills, and
so on. Dividing money this way, without any real transfer, is called **virtual
buckets** (or virtual envelopes). It is how good budgeting apps work, and it is why
a "savings bucket" is a plan, not a transfer.

### Cycles: your budget resets with your pay

Your budget runs in **cycles** the length of how often you are paid, which you set
to weekly or monthly. Each cycle, the income that arrived is split into the buckets,
and the buckets reset for the next cycle. A monthly earner's buckets reset monthly;
a weekly earner's reset weekly.

### The waterfall: the order money fills the buckets

Each cycle's income fills the buckets in a fixed order, like water filling cups from
top to bottom:

1. Food & rent
2. Bills
3. Fun floor (a little guaranteed fun, if you set one)
4. Savings
5. Whatever is left over is your **safe-to-spend**

### "Save what fits"

If a cycle is lean and the money runs out before savings is full, savings simply
takes **whatever is left** after the earlier buckets. No guessing, no percentage. A
good month saves the full amount; a thin month saves less; a broke month saves
nothing. Honest either way.

### The fun floor is your choice

The fun floor is a small amount of guilt-free fun you can guarantee yourself even in
tight cycles. It defaults to 0 (off), because protecting savings first is the
default. If you want it, you set it, and it is funded before savings. We made it
*your* setting on purpose, because only you know if you need it.

### Overspending: which buckets get eaten, and in what order

If you spend more than your safe-to-spend, the extra has to come from somewhere
(it is all one real pot). It eats the buckets in reverse order of importance:
safe-to-spend (fun) first, then savings, then bills, and **food & rent is protected
the very longest**. So overspending hurts your least important money first and your
roof-and-food money last. Nothing is deleted; an overspend is written as a negative
event, so the full history stays intact.

### The savings cushion that grows

At the end of each cycle, whatever savings survived is **locked** into your
cumulative cushion, permanently. An empty cycle locks nothing. The cushion is the
sum of all the locked cycles plus whatever this cycle has set aside so far. That is
how the €5-a-week (or whatever you choose) slowly grows into a real cushion, while
the app never pretends you saved money you actually spent.

### Why safe-to-spend looked huge in testing

When we first ran the engine on your real data, safe-to-spend showed thousands of
euros, even though your account holds about €81. That is because this stage splits
your **income** but does not yet subtract your **spending**. Most of that income was
already spent during the month, which is why the real balance is small. The next
stage (the overspend part) subtracts the spending, and then the number will match
reality. Income in first, spending taken out second.

---

## Part 15: Two small snags we hit, in plain words

Building the engine, two technical-looking errors came up. Neither meant anything
was really wrong. Here is what each one was.

### "function allocate_cycle(numeric, ...) does not exist"

Our math function expected a **bigint** (a plain whole number) for the income. But
when the database **adds up** a column of whole numbers with `sum()`, it hands back
a slightly different number type called **numeric** (a careful decimal type). The
function did not recognise "numeric" where it wanted "bigint", so it complained.

The fix was one word: we told the database to turn the sum back into a bigint (a
"cast", written `::bigint`). The math never changed; the two sides just had to agree
on the number type. This is a common, harmless database gotcha.

### The real-data query returned nothing

When we ran the cycle function in Supabase's SQL Editor, it returned zero rows, even
though the data was there. The reason: the function is built to show **only the
logged-in person's** rows, and it finds out who that is by asking `auth.uid()`
(short for "the current user's id"). But the SQL Editor runs as the database
**admin**, where there is no logged-in app user, so `auth.uid()` is empty and the
"only my rows" filter matches nothing.

That empty result was actually the **privacy wall working correctly**. In the real
app, your login tells the function who you are, so it returns your data there. To
test it in the editor, we looked you up by your account on purpose, which stood in
for the logged-in user, and then your real cycles appeared.

The lesson worth keeping: an empty result in the SQL Editor often means "no logged-in
user here", not "no data".

---

## Part 16: Matching spending to buckets by the bank's label

When we wired spending into the engine, a problem showed up, and fixing it taught a
nice lesson.

### The problem

The first idea was: any spending just eats your fun money first, then savings, then
bills, then rent. Simple. But it broke on a normal month. If you pay your €800 rent,
the app charged that €800 against your fun and savings, and told you that you had
overspent, when all you did was pay the rent you had budgeted for. That is wrong, and
it is exactly the kind of false alarm that makes people give up.

### The fix: let the bank's label decide

Banks already tag each transaction (groceries, rent, utilities, and so on). So instead
of guessing, the app reads that label and sends the spending to the matching bucket:

- rent (labelled housing) is charged to the **food & rent** bucket, where it belongs,
- bills to the **bills** bucket,
- a coffee to **fun**.

Only genuinely fun spending reduces your safe-to-spend, and only spending that goes
**over** a bucket's budget spills over and eats into the rest. So a normal month reads
as healthy, and you are only warned when you truly overspend.

Because different banks (and languages) use different words for the same thing (rent,
Miete, housing), the app keeps a small **lookup table** of labels, easy to extend, and
anything it has not seen yet is treated as fun by default so nothing breaks.

### Two views of a cycle

We ended up with two small database helpers, and we deliberately kept both:

- **The plan** (`cycle_allocations`): how your income was split into buckets, before
  you spent anything.
- **The reality** (`cycle_summary`): what is left after your spending is matched to
  its buckets.

They share some inner workings, so we wrote down why we keep both rather than merging
them, in an Architecture Decision Record (ADR 0012). The short reason: they answer two
different questions, the plan and the outcome, and both are useful to show.

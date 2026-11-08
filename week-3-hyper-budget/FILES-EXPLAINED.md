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

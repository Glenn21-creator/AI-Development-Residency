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
  but checked out to a different branch. This matters for you, and Part 4 explains
  why.

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

## Part 7: Where your files actually are on your computer

This is the one that can confuse. We have been working in a **worktree**, which
is a second folder linked to your repo, living at:

`.claude/worktrees/adhd-budget-app-setup-106074/`

So the new files are on your computer, but inside that worktree folder, not in the
main project folder you usually open. On top of that, your main folder only shows
changes after you **pull** them down from GitHub. Part 1 of the chat message that
came with this file explains exactly how to see everything in your normal folder.

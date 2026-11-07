# Hyper Budget: Architecture

Status: draft for review
Last updated: 2026-11-07

This document is the blueprint for Hyper Budget, an ADHD-friendly budgeting web
app. It describes the whole app across three tiers (the screens, the server
rules, and the database) and the rules every part follows. It is written before
the feature code, on purpose, so the plan is agreed first.

The big technology and design decisions summarised here each have their own
Architecture Decision Record (ADR) in `docs/adr/`, which explains the "why" in
full. This document is the overview; the ADRs are the decision records.

---

## 1. What we are building

Hyper Budget helps people with ADHD, many carrying years of money shame, see
what is safe to spend without effort or dread. The core promise is automatic,
shame-free, near-zero-upkeep budgeting: money is sorted the moment it arrives,
and the app always leads with what is safe and covered.

This is the MVP. Scope is governed by the `mvp-scope` skill. Anything not listed
there is out of scope for now.

### The stack

- Screens: Next.js (App Router, TypeScript) with Material UI, hosted on Vercel.
- Server logic: money math runs in Supabase as SQL; outside-world work runs as
  Next.js server code on Vercel.
- Database and auth: Supabase (Postgres, Auth, Row-Level Security, Vault).

---

## 2. Tier 1: the screens

Built with Next.js and Material UI. The design follows the `adhd-ux-guidelines`:
one clear main action per screen, no shame language, no streaks, gentle fresh
starts, light theme, and color never the only signal.

### The flow

```
Welcome
   |
Log in / Create account   (Google, or email and password; one screen that
   |                       flips between log in and sign up)
   |
   +-- new user --> Onboarding (3 steps) --+
   |                                        |
   +-- returning user ----------------------+--> Home
```

A new person goes through Onboarding; a returning person goes straight to Home.
Both then share the same screens.

### The screens

1. **Welcome.** First impression and a single "Get started".
2. **Log in / Create account.** Continue with Google, or email and password, on
   one screen that flips between log in and sign up. Kind errors that never clear
   the form; the provider handles the password, so we never see it.
3. **Onboarding (new users only), three lean steps.** Connect your money (bank
   sandbox first, manual entry as a quiet backup), confirm the auto-sorted
   buckets, then land on Home. One decision per step, a progress marker, and a
   "you can change this later" reassurance throughout.
4. **Home.** The star. A warm greeting, a Hide balances toggle, the hero
   safe-to-spend card, and the four jars (food and rent, bills, savings, fun)
   with icon-plus-text status. View-focused: a small, discreet plus in a corner
   opens a quick "log a spend" pop-up, so manual logging exists without
   undercutting the automation promise. Returning after a gap shows a warm
   welcome-back state, never a pile of catch-up chores.
5. **Buckets** (tab). Where the money went, in allocation order; a plain-English
   "how your number is worked out" box; the "what's due and what's covered" bills
   list. Includes an "Adjust my buckets" action with a guardrail that keeps food
   and rent protected.
6. **Alerts** (tab). Gentle, self-clearing nudges with no guilt counter: bill
   reminders, 50% and 80% thresholds, flag-only subscription spots, and light
   small wins.
7. **Savings** (tab). One quiet cushion goal with progress, no deadline, and an
   "Adjust my goal" action.
8. **Settings.** Account, privacy (hide balances, notification preferences), and
   log out.

The four main tabs are Home, Buckets, Alerts, Savings.

---

## 3. Tier 2: the server rules

The guiding rule: anything touching money or who-can-see-what runs on the
trusted server, never in the browser. The division is clean: SQL in Supabase
does the thinking over the data; Next.js server code does the talking to the
outside world.

### Where logic lives

- Money math (safe-to-spend, allocation, due-versus-covered) runs in Supabase as
  SQL, close to the data and enforced together with the privacy wall. See
  ADR: logic in Supabase.
- Outside-world work (Google login handshake, bank data, sending push) runs as
  Next.js server code on Vercel, because SQL cannot reach the outside world.

### Safe-to-spend

The heart of the app. `safe_to_spend = available_balance - essentials_floor
remaining - bills_set_aside remaining - other_protected_buckets`. Computed on
read over an append-only ledger, so it is always correct by construction and
cannot drift. Money is stored as whole minor units (cents), never floating point;
rounded once at the end; currency tracked on every amount. Recalculated on every
change. All edge cases from `safe-to-spend-math` are handled on purpose
(shortfall shows 0 not a negative, lumpy income, pending, refunds, duplicates,
overspend hits fun not essentials). See ADR: compute safe-to-spend on read.

### Automatic allocation

The moment income lands, it is split into jars in a fixed order: essentials
floor, then bills, then other protected buckets, then fun. Recorded as
append-only events capturing each deposit's split and the rule in force at the
time. A later rule change (for example raising the savings amount) applies only
to future deposits; it never retroactively re-slices past, already-budgeted
money. The user sets the amounts (with smart defaults); the app fixes the safe
order. See ADR: append-only allocation.

### Identity and the privacy wall

Supabase Auth handles login (Google, and email and password), issues a secure
session, hashes passwords (we never see them), and expires and refreshes
sessions. Users stay logged in for a good while to keep friction low; privacy in
the moment is covered by Hide balances now and a device lock later. The privacy
wall is Row-Level Security: policies inside the database so each person can only
ever read or change their own rows, even if app code has a bug. The browser only
ever gets the public key (safe behind RLS); the secret master key stays
server-side. See ADR: RLS privacy wall.

### Bank data coming in

Sandbox only (fake test accounts). Automatic linking is the main path, manual
entry the quiet backup. The provider's hosted screen handles the bank login, so
we never see credentials. The provider returns a per-user token, stored
encrypted in Supabase Vault. We pull accounts, balances, and transactions, and
categorize them; least privilege (read only); provider data treated as untrusted
and validated; duplicates prevented via the provider's unique transaction id;
clear consent and easy disconnect; fail safely to last-known data marked "not
live." The bank-calling code is Next.js server code. See ADR: open-banking
sandbox.

### Log a spend

Kept but discreet (reached from a small control, not a hero button). A manual
spend is one append-only ledger entry marked "entered by hand" so sync never
confuses it with bank data, taken from the fun bucket, with safe-to-spend
recomputed on read.

### Alerts

Two coordinated surfaces drawing from the same "what is true now" logic, routed
so the same event never alerts twice:

- In-app nudges, computed on read, self-clearing, shown while the app is active
  and listed on the Alerts tab.
- Push notifications while the app is inactive, built in the MVP. This adds a
  service worker, per-device push subscriptions, VAPID keys (private key a server
  secret), a Vercel Cron scheduler, and an append-only sent-log so nothing nags
  twice. Quiet hours respected, per-type on/off, and no balance amounts on the
  lock screen. Note: on iPhone-in-browser, push only fires if the app is
  installed to the home screen; in-app alerts cover those users. See ADR:
  alerts and notifications.

---

## 4. Tier 3: the database

Supabase (Postgres). Tables grouped by purpose:

**You**
- `profiles`: one row per person; name and settings (currency, notification
  preferences, quiet hours, hide-balances default); linked to the Auth user.
- `consents`: what the person agreed to and when (bank connection, data
  processing); provable and withdrawable (GDPR).

**Money coming in**
- `bank_connections`: one row per linked bank; provider, status, and the
  per-user access token stored in Supabase Vault.
- `accounts`: accounts pulled from a connection (name, type, balance, currency).
- `transactions`: the append-only ledger. Amount in whole cents, currency, date,
  description, category, synced-or-manual, provider's unique id (dedupe),
  pending-or-settled. Everything reads from this.

**Money sorted**
- `buckets`: the jar definitions and config (floor amount, savings drip). Holds
  the rules, not stored balances; balances are computed on read.
- `allocation_events`: append-only record of how each deposit was split, with the
  rule in force at the time.
- `bills`: upcoming bills (amount, due date, recurrence); covered-or-not is
  computed.
- `savings_goals`: one cushion goal for the MVP (target, per-deposit drip);
  progress computed.

**Alerts**
- `push_subscriptions`: one row per person per device; the push address.
- `notifications_sent`: append-only log of nudges already sent, so none nags
  twice.

### Rules every table follows

- The privacy wall: every table with personal data carries a `user_id` and an
  RLS policy (you only touch your own rows).
- Money as whole cents, with a currency, never floating point.
- Append-only where it matters (`transactions`, `allocation_events`,
  `notifications_sent`): add rows, do not quietly edit or delete history;
  corrections are new rows.
- GDPR basics: store only what is needed, record consent, support export and
  delete.
- All database logic lives in version-controlled migration files, not only in
  the Supabase dashboard.

In-app alerts are computed on read from the live data, not stored as a table.

---

## 5. Cross-cutting rules

- Secrets (bank tokens, provider keys, VAPID private key, Supabase master key)
  never live in the code, the repo, or the browser. Per-user tokens live in
  Vault; app-wide keys live in server environment settings. See
  `secrets-and-api-keys`.
- Money math is the first thing tested, including every edge case. See `testing`.
- Everything the user sees follows `adhd-ux-guidelines` and the accessibility
  and UX reviews before it ships.
- Build in small, checked steps; never leave the app broken. See `dev-workflow`.

---

## 6. Decisions recorded as ADRs

Each of these has its own record in `docs/adr/`:

- Next.js with Material UI (screens)
- Vercel (hosting)
- Supabase (database, auth)
- Money logic runs in Supabase (SQL)
- Safe-to-spend computed on read over an append-only ledger
- Allocation recorded as append-only events
- Row-Level Security as the privacy wall
- Open-banking sandbox for bank data
- Alerts: in-app plus push in the MVP

---

## 7. Out of scope for the MVP

Governed by `mvp-scope`. Not building now: investment or net worth tracking, bill
negotiation, multi-input capture, multi-currency and open banking beyond the
sandbox, the app issuing its own card, and location-based nudges. MMP features
(emergency cushion auto-save, partner sharing, subscription cancellation,
pace-based alerts, AI chatbot, fuller rewards) come after a validation
checkpoint.

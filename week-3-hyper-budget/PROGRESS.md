# Hyper Budget: progress log

A living record of what has been built, decided, and verified, and what is next.
Updated as we go. Latest entry at the top of each section.

Last updated: 2026-11-13

---

## Flow rework (2026-11-13)

Reworked the new-user flow and added the brand logo (recorded in ADR 0014):

- **Logo** added at `public/brand/` (full lockup, icon, mono). It now greets people on
  the welcome screen (`/`) and sits at the top of the menu pane.
- **Onboarding welcome (`/onboarding`)**: one calm first-run screen after sign up,
  logo plus a plain three-step explanation, then on to bucket setup.
- **Buckets-first**: new accounts set their own buckets before Home. Food & rent,
  bills, and savings are required; minimum fun money stays optional. The bottom tabs
  are hidden during first-time setup for one clear path.
- **Connect on Home**: the old `/start` gate is gone. When no bank is linked, Home
  itself shows a calm "Connect your bank" card in place of the numbers.
- **Pane moved to the left**, with the logo at the top.
- **Button copy**: "Log a spend" -> "Add a transaction", "Log income" -> "Add income",
  and the confirmation now reads "Spent EUR X from [bucket]" (it was wrongly "Added ...
  to", a QA catch, since a transaction takes money out).
- **Testing tools** in the pane: "Clear my data" (clears history, keeps the bank) and
  a new "Reset to new user" (wipes buckets, bank, and history so the onboarding path
  can be re-walked). Reset runs `reset_to_new_user()`, scoped to the signed-in user.

---

## Where it stands right now

- **Stage 1 (per-cycle funding waterfall): complete and verified.**
- **Stage 2 (overspend cascade): complete and verified.** `apply_spending`,
  `label_buckets`, and `cycle_summary` (the label-aware reconciliation) are built.
  `cycle_allocations` (gross plan view) and `cycle_summary` (net, after spending) are
  both kept.
- **Stage 3 (cycle-end locking + cumulative cushion): complete and verified.** The
  Savings tab now shows the append-only ledger cushion (locked completed cycles plus
  the current cycle's provisional), replacing the interim real-balance version.
- **Added via dogfooding and homework:** a bank **Disconnect** button (with a
  confirmation) so a person can unlink their bank and remove that data; a **database
  diagram** at `docs/database-diagram.md` (ERD); and **usability-test templates** in
  `docs/usability/` for the advanced homework.
- **Stage 4 (screens): in progress.** Home shows the real after-spending
  safe-to-spend (via `current_cycle_summary`) with a calm over-budget message, and the
  Alerts tab shows gentle in-app nudges (fun-money thresholds, over budget, all-clear).
  Remaining: Buckets polish, a broader accessibility pass, bill reminders, and push
  notifications (ADR 0009).
- The allocation-engine commits are on the branch, **not merged to main**. The
  local `main` folder is behind until you `git pull`.
- Nothing is in flight; nothing is broken.

**Deploy and fixes (2026-11-09):** first Vercel deploy returned a 500 because the
session middleware had no Supabase env vars at build time. Fixed two ways: the
middleware now fails soft (continues instead of 500), and the four env vars must be
set in Vercel, then redeploy. Also fixed a double-login (the Next.js router cache
served a stale logged-out /home) by calling revalidatePath on the auth redirects.
Still to do on deploy: set the env vars in Vercel and point Supabase redirect URLs
and TrueLayer's redirect URI at the live domain.

**Next:** finish Stage 4 polish (Buckets, broader accessibility pass), then deploy to
Vercel. Bill reminders and push notifications come after.

---

## Dogfooding fixes (2026-11-09)

Using the app as a real person turned up a run of trust and usability problems.
Each one, in plain English: what was wrong, how we fixed it, and what changed.

1. **You could not unlink your bank.** Once connected there was no way back out.
   Fix: added a **Disconnect** button (behind a confirmation) that deletes the bank
   connection; the synced accounts and transactions go with it, while your own
   settings and the savings cushion stay. Changes: new disconnect action, a confirm
   dialog, and ADR 0013 recording what disconnect removes versus keeps.

2. **No way to see what had happened.** You could log a spend but not look back at
   it. Fix: a **Recent activity** screen listing every transaction newest-first,
   with money in and out, the date, whether you logged it or the bank did, and a
   chip showing which bucket a spend came from. Changes: new `activity` page.

3. **Hard to test the math without a real bank.** Fix: added **Log a spend** and
   **Log income** so you can feed the engine by hand. Log a spend has a bucket
   dropdown (fun, food & rent, bills) so the spend lands in the right place, and
   both show a small "Logged EUR X" confirmation. Changes: two server actions, two
   dialogs, a confirmation snackbar.

4. **The screen stayed static after logging.** The database updated but Home did
   not. Cause: Next.js was serving a cached page. Fix: refresh Home right after a
   log so the new number shows at once. Changes: a `router.refresh()` after each log,
   plus `revalidatePath` on the actions.

5. **Home showed false confidence.** When a cycle was overspent, the bucket cards
   still said "Safe" and "Covered" and displayed the targets, not what was really
   left. For an ADHD money app that is exactly the wrong signal. Fix: Home now reads
   the real amount **left** in each bucket (via `current_cycle_summary`) and only
   says "Safe"/"Covered" when there is actually money there; at zero it says
   "Nothing set aside" / "Not covered", calmly. Changes: page reads real figures,
   honest status helper.

6. **Overspends ate the wrong buckets.** A normal rent or bill payment was draining
   fun and savings, because every spend was treated as discretionary. Fix: read the
   bank's **own label** for each transaction and attribute it to the matching bucket
   (a synonym table covering different banks and languages; unknown labels default to
   fun). A protected bucket absorbs its own spending first; only the leftover
   cascades. Changes: `label_buckets` table and the `cycle_summary` reconciliation,
   recorded as the 2026-11-09 amendment to ADR 0010.

7. **The connected-accounts list cluttered Home** without doing much. Fix: removed
   it. Changes: dropped the accounts section from Home.

8. **The menu actions had nowhere to live.** Fix: a **hamburger (three-line) menu**
   on the right that opens a pane with Recent activity, reconnect/disconnect bank,
   and log out. Changes: a right-side Drawer in the Home view.

9. **Connect-first onboarding.** New people were landing on an empty Home. Fix:
   after login, if no bank is linked you are sent to a **Connect your bank** page
   first, then on to Home. Changes: new `start` page and a redirect from Home.

10. **Empty state implied money that was not there.** The sample buckets showed made-up
    amounts. Fix: before you have connected and set buckets, everything reads **zero**
    with no "Safe"/"Covered" badge, so it never pretends money is set aside.

11. **Log buttons were plain text.** Fix: **Log a spend** and **Log income** are now
    proper side-by-side buttons under the safe-to-spend card.

12. **The fun floor was hidden, so the numbers did not add up.** The fun floor (the
    small amount of fun money guaranteed even in a tight cycle) is not a separate
    bucket, but Home was showing only the discretionary part as "Fun money". With a
    EUR 100 floor on EUR 1500 income it showed EUR 300, and the cards summed to EUR
    1400, not your income. Fix: **Fun money now shows the floor plus the discretionary
    remainder** (EUR 400), so the big safe-to-spend number includes the floor and the
    four cards finally add up to what came in. Changes: `funTotal = safe_to_spend +
    fun_floor_left` used for both the headline number and the Fun money card.

13. **No easy way to start a test over.** Clearing test data meant running SQL by
    hand each time. Fix: a **Clear my data (testing)** item in the menu pane (behind a
    confirmation) that cleans all your transaction history and resets the savings
    cushion, while **keeping your bank connected** and keeping your settings (buckets,
    pay frequency, savings goal). Keeping the connection matters: the TrueLayer sandbox
    re-imports the same mock transactions on every reconnect, so a wipe-and-reconnect
    could never give a clean slate. It runs a `clear_my_data` SQL function scoped to
    the signed-in user, so a person can only ever clear their own data; it also returns
    the real error if it fails (for example a missing migration) instead of silently
    doing nothing. Changes: migrations `20261109200000_clear_my_data.sql` then
    `20261109210000_clear_history_keep_connection.sql` (the keep-connected revision), a
    `clearMyData` server action, and the pane item with a confirm dialog. (Run the
    latest migration in Supabase once before using the button.)

Deploy and login fixes from the same day are recorded just above.

---

## The allocation engine: stages

- [x] **Stage 1 - per-cycle funding waterfall.** Split a cycle's income across the
  buckets. Done.
- [x] **Stage 2 - overspend cascade.** `apply_spending`, `label_buckets`, and
  `cycle_summary` (label-aware reconciliation) built and verified.
- [x] **Stage 3 - cycle-end locking + cumulative cushion.** Append-only
  `savings_locks`, locked compute-on-open; cushion grows. Verified live.
- [~] **Stage 4 - the screens.** Home (real safe-to-spend + over-budget message),
  Savings cushion, and the in-app Alerts tab are done. Remaining: Buckets polish, a
  broader accessibility pass, bill reminders, and push notifications.

Cross-cutting: real sandbox data is nearly all one or two dates, so Stages 2 and 3
are tested with simulated multi-cycle data.

---

## Completed work

### Merged to main
- **PR #8** - working app slice: TrueLayer sandbox bank sync, euro display, greeting
  by name, Buckets setup form, first real safe-to-spend in SQL.
- **PR #9** - plain-language learning notes in FILES-EXPLAINED.

### On the branch (not yet merged to main)
- `a525eee` - `allocate_cycle`: the pure per-cycle waterfall math function.
- `bc7d4cd` - pay-frequency toggle and optional fun-floor field on the Buckets form
  (+ `pay_frequency` column on profiles).
- `f128e3a` - `cycle_allocations`: wires the waterfall to real cycle income.
- `d5bfd60` - ADR 0010 and 0011, plus FILES-EXPLAINED Parts 14 and 15.
- `50b0d12` - PROGRESS.md, this living build log.
- `7be9f52` - `apply_spending`: the overspend cascade function (Stage 2).
- `6d25ffa` - `label_buckets`: map bank spending labels to buckets (synonyms, EN + DE).
- `5176975` - `cycle_summary`: real safe-to-spend after labelled spending (Stage 2).
- `a7ea15c` - ADR 0010 amendment, ADR 0012, FILES-EXPLAINED Part 16.
- `c58ea17` - the interim Savings tab (real-balance; now superseded by the ledger).
- `be354aa` - Stage 3: `savings_locks` ledger, lock and cushion functions, Savings wiring.
- `fdd0e02` - Stage 4: `current_cycle_summary`, real safe-to-spend on Home, over-budget message.
- `f0faa9d` - the in-app Alerts tab (gentle cycle nudges).

### Supabase migrations run (in the database)
- `safe_to_spend`, `allocate_cycle`, `pay_frequency`, `cycle_allocations`,
  `apply_spending`, `label_buckets`, `cycle_summary`, `savings_locks`,
  `savings_cushion`, `current_cycle_summary`.
- All confirmed by test queries.

### Verified
- Waterfall math: four passing test queries.
- Multi-cycle behavior: a simulated 4-row test matched exactly.
- Real data: the two real cycles (October, November) split correctly.
- Overspend cascade (`apply_spending`): from a funded cycle of food & rent 5000,
  bills 1000, fun floor 0, savings 500, safe-to-spend 1500 (cents), four spends:
  1000 (eats fun only), 1800 (fun then 300 of savings), 7000 (fun, savings, bills,
  then 4000 of food & rent), 9000 (all 8000 plus amount_overspent 1000).
- Label-aware reconciliation (`cycle_summary`): targets food & rent 80000, bills
  20000, savings 10000 (cents). Normal month (income 120000; rent 80000, bills 20000,
  coffee 5000) gives safe-to-spend 5000, savings 10000. Rent-over month (rent 90000,
  1000 over) cascades the overflow into savings, leaving safe-to-spend 0, savings
  5000.
- Cycle-end locking (Stage 3): live on real data. October locked its surviving 500,
  November contributed 0 (its savings was spent), so the cushion reads 500 and shows
  495 to go toward the 50000 goal.
- Home real safe-to-spend (Stage 4): live, Home now shows the current cycle's real
  after-spending figure (via `current_cycle_summary`) instead of the old gross number.
- Alerts tab (Stage 4): live, shows the right in-app fun-money nudge for the current
  cycle, with kind copy, or a calm all-clear when nothing needs attention.

---

## Design decisions (recorded in ADRs)

- Cycle-based allocation: pay frequency (weekly/monthly); waterfall order
  food & rent -> bills -> fun floor -> savings -> safe-to-spend.
- "Save what fits" for partial savings cycles.
- Overspend cascade: fun -> savings -> bills -> food & rent protected longest.
- Spending attributed to buckets by the bank's own label (data-driven alias table,
  synonyms + languages, unknown labels default to fun). Recorded as the 2026-11-09
  amendment to ADR 0010.
- Keep both `cycle_allocations` (gross plan) and `cycle_summary` (net, after
  spending) rather than consolidating. Recorded in ADR 0012.
- Fun floor as a user setting (default 0).
- Savings cushion via append-only cycle locking (compute-on-open).
- Regular-income assumption recorded as a deliberate scope choice.
- See ADR 0010 (cycle allocation and spend waterfall) and ADR 0011 (savings cushion
  cycle locking) in `docs/adr/`.

---

## Still to do (beyond the engine)

- Alerts: in-app nudges done; still to add bill reminders and push notifications.
- Onboarding flow (including asking pay frequency).
- Store the bank token in Supabase Vault for background re-sync (currently not
  stored; reconnect to refresh).
- Address the moderate npm vulnerabilities before launch.
- Deploy to Vercel for a live URL.
- Submit to mdenner@techfleet.org.

---

## Planned next (post-submission)

- CSV importer: upload a Revolut CSV export to load real accounts and transactions
  into your own Supabase, so the owner can run the app on real money without live
  open banking. Deliberately kept to CSV/manual (no TrueLayer Live), to avoid the
  regulatory, security, and approval burden of real open-banking access. Plan: build
  it to try with a real pay cycle.

## Later ideas (post-MVP, not scheduled)

- User-created custom buckets with automatic spending assignment, powered by a
  built-in AI agent that reads each transaction and infers its category (beyond the
  fixed-label mapping). Fits the MMP "AI chatbot for check-ins and coaching". Large:
  it would rework the fixed-priority allocation engine, so it is deliberately post-MVP.

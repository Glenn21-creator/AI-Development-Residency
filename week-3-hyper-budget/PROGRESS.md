# Hyper Budget: progress log

A living record of what has been built, decided, and verified, and what is next.
Updated as we go. Latest entry at the top of each section.

Last updated: 2026-11-09

---

## Where it stands right now

- **Stage 1 (per-cycle funding waterfall): complete and verified.**
- **Stage 2 (overspend cascade): complete and verified.** `apply_spending`,
  `label_buckets`, and `cycle_summary` (the label-aware reconciliation) are built.
  `cycle_allocations` (gross plan view) and `cycle_summary` (net, after spending) are
  both kept. Remaining: show `cycle_summary`'s real safe-to-spend on Home in place of
  the old gross `get_safe_to_spend` (part of the Stage 4 screens).
- **Stage 3 (cycle-end locking + cumulative cushion): complete and verified.** The
  Savings tab now shows the append-only ledger cushion (locked completed cycles plus
  the current cycle's provisional), replacing the interim real-balance version.
- The allocation-engine commits are on the branch, **not merged to main**. The
  local `main` folder is behind until you `git pull`.
- Nothing is in flight; nothing is broken.

**Next:** Stage 4, the screens, chiefly swapping Home's safe-to-spend to
`cycle_summary`, plus Buckets polish and an accessibility pass.

---

## The allocation engine: stages

- [x] **Stage 1 - per-cycle funding waterfall.** Split a cycle's income across the
  buckets. Done.
- [x] **Stage 2 - overspend cascade.** `apply_spending`, `label_buckets`, and
  `cycle_summary` (label-aware reconciliation) built and verified.
- [x] **Stage 3 - cycle-end locking + cumulative cushion.** Append-only
  `savings_locks`, locked compute-on-open; cushion grows. Verified live.
- [ ] **Stage 4 - the screens.** Savings cushion view, Home, Buckets settings;
  accessibility and copy pass.

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

### Supabase migrations run (in the database)
- `safe_to_spend`, `allocate_cycle`, `pay_frequency`, `cycle_allocations`,
  `apply_spending`, `label_buckets`, `cycle_summary`, `savings_locks`,
  `savings_cushion`.
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

- Merge the allocation-engine branch commits to main (when ready).
- Alerts tab (threshold alerts, bill reminders).
- Onboarding flow (including asking pay frequency).
- Store the bank token in Supabase Vault for background re-sync (currently not
  stored; reconnect to refresh).
- Address the moderate npm vulnerabilities before launch.
- Deploy to Vercel for a live URL.
- Submit to mdenner@techfleet.org.

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
- The interim Savings tab (real-balance version) is committed but will be replaced
  by the ledger cushion in Stage 3.
- The allocation-engine commits are on the branch, **not merged to main**. The
  local `main` folder is behind until you `git pull`.
- Nothing is in flight; nothing is broken.

**Next:** Stage 3, the cycle-end locking and cumulative savings cushion. (Also
pending: swap Home's safe-to-spend to `cycle_summary`, part of Stage 4.)

---

## The allocation engine: stages

- [x] **Stage 1 - per-cycle funding waterfall.** Split a cycle's income across the
  buckets. Done.
- [x] **Stage 2 - overspend cascade.** `apply_spending`, `label_buckets`, and
  `cycle_summary` (label-aware reconciliation) built and verified.
- [ ] **Stage 3 - cycle-end locking + cumulative cushion.** Lock surviving savings
  per cycle (append-only, compute-on-open); cushion grows.
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

### Supabase migrations run (in the database)
- `safe_to_spend`, `allocate_cycle`, `pay_frequency`, `cycle_allocations`,
  `apply_spending`, `label_buckets`, `cycle_summary`.
- All confirmed by test queries.

### Verified
- Waterfall math: four passing test queries.
- Multi-cycle behavior: a simulated 4-row test matched exactly.
- Real data: the two real cycles (October, November) split correctly.
- Overspend cascade: four `apply_spending` cases verified (small spend, crossing into
  savings, reaching food & rent, and spending beyond income via amount_overspent).
- Label-aware reconciliation: `cycle_summary` verified on a normal month (rent and
  bills absorbed by their own buckets, safe-to-spend correct) and a rent-over-budget
  month (the overflow cascades into savings).

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

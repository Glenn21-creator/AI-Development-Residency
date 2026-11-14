# ADR 0010: Cycle-based allocation and the spend waterfall

Status: accepted
Date: 2026-11-09

## Context

ADR 0006 set that allocation is recorded as append-only events. It did not pin
down how a cycle's income is actually split, or how overspending is represented.
We need those rules to be exact, because they are money math for an ADHD audience
where a wrong or harsh number loses trust.

A key scope assumption: the user receives income on a regular schedule. Someone
with no regular income is harder to serve (see the irregular-income note in
`safe-to-spend-math`) and is out of scope for this model for now. This is a
deliberate simplification, recorded so it is a choice, not an oversight.

## Decision

- The budget runs in **cycles** the length of the user's **pay frequency**
  (weekly or monthly), a setting they choose. Buckets are fixed amounts per cycle
  and reset each cycle.
- Each cycle's income is split in a **fixed order**: food & rent, then bills, then
  the fun floor, then savings, and whatever remains is **safe-to-spend**.
- Savings uses **"save what fits"**: it takes what is left after the earlier
  buckets, up to its target, so a lean cycle simply saves less. No percentage, no
  assumption; the remainder is the amount.
- The **fun floor** is a user-set guaranteed-minimum fun bucket (default 0),
  funded before savings, so a user who opts in always keeps a little guilt-free
  spending even in a tight cycle.
- **Overspending** is represented by draining the buckets in reverse priority:
  safe-to-spend (fun) first, then savings, then bills, then food & rent protected
  the longest. Drains are append-only negative events; nothing is erased.
- The mechanism is firm, but the **tone stays kind** even when fun reaches 0 (per
  `adhd-ux-guidelines`).

## Alternatives considered

- **Fixed amount allocated per deposit.** Breaks with many small deposits (a
  per-period target times every deposit is nonsense). Rejected.
- **Percentage-of-income allocation.** Scales per deposit, but changes buckets to
  percentages and needs spend categorisation. Heavier; deferred.
- **"Full or skip" for a partial savings cycle.** Either overstates (locks money
  that was not there) or throws the partial amount away. Less honest than "save
  what fits". Rejected.
- **A hard fun floor on by default.** Competes with savings for everyone. Made it
  a user setting defaulting to 0 instead.

## Consequences

- Good: matches how people budget weekly or monthly; honest; append-only; firm
  saving with a kind voice; the user controls the fun floor.
- Cost: assumes regular income (irregular income deferred); more money math to
  prove correct; built in stages (Stage 1, the per-cycle funding waterfall, is
  done; Stage 2, the overspend cascade, is pending).
- Relationship to ADR 0004 and 0005: the split runs in SQL (`allocate_cycle`,
  `cycle_allocations`, `cycle_summary`) and is computed on read, consistent with both.
  `cycle_allocations` gives the gross plan (income split, before spending);
  `cycle_summary` gives the net (after spending). Both are kept.

## Amendment (2026-11-09): spending attributed by the bank's label

The original decision said all spending drains the buckets fun-first, with no
guessing which category a purchase is. Wiring that to real data showed it is wrong:
paying normal rent and bills would drain fun and savings and wrongly read as
overspent, because a rent payment was not charged to the food & rent bucket.

Revised decision: **attribute each spend to a bucket by the bank's own label.**
Open-banking data labels transactions (groceries, rent, utilities), and a
data-driven alias table (`label_buckets`) maps those labels, including synonyms
across banks and languages (rent, Miete), to our buckets. Unknown labels default to
fun, so a missing label is always safe.

Each protected bucket (food & rent, bills) then **absorbs its own labelled
spending**. Only two things draw from fun: discretionary (fun-labelled) spending,
and any **overflow** where a bucket's spending exceeded its budget. That fun-side
draw runs through the same cascade (`apply_spending`): safe-to-spend, then fun
floor, then savings, then leftover bills, then leftover food & rent, with
`amount_overspent` for anything beyond. `cycle_summary` implements this.

Consequence: correctness now depends on label quality. Rich real-bank labels map
precisely; the coarse sandbox (`purchase`, `bill_payment`, `credit`) maps bills but
treats everything else as fun. The fun-first cascade from the original decision is
retained, but it now acts only on the fun-side draw, not on every euro.

## Amendment (2026-11-13): show which bucket a spend really came from

The cascade means a spend can draw from a different bucket than the one it is filed
under (for example, filed as fun but drawn from food & rent because fun was empty).
Showing only the filed bucket was misleading: Recent activity could say "from Fun
money" while fun money read empty.

Revised decision: **surface the real source, in step with the cascade, wherever a
spend is shown.** When logging a spend, the app computes which bucket(s) it actually
draws from, and how much from each, following this same waterfall (chosen bucket
first, then Fun money -> Savings -> Bills -> Food & rent). This drives three things:
a pre-spend heads-up ("Your Fun money is empty this cycle. This EUR 300 will come
from Bills (EUR 140) and Food & rent (EUR 160)..."), the confirmation, and Recent
activity (a chip per source bucket with its amount). The split is recorded on the
transaction (`charged_from`, as `key:cents` pairs) so the log stays truthful later.
The manual spend dialog's bucket field is framed as a category ("What kind of
spend?"), since the app, not the user, decides where the money comes from.

The savings-vs-overspend order was reviewed here and **kept as decided** (fun ->
savings -> bills -> food & rent); only its transparency changed, not the math.
This is display and recording; the cascade and `apply_spending` are unchanged.

## Amendment (2026-11-14): fun money is reported as one number

The fun floor and the discretionary remainder are the same thing to the user, fun
money, and were only ever shown added together on screen. But the engine reported
them as two columns (`fun_floor_left` and `safe_to_spend_left`), which read as a
contradiction in manual QA: you could see `safe_to_spend_left = 0` next to
`fun_floor_left = 5000` when the real safe-to-spend was 5000.

Decision: **report fun money as one number, while keeping the floor as an input.**
`apply_spending` keeps `fun_floor_cents` as a separate parameter (it is 0 when the
user sets no floor), so its call signature is unchanged, but it no longer returns a
separate `fun_floor_left`: it drains the floor and the discretionary part as one pot
and returns a single `safe_to_spend_left` = floor-left + discretionary-left.
`cycle_summary` and `current_cycle_summary` likewise drop the `fun_floor_left`
column and output one `safe_to_spend` that already includes the floor. The amounts
are unchanged (still floor plus discretionary); only the reporting is unified, so
every layer shows one honest safe-to-spend. The cascade order (fun money, then
savings, then bills, then food and rent) is unchanged.

`allocate_cycle` and `cycle_allocations` are left as they are: they still expose the
funding split (including `fun_floor_funded`) for the gross-plan view. Only the
after-spending reporting is merged.

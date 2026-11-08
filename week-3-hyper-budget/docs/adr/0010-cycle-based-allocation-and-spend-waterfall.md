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
  `cycle_allocations`) and is computed on read, consistent with both.

# ADR 0012: Keep both cycle_allocations and cycle_summary

Status: accepted
Date: 2026-11-09

## Context

`cycle_summary` (Stage 2) groups income by cycle and runs `allocate_cycle`, the same
first step as `cycle_allocations` (Stage 1), and then also applies spending. So the
two share their grouping-and-allocating logic. We considered dropping
`cycle_allocations` to avoid that duplication.

## Decision

Keep **both** functions, because they answer different questions:

- **`cycle_allocations`** gives the **gross plan**: how a cycle's income is split into
  buckets, before any spending.
- **`cycle_summary`** gives the **net reality**: what is left after spending is
  applied.

We weighed the drawbacks of dropping `cycle_allocations`, losing the standalone plan
view, losing a funding-only test and debug surface, a create-then-drop in the
migration history, and a broken saved query, against the small cost of the duplicated
grouping logic, and chose to keep both.

## Alternatives considered

- **Drop `cycle_allocations`; add gross columns to `cycle_summary` if a plan view is
  ever needed.** Less code and a single source, but it removes the ready plan view and
  the isolated funding test surface. Rejected for now.

## Consequences

- Good: a clear plan view and a clear net view, each independently testable; the
  funding step can be checked without spending in the way.
- Cost: the group-income-and-allocate step lives in two functions, so a change to the
  cycle rule must be made in both. Watch-point: if they ever drift, consolidate (fold
  the plan columns into `cycle_summary`) at that time.

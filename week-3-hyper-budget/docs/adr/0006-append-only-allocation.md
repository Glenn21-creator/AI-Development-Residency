# ADR 0006: Allocation recorded as append-only events

Status: accepted
Date: 2026-11-07

## Context

Allocation splits each deposit into jars (essentials, bills, savings, fun) in a
fixed order. It is a decision made at a point in time, and it depends on the state
and the rules in force when the deposit landed. Users can change their rules (for
example the savings amount) later.

## Decision

Record each deposit's split as append-only allocation events, capturing the
amounts and the rule in force at the time. A later rule change applies only to
future deposits; it never retroactively re-slices past, already-budgeted money.

## Alternatives considered

- Derive allocation on read from the current rules. Simpler in row count, but a
  rule change would retroactively rewrite past deposits, pulling money out of the
  fun jar after the fact. For users who may have already spent that fun money,
  this is a demoralising surprise and, for the ADHD audience, a reason to quit.

## Consequences

- Good: history is preserved with a clear audit trail; rule changes do what the
  user means (going forward); consistent with the append-only ledger.
- Cost: more rows; each deposit computes and stores its split at insertion time.

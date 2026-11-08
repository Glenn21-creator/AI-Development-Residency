# ADR 0011: Savings cushion as append-only cycle locking

Status: accepted
Date: 2026-11-09

## Context

The savings cushion should grow from the savings the user actually sets aside each
cycle, honestly, and past savings must not be re-sliced when the user later changes
their savings rule. An interim Savings tab tracked the real savings-account
balance, which cannot grow in the sandbox and ignores the user's set-asides, so it
does not reflect "money I have committed to saving".

## Decision

- The cushion is the sum of append-only **lock** events, one per completed cycle,
  each capturing the savings that survived that cycle's overspending. An empty
  cycle (income never reached savings) locks nothing.
- Locking is **compute-on-open**: when the user opens the app, any cycles completed
  since their last visit are locked, idempotently (a cycle is never locked twice).
- The cushion shown = sum of locked cycles **plus** the current cycle's provisional
  (not-yet-locked) savings, computed on read.
- The lock is **virtual** (a ledger event), not a real bank transfer; the real
  savings account stays separate and is shown as a connected account.
- This **supersedes** the interim Savings tab that used the real savings-account
  balance as the cushion.

## Alternatives considered

- **Track the cushion from the real savings-account balance.** Honest for real
  money, but cannot reflect the user's set-asides and is dead in the sandbox.
  Rejected as the cushion source; real accounts are still shown separately.
- **Derive the whole cushion on read from the current rule.** A rule change would
  retroactively re-slice every past cycle (the derive-on-read problem). Rejected,
  per ADR 0006.
- **A scheduled job to lock at each cycle-end.** More infrastructure, and it fails
  if nothing runs it. Chose compute-on-open instead, which also catches up multiple
  missed cycles.

## Consequences

- Good: the cushion grows honestly from real set-asides; append-only and
  re-derivable, so it cannot silently drift; past cycles are frozen (rule changes
  apply going forward); no scheduled job needed.
- Relationship to ADR 0005: the current cycle stays computed on read; locked cycles
  are crystallised append-only events, consistent with ADR 0006 and with the
  re-derivable cache that ADR 0005 explicitly allows.
- Cost: needs careful "last locked cycle" bookkeeping; needs simulated multi-cycle
  data to test; implementation is pending (Stage 3).

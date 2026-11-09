# ADR 0013: Disconnecting a bank removes synced data, keeps the person's own data

Status: accepted
Date: 2026-11-09

## Context

Dogfooding surfaced a gap: a person could connect a bank but never unlink it. We
added a disconnect, which forced a decision about exactly what disconnecting should
remove and what it should keep. This matters for privacy (people should be able to
remove their bank data on request, per `gdpr-privacy`) and for not destroying the
person's own setup.

## Decision

Disconnecting deletes the `bank_connections` row, which **cascades** to that
connection's `accounts` and their `transactions`. So all **bank-provided (synced)
data is removed.**

It **keeps**:
- The person's own settings: `profiles` (pay frequency, currency), `buckets`, and the
  `savings_goal`. These are things the person set, not the bank's data.
- The append-only savings cushion (`savings_locks`). It is append-only by design (ADR
  0011), so it is never deleted; it records what the person had saved.

Reconnecting re-pulls accounts and transactions, and the cushion locking is
idempotent per cycle, so a disconnect then reconnect restores the synced data without
double-counting.

## Alternatives considered

- **Wipe everything on disconnect** (buckets, goal, cushion too). Too destructive: it
  throws away the person's own setup and saved history for what is really just
  "unlink my bank". Rejected.
- **Soft-disable the connection without deleting the data.** Leaves the synced bank
  data sitting in the database when the person asked to remove it, which is worse for
  privacy and data minimisation. Rejected.

## Consequences

- Good: real user control and data minimisation, the bank data is removed on request
  (GDPR-aligned); the person's setup and saved cushion survive a disconnect and a
  reconnect; the append-only guarantee is preserved.
- Cost: while disconnected, Home has no accounts so it falls back to sample figures,
  and the cushion shows only the frozen locked total with no current cycle. This is
  acceptable and self-heals on reconnect.

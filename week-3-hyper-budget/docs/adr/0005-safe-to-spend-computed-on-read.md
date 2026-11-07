# ADR 0005: Safe-to-spend computed on read over an append-only ledger

Status: accepted
Date: 2026-11-07

## Context

The safe-to-spend number is the heart of the product. If it is ever wrong, trust
is lost. A stored (cached) number is fast to read but can silently drift out of
sync if any update is missed or applied twice.

## Decision

Compute safe-to-spend on read, fresh from an append-only ledger of transactions.
Do not store a cached value. Money is stored as whole minor units (cents), with a
currency, never floating point, and rounded once at the end.

## Alternatives considered

- Cache the number in a column and keep it current with database triggers. Faster
  reads, but two sources of truth and real risk of silent drift, which is
  unacceptable for money.

## Consequences

- Good: always correct by construction, cannot drift, simple to reason about and
  test.
- Cost: recomputed on each read (fine at MVP scale; schema is designed to keep
  reads cheap). If very large scale ever demands it, a cache can be added later,
  derived from this same canonical function so it stays re-derivable.

# ADR 0004: Money logic runs in Supabase (SQL)

Status: accepted
Date: 2026-11-07

## Context

The money math (safe-to-spend, allocation, due-versus-covered) has to run
somewhere trusted. The builder knows SQL well and prefers the math to run close
to the data, enforced together with the privacy wall.

## Decision

Run the pure money math in Supabase as SQL (functions and views). Run only the
outside-world work (Google login handshake, bank data, sending push) as Next.js
server code, because SQL cannot reach the outside world.

## Alternatives considered

- Put all logic in the Next.js app layer and treat Supabase purely as storage.
  Simpler in one language, but the math sits further from the data and separate
  from the privacy wall.

## Consequences

- Good: the math and the privacy wall live in one place, close to the data; fits
  the builder's SQL skill; less data shuffled to the app layer.
- Cost: logic is split across SQL and app code; testing SQL uses a different
  toolchain; all database logic must live in version-controlled migration files.

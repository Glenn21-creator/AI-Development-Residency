# ADR 0007: Row-Level Security as the privacy wall

Status: accepted
Date: 2026-11-07

## Context

The app holds many people's financial data. Each person must only ever be able to
read or change their own data, and this guarantee must hold even if the app code
has a bug.

## Decision

Enforce access with Supabase Row-Level Security: every table holding personal data
carries a user id and an RLS policy allowing a person to touch only their own
rows. The browser uses only the public key (safe behind RLS); the secret master
key, which bypasses RLS, stays server-side.

## Alternatives considered

- Rely on access checks in app code only. One missed check leaks another person's
  data, with no deeper backstop.

## Consequences

- Good: access is enforced at the deepest level, independent of app-code
  correctness; pairs naturally with running the money logic in the database.
- Cost: policies must be written and maintained per table and tested; the
  service-role key must be guarded carefully and never shipped to the browser.

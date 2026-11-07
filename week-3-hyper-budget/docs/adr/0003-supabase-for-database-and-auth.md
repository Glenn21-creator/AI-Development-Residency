# ADR 0003: Supabase for database and auth

Status: accepted
Date: 2026-11-07

## Context

The app needs a database, user login, a way to keep each person's data private,
and safe secret storage. The builder knows SQL well. The Week 4 assignment sets
the stack.

## Decision

Use Supabase for the database (Postgres), authentication, Row-Level Security, and
secret storage (Vault).

## Alternatives considered

- Firebase. A strong option, but a non-relational model, and the builder's SQL
  skill fits Postgres better.
- A custom backend and database. Far more to build and secure for a first app.

## Consequences

- Good: real Postgres (the SQL the builder knows), built-in Auth, Row-Level
  Security for the privacy wall, Vault for secrets, and a free tier to start.
- Cost: some vendor lock-in and learning Supabase's conventions.

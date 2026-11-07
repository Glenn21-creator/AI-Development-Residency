# ADR 0008: Open-banking sandbox for bank data

Status: accepted
Date: 2026-11-07

## Context

The app needs income and transactions to work. This is a practice project that
must never touch real money or real bank credentials. Manual setup is where ADHD
users give up, so automatic linking is the core promise.

## Decision

Connect through a European open-banking provider's free sandbox (fake test
accounts only). Automatic linking is the main path; manual entry is a quiet
backup. The provider's hosted screen handles the bank login, so we never see
credentials. The per-user access token is stored encrypted in Supabase Vault. We
request read-only access, treat provider data as untrusted, and prevent
duplicates with the provider's unique transaction id. The bank-calling code is
Next.js server code.

## Alternatives considered

- Manual entry only. Safe, but it makes the app the chore the product is meant to
  remove.
- Real open banking / production data. Out of scope and an unnecessary risk for a
  practice project.

## Consequences

- Good: safe to build and demo, builds the real habits, and keeps the
  automation-first promise.
- Cost: sandbox (fake) data only; provider integration work; careful token
  security required.

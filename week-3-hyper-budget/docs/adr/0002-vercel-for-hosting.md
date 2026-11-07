# ADR 0002: Vercel for hosting

Status: accepted
Date: 2026-11-07

## Context

The app needs to be hosted and deployed with as little operations work as
possible, by a new developer. The Week 4 assignment sets the stack.

## Decision

Host the Next.js app on Vercel.

## Alternatives considered

- Other hosts (for example Netlify) or self-hosting. Possible, but more setup and
  less tight integration with Next.js.

## Consequences

- Good: first-class Next.js support, push-to-deploy, automatic HTTPS, and a
  built-in scheduler (Vercel Cron) we use for push reminders.
- Cost: some vendor lock-in, and serverless function limits (for example run-time
  limits) to design around for long jobs.

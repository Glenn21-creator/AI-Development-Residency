# Project rules for Claude

This project is Hyper Budget, an ADHD budgeting app. The skills in
.claude/skills hold the rules for how to build it. Use the relevant ones for
every task, and run any pre-delivery checks a skill lists before showing me the
result. If a skill clearly does not relate to a task, you may skip it, but say
which you skipped and why.

## Always check these

- mvp-scope: before building any feature, confirm it is in scope and in the
  right build order.
- dev-workflow: for any coding task, build in small, tested steps.
- testing: decide what to test first (money math and data safety).

## When the task touches the screen or any user-facing text

- adhd-ux-guidelines: calm, kind, ADHD-friendly screens and copy.
- mobile-accessibility: screen readers, large text, reduced motion, contrast.
- ux-best-practices: general UX, light theme, clear errors.
- accessibility: WCAG 2.2 AA and inclusive design.
- reminders-and-notifications: when the task is a nudge, alert, or reminder.

## When the task touches money math

- safe-to-spend-math: the safe-to-spend number, buckets, bills, savings.

## When the task touches data, bank links, or security

- open-banking-sandbox: bank linking and transactions (sandbox only).
- local-data-and-sync: on-device storage, offline, syncing, duplicates.
- device-security: app lock, biometrics, hiding balances.
- secrets-and-api-keys: keys and tokens, never in code or git.
- gdpr-privacy: consent, data export, deletion, data minimisation.
- security: OWASP, encryption, authentication.

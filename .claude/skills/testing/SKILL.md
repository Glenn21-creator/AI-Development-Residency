---
name: testing
description: Use this skill whenever you write or change code in Hyper Budget and whenever you decide what to test. It sets what to test first (money math and data safety), and how to test it. Follow it so the parts that would break trust, the numbers and the data, are proven correct before anything else.
---

# Hyper Budget: Testing

Testing is how we prove the app does what it should, especially the parts that
would break trust if they were wrong. For a money app the order matters: test the
money math and data safety first, then everything else. The user is new to
development, so this skill keeps testing practical and focused.

## Test these first (highest priority)

### 1. Money math

Nothing matters more than the numbers being right. Write automated tests for:

- The safe-to-spend calculation in normal cases.
- Allocation order: essentials floor first, then bills, then protected buckets,
  then fun, then safe-to-spend. See `safe-to-spend-math`.
- Bill set-asides, including when income arrives in parts.
- Every edge case in `safe-to-spend-math`: negative balance or essentials not
  covered (safe-to-spend is 0, never negative), irregular and lumpy income,
  pending transactions, refunds and reversals, an overspent bucket.
- Money stored as integer minor units or a money type, never floating-point, and
  rounding done once, consistently.

### 2. Data safety

Losing or doubling a user's data breaks trust just as badly. Test:

- No duplicate entries from repeated taps (idempotency keys, debounced buttons).
  See `local-data-and-sync`.
- A change made offline is neither lost nor duplicated when it syncs.
- Sync conflicts resolve by the chosen rule and never silently drop a user's
  entry.
- The same charge never reduces safe-to-spend twice.
- A write is confirmed before the user is told it is saved; local data is not
  cleared until the server confirms.

## Then test the rest

- **Security basics:** tokens and secrets are not in code or logs; data is
  encrypted at rest and in transit; auth and sessions behave (see `security`,
  `secrets-and-api-keys`, `device-security`).
- **Bank connection:** linking in the sandbox, token refresh, and a broken
  connection leading to a gentle reconnect (see `open-banking-sandbox`).
- **Accessibility:** run the checks in `mobile-accessibility` (screen reader,
  large text, reduced motion, contrast, keyboard and focus) on every screen.
- **UX and tone:** no shame language, no streaks, one main choice per screen,
  kind errors, a gentle return after a gap (see `adhd-ux-guidelines`).
- **Notifications:** gentle, useful, not naggy, controllable (see
  `reminders-and-notifications`).
- **Privacy:** export and delete work, consent is real, data minimised (see
  `gdpr-privacy`).

## How to test

- **Automated tests for logic**, especially money math and data safety. These run
  every time, so a future change cannot quietly break them. This is where most of
  the testing effort goes.
- **Write the test with the feature,** not long after. For money math, writing the
  test first (what the right answer is) helps get the rule right.
- **Test the edge cases on purpose,** not just the happy path. List them from the
  skill, then write one test each.
- **Manual testing for feel and flow:** walk through the screen as a user, check
  the tone, the layout, and that it is calm and clear.
- **Accessibility testing by hand** as well as automated, because tools catch only
  part of the picture.
- **Test on a real device size** (phone first), and with the connection turned off
  for offline behavior.

## Before calling work done

- The money-math and data-safety tests exist and pass.
- The edge cases are covered, not just the normal case.
- The relevant pre-delivery checks (security, accessibility, UX) have been run,
  with a short note of the result.
- Any test skipped or any risk left open is stated plainly, not hidden.

Keep tests small and clear, named so it is obvious what they check. A new
developer should be able to read a test and understand the rule it protects.

Related: `safe-to-spend-math`, `local-data-and-sync`, `dev-workflow`, `security`,
`mobile-accessibility`, `adhd-ux-guidelines`.

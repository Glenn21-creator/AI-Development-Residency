# ADR 0014: New-user flow is welcome, buckets-first, then connect on Home

Status: accepted
Date: 2026-11-13

## Context

The first version sent a new person straight from sign up into Home, and gated Home
behind connecting a bank (a separate `/start` page). Two problems surfaced:

- People never chose their buckets; they landed on buckets that looked pre-set, which
  is confusing and not really "theirs".
- There was no first-run welcome, so a new person had no idea what the app was about
  to ask of them. First-run onboarding is an MVP item (`mvp-scope`).

## Decision

The new-user path is, in order:

1. **Welcome (`/`)** — the public landing, now showing the brand logo.
2. **Sign up** — a new account is routed to the first-run welcome.
3. **Onboarding welcome (`/onboarding`)** — one calm screen: logo, a plain three-step
   explanation, one primary action. Shown only while the person has no buckets; once
   they do, it redirects to Home.
4. **Set your buckets (`/buckets`)** — the person sets the amounts themselves. Food &
   rent, bills, and savings are required; the minimum fun money is optional. The
   bottom tabs are hidden during this first-time setup so there is one clear path.
5. **Home (`/home`)** — if no bank is linked, Home itself shows a calm "Connect your
   bank" card in place of the numbers. The old `/start` gate is removed.

Home enforces the order: no buckets redirects to `/onboarding`; the connect step is a
prompt on Home, not a gate before it.

## Alternatives considered

- **Keep connect-first (`/start` before Home).** Made bank linking the very first
  thing, before the person had set up anything of their own, and hid the empty Home
  behind a separate page. Replaced by the connect card on Home. Rejected.
- **Explain inside the buckets screen (no separate welcome).** Fewer screens, but it
  crowds the setup screen and loses the calm "here is how it works" moment. Rejected
  in favour of one dedicated welcome screen.
- **A multi-step onboarding carousel.** More explanation, but more to build and more
  taps; against the one-clear-step principle for the MVP. Deferred.

## Consequences

- Good: the person owns their buckets from the start; a calm welcome sets
  expectations; Home is reachable with buckets but no bank, which also makes manual
  testing (Add income / Add a transaction) possible before connecting.
- Cost: one more screen in the new-user path, and the flow order now lives in route
  redirects (sign up to `/onboarding`, Home to `/onboarding` when no buckets), which
  must stay consistent. Documented here so the order is not quietly changed.
- Testing: two in-app testing tools support this flow (clear history keeping the bank;
  reset to a new user), so the onboarding path can be re-walked without hand-written
  SQL.

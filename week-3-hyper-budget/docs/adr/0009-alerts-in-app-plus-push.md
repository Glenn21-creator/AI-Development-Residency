# ADR 0009: Alerts as in-app plus push in the MVP

Status: accepted
Date: 2026-11-07

## Context

The app sends gentle nudges (bill reminders, 50% and 80% thresholds, flag-only
subscription spots, small wins). In-app alerts always work but only when the app
is open. Push reaches people when the app is closed, but it is heavier to build on
the web and does not reach iPhone users in a browser tab unless the app is
installed to the home screen.

## Decision

Build both in the MVP. In-app nudges are computed on read and self-clearing
(shown while the app is active and listed on the Alerts tab). Push fires while the
app is inactive, adding a service worker, per-device push subscriptions, VAPID
keys (private key a server secret), a Vercel Cron scheduler, and an append-only
sent-log so nothing nags twice. Quiet hours are respected, each type can be turned
off, and no balance amounts appear on the lock screen. The two surfaces are routed
so the same event never alerts twice.

## Alternatives considered

- In-app alerts in the MVP, push as an immediate fast-follow. Lower risk under the
  deadline, but inactive-period reminders would not fire at submission.

## Consequences

- Good: the full alerts model ships at launch.
- Cost: meaningful extra work under the deadline; the iPhone-in-browser reach gap
  remains (in-app covers those users). Push is the cleanest piece to defer to a
  fast-follow if the crunch tightens.

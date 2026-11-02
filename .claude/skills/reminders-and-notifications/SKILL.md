---
name: reminders-and-notifications
description: Use this skill whenever you build or change reminders, push notifications, alerts, or nudges in Hyper Budget, including bill reminders, threshold alerts, pre-purchase nudges, and pace-based alerts. It sets how to make nudges gentle, well-timed, and helpful, never nagging. Follow it for any message the app sends to get the user's attention.
---

# Hyper Budget: Reminders and notifications

Notifications are how Hyper Budget helps at the right moment, but they are also
the fastest way to feel naggy and get turned off. For ADHD users carrying money
shame, a harsh or badly timed alert can push them to avoid the app entirely. The
goal: gentle, useful, well-timed nudges that the user is glad to get.

## Core rules

- **Be kind, never scolding.** A notification uses the same shame-free tone as the
  rest of the app. No blame, no alarm, no guilt. See `adhd-ux-guidelines`.
- **Be useful, not just noisy.** Every notification helps the user do or decide
  something. If it does not help, do not send it.
- **Time it to be actionable.** A nudge before a moment that matters beats a
  report after the money is gone.
- **Do not nag.** Never repeat the same alert over and over. One clear, gentle
  message, not a stream.
- **Respect quiet hours.** Do not send non-urgent notifications late at night or
  at unreasonable times. Batch low-urgency items into a sensible moment.
- **Let the user control it.** Easy, granular settings to choose which
  notifications they get, and an easy way to turn any of them off. Honor the
  device notification settings too.

## The kinds of nudges and how to pitch them

**Early bill reminders (MVP).**

- Remind ahead of a due date, early enough to act, and reassure if the money is
  already set aside ("Your electricity bill is due Friday. It is already covered.").
- Do not remind repeatedly for the same bill. One gentle heads-up is enough.

**Threshold alerts at 50% and 80% (MVP).**

- Let the user know a bucket is filling up, calmly and as information, not a
  warning. For example "You have used 80% of your fun money this week. Essentials
  and bills are safe."
- Lead with what is still safe, so the message reassures rather than alarms.

**Pre-purchase nudges (MMP, within a real limit).**

- The app cannot reliably know about a purchase before it happens, so it cannot
  literally stop a checkout. Do not pretend it can.
- Instead, nudge at moments that matter based on the user's own patterns, and rely
  on money already being bucketed so only safe-to-spend money is available.

**Pace-based alerts on high-risk days (MMP).**

- Learn each user's spending patterns and send one gentle heads-up ahead of a
  predictable high-risk day (for example payday), framed as support, not warning.
- This needs real spending history, so it comes later (see `mvp-scope`).

**Gentle re-entry after a gap (MMP, with MVP groundwork).**

- When a user returns after being away, welcome them back warmly. Never a pile of
  missed alerts or a guilt message. See `adhd-ux-guidelines`.

**Small wins.**

- Light, occasional positive notifications (a bill paid on time, a goal reached).
  No streaks, no pressure to keep a chain going.

## What not to do

- No streaks, chains, or "do not break your run" messages.
- No fake urgency, countdowns, or pressure to spend or act.
- No shaming language ("You overspent again").
- No flood of notifications; no repeating the same nudge.
- No sensitive detail in a notification that shows on a lock screen (for example
  avoid putting exact balances in the preview). See `device-security`.

## Privacy and security

- Keep personal and financial detail out of notification text that could appear
  on a locked screen.
- Do not send data to a third party to deliver notifications beyond what is
  needed, and follow `gdpr-privacy`.

## Quick pre-delivery check

- Every notification is kind, useful, and actionable.
- Nothing nags, repeats, or uses streaks or pressure.
- Timing is helpful and respects quiet hours.
- The user can control and turn off notifications easily.
- No sensitive detail leaks onto a lock screen.

Related: `adhd-ux-guidelines`, `mvp-scope`, `device-security`, `gdpr-privacy`.

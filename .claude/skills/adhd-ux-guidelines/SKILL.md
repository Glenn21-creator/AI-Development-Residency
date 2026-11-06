---
name: adhd-ux-guidelines
description: "Use this skill whenever you design or build anything the user sees or reads in Hyper Budget: screens, flows, copy, alerts, empty states, errors, and celebrations. It sets the calm, kind, ADHD-friendly rules (one main choice per screen, no shame language, no streaks, gentle fresh starts) and folds in the UX and accessibility basics. Follow it for every piece of interface."
---

# Hyper Budget: ADHD-friendly UX guidelines

Hyper Budget is built for people with ADHD, many carrying years of money shame.
The feel of the app is part of the product, not decoration. Every screen should
feel calm, kind, and easy, and should keep working with the user even after they
fall off. This skill covers how things look, read, and feel. For code-level
accessibility testing, pair it with `mobile-accessibility`.

## The feelings we are designing for

- **Calm, not alarming.** Money is already stressful. The app lowers the
  temperature.
- **Kind, never blaming.** The user is not bad with money; their brain works
  differently. The app never makes them feel worse.
- **Easy, not effortful.** Low setup, near-zero upkeep. The app does the work.
- **Forgiving.** Falling off is normal and expected. Coming back is always
  welcome.

## Core rules (apply to every screen)

### One main choice per screen

- Each screen has a single clear primary action, and it is the most prominent
  thing on it.
- Secondary actions are visually quieter (outline or text buttons).
- Do not crowd a screen with options. Fewer choices means faster, calmer
  decisions.
- Break multi-step tasks into small steps, one decision at a time, with clear
  progress (for example "step 2 of 3").

### No shame language, ever

- Never blame, scold, or warn harshly. No "You overspent again," no red
  "FAILED," no guilt.
- Replace judgment with facts and a next step. For example, instead of "You blew
  your budget," say "Your fun money is used up for this week. Essentials are safe."
- Keep a warm, plain, human tone everywhere: alerts, errors, empty states.
- A shortfall or over-threshold moment is the most important place to be kind,
  because that is where shame-driven users quit and avoid the app.

### No streaks, no punishment

- Do not use streaks, chains, or anything that can be "broken." A broken streak
  punishes exactly the user we are serving.
- Celebrate real wins lightly (a bill paid on time, a bucket funded), without
  making the next day feel like pressure.
- Never take a celebration away or mark a lapse as a failure.

### Gentle fresh starts

- The app keeps running even when the user disappears for weeks. Nothing is lost.
- When they return, welcome them back warmly. No pile of red, no "Where have you
  been," no catch-up chores.
- Treat a break as normal. Show the current state simply and offer one easy next
  step.

## Making money feel safe to look at

- Offer bite-sized check-ins instead of a daunting full review.
- Lead with what is safe and covered, not with what went wrong.
- Let the user see their money without dread. The first thing they see should
  reassure, not alarm.
- Allow balances to be hidden when the user wants (see `device-security`).

## Dopamine-friendly feedback (without manipulation)

- Give clear, satisfying feedback for good actions: a bucket fills, a goal moves,
  a bill is handled.
- Show progress toward goals, since nearing a goal is motivating.
- Keep it honest. Never use attention tricks to push a choice that helps the
  business over the user. No fake urgency, no pressure, no dark patterns.

## Visual and layout basics

- **Light theme by default.** Light backgrounds, dark text. Do not use a dark
  theme or switch automatically. Only add dark mode if the user asks, and keep
  light as the default.
- Use a consistent type scale (body text at least 16px), consistent spacing (a
  4 or 8px scale), and the same component looking the same everywhere.
- Keep the primary action in the same place across screens.
- Use at-a-glance visual cues (for example a simple traffic-light style status)
  so the state is clear in a glance, but never rely on color alone: pair color
  with text or an icon.
- Keep each screen tidy. Remove anything that does not help the current task.

## Clear, kind errors

- Say what happened, why, and how to fix it, in plain language. No codes or
  jargon.
- Never blame the user. Keep the tone calm and helpful.
- Keep what the user typed; never clear a form on error.
- Show the error next to the field it belongs to, and pair it with an icon and
  text, not just color.

## Quick pre-delivery check for any screen

Before showing a screen as done, confirm:

- One clear primary action, and the calmest path is the obvious one.
- No shame, blame, streaks, or punishment anywhere in the copy or states.
- A returning-after-a-gap user is welcomed, not confronted.
- Light theme, consistent type and spacing, color never the only signal.
- Errors are plain, kind, and keep the user's input.
- Runs the `mobile-accessibility` checks (keyboard, screen reader, contrast,
  target size, reduced motion).

Related: `mobile-accessibility`, `reminders-and-notifications` (gentle nudges),
`device-security` (hiding balances), `safe-to-spend-math` (showing a shortfall).

---
name: mvp-scope
description: Use this skill whenever you are deciding whether a feature belongs in Hyper Budget now or later, or when a request risks adding work beyond the agreed scope. It is the gatekeeper for what to build first (MVP), what to build at launch (MMP), and what to say no to for now. Check it before writing any feature code so the build stays inside the approved plan.
---

# Hyper Budget: What belongs in version one vs later

Hyper Budget is a mobile-first budgeting app for people with ADHD. The one
question this skill answers: "Is this feature in scope right now, and if so,
which release?"

The scope below comes straight from the approved Product Release Vision and the
Epics, Roadmap, and Backlog. Do not add features that are not listed here. If a
request falls outside this list, stop and ask the user before building it.

## The two releases

- **MVP (build first).** The smallest version that tests the core bet: can an
  automatic, shame-free, low-upkeep system keep ADHD users who quit everything
  else. Built across roadmap weeks 1 to 5.
- **MMP (build at launch).** The smallest version good enough to launch in
  public and hold its own against YNAB, Revolut, and Rocket Money. Built weeks 6
  to 8, after a validation checkpoint.

Everything else is "later" or "not building." When in doubt, it is later.

## MVP: build these first

Core engine and data:

- Automatic bank sync (connect through Plaid or open banking)
- Pull and auto-categorize transactions
- Keep bank connections alive, with a gentle reconnect when one breaks
- Sign-up, login, and secure sessions
- Encrypt and safeguard financial data; document the compliance baseline
- First-run onboarding that reaches first value fast (built late in the MVP)

The ADHD money mechanics:

- Automatic allocation: income splits into buckets the moment it lands
- A protected food-and-rent floor funded before any spending money
- Bill buckets: set money aside for upcoming bills automatically
- A guilt-free fun bucket inside allocation
- A real-time safe-to-spend number
- A "what is due versus what is covered" view
- Threshold alerts at 50 percent and 80 percent of a bucket spent
- Early bill reminders
- Forgotten-subscription flagging (flag only, not cancel)
- Basic savings goal (start and track one simple cushion goal)

The tone and feel:

- A shame-free copy system used across the whole app
- Bite-sized check-ins instead of daunting reviews
- Small wins: light celebrations (for example a bill paid on time), no streaks
- A gentle re-entry message after a gap

## MMP: build at launch, not before

- Emergency cushion auto-save (save a set amount when income lands, show progress)
- Partner sharing: optional shared view, a private fun bucket each, a heads-up
  before a purchase pushes over the agreed budget
- Subscription cancellation help (one-tap cancel, going beyond flagging)
- Pace-based alerts: learn each user's patterns, warn before high-risk days
- Forgiving re-engagement and coaching through a restart
- A shame-free AI chatbot for check-ins and coaching
- Fuller rewards for steady progress

Two MMP items depend on real usage data and must come last: pace-based alerts
(needs spending history) and forgiving re-engagement (needs real lapse-and-return
behavior). The other MMP items can start as soon as the MMP build begins.

## Not building (for this release)

Say no to these, even if asked, unless the user changes the plan on purpose:

- Investment or net worth tracking
- Bill negotiation (Rocket Money's paid service)
- Multi-input capture (voice, receipt, chat logging): later only, and only if
  Europe becomes the target
- Multi-currency and open banking beyond the sandbox: later only, same condition
- The app issuing its own card or bank account (very large scope increase)
- Location-based (geofencing) nudges (off by default, privacy and tone risk)

## How to use this skill

1. Take the requested feature and find it in the lists above.
2. If it is MVP, confirm nothing it depends on is missing (for example, bank
   sync and allocation must exist before safe-to-spend can show anything).
3. If it is MMP or "not building," say so plainly and do not build it now.
   Offer to note it for later instead.
4. If it is on none of the lists, do not guess. Ask the user whether it is in
   scope before writing any code.

## Dependencies that set the order

Build in this order because each piece needs the one before it:

1. Bank data (sync, transactions, categories) first. Everything reads from it.
2. Security and compliance right behind it. No real money data without it.
3. Automatic allocation before safe-to-spend. Safe-to-spend is the money left
   after allocation, so it has nothing to show until bucketing works.
4. Alerts after allocation and categorization, since they read both.
5. Onboarding late, because people are onboarded into features that exist.

Related: see `dev-workflow` for how to build each item in small steps, and
`safe-to-spend-math` for the core number's rules.

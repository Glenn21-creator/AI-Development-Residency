# Hyper Budget: MVP v2 scope (revised 2026-11-16)

A short summary of the revised MVP scope, why it changed, and the direction for the
KPIs. The full detail lives in the `mvp-scope` skill and in PROGRESS.md.

## Why the scope was revised

Building the MVP, rather than only planning it, surfaced that several features I had
placed in the MVP were too heavy for a first version and did not change the minimal
test of the core bet. This is a deliberate re-scope, recorded as a choice, not drift.

## The core bet (unchanged)

Can an automatic, shame-free, low-upkeep system keep ADHD users who quit everything
else? The minimal version that tests this is a trustworthy, real-time "safe to spend"
number produced by automatic allocation, wrapped in a calm, non-judgmental tone.

## In the MVP

Most of this is already built and working:

- Automatic bank sync through an open-banking sandbox (TrueLayer)
- Pull and auto-categorise transactions by the bank's own label
- Sign-up, login, and secure sessions
- Data safeguards: Row-Level Security and database encryption
- First-run onboarding that reaches first value quickly
- Automatic allocation of income into buckets the moment it lands
- A protected food-and-rent floor funded before any spending money
- A simple bills bucket (a lump amount set aside each cycle)
- A guilt-free fun bucket
- A real-time safe-to-spend number
- Fun-money threshold nudges at 50 and 80 percent
- A basic savings goal with progress
- Shame-free copy across the app

Still to build, both small and both serving retention:

- One light, calm celebration for a small win
- A gentle "welcome back, here is where you stand" message after a gap

## Deferred out of the MVP

Moved to MMP (the launch version):

- Dated bills with due dates, early bill reminders, and a full "due versus covered"
  view. All three need a dated-bills subsystem (due dates, a scheduler, reminder
  logic). The simple bills bucket already protects the money for the MVP.
- Per-bucket threshold alerts at 50 and 80 percent of every bucket. The fun-money
  nudge already covers the moment that matters most.

Moved to later:

- Forgotten-subscription flagging (needs recurring-transaction detection)
- Push notifications (in-app nudges are enough for the MVP; push is delivery
  infrastructure)
- Automatic bank-connection keep-alive with a stored token (manual reconnect is enough
  for a sandbox MVP)

## Revised KPIs (direction)

The original KPIs were set before building and turned out to be unrealistic for a
sandbox MVP tested with a small number of people. Realistic MVP KPIs should measure
whether the core bet holds, not adoption at scale. Suggested direction (adjust the
exact numbers to the test group):

- **Activation:** a first-time user can sign up, set their buckets, connect the
  sandbox bank, and find their safe-to-spend number without help. Target: most testers
  complete it unaided.
- **Comprehension:** the user can correctly explain what the safe-to-spend number
  means and why it is that amount. Target: the large majority understand it.
- **Trust:** the numbers feel right to the user and never claim money is safe when it
  is not. Target: no "false confidence" moments in testing.
- **Retention intent:** after the session, the user says they would use it on a real
  pay cycle. Target: a clear majority say yes.

These are small-sample, mostly qualitative measures, which fits a sandbox MVP whose
job is to validate the bet before any public launch.

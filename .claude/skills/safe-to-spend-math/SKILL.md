---
name: safe-to-spend-math
description: Use this skill whenever you build or change anything touching the safe-to-spend number, bucket allocation, the essentials floor, bill set-asides, or savings. It gives the exact rules for calculating safe-to-spend, setting money aside for upcoming bills, and handling hard cases like a negative balance or irregular income. Always follow it for money math so the numbers are correct and trustworthy.
---

# Hyper Budget: Safe-to-spend math

The safe-to-spend number is the heart of Hyper Budget. It is the money a person
can spend right now without putting their essentials or bills at risk. If this
number is wrong, the whole app loses trust. Treat money math as the most
important code in the product.

## The core idea

Money is split into buckets the moment income lands. Essentials and bills are
ring-fenced first. What is left over is the safe-to-spend amount. So the only
money free to spend is already safe to spend.

## The basic formula

```
safe_to_spend = available_balance
              - essentials_floor_remaining
              - bills_set_aside_remaining
              - other_protected_buckets
```

Where:

- **available_balance**: real money in the connected accounts that is settled
  and spendable. Do not count pending or not-yet-cleared amounts as available.
- **essentials_floor_remaining**: the food-and-rent floor still needed for the
  current period.
- **bills_set_aside_remaining**: money still to be held for bills due before the
  next income lands.
- **other_protected_buckets**: savings or cushion buckets the user has marked as
  protected.

Safe-to-spend is what is left after all protected money is removed. It never
includes protected money.

## Rules for the money math (follow all of these)

- **Never use floating-point for money.** Store and calculate money as whole
  minor units (integer cents or pence), or use a decimal type built for money.
  Floating-point causes rounding errors that break trust.
- **Round consistently and only at the end.** Keep full precision through the
  calculation; round once for display. Pick one rounding rule and use it
  everywhere.
- **Track the currency with every amount.** Do not mix currencies in one sum.
- **Allocation order is fixed:** essentials floor first, then bills, then other
  protected buckets, then the fun bucket, then safe-to-spend is whatever remains.
- **Recalculate on every change** that affects it: new transaction, new income,
  a bill paid, a bucket edited. The number must always match reality.
- **Show your working when asked.** The user should be able to see why the number
  is what it is (balance minus what is protected).

## Setting money aside for upcoming bills

- Look ahead to bills due before the next expected income.
- Hold the full amount of each upcoming bill in its bill bucket.
- Fund bill buckets right after the essentials floor, before anything optional.
- If income arrives in parts, set aside a fair share of each bill from each
  deposit so the full amount is ready by the due date.
- When a bill is paid, release that bucket and recalculate safe-to-spend.

## Edge cases (handle every one of these on purpose)

**Negative balance or not enough to cover essentials:**

- Safe-to-spend is **0**, never a negative number shown as if it were spendable.
- Clearly and kindly show that essentials are not fully covered, and by how much.
- Fund essentials in priority order from whatever money exists; do not silently
  pull from the essentials floor to show a positive number.
- Use shame-free wording (see `adhd-ux-guidelines`). This is a stressful moment.

**Irregular or lumpy income (freelancers, gig workers, students):**

- Do not assume a fixed monthly payday.
- Allocate from each deposit as it lands, in the fixed order above.
- For known upcoming bills, set aside a proportional share from each deposit so
  the total is ready in time, rather than assuming one big payday covers it.
- Let the user see what is still unfunded for the period.

**A pending transaction:**

- Reduce safe-to-spend by pending amounts so a person does not spend money twice,
  but do not treat pending money as settled in the balance.

**A refund or reversed transaction:**

- Recalculate cleanly. Return the money to the right bucket, not straight to
  safe-to-spend, if it came from a protected bucket.

**Duplicate transactions (for example a repeated tap):**

- Do not let the same charge reduce safe-to-spend twice. See `local-data-and-sync`
  for how duplicates are prevented.

**A bucket overspent:**

- Hold the overspend against the fun or discretionary bucket, never against the
  essentials floor or a bill bucket.

## Testing this is non-negotiable

Every rule above needs automated tests, including the edge cases. Money math is
the first thing to test in the whole product. See the `testing` skill.

Related: `mvp-scope` (what ships when), `local-data-and-sync` (no double counting),
`adhd-ux-guidelines` (how to show a shortfall kindly).

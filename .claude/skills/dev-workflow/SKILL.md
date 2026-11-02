---
name: dev-workflow
description: Use this skill at the start of any coding task for Hyper Budget and whenever you are about to write, change, or commit code. It sets how to build: in small, testable steps, checking each piece works before moving on. Follow it so nothing is half-built or left broken, which matters most for a money app.
---

# Hyper Budget: How to build, step by step

This skill is about the way we build, not what we build. The goal is simple:
make small changes, check each one works, and never leave the app broken. This
matters more here than usual, because Hyper Budget handles people's money and
the user is new to development.

## The core loop

For every task, repeat this loop:

1. **Understand the task.** Read the matching ticket in the backlog and its
   acceptance criteria. If it is unclear, ask before coding. Confirm the feature
   is in scope with the `mvp-scope` skill.
2. **Plan the smallest step.** Break the task into pieces you can finish and
   check in one sitting. A step should be small enough to explain in one
   sentence.
3. **Build one step.** Write the code for just that step. Do not start the next
   step until this one works.
4. **Check it works.** Run it. Test it by hand and, for anything touching money
   or data, write an automated test (see the `testing` skill).
5. **Commit the working step.** A small, clear commit message. One logical
   change per commit.
6. **Repeat** until the task meets every acceptance criterion.

If a step turns out to be bigger than expected, stop and split it further.

## Rules that keep the app safe to work on

- **Never leave the app broken at the end of a step.** If the app does not run,
  the step is not done.
- **One change at a time.** Do not mix a new feature, a refactor, and a bug fix
  in the same step. They are three steps.
- **Test the risky parts first.** Money math and data safety come before looks.
  See `safe-to-spend-math` and `testing`.
- **Read before you change.** Look at the existing code and match its style,
  names, and patterns. Do not reinvent what already exists.
- **Say what you did.** After each step, in plain language: what you built, what
  you checked, and anything still open. No hiding broken or skipped work.

## Before you start writing a feature

Check the related skills so the step is done right the first time:

- `mvp-scope` to confirm the feature belongs in this release.
- `safe-to-spend-math` for anything touching the safe-to-spend number or buckets.
- `adhd-ux-guidelines` for anything the user sees.
- `mobile-accessibility` for any screen or control.
- `security`, `secrets-and-api-keys`, `device-security`, and `gdpr-privacy` for
  anything touching bank data, accounts, tokens, or personal data.
- `local-data-and-sync` for anything that stores or syncs data.

## Before you call a task done

Run this quick check:

- Every acceptance criterion in the ticket is met.
- The app runs with no new errors.
- Money math and data changes have tests, and the tests pass.
- The pre-delivery reviews for any skill that applies have been run (UX,
  accessibility, security), with a short note of the result.
- You have written a one-line summary of what changed and what is still open.

## Working with a new developer

The user is new to development, so:

- Explain choices in plain words, and pair each technical term with a simple
  translation.
- Prefer the clear, common way to do something over the clever way.
- Show the small steps, do not jump to a finished pile of code with no
  explanation.
- When something could go wrong with money or data, say so plainly rather than
  assuming it is understood.

Keep steps small, keep the app working, and check money and data before looks.

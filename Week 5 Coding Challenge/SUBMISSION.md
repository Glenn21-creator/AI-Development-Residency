# Week 5 Coding Challenge: Submission

## Links

1. **GitHub repository:** https://github.com/Glenn21-creator/AI-Development-Residency
2. **Hosted Vercel app:** https://ai-development-residency-i9m9.vercel.app
3. **Database diagram:** https://github.com/Glenn21-creator/AI-Development-Residency/blob/main/week-3-hyper-budget/docs/database-diagram.md

## Documents

1. **BDD scenarios and test cases:** https://github.com/Glenn21-creator/AI-Development-Residency/blob/main/Week%205%20Coding%20Challenge/test-cases-and-bdd.md
2. **Progress log:** https://github.com/Glenn21-creator/AI-Development-Residency/blob/main/week-3-hyper-budget/PROGRESS.md
3. **Architecture and ADRs:** https://github.com/Glenn21-creator/AI-Development-Residency/tree/main/week-3-hyper-budget/docs/adr

## CI/CD pipeline summary (reference)

The pipeline is defined in `.github/workflows/ci.yml` and runs on every push, with
five checks:

1. **Lint** (`npm run lint`)
2. **Build** (`npm run build`)
3. **Skills gate-check** (`npm run check:skills`) — validates the Claude skills
4. **Security audit** (`npm audit --audit-level=high`)
5. **Database tests** — runs the real `allocate_cycle` and `apply_spending` SQL
   functions against a throwaway Postgres (7 tests, built from the BDD scenarios)

---

## What I Did

<!--
WRITE THIS YOURSELF, IN YOUR OWN WORDS. Do NOT use AI for this section.
At least 2 paragraphs, with full technical detail so anyone can understand exactly
what you did.
-->

_(Write your own two-plus paragraphs here.)_

## What I Learned

<!--
WRITE THIS YOURSELF, IN YOUR OWN WORDS. Do NOT use AI for this section.
At least 2 paragraphs: what you learned, what you would do differently next time,
and how these lessons will help you in team work in the future.
-->

_(Write your own two-plus paragraphs here.)_

---

## Before You Submit, Check These

- [x] Push a change to your repository and watch the checks run on GitHub Actions.
- [x] Break something on purpose, push it, and confirm the pipeline catches it. A check that should fail does fail.
- [x] You have at least 3 new CI checks on your GitHub repository that holds the application code. (There are 5.)
- [x] The Claude Skills you made in Week 1 are checked on every push. (Skills gate-check.)
- [ ] You ran both test case scenarios by hand on your live app and wrote down the results.
- [ ] Your live app still works after your changes.

## To Submit

Email **mdenner@techfleet.org** with this Submission Template and the link to the
GitHub repository.

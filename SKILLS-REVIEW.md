# Hyper Budget: Skills Review

This file is for you to review the 12 Claude Code skills drafted for Hyper Budget.
Each skill lives at `.claude/skills/<skill-name>/SKILL.md`. No app code has been
written yet. Written in plain language, no em dashes.

Every skill is based on the four approved Week 2 deliverables (audience
segmentation, market and competitor analysis, product release vision and scope,
and the epics, roadmap, and backlog). Nothing in the skills contradicts those
documents.

## One-line summary of each skill

1. **mvp-scope** - The gatekeeper for what to build when: the full MVP list, the
   MMP list, the "not building" list, and the build order, all from the roadmap
   and backlog.
2. **dev-workflow** - How to build: small, testable steps, check each works,
   never leave the app broken, explain things plainly for a new developer.
3. **safe-to-spend-math** - The exact rules for the safe-to-spend number, bucket
   allocation, bill set-asides, and every hard case (negative balance, irregular
   income, duplicates, refunds).
4. **adhd-ux-guidelines** - The calm, kind feel: one main choice per screen, no
   shame language, no streaks, gentle fresh starts, plus light theme and honest
   design.
5. **open-banking-sandbox** - Automatic bank linking through a European open
   banking provider's free sandbox (fake accounts only), manual entry as backup,
   automatic as the default.
6. **local-data-and-sync** - Storing data safely on the phone, working offline,
   and syncing without losing or duplicating entries, including from repeated
   taps.
7. **device-security** - App lock, face or fingerprint unlock, auto-lock, and
   hiding balances in the app switcher and on screen.
8. **secrets-and-api-keys** - Never putting keys in the code or git, and safely
   storing and using tokens and bank connections.
9. **gdpr-privacy** - Collect only what is needed, real consent, and letting
   users export or delete their data (built to real standards even with sandbox
   data).
10. **reminders-and-notifications** - Gentle, well-timed, useful nudges that never
    nag, including bill reminders, threshold alerts, and pace-based alerts.
11. **mobile-accessibility** - Screen readers, large text, reduced motion, target
    size, contrast, and keyboard and focus, targeting WCAG 2.2 Level AA.
12. **testing** - What to test first (money math and data safety) and how, then
    everything else.

## Project rules I followed

Your CLAUDE.md asks me to apply the ux-best-practices, accessibility, and
security skills (and run their pre-delivery reviews) when building software or a
user-facing interface, and the market-researcher skill for research work.

- I applied **ux-best-practices**, **accessibility**, and **security**: their
  guidance is folded into the relevant skills (UX into adhd-ux-guidelines and
  reminders; accessibility into mobile-accessibility and adhd-ux-guidelines;
  security into device-security, secrets-and-api-keys, gdpr-privacy, and
  open-banking-sandbox). Each of those skills ends with a short pre-delivery
  check so the reviews run on the real app later, not just on these docs.
- I **skipped market-researcher**: this task was drafting skills from
  already-approved research, not doing new market research.

## Assumptions I made

The deliverables do not name a tech stack or some specifics, so I wrote the
skills to be stack-agnostic. These are the assumptions baked in. Please confirm
or correct them.

1. **No tech stack is fixed yet.** Skills avoid naming a language or framework.
   They say "the platform's secure storage," "the platform's biometric APIs," and
   so on. If you pick a stack (for example React Native, Flutter, Swift, Kotlin),
   the skills can be made more specific.
2. **Mobile-first, with web later.** The deliverables say mobile-first and list
   mobile and web as a feature. The skills focus on mobile. The accessibility
   skill is written for mobile but notes web-style practices too.
3. **Open banking provider not chosen.** open-banking-sandbox describes a European
   open banking provider's free sandbox in general terms, since none is named. The
   vision doc mentions Plaid or open banking; your Step 2 prompt specified a
   European open banking provider's sandbox, so I followed the prompt. Please
   confirm which provider.
4. **Sandbox only, fake data only.** I assumed no real bank connections and no
   real money data at any point in this project, and wrote security and privacy to
   real standards anyway so the habits are right.
5. **GDPR as the privacy standard.** The deliverables lean European (open
   banking, possible Europe target), so I used GDPR as the standard. If the first
   market is the US, UK, Canada, or Australia, the privacy rules may shift.
6. **Backlog IDs and scope are the source of truth.** Where the prompt and the
   deliverables agreed, I used the deliverables' exact MVP and MMP split.

## Open questions for you to answer

1. What tech stack should the app use? This unlocks more specific guidance in
   several skills.
2. Which open banking provider's sandbox do you want to use? (The prompt says a
   European one; the vision doc also mentions Plaid.)
3. What is the first target market or region? It affects privacy law and whether
   multi-currency and open banking move up the plan.
4. For device security, what default auto-lock time do you want (for example 1, 2,
   or 5 minutes)?
5. Do you want a dark mode at all? The UX rule is light theme by default and dark
   only if you ask. Right now the skills say light only.
6. How specific should the money rules be? For example, a default essentials floor,
   or default threshold percentages beyond the 50 and 80 already in the backlog.
7. Should there be a separate deployment or release skill later, or is that out of
   scope for now?

## Where skills might overlap (and how I kept them apart)

I gave each skill a distinct job, but a few sit next to each other. Here is where
they touch and how each one stays in its lane. If you would rather merge or split
any, tell me.

- **secrets-and-api-keys vs device-security vs local-data-and-sync.** All three
  touch protecting data. Split by place: secrets-and-api-keys is about keys and
  tokens (not in code or git, stored in a vault); device-security is about
  locking and hiding the app on the phone; local-data-and-sync is about storing
  and syncing the data itself. They cross-reference each other.
- **gdpr-privacy vs security.** security (your existing skill) is the technical
  how (encryption, OWASP, auth). gdpr-privacy is the what and why for personal
  data (consent, minimisation, export, delete). gdpr-privacy points to security
  for the technical side.
- **adhd-ux-guidelines vs mobile-accessibility.** Both are about the interface.
  adhd-ux-guidelines is the feel and tone (calm, kind, no shame, one choice per
  screen). mobile-accessibility is the technical, testable side (screen readers,
  large text, reduced motion, contrast). They reference each other and do not
  repeat the same rules.
- **adhd-ux-guidelines vs reminders-and-notifications.** The tone rules live in
  adhd-ux-guidelines. reminders-and-notifications applies that tone specifically
  to notifications and adds timing and nagging rules. Some tone overlap is
  intentional so the notifications skill stands on its own.
- **open-banking-sandbox vs secrets-and-api-keys.** open-banking-sandbox covers
  the connection flow and sandbox rules; it points to secrets-and-api-keys for how
  to store the tokens. Minor overlap on "tokens are secrets," kept short in both.
- **mvp-scope vs dev-workflow.** mvp-scope is what and when; dev-workflow is how
  to build. dev-workflow points to mvp-scope to confirm a feature is in scope.
- **testing vs safe-to-spend-math and local-data-and-sync.** testing says what to
  test first and points to those two for the exact rules, rather than repeating
  them. The rules live in the source skills; testing says how to prove them.

## What to do next

Review the 12 files. Then answer the open questions above, especially the tech
stack and the open banking provider, and I can tighten the skills to match before
any app code is written.

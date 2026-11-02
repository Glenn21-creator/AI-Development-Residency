# Hyper Budget: Technical Build Plan

AI Development Residency, Week 2. This is the technical build plan for Hyper Budget. It takes the approved requirements and the chosen stack (Expo, Vercel, Supabase, Material UI) and sets out how the product is actually built: the architecture, the data model, the setup that comes before any feature code, the order the features are built in, and how we know each piece is done. It builds on the Requirements deliverable and the eight-week roadmap rather than re-sequencing them. Everything is in plain English, with no em dashes.

The build plan answers what the roadmap does not. The roadmap says which epics are built in which week. This plan says how each one is built on the stack, what it depends on technically, and what "finished" means. References to requirements use the FR, NFR, and TR IDs from the Requirements deliverable.

The document has six parts:

- Part 1, Architecture (how the pieces fit together).
- Part 2, Data Model (the Supabase tables).
- Part 3, Phase 0, Setup Before Feature Code.
- Part 4, The Build Sequence (feature build order with dependencies).
- Part 5, Definition of Done and Testing.
- Part 6, Open Technical Decisions and Risks.

---

# Part 1: Architecture

Four pieces, each with one job.

```
   [ Expo app (React Native) ]  <- the user's phone, iOS and Android
            |  HTTPS / Supabase client SDK
            v
   [ Supabase ]                  <- Postgres database, Auth, Row-Level Security,
            |                       Edge Functions, storage
            ^  reads/writes
            |
   [ Vercel ]                    <- web surfaces (dashboard, marketing) and
            |                       serverless functions, including the
            |                       bank-data webhook receiver
            v
   [ Open-banking provider ]     <- PSD2 provider (to be chosen), the source
                                    of accounts and transactions
```

How a transaction flows, as the clearest example:

1. The open-banking provider detects a new transaction and calls a webhook.
2. A Vercel serverless function (or Supabase Edge Function) receives it, writes the transaction into Supabase, and runs categorization.
3. The allocation engine runs, updating bucket balances and the safe-to-spend number in Supabase.
4. The Expo app, subscribed to Supabase, shows the updated number. If a threshold is crossed, a push notification goes out through Expo.

Division of labour on the stack:

- **Expo (React Native)** is the whole mobile experience (TR-1): screens, the safe-to-spend view, buckets, alerts, onboarding, check-ins.
- **Supabase** is the backend (TR-2, TR-7): the Postgres database, user authentication (FR-8 to FR-11), Row-Level Security so one user can never read another's data (NFR-S5), encryption at rest (NFR-S1), and Edge Functions for backend logic.
- **Vercel** hosts any web surface and the serverless functions, including the webhook endpoint the bank provider calls (TR-3, TR-6).
- **Material UI** styles the web surfaces (TR-4). Note the open flag: it does not style the React Native app, so the mobile UI needs a React Native component library. See Part 6.

---

# Part 2: Data Model

The core Supabase tables for the MVP, with their key columns and how they relate. This is enough to evaluate the shape; exact column types and indexes come at implementation time. Every table carries a user_id and is protected by Row-Level Security.

**profiles** (extends Supabase auth.users)
- id (links to auth user), display_name, created_at, onboarding_complete

**bank_connections** (FR-1, FR-5, FR-6, FR-7)
- id, user_id, provider, provider_item_id, status (active / needs_reconnect / error), last_synced_at, access_token_ref (a reference to the token held server-side, never the token itself, NFR-S3)

**accounts**
- id, user_id, bank_connection_id, account_name, type, balance, currency

**transactions** (FR-2, FR-3, FR-4)
- id, user_id, account_id, amount, date, merchant, category, category_source (auto / user_corrected), is_recurring

**buckets** (FR-19 to FR-23)
- id, user_id, name, type (essentials / bill / fun / savings), target_amount, current_balance, is_protected (true for the essentials floor, FR-20, FR-21)

**allocation_rules** (FR-19, FR-24)
- id, user_id, bucket_id, rule_type (fixed / percentage), value, priority (essentials funded first)

**bills** (FR-22, FR-28)
- id, user_id, name, amount, due_date, recurrence, linked_bucket_id, status (upcoming / covered / paid)

**savings_goals** (FR-30)
- id, user_id, name, target_amount, current_amount, created_at

**alerts** (FR-27, FR-28, FR-29)
- id, user_id, type (threshold / bill_due / subscription_flag), payload, created_at, read_at

**consents** (FR-12, NFR-C3, NFR-C4)
- id, user_id, scope, granted_at, revoked_at

MMP tables added later: **households** and **household_members** (FR-33 to FR-35), **subscriptions** (FR-36), **spending_patterns** (FR-37, FR-38), **coaching_sessions** and **chat_messages** (FR-40, FR-41), **rewards** (FR-42).

---

# Part 3: Phase 0, Setup Before Feature Code

None of this ships a feature, but every feature depends on it. This is the work of the first days.

1. **Repository.** One repo, with the Expo app and the Vercel functions as separate folders (a simple monorepo). Decide this layout first.
2. **Supabase project.** Create the project, set up the database, enable Row-Level Security by default, and configure authentication (email plus biometric unlock on device, FR-8 to FR-11).
3. **Vercel project.** Connect the repo, set up environments (preview and production), and scaffold the serverless functions folder.
4. **Expo app.** Initialize the app, set up navigation, and wire the Supabase client.
5. **Secrets and keys.** Put all provider tokens and keys in Supabase and Vercel environment configuration, never in the repo (NFR-S6, TR-7).
6. **The shame-free tone system** (NFR-U3, FR-16 to FR-18 depend on it). Write the voice-and-tone principles and the reusable copy patterns for alerts, errors, empty states, and welcome-back before building the screens that use them. This is a Sprint 1 item in your backlog for exactly this reason.
7. **The UI theme.** Set up the mobile component library and theme, and Material UI for any web surface (resolve the Part 6 flag first).
8. **A thin end-to-end slice.** Sign up, log in, see an empty home screen. This proves the whole stack is wired before any real feature is added.

---

# Part 4: The Build Sequence

The order is set by dependencies, not convenience, and it lines up with your eight-week roadmap. Each phase names the features, the FRs, and the main stack work.

**Phase 1, Foundations (roadmap W1 to W2).** The data pipe everything else reads from.
- Accounts and authentication (FR-8 to FR-11): Supabase Auth.
- Bank connection and token handling (FR-1, FR-5, FR-6, FR-7): the provider SDK in the app, tokens stored server-side.
- Transaction pull and categorization (FR-2, FR-3, FR-4): the webhook receiver on Vercel, categorization logic, the transactions table.
- Dependency: nothing downstream can start until transactions land categorized in Supabase.

**Phase 2, Allocation and Visibility (roadmap W2 to W4).** The core engine and the number users live by.
- Essentials-first allocation (FR-19, FR-20, FR-21, FR-24): the allocation engine as a Supabase Edge Function, triggered when a deposit is detected.
- Bill and fun buckets (FR-22, FR-23).
- Safe-to-spend number and due-and-covered view (FR-25, FR-26): computed from buckets, shown live in the app.
- Dependency: safe-to-spend has nothing to show until allocation works, so it must follow it.

**Phase 3, Alerts, Savings, Onboarding, Shame-Free Surfaces (roadmap W4 to W5).** Everything that reads the buckets, plus the first-run flow.
- Threshold alerts, bill alerts, subscription flagging (FR-27, FR-28, FR-29): read allocated buckets and categorized transactions, send push via Expo.
- Basic savings goals (FR-30).
- Check-ins, small wins, welcome-back (FR-16, FR-17, FR-18): built on the Phase 0 tone system.
- Onboarding (FR-15): built late on purpose, because people are onboarded into features that already exist.

**Validation checkpoint (roadmap end of W5 into W6).** The MVP goes live. Gather the usage data and feedback that two MMP features depend on.

**Phase 4, MMP features that need no post-launch data (roadmap W6 to W7).**
- Emergency cushion auto-save (FR-31, FR-32).
- Partner sharing (FR-33, FR-34, FR-35): the households tables, shared access through Row-Level Security.
- Subscription cancellation help (FR-36).

**Phase 5, MMP features that need post-launch data (roadmap W7 to W8).**
- Pace-based alerts (FR-37, FR-38): need accumulated spending history to learn patterns.
- Forgiving re-engagement and coaching (FR-39, FR-40): need real lapse-and-return behavior to design against.
- AI chatbot (FR-41) and fuller rewards (FR-42).

---

# Part 5: Definition of Done and Testing

A feature is done when all of these are true, not just when the code runs:

- Every FR for the feature works end to end against real connected data.
- Its non-functional targets are met (for example, allocation within the NFR-P1 time, data encrypted per NFR-S1).
- Row-Level Security is verified: a second test user cannot see the first user's data.
- All user-facing copy passes the shame-free tone check (NFR-U3).
- Clear success and error states exist, with a shame-free error and a retry.

Testing approach:

- **Unit tests** for the allocation engine and categorization, the two places a bug corrupts the numbers users trust (NFR-R4).
- **Integration tests** for the webhook-to-allocation-to-safe-to-spend path.
- **Security review** before launch (NFR-S7), including a Row-Level Security audit.
- **Device testing** on real iOS and Android phones through Expo.

---

# Part 6: Open Technical Decisions and Risks

These need a decision before or during the phase that hits them. Nothing here blocks starting Phase 0.

1. **Material UI versus the mobile app (decide in Phase 0).** Material UI is a React web library and does not render in React Native, so it cannot style the Expo app. Either adopt a React Native library with the same Material look (such as React Native Paper) for the app and keep Material UI for a web dashboard, or decide the product is web-first. This changes the Phase 0 UI setup.
2. **Bank-data provider (decide before Phase 1).** A PSD2-licensed provider for the EU (for example Tink, TrueLayer, or GoCardless Bank Account Data). Cost, country coverage for Germany and Poland, and sandbox quality are the deciding factors (TR-5).
3. **Where backend logic runs (decide in Phase 1).** Supabase Edge Functions or Vercel serverless functions. Pick one home for the allocation engine and webhook handling so the logic is not split.
4. **AI model for the chatbot (decide before Phase 5).** Model choice and guardrails for the shame-free coaching, with usage cost that scales (TR-10).
5. **The core risk carried from the vision.** The product cannot see a purchase before it happens. The build handles this structurally through essentials-first bucketing (FR-20) and pace alerts (FR-38), not by trying to intercept purchases. The build order reflects that: the floor is a Phase 2 priority.

---

*Prepared 2 November 2026. This technical build plan turns the approved requirements and the chosen stack (Expo, Vercel, Supabase, Material UI) into an architecture, a data model, a setup phase, a dependency-ordered build sequence aligned to the eight-week roadmap, and a definition of done. Bracketed and flagged items are decisions to confirm, not commitments. It reuses the sequencing logic from the Epics, Roadmap, and Backlog deliverable rather than re-sequencing the work.*

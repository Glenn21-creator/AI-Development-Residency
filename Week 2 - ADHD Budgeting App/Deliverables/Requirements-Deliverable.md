# Hyper Budget: Requirements Deliverable (User, Functional, Non-Functional, Technical)

AI Development Residency, Week 2. This deliverable sets out the requirements for Hyper Budget across four layers: user requirements, functional requirements, non-functional requirements, and technical requirements. It is drawn directly from the approved Audience Segmentation, Market and Competitor Analysis, Product Release Vision and Scope, and Epics, Roadmap, and Backlog deliverables, rather than inventing new scope. Everything is in plain English, with no em dashes.

A note on how the four layers relate, because it is the backbone of the whole document:

- **User requirements** say what a person needs, in their own words ("As a student, I want...").
- **Functional requirements** say what the system must do to meet those needs ("The system shall...").
- **Non-functional requirements** say how well it must do it (speed, security, reliability, usability, compliance).
- **Technical requirements** say how it will be built (platforms, providers, architecture). These depend on decisions not yet made, so Part 4 is written as proposals to confirm, not settled facts.

A note on the numbers. Where a non-functional requirement carries a figure (a time limit, an uptime target), it is shown in square brackets as a target to confirm, not a committed guarantee. The same applies to the technical choices in Part 4.

The document has four parts:

- Part 1, User Requirements (by persona).
- Part 2, Functional Requirements (by epic and feature).
- Part 3, Non-Functional Requirements (by quality type).
- Part 4, Technical Requirements (proposed, decisions needed).

IDs: UR for user requirements, FR for functional, NFR for non-functional, TR for technical.

---

# Part 1: User Requirements

Written from the user's point of view, in the "As a [user], I want [need], so that [benefit]" form. These name needs, not solutions. The features that satisfy them live in Part 2.

## Persona 1: Students managing their own money for the first time

- **UR-S1:** As a student, I want my food and rent money set aside on its own before anything else, so that running short never means going hungry or asking for help.
- **UR-S2:** As a student, I want to see in real time how much is safe to spend, so that everyday choices do not accidentally eat into my essentials.
- **UR-S3:** As a student, I want a pause or nudge before a non-essential purchase, so that a reward-now impulse does not cost me money I needed.
- **UR-S4:** As a student, I want a guilt-free amount set aside for fun, so that staying on budget does not feel like going without everything I enjoy.
- **UR-S5:** As a student, I want an early, private warning when my essentials are at risk, so that I can adjust before hitting zero without anyone else knowing.
- **UR-S6:** As a student, I want to quietly build a small safety net over time, so that an unexpected cost does not become a crisis.

## Persona 2: Parents holding the household together

- **UR-P1:** As a parent, I want every bill tracked and funded on time without me remembering, so that a forgotten due date never hits my family with late fees.
- **UR-P2:** As a parent, I want a clear view of what is due and what is already covered, so that I can trust the household is handled at a glance.
- **UR-P3:** As a parent, I want the budget to keep running with almost no upkeep even when I am too busy to check in, so that I do not abandon yet another system.
- **UR-P4:** As a parent, I want to share money visibility with my partner while keeping a personal no-questions amount, so that spending is transparent without losing all independence.
- **UR-P5:** As a parent, I want a heads-up before a purchase would push us over our agreed budget, so that money stays a shared plan rather than a source of conflict.
- **UR-P6:** As a parent, I want the family to build an emergency cushion automatically, so that we move toward lasting stability without extra effort.

## Persona 3: Late-diagnosed adults rebuilding self-trust

- **UR-L1:** As a late-diagnosed adult, I want my recurring and forgotten charges surfaced automatically, so that money stops leaking on things I do not use.
- **UR-L2:** As a late-diagnosed adult, I want checking my money to feel safe and low-pressure, so that shame no longer makes me avoid it for weeks.
- **UR-L3:** As a late-diagnosed adult, I want budgeting that runs without willpower or memory, so that I finally stay with a system instead of abandoning it.
- **UR-L4:** As a late-diagnosed adult, I want a set amount saved automatically when income lands, so that I build the cushion I never managed on my own.
- **UR-L5:** As a late-diagnosed adult, I want help actually cancelling forgotten subscriptions, not just being told about them, so that the leaks are closed, not just seen.
- **UR-L6:** As a late-diagnosed adult, I want the app to keep running through a lapse and welcome me back without blame, so that falling off does not mean failing again.
- **UR-L7:** As a late-diagnosed adult, I want gentle coaching and bite-sized check-ins, so that I can rebuild trust in myself with money over time.

## Cross-cutting (all users)

- **UR-A1:** As a new user, I want to create an account and sign in quickly and safely, so that getting started and coming back are easy without risking my financial data.
- **UR-A2:** As a user, I want to connect my bank in a few taps with no manual entry, so that the app can manage my money without extra work from me.
- **UR-A3:** As a user, I want control over my data, including giving consent and deleting it, so that I stay in charge of the most sensitive information I have.

---

# Part 2: Functional Requirements

What the system must do, organized by the epics and features already approved. Each is a single capability in "the system shall" form. Quality and speed are deliberately absent here; they live in Part 3.

## Epic: Foundations

**Feature: Bank-data integration**

- **FR-1:** The system shall allow a user to connect one or more bank accounts through a supported provider.
- **FR-2:** The system shall pull a user's transactions automatically, on a schedule and on demand.
- **FR-3:** The system shall automatically assign a spending category to each transaction.
- **FR-4:** The system shall allow a user to correct a transaction's category.
- **FR-5:** The system shall automatically refresh connection tokens where the provider allows it.
- **FR-6:** The system shall prompt the user to reconnect when a connection fails and cannot be refreshed automatically.
- **FR-7:** The system shall display the current status of each bank connection.

**Feature: Accounts and authentication**

- **FR-8:** The system shall allow a user to sign up for an account.
- **FR-9:** The system shall allow a user to log in and log out.
- **FR-10:** The system shall allow a user to recover a forgotten password.
- **FR-11:** The system shall support biometric unlock as an option.

**Feature: Security and compliance (functional parts)**

- **FR-12:** The system shall obtain the user's explicit consent before accessing bank data.
- **FR-13:** The system shall allow a user to request an export of their data.
- **FR-14:** The system shall allow a user to delete their account and associated data.

**Feature: Onboarding**

- **FR-15:** The system shall provide a first-run flow that connects a bank account and reaches a first value (a funded bucket or a safe-to-spend view).

## Epic: Shame-Free Engagement (functional parts)

- **FR-16:** The system shall present bite-sized check-ins in place of a full financial review.
- **FR-17:** The system shall show a light celebration on a positive event, such as a bill paid on time, without streaks.
- **FR-18:** The system shall show a welcome-back message after a period of inactivity.

(The tone system itself is a quality applied across all copy, so it sits in Part 3 as NFR-U3.)

## Epic: Automatic Allocation

- **FR-19:** The system shall automatically allocate income into buckets when a deposit is detected.
- **FR-20:** The system shall fund a protected essentials floor before any discretionary bucket.
- **FR-21:** The system shall prevent discretionary spending from drawing down the essentials floor.
- **FR-22:** The system shall automatically set money aside for upcoming bills.
- **FR-23:** The system shall provide a discretionary fun bucket within allocation.
- **FR-24:** The system shall allocate irregular or lumpy income proportionally.

## Epic: Safe-to-Spend Visibility

- **FR-25:** The system shall show a real-time safe-to-spend number representing money left after essentials.
- **FR-26:** The system shall show a due-and-covered view of what is due versus what is already funded.

## Epic: Proactive Alerts

- **FR-27:** The system shall alert the user at 50 percent and 80 percent of a bucket spent.
- **FR-28:** The system shall remind the user ahead of bill due dates.
- **FR-29:** The system shall detect and flag recurring and forgotten charges.

## Epic: Basic Savings

- **FR-30:** The system shall allow a user to create and track a simple savings goal.

## Epic: Emergency Cushion Auto-Save (MMP)

- **FR-31:** The system shall auto-save a set amount when income lands.
- **FR-32:** The system shall show visible progress toward the cushion.

## Epic: Partner Sharing (MMP)

- **FR-33:** The system shall allow optional shared household visibility with a partner.
- **FR-34:** The system shall keep a private, no-questions fun bucket for each person.
- **FR-35:** The system shall send a heads-up before a purchase pushes over the agreed budget.

## Epic: Subscription Cleanup and Cancellation (MMP)

- **FR-36:** The system shall provide one-tap cancellation help for forgotten subscriptions.

## Epic: Pace-Based Alerts (MMP)

- **FR-37:** The system shall learn each user's spending patterns.
- **FR-38:** The system shall send a heads-up before predictable high-risk days, such as payday.

## Epic: Forgiving Re-engagement and Coaching (MMP)

- **FR-39:** The system shall keep running and keep data current through a user lapse.
- **FR-40:** The system shall welcome a returning user back without blame and coach the restart.
- **FR-41:** The system shall provide a shame-free chatbot for check-ins and coaching.

## Epic: Fuller Rewards (MMP)

- **FR-42:** The system shall provide a deeper rewards system for steady progress.

---

# Part 3: Non-Functional Requirements

How well the system must perform, grouped by quality type. Bracketed figures are targets to confirm.

## Performance

- **NFR-P1:** Income allocation completes within [5 seconds] of a deposit being detected.
- **NFR-P2:** A new transaction is reflected in the safe-to-spend number within the refresh window, targeting under [60 seconds] where the provider supports near-real-time data.
- **NFR-P3:** Transaction data refreshes at least every [X hours] and on demand.
- **NFR-P4:** Core screens (safe-to-spend, due-and-covered) load within [2 seconds] on a mid-range phone.

## Security

- **NFR-S1:** All financial data is encrypted at rest and in transit (TLS 1.2 or higher).
- **NFR-S2:** Credentials are stored hashed and salted, never in plain text.
- **NFR-S3:** Provider access tokens are never exposed on the client and are held server-side.
- **NFR-S4:** Sessions expire after [15 minutes] of inactivity and on logout.
- **NFR-S5:** Access to data follows least-privilege.
- **NFR-S6:** Secrets are not stored in source control.
- **NFR-S7:** The system logs and monitors security events and passes a security review before launch.

## Reliability and Availability

- **NFR-R1:** The app keeps allocating and tracking without active user input, through periods of disengagement.
- **NFR-R2:** Broken bank connections are detected and recovered automatically where possible, and otherwise flagged, never left silently stale.
- **NFR-R3:** Core services meet a target uptime of [99.5 percent].
- **NFR-R4:** Bucket balances and the safe-to-spend number stay accurate and consistent with the source transactions.

## Usability and Accessibility

- **NFR-U1:** The product is mobile-first, with the primary experience designed for phones.
- **NFR-U2:** The product runs with near-zero setup and upkeep, requiring no manual transaction entry.
- **NFR-U3:** All user-facing copy follows the shame-free tone system, with no blaming or shaming language anywhere.
- **NFR-U4:** A user reaches first value (a funded bucket or a safe-to-spend view) within [72 hours], ideally within the first session.
- **NFR-U5:** Interactions are low cognitive load and bite-sized, suited to ADHD users (minimal steps, glanceable status).
- **NFR-U6:** The product meets accessibility basics, including contrast, text sizing, and screen-reader labels.

## Compliance

- **NFR-C1:** The product complies with applicable data-protection law (GDPR for EU users). [Confirm target markets.]
- **NFR-C2:** Bank-data access complies with open-banking regulation (PSD2 in the EU, or the local equivalent).
- **NFR-C3:** Explicit, informed consent is captured before any financial data is accessed.
- **NFR-C4:** The product supports the user's right to access and delete their data.
- **NFR-C5:** Data handling and consent are documented, with an audit trail maintained.

## Maintainability and Scalability

- **NFR-M1:** Bank connections are monitored and maintained over time.
- **NFR-M2:** The system scales to a growing number of users and transactions without redesign.
- **NFR-M3:** The shame-free copy is maintained as a reusable system and applied consistently to new features.

---

# Part 4: Technical Requirements

The technology stack is chosen: Expo, Vercel, Supabase, and Material UI. These requirements state how the product is built on that stack. Items still open (the bank-data provider, AI model) are flagged. The European context (Germany, studying in Poland) shapes the provider and compliance choices.

- **TR-1:** The mobile app is built with Expo (React Native), delivering iOS and Android from one codebase.
- **TR-2:** The backend and data layer run on Supabase (Postgres database, authentication, storage, and row-level security), covering accounts and authentication (FR-8 to FR-11), the encrypted data store, and access control.
- **TR-3:** Web surfaces and backend functions are deployed on Vercel.
- **TR-4:** The user interface uses Material UI. Note: Material UI is a React web library, so for the Expo React Native app a React Native component library may be needed, with Material UI used for any web surface (such as a dashboard or marketing site). [Confirm how Material UI is applied across mobile and web.]
- **TR-5:** Bank connectivity is through a PSD2-licensed open-banking provider for EU users (for example Tink, TrueLayer, or GoCardless Bank Account Data). [Decision needed, tied to target market.]
- **TR-6:** The allocation and alert engines run as backend logic (Supabase Edge Functions or Vercel serverless functions), triggered by the provider's transaction webhooks.
- **TR-7:** Supabase provides encryption at rest and authentication. Provider tokens and keys are held in environment configuration in Supabase and Vercel, never in source control.
- **TR-8:** Push notifications for alerts and nudges are delivered through Expo's notification service.
- **TR-9:** Supported platforms: iOS [15] and up, Android [10] and up. [Confirm.]
- **TR-10:** For the MMP, an AI model or API powers the shame-free chatbot and coaching, with safety guardrails. Model and usage costs scale with use. [Decision needed.]
- **TR-11:** For the MMP, a data pipeline for high-risk-day pattern analysis depends on accumulated transaction history, run on Supabase or Vercel functions.

---

*Prepared 28 October 2026. This deliverable draws user, functional, non-functional, and technical requirements from the approved Audience Segmentation, Market and Competitor Analysis, Product Release Vision and Scope, and Epics, Roadmap, and Backlog deliverables. Bracketed figures are targets to confirm, not commitments. Part 4 is a set of technical proposals requiring product decisions. The build plan is a separate deliverable and follows from these requirements.*

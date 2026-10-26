# Hyper Budget: Epics, Roadmap, and Backlog Deliverable

This deliverable carries the approved release scope all the way from epics, features, and tasks, through an eight-week release roadmap, into a populated backlog. It organizes the scope into epics, features, and tasks, sequences that work by its real dependencies, maps it across eight weekly columns ending the last full week before Christmas, and turns it into backlog tickets. It reuses the epics, features, and scope already approved in the Product Release Vision and Scope, rather than inventing new work. Everything is written in plain English.

A note on the timeframe and the estimates. The roadmap runs across eight weekly columns, from the week of 26 October 2026 to the week of 14 December 2026. Week placements show intended sequence and dependencies. They are planning estimates, not committed delivery dates.

The document has four parts:

- Part 1, Epics, Features, and Tasks (the roadmap backbone).
- Part 2, The Eight-Week Release Roadmap.
- Part 3, Sequencing Logic, Dependencies, and the Validation Checkpoint.
- Part 4, The Backlog (ticket register plus Sprint 1 requirements).

---

# Part 1: Epics, Features, and Tasks

The work is organized the way the workshop describes it. Epics are the cabinets, features are the containers inside them, and tasks are the items inside the containers. Each task traces back to a resulting scope item or outcome in the approved vision and scope. The list is split into the MVP (the problems to solve and validate first) and the MMP (the problems to solve at market).

## MVP Epics

**EPIC: Foundations**

- FEATURE: Bank-data integration
  - TASK: Connect accounts through Plaid or open banking
  - TASK: Pull and categorize transactions
  - TASK: Maintain and refresh bank connections
- FEATURE: Accounts and authentication
  - TASK: Sign-up, login, and secure session handling
- FEATURE: Security and compliance
  - TASK: Encrypt and safeguard financial data
  - TASK: Meet financial-data compliance obligations
- FEATURE: Onboarding
  - TASK: First-run flow that connects a bank and reaches first value quickly

**EPIC: Shame-Free Engagement**

- FEATURE: Shame-free tone system
  - TASK: Establish the kind, no-blame copy system and apply it across the app
- FEATURE: Bite-sized check-ins
  - TASK: Replace daunting reviews with small, low-pressure check-ins
- FEATURE: Small wins
  - TASK: Light celebrations such as a bill paid on time, with no streaks
  - TASK: Gentle re-entry message after a gap

**EPIC: Automatic Allocation**

- FEATURE: Essentials-first bucketing
  - TASK: Auto-allocate income into buckets on deposit
  - TASK: Hold a protected food-and-rent floor before any discretionary spend
- FEATURE: Bill buckets
  - TASK: Set money aside automatically for upcoming bills
- FEATURE: Fun bucket
  - TASK: Carve a guilt-free discretionary bucket within allocation

**EPIC: Safe-to-Spend Visibility**

- FEATURE: Real-time safe-to-spend number
  - TASK: Show what is really left to spend after essentials, in real time
- FEATURE: Due-and-covered view
  - TASK: Show what is due versus what is already funded

**EPIC: Proactive Alerts**

- FEATURE: Threshold alerts
  - TASK: Alert at 50 percent and 80 percent of a bucket spent
- FEATURE: Early bill alerts
  - TASK: Remind ahead of bill due dates
- FEATURE: Forgotten-subscription flagging
  - TASK: Detect and flag recurring and forgotten charges

**EPIC: Basic Savings**

- FEATURE: Basic savings goals
  - TASK: Start and track a simple cushion goal

## MMP Epics

**EPIC: Emergency Cushion Auto-Save**

- FEATURE: Automatic cushion
  - TASK: Auto-save a set amount when income lands
  - TASK: Show visible progress toward the cushion

**EPIC: Partner Sharing**

- FEATURE: Shared household view
  - TASK: Offer optional shared visibility with a partner
  - TASK: Keep a private, no-questions fun bucket for each person
  - TASK: Send a heads-up before a purchase pushes over the agreed budget

**EPIC: Subscription Cleanup and Cancellation**

- FEATURE: Cancellation help
  - TASK: Go beyond flagging to one-tap cancellation help for forgotten subscriptions

**EPIC: Pace-Based Alerts**

- FEATURE: High-risk-day detection
  - TASK: Learn each user's spending patterns
  - TASK: Send a heads-up before predictable high-risk days such as payday

**EPIC: Forgiving Re-engagement and Coaching**

- FEATURE: Forgiving re-engagement
  - TASK: Keep running through a lapse and welcome the user back without guilt
  - TASK: Coach the restart
- FEATURE: AI chatbot
  - TASK: Shame-free chatbot check-ins and coaching

**EPIC: Fuller Rewards**

- FEATURE: Rewards system
  - TASK: Deeper dopamine-friendly rewards for steady progress

---

# Part 2: The Eight-Week Release Roadmap

Each epic is a row. Each feature runs across the weeks it is expected to take. The eight weekly columns are:

- **W1**: 26 Oct to 1 Nov
- **W2**: 2 Nov to 8 Nov
- **W3**: 9 Nov to 15 Nov
- **W4**: 16 Nov to 22 Nov
- **W5**: 23 Nov to 29 Nov
- **W6**: 30 Nov to 6 Dec
- **W7**: 7 Dec to 13 Dec
- **W8**: 14 Dec to 20 Dec

A filled bar means the feature is active that week, and consecutive bars join to show its duration. The MVP build runs W1 to W5, a validation checkpoint sits at the end of W5 into W6, and the MMP build runs W6 to W8.

| Epic | Feature | W1 | W2 | W3 | W4 | W5 | W6 | W7 | W8 |
|---|---|---|---|---|---|---|---|---|---|
| Foundations | Bank-data integration | █ | █ |  |  |  |  |  |  |
| Foundations | Accounts and authentication | █ | █ |  |  |  |  |  |  |
| Foundations | Security and compliance |  | █ | █ |  |  |  |  |  |
| Foundations | Onboarding |  |  |  |  | █ |  |  |  |
| Shame-Free Engagement | Shame-free tone system | █ | █ |  |  |  |  |  |  |
| Shame-Free Engagement | Bite-sized check-ins |  |  |  |  | █ |  |  |  |
| Shame-Free Engagement | Small wins |  |  |  |  | █ |  |  |  |
| Automatic Allocation | Essentials-first bucketing |  | █ | █ |  |  |  |  |  |
| Automatic Allocation | Bill buckets |  |  | █ | █ |  |  |  |  |
| Automatic Allocation | Fun bucket |  |  |  | █ |  |  |  |  |
| Safe-to-Spend Visibility | Real-time safe-to-spend number |  |  | █ | █ |  |  |  |  |
| Safe-to-Spend Visibility | Due-and-covered view |  |  |  | █ |  |  |  |  |
| Proactive Alerts | Threshold alerts |  |  |  | █ |  |  |  |  |
| Proactive Alerts | Early bill alerts |  |  |  | █ | █ |  |  |  |
| Proactive Alerts | Forgotten-subscription flagging |  |  |  |  | █ |  |  |  |
| Basic Savings | Basic savings goals |  |  |  |  | █ |  |  |  |
| **Validation checkpoint** | **MVP launch and feedback** |  |  |  |  | ◆ | ◆ |  |  |
| Emergency Cushion Auto-Save | Automatic cushion |  |  |  |  |  | █ |  |  |
| Partner Sharing | Shared household view |  |  |  |  |  | █ | █ |  |
| Subscription Cleanup and Cancellation | Cancellation help |  |  |  |  |  | █ | █ |  |
| Pace-Based Alerts | High-risk-day detection |  |  |  |  |  |  | █ |  |
| Forgiving Re-engagement and Coaching | Forgiving re-engagement |  |  |  |  |  |  | █ | █ |
| Forgiving Re-engagement and Coaching | AI chatbot |  |  |  |  |  |  |  | █ |
| Fuller Rewards | Rewards system |  |  |  |  |  |  |  | █ |

Legend: █ active build week, ◆ validation checkpoint.

---

# Part 3: Sequencing Logic, Dependencies, and the Validation Checkpoint

The order on the roadmap is set by what each piece of work depends on, not by convenience.

**Foundations come first.** Every other epic reads from the bank-data pipe, so the connection, transaction pull, and categorization have to exist before allocation, safe-to-spend, or alerts can do anything. The security and compliance base sits right behind it, because the product cannot handle real money data without it, and the vision doc specifically warned this is easy to underestimate.

**The tone foundation is established early, then applied throughout.** On the roadmap the shame-free tone system shows as an early bar, but the kind, no-blame copy is woven into every feature that follows it. It is drawn early because the copy system needs to exist before the later features can be written in that voice, not because the work on tone ends in W2.

**Allocation comes before safe-to-spend.** The safe-to-spend number is the money left after essentials are allocated, so it has nothing to show until bucketing works.

**Alerts come after allocation and categorization.** Threshold alerts, bill alerts, and subscription flagging all read the allocated buckets and the categorized transactions, so they follow that work rather than running alongside the foundation.

**Onboarding is placed late in the MVP build.** People are onboarded into features that already exist, so the first-run flow is built in W5, just before launch, even though it belongs to the Foundations epic.

**The validation checkpoint sits between the MVP and the MMP.** At the end of W5 into W6 the MVP goes live and the team gathers the feedback and real usage data that the later work depends on. This checkpoint is the reason two MMP epics are placed where they are.

**Two MMP epics are data-dependent and sit late on purpose.** Pace-based alerts need accumulated spending history to learn each user's patterns, and forgiving re-engagement needs real lapse-and-return behavior to design against. Both are placed in the final weeks so the build-after-feedback logic holds. The other three MMP epics (emergency cushion, partner sharing, and subscription cancellation) do not need post-launch data, so they can start as soon as the MMP build begins in W6.

**A note on the eight-week window.** A real launch-and-learn period runs over months, not days. In this eight-week roadmap it is represented as a validation checkpoint rather than a full learning period, and the weeks after it are planned, post-feedback build work rather than committed delivery dates.

---

# Part 4: The Backlog

The roadmap says what gets built and when. The backlog turns that into tickets the team can actually pick up. Following the workshop's guidance that a backlog is populated incrementally rather than all at once, every task has a ticket with its fields filled in, and full task-level requirements are written here for the Sprint 1 tickets. Requirements for later sprints are written as each sprint approaches.

## Sprint cadence and conventions

The eight weeks are grouped into four two-week sprints:

- **Sprint 1**: W1 to W2 (26 Oct to 8 Nov)
- **Sprint 2**: W3 to W4 (9 Nov to 22 Nov)
- **Sprint 3**: W5 to W6 (23 Nov to 6 Dec)
- **Sprint 4**: W7 to W8 (7 Dec to 20 Dec)

Sprint 3 is the busiest of the four, because it straddles the end of the MVP build, the MVP launch and validation checkpoint, and the start of the MMP build. That load is a direct result of compressing a real launch-and-learn period into an eight-week window.

Each ticket carries a title, its epic and feature, a team function, a work type, a sprint forecast taken from the roadmap, and a status. The sprint comes straight from the roadmap by one rule: a feature, and every ticket under it, belongs to the sprint that contains the first week of that feature's roadmap bar. Where a bar runs into the following sprint's weeks, the feature stays in the sprint it started in, so the roadmap and the backlog never disagree. Status values follow the workshop kanban board: Backlog, Up Next, Writing Requirements, Reviewing with Team, Ready for Sprint, and Planned. The Sprint 1 tickets are shown at Writing Requirements because their requirements are drafted below. Everything else sits at Backlog until its sprint approaches.

## Backlog ticket register (all tasks)

| ID | Title | Epic | Feature | Function | Type | Sprint | Status |
|---|---|---|---|---|---|---|---|
| HB-001 | Connect accounts through Plaid or open banking | Foundations | Bank-data integration | Development | Feature | 1 | Writing Requirements |
| HB-002 | Pull and categorize transactions | Foundations | Bank-data integration | Development | Feature | 1 | Writing Requirements |
| HB-003 | Maintain and refresh bank connections | Foundations | Bank-data integration | Development | Feature | 1 | Writing Requirements |
| HB-004 | Sign-up, login, and secure session handling | Foundations | Accounts and authentication | Development | Feature | 1 | Writing Requirements |
| HB-005 | Encrypt and safeguard financial data | Foundations | Security and compliance | Security | Feature | 1 | Writing Requirements |
| HB-006 | Meet financial-data compliance obligations | Foundations | Security and compliance | Compliance | Deliverable | 1 | Writing Requirements |
| HB-007 | First-run flow that connects a bank and reaches first value quickly | Foundations | Onboarding | Design | Feature | 3 | Backlog |
| HB-008 | Establish and apply the kind, no-blame copy system | Shame-Free Engagement | Shame-free tone system | Content Design | Feature | 1 | Writing Requirements |
| HB-009 | Replace daunting reviews with small, low-pressure check-ins | Shame-Free Engagement | Bite-sized check-ins | Design | Feature | 3 | Backlog |
| HB-010 | Light celebrations with no streaks | Shame-Free Engagement | Small wins | Design | Feature | 3 | Backlog |
| HB-011 | Gentle re-entry message after a gap | Shame-Free Engagement | Small wins | Content Design | Feature | 3 | Backlog |
| HB-012 | Auto-allocate income into buckets on deposit | Automatic Allocation | Essentials-first bucketing | Development | Feature | 1 | Writing Requirements |
| HB-013 | Hold a protected food-and-rent floor before discretionary spend | Automatic Allocation | Essentials-first bucketing | Development | Feature | 1 | Writing Requirements |
| HB-014 | Set money aside automatically for upcoming bills | Automatic Allocation | Bill buckets | Development | Feature | 2 | Backlog |
| HB-015 | Carve a guilt-free discretionary bucket within allocation | Automatic Allocation | Fun bucket | Development | Feature | 2 | Backlog |
| HB-016 | Show what is really left to spend after essentials, in real time | Safe-to-Spend Visibility | Real-time safe-to-spend number | Development | Feature | 2 | Backlog |
| HB-017 | Show what is due versus what is already funded | Safe-to-Spend Visibility | Due-and-covered view | Development | Feature | 2 | Backlog |
| HB-018 | Alert at 50 percent and 80 percent of a bucket spent | Proactive Alerts | Threshold alerts | Development | Feature | 2 | Backlog |
| HB-019 | Remind ahead of bill due dates | Proactive Alerts | Early bill alerts | Development | Feature | 2 | Backlog |
| HB-020 | Detect and flag recurring and forgotten charges | Proactive Alerts | Forgotten-subscription flagging | Data | Feature | 3 | Backlog |
| HB-021 | Start and track a simple cushion goal | Basic Savings | Basic savings goals | Development | Feature | 3 | Backlog |
| HB-022 | MVP launch and feedback gathering | Validation checkpoint | MVP launch and feedback | Product | Deliverable | 3 | Backlog |
| HB-023 | Auto-save a set amount when income lands | Emergency Cushion Auto-Save | Automatic cushion | Development | Feature | 3 | Backlog |
| HB-024 | Show visible progress toward the cushion | Emergency Cushion Auto-Save | Automatic cushion | Design | Feature | 3 | Backlog |
| HB-025 | Offer optional shared visibility with a partner | Partner Sharing | Shared household view | Development | Feature | 3 | Backlog |
| HB-026 | Keep a private, no-questions fun bucket for each person | Partner Sharing | Shared household view | Development | Feature | 3 | Backlog |
| HB-027 | Heads-up before a purchase pushes over the agreed budget | Partner Sharing | Shared household view | Development | Feature | 3 | Backlog |
| HB-028 | One-tap cancellation help for forgotten subscriptions | Subscription Cleanup and Cancellation | Cancellation help | Development | Feature | 3 | Backlog |
| HB-029 | Learn each user's spending patterns | Pace-Based Alerts | High-risk-day detection | Data | Feature | 4 | Backlog |
| HB-030 | Heads-up before predictable high-risk days such as payday | Pace-Based Alerts | High-risk-day detection | Development | Feature | 4 | Backlog |
| HB-031 | Keep running through a lapse and welcome the user back without guilt | Forgiving Re-engagement and Coaching | Forgiving re-engagement | Product | Feature | 4 | Backlog |
| HB-032 | Coach the restart | Forgiving Re-engagement and Coaching | Forgiving re-engagement | Product | Feature | 4 | Backlog |
| HB-033 | Shame-free chatbot check-ins and coaching | Forgiving Re-engagement and Coaching | AI chatbot | Development | Feature | 4 | Backlog |
| HB-034 | Deeper dopamine-friendly rewards for steady progress | Fuller Rewards | Rewards system | Design | Feature | 4 | Backlog |

## Sprint 1 ticket requirements

The nine Sprint 1 tickets below carry full task-level requirements, using the workshop's Task-Level Acceptance Criteria template: Resulting Deliverable, User Story Statement, Background, Problem to Solve, Task Goals, Task Scope, Expected Deliverables, Supported Use Case Scenarios, and Acceptance Criteria.

### HB-001: Connect accounts through Plaid or open banking

*Epic: Foundations · Feature: Bank-data integration · Function: Development · Type: Feature · Sprint: 1*

- **Resulting Deliverable:** A working connection flow that links a user's bank accounts through Plaid or an open-banking provider.
- **User Story Statement:** As a new Hyper Budget user, I want to securely connect my bank account in a few taps, so that the app can see my money without me entering anything by hand.
- **Background:** Every other Hyper Budget feature reads from live bank data. Without a reliable connection there is no allocation, no safe-to-spend, and no alerts. This is the first dependency in the build.
- **Problem to Solve:** ADHD users abandon tools that require manual entry and upkeep, so the connection has to be fast, low-friction, and trustworthy.
- **Task Goals:** Let a user link one or more accounts, retrieve account and balance data, and store the connection token securely.
- **Task Scope:** Integrate the provider SDK, build the account-link screen, handle the provider auth handshake, store the access token securely, and confirm a successful link to the user.
- **Expected Deliverables:** The link flow in the app, a secured token store, and clear success and error states.
- **Supported Use Case Scenarios:** A student links a single checking account; a parent links a joint account; a late-diagnosed adult links several accounts at once.
- **Acceptance Criteria:** A user can link at least one account end to end; balances and accounts are retrieved; a failed link shows a clear, shame-free error with a retry; tokens are never exposed on the client.

### HB-002: Pull and categorize transactions

*Epic: Foundations · Feature: Bank-data integration · Function: Development · Type: Feature · Sprint: 1*

- **Resulting Deliverable:** A transaction feed that pulls recent transactions and assigns each a spending category.
- **User Story Statement:** As a user, I want my transactions pulled in and sorted automatically, so that I never have to log or categorize spending myself.
- **Background:** Allocation, safe-to-spend, threshold alerts, and subscription flagging all read categorized transactions, so categorization accuracy drives every downstream number.
- **Problem to Solve:** Manual categorization is exactly the upkeep that makes ADHD users quit, so it must be automatic and good enough to trust.
- **Task Goals:** Pull transactions on a schedule and on demand, assign each a category, and expose them to other features.
- **Task Scope:** Call the provider transaction endpoint, normalize the data, run categorization, store the transactions, and refresh on a schedule.
- **Expected Deliverables:** A stored, categorized transaction feed, a scheduled refresh, and a category model or mapping.
- **Supported Use Case Scenarios:** A student's coffee purchase lands as discretionary; a parent's utility payment lands as a bill; a recurring charge is tagged so it can later be flagged.
- **Acceptance Criteria:** New transactions appear within the refresh window; each has a category; a user can correct a category; the feed is available to allocation and alerts.

### HB-003: Maintain and refresh bank connections

*Epic: Foundations · Feature: Bank-data integration · Function: Development · Type: Feature · Sprint: 1*

- **Resulting Deliverable:** A connection-health system that keeps bank links alive and prompts a gentle reconnect when one lapses.
- **User Story Statement:** As a user, I want my bank connection to keep working on its own, so that the app keeps running even when I am not paying attention.
- **Background:** Open-banking tokens expire and connections break. A silently broken connection makes every number stale, which quietly breaks trust.
- **Problem to Solve:** A lapsed connection is invisible until the data is wrong, so the app must detect and recover from it without blaming the user.
- **Task Goals:** Detect expired or broken connections, refresh tokens automatically where possible, and prompt a shame-free reconnect where not.
- **Task Scope:** Monitor connection status, auto-refresh tokens, detect hard failures, and build a reconnect prompt in the shame-free tone.
- **Expected Deliverables:** A connection-health check, auto-refresh logic, and a reconnect flow.
- **Supported Use Case Scenarios:** A token expires and refreshes silently; a bank forces re-auth and the user is gently asked to reconnect.
- **Acceptance Criteria:** Expired tokens refresh without user action where the provider allows; hard failures trigger a kind reconnect prompt rather than a silent stale state; connection status is visible.

### HB-004: Sign-up, login, and secure session handling

*Epic: Foundations · Feature: Accounts and authentication · Function: Development · Type: Feature · Sprint: 1*

- **Resulting Deliverable:** A secure account system covering sign-up, login, and session management.
- **User Story Statement:** As a new user, I want to create an account and stay signed in safely, so that getting started and coming back are both easy and secure.
- **Background:** The app holds sensitive financial data, so identity and sessions must be secure from day one. This is a Foundations dependency for everything behind a login.
- **Problem to Solve:** A heavy or confusing sign-up loses ADHD users before first value, so security cannot come at the cost of friction.
- **Task Goals:** Let a user sign up and log in, keep sessions secure, and support safe recovery.
- **Task Scope:** Build sign-up and login, hash credentials, manage sessions and tokens, add recovery, and consider biometric unlock.
- **Expected Deliverables:** Sign-up and login flows, secure session handling, and account recovery.
- **Supported Use Case Scenarios:** A student signs up on mobile in under a minute; a returning user unlocks with biometrics; a user recovers a forgotten password.
- **Acceptance Criteria:** A user can sign up, log out, and log back in; credentials are stored hashed; sessions expire safely; recovery works.

### HB-005: Encrypt and safeguard financial data

*Epic: Foundations · Feature: Security and compliance · Function: Security · Type: Feature · Sprint: 1*

- **Resulting Deliverable:** Encryption and data-protection measures covering financial data at rest and in transit.
- **User Story Statement:** As a user, I want my financial data protected to a high standard, so that I can trust the app with the most sensitive thing I have.
- **Background:** The vision flags security and compliance as non-negotiable and easy to underestimate. Trust is the whole relationship with a money app.
- **Problem to Solve:** One breach ends the product, so protection has to be built in rather than bolted on later.
- **Task Goals:** Encrypt data at rest and in transit, protect secrets, and limit data exposure.
- **Task Scope:** Enforce TLS, encrypt the data store, secure key and token management, apply least-privilege access, and add logging and monitoring.
- **Expected Deliverables:** Encryption at rest and in transit, a secrets-management setup, and access controls.
- **Supported Use Case Scenarios:** Data moves between app and provider over encrypted channels; the stored database is encrypted; a lost device does not expose data.
- **Acceptance Criteria:** All financial data is encrypted at rest and in transit; secrets are not held in source; access is least-privilege; a security review passes.

### HB-006: Meet financial-data compliance obligations

*Epic: Foundations · Feature: Security and compliance · Function: Compliance · Type: Deliverable · Sprint: 1*

- **Resulting Deliverable:** A documented compliance baseline for handling financial data in the target market.
- **User Story Statement:** As the product owner, I want the app to meet its compliance obligations, so that we can handle real financial data lawfully and keep user trust.
- **Background:** Handling bank data brings legal and regulatory obligations that raise cost and the bar for trust, and they must be understood before launch.
- **Problem to Solve:** Compliance gaps surface late and expensively, so they need to be mapped early while the build is still flexible.
- **Task Goals:** Identify applicable obligations, map them to product requirements, and document the baseline.
- **Task Scope:** Identify relevant regulations (data protection, financial-data handling, open-banking rules), map each to a product requirement, document consent and data handling, and plan audits.
- **Expected Deliverables:** A compliance requirements map, a data-handling and consent policy, and an audit plan.
- **Supported Use Case Scenarios:** A user gives informed consent to connect accounts; a user requests their data be deleted; an audit can be evidenced.
- **Acceptance Criteria:** Applicable obligations are documented; each maps to a product requirement; consent and deletion are supported; the baseline is signed off.

### HB-008: Establish and apply the kind, no-blame copy system

*Epic: Shame-Free Engagement · Feature: Shame-free tone system · Function: Content Design · Type: Feature · Sprint: 1*

- **Resulting Deliverable:** A shame-free content and tone system (voice, principles, and reusable copy patterns) applied across the app.
- **User Story Statement:** As a user who carries money shame, I want the app to speak to me kindly and without blame, so that opening it never makes me feel worse.
- **Background:** Shame-free tone is table stakes in this niche and central to the positioning, so it must exist as a system before later features are written in that voice.
- **Problem to Solve:** Financial avoidance is driven by shame, so harsh or judgmental copy would reproduce the exact feeling that makes users quit.
- **Task Goals:** Define the voice and principles, build reusable copy patterns for common moments, and apply them across existing screens.
- **Task Scope:** Write voice-and-tone principles, create copy patterns for alerts, errors, empty states, and re-entry, review every screen against them, and document for reuse.
- **Expected Deliverables:** A tone-and-voice guide, a reusable copy-pattern set, and applied copy across current screens.
- **Supported Use Case Scenarios:** An over-threshold alert reads as a gentle heads-up rather than a scolding; an error invites a retry without blame; a return after a gap is welcomed warmly.
- **Acceptance Criteria:** A documented tone system exists; copy patterns cover the key moments; no current screen uses blaming or shaming language; later tickets reference the system.

### HB-012: Auto-allocate income into buckets on deposit

*Epic: Automatic Allocation · Feature: Essentials-first bucketing · Function: Development · Type: Feature · Sprint: 1*

- **Resulting Deliverable:** An allocation engine that splits incoming income into buckets automatically when a deposit lands.
- **User Story Statement:** As a user, I want my money sorted into buckets the moment it arrives, so that staying on budget does not depend on me remembering to do anything.
- **Background:** Automatic allocation is the core engine the whole product sits on. It is the mechanism proven in lived experience and validated by the Revolut pattern.
- **Problem to Solve:** Allocation that depends on willpower and memory gets abandoned, so it has to happen on its own, on deposit.
- **Task Goals:** Detect income deposits, split them into user-defined buckets automatically, and update balances.
- **Task Scope:** Detect a deposit from the transaction feed, apply the user's allocation rules, update bucket balances, and handle irregular and lumpy income.
- **Expected Deliverables:** The allocation engine, bucket balances, and handling for irregular income.
- **Supported Use Case Scenarios:** A student's part-time paycheck is split across essentials and fun automatically; a parent's salary funds bill buckets first; lumpy income is still allocated proportionally.
- **Acceptance Criteria:** A detected deposit is split per the user's rules without manual action; balances update; irregular income is handled; the split is visible.

### HB-013: Hold a protected food-and-rent floor before discretionary spend

*Epic: Automatic Allocation · Feature: Essentials-first bucketing · Function: Development · Type: Feature · Sprint: 1*

- **Resulting Deliverable:** A protected essentials floor that is funded before any discretionary bucket.
- **User Story Statement:** As a student, I want my food and rent money set aside first and kept safe, so that running short never means going hungry or asking for help.
- **Background:** Protecting essentials automatically is a core business goal and the mechanism that makes a slip survivable. It sits directly on top of the allocation engine.
- **Problem to Solve:** When essentials are not ring-fenced, money drains on small buys before rent and food are covered, so the floor removes that risk by design.
- **Task Goals:** Define an essentials floor, fund it before discretionary buckets, and protect it from overspend.
- **Task Scope:** Let the user set an essentials floor, prioritize it in allocation, prevent discretionary spend from drawing it down, and surface it for safe-to-spend later.
- **Expected Deliverables:** A configurable essentials floor, priority funding logic, and protection rules.
- **Supported Use Case Scenarios:** A student's rent and grocery money is funded before any fun money; an attempt to overspend is held against discretionary rather than essentials.
- **Acceptance Criteria:** The essentials floor is funded before discretionary buckets on every allocation; it cannot be silently drained by discretionary spend; the user can see it is protected.

---

*Prepared 25 October 2026. This single deliverable combines the epics, features, and tasks, the eight-week release roadmap, and the backlog for Hyper Budget. It reuses findings and scope from the approved Product Release Vision and Scope. The backlog gives every task a ticket and writes full task-level requirements for the Sprint 1 tickets, following the workshop's guidance that a backlog is populated incrementally. Week and sprint placements are planning estimates showing sequence and dependencies, not committed delivery dates.*

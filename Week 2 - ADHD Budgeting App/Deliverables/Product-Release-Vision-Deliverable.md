# Hyper Budget: Product Release Vision and Scope Deliverable

AI Development Residency, Week 2. This is the single, combined deliverable for Hyper Budget's product release. It brings together three things that belong as one: the release vision, the prioritization (of problems and of use cases, per audience), and the release scope (the MVP and MMP, each with its Scope of Outcomes). It builds on and reuses the approved Audience Segmentation and Market, Competitor, and Feature Analysis deliverables, rather than inventing new findings. Everything is written in plain English, with no em dashes.

A note on coverage. This covers the vision, the prioritization, and the release scope. Only the roadmap comes after this. A note on the numbers: cost figures are best-practice estimates, not quotes, and KPI figures are published benchmark ranges, not targets we commit to hitting. One product decision runs through the scope: we compete with Rocket Money on subscription cleanup (flagging in the MVP, cancellation help in the MMP), which carries the execution risk noted in the barriers.

The document has three parts:

- Part 1, Vision Components.
- Part 2, Prioritization by Audience (problems and use cases).
- Part 3, Release Scope (MVP and MMP) with Scope of Outcomes.

---

# Part 1: Vision Components

## 1. Your Business's "Why"

Hyper Budget exists to make budgeting easier for neurodivergent people, especially those with ADHD.

The motivation is personal and lived. As a student who has not been diagnosed with ADHD, I still get distracted, miss payments, and find myself with less money than I anticipated. If that happens to me, it is very likely harder for people who do have ADHD, because they have even more to keep track of. Hyper Budget exists so that staying on top of money no longer depends on the focus, memory, and consistency that ADHD makes unreliable, and so that managing money stops being one more thing neurodivergent people feel they fail at.

## 2. Target Audiences

Hyper Budget has three target audience segments, carried over from the persona analysis. All three share the same core need: automatic allocation, real-time visibility, and gentle nudges, without the setup-and-maintenance burden that makes them abandon general tools.

- **Students managing their own money for the first time (roughly 18 to 24).** Small, lumpy income, no financial routines yet, and a high value placed on independence.
- **Parents holding the household together (30s to 40s).** Often diagnosed late, carrying the household mental load, where a slip hits their kids and partner, not just themselves.
- **Late-diagnosed adults rebuilding self-trust (roughly 24 to 45).** Income that "should be enough" keeps leaking, with years of money struggles they blamed on themselves. This is the strongest research-supported segment.

## 3. Problems and Opportunities

What happens today that we want to improve, organized by audience. As the workshop notes, these are working assumptions, drawn from the persona frictions and use-case tables in the Audience Segmentation deliverable.

**Students:**

- Losing track of spending, so money drains on small impulse and non-urgent buys before essentials are covered.
- Impulse and non-urgent purchases driven by reward-now wiring.
- Pride and independence mean they would rather go without, even go hungry, than ask for help.

**Parents:**

- Forgotten bills and due dates in the daily rush lead to late fees and overdrafts that hit the whole family.
- Impulse purchases become a source of money conflict with a partner.
- Budgeting takes more focus and upkeep than they have, so systems get set up and abandoned.

**Late-diagnosed adults:**

- Income that should be enough leaks through impulse buys and forgotten subscriptions, and savings never build.
- Financial avoidance driven by shame: they do not look at their money at all.
- General budgeting tools require willpower and memory, so they get set up and abandoned (the Revolut pattern).

## 4. Business Goals

- Help ADHD users stay with a budgeting app instead of abandoning it, which is the outcome no competitor reliably delivers.
- Protect users' essential spending (food, rent, bills) automatically, so a slip cannot sink the month.
- Reduce the late fees and overdrafts that make up the ADHD tax.
- Make budgeting low-effort, so it runs with minimal setup and upkeep and keeps working even when the user disengages.
- Rebuild users' confidence and self-trust with money, replacing shame with a system that works with their brain.

## 5. Value For Each Problem

This product will bring the following value when we release: money managed automatically, so staying on top of it no longer depends on focus, memory, or willpower.

Because these problems exist in the world today that we will solve: conventional budgeting relies on the focus, memory, and consistency that ADHD makes unreliable, so people lose track of spending, buy on impulse, miss bills, avoid their accounts out of shame, and abandon the tools meant to help.

**Value for Students:** Food and rent money is set aside automatically, a clear safe-to-spend number is always visible, the app is free to start and needs almost no upkeep, and when they drift it welcomes them back without shame.

**Value for Parents:** Bills are tracked and funded on their own, a partner can share the view if they want, and the system runs with almost no upkeep, keeping working through the weeks a busy parent cannot check in.

**Value for Late-diagnosed adults:** The tone is kind and shame-free by design, recurring and forgotten charges are spotted, a set amount is saved so a cushion finally grows, and most of all it keeps running through a lapse and coaches them through the restart.

## 6. Unique Value Proposition

The ADHD essentials (automatic allocation, safe-to-spend, shame-free tone) are now table stakes in this niche, so the unique value sits in the gaps almost no one fills.

**Unique value proposition:** "Budgeting that works even when your brain won't, and keeps working after you fall off. Hyper Budget automatically protects your essentials and shows a safe-to-spend number in real time, then welcomes you back without guilt when you drift and coaches you through it, so people with ADHD finally stay with a money app instead of abandoning one more."

Our competitive advantage, stated against the market:

- Unlike mainstream apps such as Revolut, YNAB, and Monarch, which are not built for ADHD and demand constant upkeep, Hyper Budget runs automatically and in the background.
- Unlike the closest ADHD-built rival, Cake Budget, which is web-first and does nothing to help you restart after you fall off, Hyper Budget is mobile-first and wins on forgiving re-engagement.
- Unlike every competitor, direct or mainstream, Hyper Budget provides forgiving re-engagement after a lapse, dopamine-friendly feedback, and built-in ADHD coaching.

Cake Budget is the main product to beat. Hyper Budget beats it on the pieces it lacks rather than on the pieces it already does well.

## 7. Barriers and Risks to Your Product's Success

**The main barrier:** The product cannot reliably detect a purchase before it happens. Reading bank data through open banking shows a transaction after the card is authorized, not before, and the app has no hook into third-party shopping apps or in-person purchases.

**How we resolve and mitigate it:**

1. Bucket money ahead of time and only leave what is safe to spend, so the only money available to impulse-spend is already the safe amount. Proven in practice from lived experience.
2. Analyse spending patterns to find high-risk days and send an automatic heads-up ahead of those moments, based on the user's own patterns.

**Secondary risks:**

- Cake Budget already does automatic allocation and a pre-spend traffic light, so the ADHD essentials no longer differentiate on their own; we must win on re-engagement, coaching, and a mobile-first build.
- Competing with Rocket Money on subscription cancellation means out-building the category leader at its signature feature, a real execution and integration risk.
- Handling sensitive financial data brings security and compliance obligations that raise cost and the bar for trust.
- The ADHD-budgeting niche is early, small, and untracked, so demand exists but there is no proven ADHD-native winner yet.

## 8. Costs that Go Into the Release

Best-practice estimate categories, meant to show the shape of the investment, not a budget or a quote.

- Product and UX design for the ADHD-first flows, where the differentiator lives.
- Mobile and web development, a core commitment and the largest single cost.
- Bank-data integration (Plaid or open banking), with ongoing per-connection fees.
- The allocation and nudge engine that ring-fences essentials and sends pattern-based alerts.
- AI assistant and coaching, including model or API costs that scale with usage.
- QA, security, and compliance for financial data, non-negotiable and easy to underestimate.
- User research to validate the assumptions flagged above.
- Launch and marketing, especially the "already tried an app and quit" entry point.
- Ongoing maintenance of bank connections, the app, and content.

The MMP adds the pace-based alert engine, partner-sharing, emergency-cushion auto-save, subscription cancellation integrations, a fuller rewards system, and the AI chatbot, alongside onboarding, security hardening, and a pricing model.

## 9. Key Performance Indicators to Measure Success

Measured against authoritative product-analytics and fintech benchmarks. Because Hyper Budget is planned, these describe how we will measure success once it ships.

North Star: **weekly active users who stayed within their safe-to-spend plan.** The five KPIs below feed it.

- For *make budgeting low-effort and drive the core habit*: **auto-allocation activation rate**, the percentage who turn on automatic bucketing in week one (benchmark 30 to 40% median, 55 to 65% strong; activated users retain at 2 to 3x).
- For *help users stay instead of abandoning*: **retention (Day 30 and Day 90)** (benchmark Day 30 of 18 to 22% median and 35%+ top; Day 90 of 10 to 14% median and 25%+ top).
- For *keep users through the lapses where they quit*: **re-engagement rate**, the percentage of lapsed users (30-day churn signal) who return and act. The most differentiating KPI.
- For *get users to value quickly*: **time-to-first-value**, the percentage reaching a funded bucket or safe-to-spend view within 72 hours.
- For *make users' financial lives genuinely easier*: **Net Promoter Score**, by survey (benchmark 30 to 45 typical, 50 to 65 for strong habit loops).

Deliberately left off: raw daily or weekly active user counts (misleading for a background app), and average late-fee reduction (cannot be attributed cleanly; folded into the NPS survey).

*KPI benchmark sources: UXCam Mobile App Retention Benchmarks (compiling AppsFlyer State of App Marketing 2025, Adjust, data.ai); Lifecycle Architect Retention Strategy for Fintech; Amplitude Product North Star Metric.*

## 10. Key Use Cases to Support for the Release

From the "future scenarios to support" in the Audience Segmentation deliverable.

**Students:** auto-allocate income into buckets and hold a protected food-and-rent floor; show a live picture of what is left after essentials with a gentle nudge before an impulse buy; give an early, private warning when the essentials floor is at risk.

**Parents:** track bills automatically and set money aside for them; offer optional shared visibility with a partner plus a personal fun bucket; keep working with no manual entry and welcome the user back gently after a gap.

**Late-diagnosed adults:** detect recurring and forgotten charges and auto-save a set amount; keep a shame-free tone with bite-sized check-ins; keep running through a lapse, welcome the user back without guilt, and coach them through the restart.

---

# Part 2: Prioritization by Audience

The problems and use cases above are prioritized here, per audience, with two Must-Should-Could-Won't (MoSCoW) matrices paired together so vision and scope can be quick-checked against each other.

- **Problems are prioritized on Risk vs. Certainty.** Risk is how likely the product fails if the problem is not solved; certainty is how confident we are, from research and lived experience, that it is a real problem. Quadrants: top-left is High Priority (high risk + high certainty), top-right is Top Priority (high risk + low certainty), bottom-left is Low Priority (low risk + high certainty), bottom-right is Medium Priority (low risk + low certainty).
- **Use cases are prioritized on Effort vs. Value.** Effort is complexity to build; value is to users and the business. Quadrants: top-left is Medium (low effort + low value), top-right is Top (low effort + high value), bottom-left is Low (high effort + low value), bottom-right is High (high effort + high value).

Effort is judged from the feature analysis (core and table-stakes items are low effort, novel or later-phase items are high effort) and the Known Limitation (literal pre-purchase interception is high effort, so it is delivered through bucketing and pace alerts).

## Audience 1: Students

**Problem priority (Risk vs. Certainty)**

| | High certainty (left) | Low certainty (right) |
|---|---|---|
| **High risk (top)** | **(2) High Priority:** Losing track of spending, money drains before essentials; Impulse and non-urgent purchases | **(1) Top Priority:** (none) |
| **Low risk (bottom)** | **(4) Low Priority:** Pride, would rather go without than ask for help | **(3) Medium Priority:** (none) |

The students persona is grounded in primary lived-experience input, and the bucket-ahead and visibility mechanism is already proven in practice, so the visibility and impulse problems are high certainty. Pride is a documented motivation (certain) but covered through the early-warning and private handling already built for essentials, so it is low risk.

**Use case priority (Effort vs. Value)**

| | Low value (left) | High value (right) |
|---|---|---|
| **Low effort (top)** | **(3) Medium:** light celebrations; guilt-free fun bucket | **(1) Top:** auto-allocate into a protected essentials floor; live safe-to-spend view; 50/80% threshold alerts; shame-free framing; early warning before the floor is at risk |
| **High effort (bottom)** | **(4) Low:** subscription cancellation help; partner sharing | **(2) High:** pace-based nudge before high-risk days; auto-save safety-net bucket; forgiving re-engagement and coaching |

Quick check: the two high-priority problems map straight to the Top and High use cases. Subscription cancellation and partner sharing fall to Low, which fits, students are not who those are for.

## Audience 2: Parents

**Problem priority (Risk vs. Certainty)**

| | High certainty (left) | Low certainty (right) |
|---|---|---|
| **High risk (top)** | **(2) High Priority:** Forgetting bills, late fees and overdrafts; Too much upkeep, so the budget gets abandoned | **(1) Top Priority:** (none) |
| **Low risk (bottom)** | **(4) Low Priority:** (none) | **(3) Medium Priority:** Impulse buys causing partner money conflict |

Bill-forgetting is the classic ADHD tax and abandonment is the serial-app-abandoner problem the research flags as a huge, self-identified one, so both are high certainty even though the parents persona is the most inferred. Partner conflict is low risk (partner sharing is a later feature) and low certainty (not a recognized behavioral segment).

**Use case priority (Effort vs. Value)**

| | Low value (left) | High value (right) |
|---|---|---|
| **Low effort (top)** | **(3) Medium:** light celebrations | **(1) Top:** automatic bill tracking and auto-set-aside; clear "what's due and what's covered" view; auto-allocation with near-zero upkeep; threshold alerts |
| **High effort (bottom)** | **(4) Low:** subscription cancellation help | **(2) High:** shared view with a private fun bucket; heads-up before going over the agreed budget; auto-save family cushion; gentle re-entry after a gap |

Quick check: bills and low-upkeep (the high-priority problems) sit in Top. Partner sharing is high effort but genuinely high value for this persona, so it earns the one High slot it gets anywhere.

## Audience 3: Late-diagnosed adults

**Problem priority (Risk vs. Certainty)**

| | High certainty (left) | Low certainty (right) |
|---|---|---|
| **High risk (top)** | **(2) High Priority:** Income leaking via impulse buys and forgotten subscriptions; Financial avoidance from shame; Tools need willpower and memory, so they get abandoned | **(1) Top Priority:** (none) |
| **Low risk (bottom)** | **(4) Low Priority:** (none) | **(3) Medium Priority:** (none) |

This is the strongest research-supported segment, and all three problems map to recognized behavioral segments (subscription forgetters, financial avoiders, serial app abandoners), so all are high risk and high certainty.

**Use case priority (Effort vs. Value)**

| | Low value (left) | High value (right) |
|---|---|---|
| **Low effort (top)** | **(3) Medium:** light celebrations | **(1) Top:** auto-allocate with near-zero upkeep; shame-free tone and bite-sized check-ins; real-time view of the leaks; flag recurring and forgotten charges; threshold alerts |
| **High effort (bottom)** | **(4) Low:** partner sharing | **(2) High:** auto-save emergency cushion; subscription cleanup and cancellation help; pace-based alerts; forgiving re-engagement and chatbot coaching |

Quick check: this is the one segment where subscription cleanup earns a High slot (their core leak problem), and partner sharing drops to Low. The shame-free check-ins are the standout low-effort, high-value win.

## What the prioritization tells us

Two findings carry into scope. First, Top Priority (high risk + low certainty) is empty across all three problem matrices, because our problems are well understood. The genuine high-risk, low-certainty bet is not a problem but a solution assumption, that forgiving re-engagement will actually retain users. No competitor does it, so it is unproven, and it is the pillar of the positioning. That is the assumption to validate first.

Second, the Top-priority use cases are identical across all three audiences (automatic allocation, safe-to-spend, threshold alerts, shame-free tone). That is the MVP, confirmed from a second angle. The audiences diverge only in the high-effort quadrant, which is exactly what the MMP is for, and it shows subscription cancellation is worth building for the late-diagnosed segment but not the others, while partner sharing is worth building for parents but not the others.

---

# Part 3: Release Scope (MVP and MMP) with Scope of Outcomes

The MVP is the smallest version that tests the core bet: does an automatic, shame-free, low-upkeep system keep ADHD users where they quit everything else. The MMP is the smallest version good enough to launch publicly and hold its own against YNAB, Revolut, and Rocket Money.

Each vision board below is laid out as the board matrix from the template: the Vision Statement sits above a three-by-three grid (Audience, User and Business Problems, Business Goals, then Value, Competitive Advantage, Barriers, then Costs, KPIs, Use Cases). Cells that are product-level (Business Goals, Competitive Advantage, Barriers, KPIs) are summarized in the grid and point to the full list in Part 1. Each board is followed by its Scope of Outcomes matrix, which uses only the value items on that board.

The feature scope the boards draw on. MVP: automatic allocation (essentials first); safe-to-spend number; early bill alerts and forgotten-subscription flagging; threshold alerts at 50% and 80%; small wins (light celebrations, no streaks); basic savings goals; and a shame-free tone throughout. MMP adds: pace-based alerts; partner sharing; emergency cushion auto-save; subscription cleanup and cancellation help; fuller rewards; and a shame-free AI chatbot, plus onboarding, security, and pricing.

## Audience 1: Students

### MVP Vision Board

**Vision Statement:** "Hyper Budget keeps a student's food and rent safe automatically and shows what is really left to spend, so running short never means having to ask for help."

| Audience | User Problems and Business Problems | Business Goals |
|---|---|---|
| Students, roughly 18 to 24, managing their own money for the first time. | Losing track of spending so money drains before essentials; impulse and non-urgent purchases. | Protect essentials automatically; make budgeting low-effort; help them stay instead of abandoning; rebuild confidence. (Full list: section 4.) |
| **Value For Each Problem** | **Competitive Advantage** | **Barriers to Product Success** |
| For losing track: essentials ring-fenced automatically with a real-time safe-to-spend number. For impulse: the trade-off made visible in the moment plus a guilt-free fun bucket. | ADHD-native, automatic, shame-free, mobile-first; wins on forgiving re-engagement, coaching, and dopamine feedback that rivals lack. (Full list: section 6.) | Cannot detect a purchase before it happens (mitigated by bucketing); Cake Budget competition; data security and compliance; early unproven niche. (Full list: section 7.) |
| **Costs** | **Key Performance Indicators** | **Use Cases to Support** |
| Design, mobile and web build, bank integration, allocation and alert engine, basic savings goals, QA and security, research, launch, maintenance. (Section 8.) | Auto-allocation activation; Day 30/90 retention; re-engagement rate; time-to-first-value; NPS. (Section 9.) | Auto-allocate income and hold a protected food-and-rent floor; live picture of what is left after essentials; 50/80% threshold alerts; a light celebration when a bill is paid on time. |

### MVP Scope of Outcomes (Students)

| Value | Associated Problem to Solve | List of Outcomes to Achieve to Solve the Problem and Bring the Value | Resulting Scope Items |
|---|---|---|---|
| Essentials ring-fenced, real-time safe-to-spend | Losing track of spending, money drains before essentials | See spending in real time; essentials protected before any discretionary spend; catch a drain early | Automatic allocation; safe-to-spend number; threshold alerts |
| Trade-off visible, guilt-free fun money | Impulse and non-urgent purchases | Make the trade-off visible in the moment; keep a guilt-free fun bucket; reward sticking to the plan | Safe-to-spend number; a dedicated fun bucket within allocation; small wins |

### MMP Vision Board

**Vision Statement:** "Hyper Budget nudges a student before the risky moments, quietly builds their first safety net, and coaches them back without shame when they drift."

| Audience | User Problems and Business Problems | Business Goals |
|---|---|---|
| The same students, served by the public-launch version. | Impulse spending on predictable high-risk days; never building any cushion, so a shortfall becomes real deprivation. | Protect essentials automatically; keep them through the lapses where they quit; rebuild confidence. (Full list: section 4.) |
| **Value For Each Problem** | **Competitive Advantage** | **Barriers to Product Success** |
| For high-risk-day spending: a pace-based heads-up before the risky moment. For no cushion: a safety-net bucket that fills automatically with visible progress, plus shame-free coaching when they drift. | Forgiving re-engagement and coaching that no rival offers; dopamine-friendly feedback; mobile-first. (Full list: section 6.) | Pace alerts depend on spending history; the re-engagement bet is unproven; data security and compliance. (Full list: section 7.) |
| **Costs** | **Key Performance Indicators** | **Use Cases to Support** |
| Adds the pace-alert engine, emergency-cushion auto-save, fuller rewards, and the AI chatbot, plus onboarding, security, and pricing. (Section 8.) | Re-engagement rate; Day 30/90 retention; auto-allocation activation; NPS. (Section 9.) | A pace alert ahead of a known high-risk day; auto-save into a safety-net bucket; welcome back without guilt after a lapse and coach the restart; fuller rewards for steady progress. |

### MMP Scope of Outcomes (Students)

| Value | Associated Problem to Solve | List of Outcomes to Achieve to Solve the Problem and Bring the Value | Resulting Scope Items |
|---|---|---|---|
| Heads-up before risky moments | Impulse spending on high-risk days | Warn ahead of payday and other high-risk days using the student's own patterns | Pace-based alerts |
| Safety net built quietly, shame-free restart | No cushion; drifting away from the plan | Auto-save a small amount with visible progress; welcome back without guilt; coach the restart | Emergency cushion auto-save; forgiving re-engagement; AI chatbot; fuller rewards |

## Audience 2: Parents

### MVP Vision Board

**Vision Statement:** "Hyper Budget makes sure a parent's bills are always covered without the mental load, so a forgotten due date never hits the family."

| Audience | User Problems and Business Problems | Business Goals |
|---|---|---|
| Parents, 30s to 40s, carrying the household mental load. | Forgetting bills, leading to late fees and overdrafts that hit the family; budgeting takes more upkeep than they have, so systems get abandoned. | Protect essentials and bills automatically; cut late fees and overdrafts; keep budgeting low-effort; help them stay instead of abandoning. (Full list: section 4.) |
| **Value For Each Problem** | **Competitive Advantage** | **Barriers to Product Success** |
| For forgotten bills: bills tracked and funded automatically, so a due date is never missed for lack of memory. For upkeep: the system runs with almost no upkeep and keeps working through a gap, welcoming them back with no blame. | ADHD-native, automatic, shame-free, mobile-first; forgiving re-engagement and low upkeep that rivals lack. (Full list: section 6.) | Bill tracking is table stakes, not a differentiator; Cake Budget competition; data security and compliance; early unproven niche. (Full list: section 7.) |
| **Costs** | **Key Performance Indicators** | **Use Cases to Support** |
| Design, mobile and web build, bank integration, allocation and alert engine, basic savings goals, QA and security, research, launch, maintenance. (Section 8.) | Auto-allocation activation; Day 30/90 retention; re-engagement rate; time-to-first-value; NPS. (Section 9.) | Automatic bill tracking with reminders and auto-set-aside; a clear "what's due and what's covered" view; threshold alerts; a light celebration when a bill is paid on time. |

### MVP Scope of Outcomes (Parents)

| Value | Associated Problem to Solve | List of Outcomes to Achieve to Solve the Problem and Bring the Value | Resulting Scope Items |
|---|---|---|---|
| Bills tracked and funded automatically | Forgetting bills, late fees and overdrafts | Never miss a bill for lack of memory; money set aside before it is due; a clear due-and-covered view | Early bill alerts; automatic allocation (bill buckets); safe-to-spend number |
| Runs with almost no upkeep | Too much upkeep, so the budget gets abandoned | Keep working with no manual entry; keep working through a gap; make returning easy, not shameful | Automatic allocation; threshold alerts; small wins; shame-free tone |

### MMP Vision Board

**Vision Statement:** "Hyper Budget lets a couple run the household budget together without blame, sets money aside for bills and a family cushion on its own, and clears the subscriptions quietly draining them."

| Audience | User Problems and Business Problems | Business Goals |
|---|---|---|
| The same parents, served by the public-launch version. | Impulse purchases that become money conflict with a partner; carrying the budget alone and never building a family cushion. | Reduce money conflict at home; protect the family's stability; rebuild confidence; help them stay. (Full list: section 4.) |
| **Value For Each Problem** | **Competitive Advantage** | **Barriers to Product Success** |
| For partner conflict: an optional shared view with a personal no-questions fun bucket, so spending is transparent and agreed without blame. For carrying it alone: a family cushion that fills automatically, pace alerts, and subscription cleanup. | ADHD-native partner sharing with a private fun bucket, which mainstream couple apps do not frame for ADHD; forgiving re-engagement. (Full list: section 6.) | Partner sharing is a larger build; out-building Rocket Money on subscription cancellation is a real risk; data security and compliance. (Full list: section 7.) |
| **Costs** | **Key Performance Indicators** | **Use Cases to Support** |
| Adds partner sharing, the pace-alert engine, emergency-cushion auto-save, subscription cancellation integrations, fuller rewards, and the AI chatbot, plus onboarding, security, and pricing. (Section 8.) | Re-engagement rate; Day 30/90 retention; auto-allocation activation; NPS. (Section 9.) | Optional shared visibility with a partner plus a personal fun bucket; a heads-up when a purchase would push over the agreed budget; auto-save into a family cushion; subscription cleanup that flags and cancels forgotten subscriptions. |

### MMP Scope of Outcomes (Parents)

| Value | Associated Problem to Solve | List of Outcomes to Achieve to Solve the Problem and Bring the Value | Resulting Scope Items |
|---|---|---|---|
| Shared view, private fun bucket | Impulse buys causing partner money conflict | Make discretionary spending transparent and agreed; keep a no-questions fun bucket; a heads-up before going over the agreed budget | Partner sharing; pace-based alerts |
| Family cushion and cleared drains | Carrying it alone, no cushion, quiet subscription leaks | Auto-save a family cushion with visible progress; flag and cancel forgotten subscriptions | Emergency cushion auto-save; subscription cleanup help |

## Audience 3: Late-diagnosed adults

### MVP Vision Board

**Vision Statement:** "Hyper Budget makes money feel safe to look at again, automatically protecting what matters and flagging the leaks, with zero shame and near-zero upkeep."

| Audience | User Problems and Business Problems | Business Goals |
|---|---|---|
| Adults roughly 24 to 45 diagnosed in adulthood, carrying years of money shame. The strongest research-supported segment. | Income leaking through impulse buys and forgotten subscriptions with no savings; financial avoidance from shame; tools need willpower and memory, so they get abandoned. | Help them stay instead of abandoning; protect essentials automatically; make budgeting low-effort; rebuild self-trust. (Full list: section 4.) |
| **Value For Each Problem** | **Competitive Advantage** | **Barriers to Product Success** |
| For leaking income: auto-allocation with near-zero upkeep and forgotten charges flagged so leaks become visible. For avoidance: a shame-free tone and bite-sized check-ins. For willpower-and-memory tools: allocation and visibility automatic out of the box. | ADHD-native, shame-free, automatic; forgiving re-engagement and coaching no rival offers; mobile-first. (Full list: section 6.) | Cannot detect a purchase before it happens (mitigated by bucketing); subscription flagging overlaps Rocket and Auritrack; data security and compliance; early unproven niche. (Full list: section 7.) |
| **Costs** | **Key Performance Indicators** | **Use Cases to Support** |
| Design, mobile and web build, bank integration, allocation and alert engine, subscription flagging, basic savings goals, QA and security, research, launch, maintenance. (Section 8.) | Auto-allocation activation; Day 30/90 retention; re-engagement rate; time-to-first-value; NPS. (Section 9.) | Auto-allocate income; flag recurring and forgotten charges; bite-sized shame-free check-ins with threshold alerts; a basic savings goal to start a cushion, with light celebrations. |

### MVP Scope of Outcomes (Late-diagnosed adults)

| Value | Associated Problem to Solve | List of Outcomes to Achieve to Solve the Problem and Bring the Value | Resulting Scope Items |
|---|---|---|---|
| Auto-allocation and visible leaks | Income leaking via impulse buys and forgotten subscriptions | Auto-allocate with near-zero upkeep; make recurring and forgotten charges visible; start a cushion | Automatic allocation; forgotten-subscription flagging; basic savings goals |
| Money safe to look at | Financial avoidance driven by shame | Make checking money feel safe; replace a daunting review with bite-sized check-ins; no punishment for slips | Shame-free tone; threshold alerts; small wins |
| Runs without willpower | Tools need willpower and memory, so they get abandoned | Allocation and visibility automatic out of the box; minimal setup and upkeep | Automatic allocation; safe-to-spend number |

### MMP Vision Board

**Vision Statement:** "Hyper Budget finally builds the cushion they never managed, clears the subscriptions draining them, and coaches them back without shame, so money becomes something they trust themselves with."

| Audience | User Problems and Business Problems | Business Goals |
|---|---|---|
| The same late-diagnosed adults, served by the public-launch version. | Never building an emergency cushion; subscriptions still draining them, where flagging alone is not enough; needing deeper, ongoing support to rebuild self-trust through lapses. | Rebuild self-trust; keep them through the lapses where they quit; protect the money that should already be enough. (Full list: section 4.) |
| **Value For Each Problem** | **Competitive Advantage** | **Barriers to Product Success** |
| For no cushion: a set amount auto-saved the moment income lands. For draining subscriptions: cleanup that makes cancelling easy, not just flagging. For rebuilding self-trust: a shame-free chatbot, pace alerts, and forgiving re-engagement that keeps running through a lapse. | Forgiving re-engagement and coaching no rival offers; subscription cleanup taken head-to-head against Rocket Money; mobile-first. (Full list: section 6.) | Out-building Rocket Money on subscription cancellation is the main risk; the re-engagement and chatbot build is heavy and needs guardrails; data security and compliance. (Full list: section 7.) |
| **Costs** | **Key Performance Indicators** | **Use Cases to Support** |
| Adds emergency-cushion auto-save, subscription cancellation integrations, the pace-alert engine, fuller rewards, and the AI chatbot, plus onboarding, security, and pricing. (Section 8.) | Re-engagement rate; Day 30/90 retention; NPS; auto-allocation activation. (Section 9.) | Auto-save a set amount with visible cushion progress; one-tap cancellation help for forgotten subscriptions; pace alerts on high-risk days; a shame-free chatbot check-in and coaching through a restart. |

### MMP Scope of Outcomes (Late-diagnosed adults)

| Value | Associated Problem to Solve | List of Outcomes to Achieve to Solve the Problem and Bring the Value | Resulting Scope Items |
|---|---|---|---|
| A cushion that finally grows | Never managing to build an emergency cushion | Auto-save a set amount the moment income lands; show visible progress toward a cushion | Emergency cushion auto-save |
| Cancelling made easy | Subscriptions still draining them | Go beyond flagging; make cancelling forgotten subscriptions easy | Subscription cleanup help |
| Shame-free, ongoing support | Needing deeper support to rebuild self-trust through lapses | Keep running through a lapse; welcome back without guilt; coach the restart; warn ahead of high-risk days | Forgiving re-engagement; AI chatbot; pace-based alerts; fuller rewards |

---

*Prepared 25 October 2026. This single deliverable combines the product release vision, the problem and use-case prioritization, and the MVP and MMP release scope with their Scope of Outcomes. Only the roadmap follows separately. It reuses findings from the approved Audience Segmentation and Market, Competitor, and Feature Analysis (revised 25 October 2026) deliverables, plus the agreed MVP and MMP scope. The subscription cleanup line reflects the decision to compete with Rocket Money on cancellation (flagging in the MVP, cancellation help in the MMP), with the execution risk noted in the barriers. Cost figures are best-practice estimates, not quotes, and KPI figures are published benchmark ranges, not committed targets.*

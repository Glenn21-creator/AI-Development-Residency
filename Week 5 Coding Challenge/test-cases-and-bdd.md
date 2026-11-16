# Hyper Budget: BDD scenarios and test cases (Week 5 QA)

This documents the quality checks for Hyper Budget, in two parts:

- **Part A: BDD scenarios** (Given / When / Then). These describe the behaviour of the
  money engine and are implemented as **automated tests** that run in CI against the
  real Postgres functions on every push.
- **Part B: Manual test cases** (Scenario / Pre-conditions / Steps / Expected /
  Actual). These are run **by hand on the live app**. The "Actual Results" line is
  filled in after each run.

All money amounts are shown in euros for readability; the automated tests use whole
cents (800 euro = 80000).

A reference cycle is used throughout: buckets food & rent 800, bills 200, savings 100,
and a fun floor of 100. "Fun money" means the fun floor plus the discretionary
remainder, shown as one number.

---

## Part A: BDD scenarios (automated)

### BDD-1: Income is split into buckets, food & rent funded first
Covers UC5 / FR-19, FR-20. Automated in `src/lib/allocation.db.test.ts`.

```
Given my buckets are food & rent 800, bills 200, savings 100, and a fun floor of 100
When income of 3000 lands
Then food & rent is funded to 800
And bills is funded to 200
And savings is funded to 100
And my safe-to-spend shows 1900
```

### BDD-2: Fun money includes the guaranteed floor
Covers UC7, UC8 / FR-23, FR-25. Automated in `src/lib/allocation.db.test.ts`.

```
Given a fun floor of 100 and buckets food & rent 800, bills 200, savings 100
When income of 1500 lands
Then my safe-to-spend shows 400 (the 100 floor plus the 300 discretionary remainder)
```

### BDD-3: A spend within fun money only reduces fun money
Covers UC9 / FR-21. Automated in `src/lib/apply_spending.db.test.ts`.

```
Given a funded cycle with fun money of 400 (floor 100 + discretionary 300), savings 100, bills 200, food & rent 800
When I spend 250
Then my fun money reduces to 150
And savings, bills, and food & rent are untouched
And nothing is overspent
```

### BDD-4: An overspend draws fun money first and protects food & rent longest
Covers UC9 / FR-21. Automated in `src/lib/apply_spending.db.test.ts`.

```
Given a funded cycle with fun money 400, savings 100, bills 200, food & rent 800
When I spend 650
Then fun money is 0
And savings is 0
And bills is reduced to 50
And food & rent is still 800 (protected)
And nothing is overspent
```

### BDD-5: Spending beyond everything empties all buckets and reports the overspend
Covers UC9 / FR-21. Automated in `src/lib/apply_spending.db.test.ts`.

```
Given a funded cycle with a total of 1500 across all buckets
When I spend 1600
Then every bucket, including food & rent, is 0
And the amount overspent is reported as 100
```

---

## Part B: Manual test cases (run by hand on the live app)

> Run these on the live app after the latest changes are deployed. Set up each test's
> pre-conditions first, follow the steps exactly, then fill in Actual Results and mark
> PASS or FAIL. Confirm button and screen names against the live app; adjust if they
> differ.

### TC-1: A new person reaches their safe-to-spend
Covers UC1-4, UC8.

**Pre-conditions:**
- A brand-new person: no account, not signed in.
- A fresh/incognito browser window.
- Sandbox bank login ready: mock bank, john / doe.

**Steps to Follow:**
1. Open the live app URL.
2. Sign up for a new account.
3. In onboarding, set the pay frequency and the bucket amounts (food & rent, bills, savings, fun).
4. Connect the sandbox bank (mock bank, john / doe) and approve the consent.
5. Wait to arrive on Home.

**Expected Results:**
1. The person lands on Home (not stuck on sign-up, onboarding, or connect).
2. A "Safe to spend" number is shown.
3. The bucket cards (Food & rent, Bills, Savings, Fun money) show amounts.

**Actual Results:** _(to fill after running on the live app)_

---

### TC-2: Adding a spend updates safe-to-spend
Covers UC12 / FR-25.

**Pre-conditions:**
- Signed in, bank connected, on Home.
- Note the current safe-to-spend number before starting.

**Steps to Follow:**
1. On Home, open the add-a-transaction (spend) dialog.
2. Enter an amount, for example 20.
3. Choose Fun money as the category.
4. Submit the spend.

**Expected Results:**
1. A confirmation of the logged spend appears.
2. Home refreshes on its own.
3. Safe-to-spend is lower than before by the amount spent (for example 20 less).

**Actual Results:** _(to fill after running on the live app)_

---

### TC-3: Adding income raises safe-to-spend and funds buckets
Covers UC13 / FR-19, FR-25.

**Pre-conditions:**
- Signed in, bank connected, on Home, with buckets set.
- Note the current safe-to-spend and bucket amounts.

**Steps to Follow:**
1. On Home, open the add-income dialog.
2. Enter an income amount, for example 1000.
3. Submit.

**Expected Results:**
1. A confirmation of the logged income appears.
2. Home refreshes on its own.
3. The buckets fund in order and safe-to-spend goes up accordingly.
4. The bucket cards still add up to the income in the cycle.

**Actual Results:** _(to fill after running on the live app)_

---

### TC-4: Disconnecting the bank removes synced data but keeps settings
Covers UC14.

**Pre-conditions:**
- Signed in with a bank connected and some synced transactions.

**Steps to Follow:**
1. Open the menu pane.
2. Choose Disconnect bank.
3. Confirm the disconnect.

**Expected Results:**
1. The bank connection and its synced accounts/transactions are removed.
2. The person's own settings (buckets, pay frequency, savings goal) remain.
3. The person can reconnect later.

**Actual Results:** _(to fill after running on the live app)_

---

### TC-5: Clear my data resets for testing but keeps the bank connected
Covers UC15.

**Pre-conditions:**
- Signed in, bank connected, with some logged and synced transactions.

**Steps to Follow:**
1. Open the menu pane.
2. Choose Clear my data (testing).
3. Confirm.

**Expected Results:**
1. All transaction history and the savings cushion are cleared.
2. The bank stays connected (the person is not sent back to the connect screen, and the sandbox does not re-import).
3. Home shows a clean, empty cycle.

**Actual Results:** _(to fill after running on the live app)_

---

## Traceability summary

| Check | Type | Covers | Where |
|---|---|---|---|
| BDD-1 | automated | UC5, FR-19/20 | allocation.db.test.ts |
| BDD-2 | automated | UC7/8, FR-23/25 | allocation.db.test.ts |
| BDD-3 | automated | UC9, FR-21 | apply_spending.db.test.ts |
| BDD-4 | automated | UC9, FR-21 | apply_spending.db.test.ts |
| BDD-5 | automated | UC9, FR-21 | apply_spending.db.test.ts |
| TC-1 | manual | UC1-4, UC8 | live app |
| TC-2 | manual | UC12, FR-25 | live app |
| TC-3 | manual | UC13, FR-19/25 | live app |
| TC-4 | manual | UC14 | live app |
| TC-5 | manual | UC15 | live app |

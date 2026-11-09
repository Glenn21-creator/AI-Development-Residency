# Hyper Budget: Usability Test Plan and Script

A short plan to follow when you watch 1 to 2 people use the live app. The goal is
to find where the app confuses people, not to prove it works. You test the app, not
the person. Do not help them, just watch and listen.

---

## 1. What we want to learn

Can a first-time person, with no help, understand and complete the core flow:
get in, set up their budget, connect a bank, and understand their safe-to-spend
and savings. Where do they hesitate, get lost, or misunderstand a number?

## 2. Who to test

- **1 to 2 people.** Ideally someone who finds money or budgeting stressful, or who
  has ADHD (your target user), but any first-time user gives useful signal.
- They must **not** have seen the app before.
- In person, or over a screen share where you can see their screen and hear them.

## 3. Setup

- The **live app**: https://ai-development-residency-i9m9.vercel.app
- Open it in a fresh/incognito window so there is no saved login.
- For the bank step, this is the TrueLayer **sandbox**, so give them the test login
  when they reach it: pick the mock bank, username **john**, password **doe**.
- If you can, **record** the screen and audio (with their permission). If not, take
  notes as you watch.

## 4. The facilitator rules (you)

- **Do not help and do not lead.** If they ask "what do I do?", gently turn it back:
  "What would you try?"
- **Let silence sit.** Give them time to figure it out.
- When they go quiet, prompt them to **think aloud**: "What are you thinking?",
  "What do you expect to happen?", "What would you do next?"
- Write down what they **do**, what they **say** (exact words), and how they **feel**.

## 5. What to say to start (read this aloud)

> "Thanks for helping. This is a test of the app, not of you, so there are no wrong
> answers. I did not build it to trick you. As you use it, please think out loud:
> say what you are looking at, what you expect, and anything that confuses you. I
> will not be able to help you, because I want to see what a real person does on
> their own. Ready?"

## 6. The tasks (give one at a time, as goals, not steps)

Give each task as a goal and let them find their own way. Do not tell them where to
click.

1. **Get in.** "Imagine you just found this app and want to try it. Get yourself
   into it." (sign up or log in)
2. **Set up the budget.** "Set things up so the app knows how often you are paid and
   how much to protect for food and rent, bills, and savings." (Buckets tab)
3. **Connect a bank.** "Connect a bank account to the app." (Connect; give them the
   sandbox login: mock bank, john / doe)
4. **Find safe-to-spend.** "Without me helping, tell me how much money is safe for
   you to spend right now, and how you know." (Home)
5. **Check savings.** "Check how your savings are doing." (Savings tab)
6. **Check alerts.** "See whether the app is trying to tell you anything." (Alerts
   tab)

## 7. What to capture for each task

For every task, note:
- **Completed?** Yes / With struggle / No.
- **Hesitation points:** where did they pause, look lost, or click the wrong thing?
- **Exact quotes:** what they said out loud (write it word for word).
- **Feeling:** calm, confused, frustrated, pleased?
- **Severity (1 to 4):** 1 = tiny annoyance, 2 = slowed them down, 3 = needed a
  workaround, 4 = could not finish.

## 8. Questions to ask after (post-session)

- What, if anything, confused you?
- What did you like?
- Was there a moment you felt lost or unsure?
- Did the numbers (safe-to-spend, savings) make sense to you?
- On a scale of 1 to 5, how easy was it to use? Why that number?
- Would you use something like this? Why or why not?

## 9. What to say to finish

> "That is everything. Thank you, this is really helpful. Is there anything else you
> want to say about it?"

---

Use one copy of the results template (`usability-test-results.md`) per person to
write down what you saw, then we turn the findings into changes.

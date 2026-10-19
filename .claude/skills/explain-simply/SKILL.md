---
name: explain-simply
description: "Teach and explain any topic by breaking it down to the simplest level, using practical real-world examples, and always pairing the technical term with a plain-English translation. Use this whenever I ask you to teach me, explain something, help me understand, walk me through, or break something down, even if I don't name a specific format. This shapes HOW you explain in the conversation; if the learning-journal skill is also present, use this to teach and that one to save the lesson."
---

# Explain Simply

When the user wants to learn, the goal is not to sound knowledgeable. It is for the
user to walk away actually understanding something they did not understand before.
That only happens when an explanation starts from where the user already is and builds
up in small, concrete steps.

The three habits below are what make that work. They matter because most explanations
fail in predictable ways: they assume knowledge the learner does not have, they stay
abstract so nothing sticks, or they hide behind jargon that sounds precise but means
nothing to a beginner. Each habit fixes one of those failures.

## The three habits

### 1. Break it down to the simplest level

Start from the smallest idea the user can understand without any prior setup, then add
one new piece at a time. Before introducing a concept, make sure everything it depends
on has already been explained. If you catch yourself using a word or idea you have not
yet introduced, stop and explain that first.

A good test: imagine the user is smart but completely new to this area. Would the next
sentence make sense to them on its own? If it leans on something unexplained, you have
skipped a step.

Lead with the big-picture "what is this really and why should I care" in one or two
plain sentences, then zoom into the parts. People hold detail far better once they know
what it is a detail *of*.

### 2. Use practical, real-world examples

Every concept gets a concrete example, not just a definition. Abstract explanations
feel clear while you read them and vanish the moment you look away; a concrete example
gives the idea something to stick to.

Prefer examples from everyday life or from the user's actual situation (their project,
their files, their job) over invented textbook ones. When an analogy helps, use a
familiar everyday thing to stand in for the technical one, then say plainly where the
analogy holds and where it breaks down, so the user does not over-trust it.

Where it fits, show the idea in action rather than only describing it, for example a
tiny code snippet, a sample input and its output, or a before-and-after.

### 3. Pair every technical term with a plain-English translation

Do use the real technical terms. The user needs them to read documentation, search for
help, and talk to other people in the field. Hiding the jargon would leave them unable
to function in the real world.

But never let a technical term stand alone. The moment you introduce one, translate it
into plain, everyday language. The pattern is: **technical term, then "in plain English,
this means ..."**. This way the user learns the vocabulary *and* the meaning at the same
time, instead of memorising words they cannot use.

## How to shape an explanation

Use this as a flexible guide, not a rigid template. Short questions deserve short
answers; a big topic deserves the full build-up.

1. **The big picture first.** One or two sentences: what this is and why it matters, in
   plain language, before any jargon.
2. **The building blocks, simplest first.** Introduce each piece in an order where
   nothing depends on something not yet explained.
3. **For each key idea, use this shape:**
   - **Technical term:** the proper name, so the user learns the real vocabulary.
   - **In plain English:** the everyday-language meaning.
   - **Example:** a concrete, practical illustration, or a short analogy with its limits noted.
4. **Put it together.** Show how the pieces connect into the whole, so it is not just a
   list of disconnected facts.
5. **Check understanding.** End by inviting the user to test it, for example a quick
   "does this click, or should I come at it from a different angle?", or a small
   question back to them. If something did not land, re-explain it with a *different*
   example or analogy rather than repeating the same words louder.

## Worked example

**User asks:** "Explain what an API is."

> **Big picture:** An API is how two different programs talk to each other. It matters
> because almost nothing you use online is built alone, apps constantly ask other apps
> for help.
>
> **Technical term:** API (Application Programming Interface).
> **In plain English:** a menu of requests one program agrees to answer for another
> program.
> **Example:** think of a restaurant. You (one program) do not walk into the kitchen and
> cook. You read the menu, tell the waiter "I'll have the pasta", and the kitchen sends
> it out. The waiter is the API: a fixed set of things you are allowed to order, and a
> reliable way to ask for them. Where the analogy breaks down: a real API can handle
> thousands of these orders a second and never gets tired.
>
> **Technical term:** request and response.
> **In plain English:** you ask for something (request), the other program sends
> something back (response), like placing your order and getting your food.
> **Example:** a weather app on your phone sends a request like "what's the weather in
> Lagos?" to a weather company's API, and gets back a response like "32 degrees, sunny".
>
> **Putting it together:** your app never needs to know *how* the weather is measured. It
> just needs to know the menu (the API) and how to order (request) and receive
> (response). That is the whole point: APIs let programs use each other's work without
> understanding each other's insides.
>
> Does that click, or would a different example help?

## Tone

Be warm, patient, and encouraging, the way a good teacher is with someone who is
genuinely curious. Never make the user feel slow for not knowing something. Avoid
em-dashes; use commas, colons, or parentheses instead.

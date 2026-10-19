---
name: learning-journal
description: "Capture teaching and learning moments into a structured study journal in Google Drive. Use this whenever I ask you to teach me, explain, make me understand, or walk me through a topic. After explaining, create or update a Google Doc in the 'My Learning Journal' folder (creating the folder, the central index doc, or a topic doc if they do not exist, or appending if they do), and write every entry as professor-style lecture notes using the framework below, so the journal reads as real learning material rather than a flat list of terms."
---

# Learning Journal

This skill turns teaching moments into a lasting, well-organised study journal in the
user's Google Drive, so the user can revisit and review what they learned.

The heart of this skill is the **professor-mode framework** below. The goal is that each
entry reads the way a good university lecturer's notes read: it opens with a question
worth answering, builds one idea into the next in flowing prose, shows the machinery
actually running with worked code examples, and closes by tying it together and testing
understanding. A journal entry should be something the user can read top to bottom and
*learn from*, not a glossary of disconnected definitions to look up.

## When to use this skill

Trigger it whenever the user asks to learn, with phrases such as:

- "teach me ..."
- "explain ..."
- "make me understand ..."
- "walk me through ..."
- "help me understand ..."

Teach the topic in the conversation first (the `explain-simply` skill, if present,
shapes that live explanation). Then run the capture process below to save the lesson as
professor-style notes.

## Where things are stored

Everything lives in one Google Drive folder named **My Learning Journal**:

```
My Learning Journal/            (folder)
  My Learning Journal           (central hub doc: an index / table of contents)
  <Topic A>                     (one doc per topic)
  <Topic B>
  ...
```

- **The folder** groups all learning.
- **The central hub doc ("My Learning Journal")** is a table of contents that links to
  every topic doc, newest topics first.
- **Each topic doc** holds the dated entries for that subject.

## The professor-mode framework (how every entry is written)

This is the required shape for the body of each lesson. Do not fall back to a flat list
of term-definition-analogy blocks: that reads as a flashcard deck, not learning
material. Instead, write each entry as a short, self-contained lecture.

### Level 1: the topic document

Each topic doc is laid out top to bottom as:

1. **Title** (Heading 1): the topic name, for example "Claude Code Hooks".
2. **About this topic** (one or two sentences): what this subject covers and why it matters.
3. **Contents** (a short jump list): the entries in the doc, newest first. Include this
   once the doc has more than one entry.
4. **Entries**: the dated lectures, newest at the top.

### Level 2: the entry, written as a lecture

Each entry is a dated block (Heading 2) titled `YYYY-MM-DD: <short lesson title>`. Inside
it, build the lecture in this order. The section headings in bold below are *roles*, not
literal labels. Name the real sections after their ideas (see Level 3).

1. **The hook (open with the question).** One short paragraph, no heading, that states
   the problem or question this lesson answers and why it is worth the reader's time.
   This replaces a dry "Summary". Make the reader want the answer. For example: "Your AI
   writes code fast, so why does the codebase keep drifting from good practice? That is
   the question this whole system exists to answer."

2. **The lecture body: two to four idea-sections (Heading 3 each).** This is the core.
   Each section is written as **prose that builds**, not as a bullet list of terms. The
   sections must follow a teaching sequence where each idea sets up the next (problem,
   then the concept that solves it, then what that forces you to handle). Inside the
   prose:
   - Introduce each **technical term in bold inline**, and translate it into plain
     English *in the same sentence or the next one*. Keep the term-plus-translation
     habit, but woven into sentences rather than isolated in a template.
   - **Show, do not just define.** Where the idea involves anything concrete (config,
     commands, data, code, an input and its output), include a **worked example**: a real
     snippet, walked through. Use a short analogy when it genuinely clarifies, and name
     where the analogy breaks down so the reader does not over-trust it.
   - Format all code, file names, commands, keys, and values using the code-formatting
     rules in the section below. A lesson about something technical should *contain* the
     thing, correctly formatted, not only describe it.

3. **The big picture (Heading 3).** One short paragraph of prose that synthesises: how
   the sections connect into a whole, and how this lesson links to the bigger subject or
   to earlier lessons. The reader should leave with the shape of the whole, not just
   parts.

4. **Check your understanding (Heading 3).** Two or three questions or one small exercise
   that make the knowledge stick, the way a professor sets problems. Prefer questions
   that require applying the idea, not just recalling a definition. If the user gave their
   own-words understanding, fold it in here (never invent it).

5. **Key terms (Heading 3, optional reference appendix).** A compact glossary for quick
   revision: one line per term as `**Term** — plain-English meaning`. This is where the
   old term-list format belongs: at the end, as a scannable reference after the lecture,
   not as the lecture itself. Include it only when the entry has several terms worth
   revising.

### Level 3: naming sections after ideas

Generic headings like "Key concepts" or "Why it matters" read as filing labels and make
the entry feel like a reference sheet. Name each lecture section after the *idea it
teaches*, as a professor titles a lecture segment. For example, in a lesson on enforcing
standards: "Why rules alone are only the honor system", "What turns advice into a wall:
the CI gate", "The five-part test for what a machine can grade". The heading itself should
teach a little.

### The central hub doc

The hub doc "My Learning Journal" is organised as:

1. **Title** (Heading 1): "My Learning Journal".
2. **About** (one or two sentences): what this journal is.
3. **Contents** (bullet list): one line per topic doc, newest first, each line a link to
   the topic doc plus the date it was started.

## Formatting code demonstrations

Code is learning material too, so format it so it reads as code, never as plain prose.

- **Multi-line snippets** (a config block, a script, a sample file, an input/output
  pair) go in their own code block: a Google Docs paragraph styled as a monospace font
  (for example Consolas, Roboto Mono, or Courier New), preserving indentation and line
  breaks, ideally with a light grey background so it reads as a distinct block. Never let
  a multi-line snippet sit as ordinary body text.
- **Inline code** (a single file name, command, key, value, or symbol such as
  `settings.json`, `PostToolUse`, `git merge`, `exit 0`, `{ }`) is set in the same
  monospace font inline, so it stands apart from the surrounding sentence.
- **Walk the reader through the snippet.** A code block is a demonstration, not
  decoration: after showing it, explain what the important lines do in plain English, so
  the reader connects the syntax to the idea.
- Keep snippets minimal: show the smallest real example that makes the point, not a whole
  file when five lines will do.

## Step-by-step process (after teaching)

1. **Decide the topic title** for what was just taught (for example "Git & GitHub",
   "Claude Code Hooks"). Keep topic names consistent so related lessons land in the same
   doc.
2. **Check Google Drive is available.** If the Google Drive / Docs connector is not
   available in this session, do not fail silently: tell the user, and offer the local
   fallback below.
3. **Find or create the folder** `My Learning Journal` at the top of the user's Drive.
   Create it only if it does not already exist.
4. **Find or create the central hub doc** `My Learning Journal` inside that folder, laid
   out as described above.
5. **Find or create the topic doc** for this topic inside the folder, laid out with the
   Level 1 structure.
   - If it exists, append a new entry at the top of the Entries section.
   - If it is new, create it with the title and "About this topic" line, then add a link
     to it in the hub doc's Contents list.
6. **Ask about the user's own words.** Ask: "Want to add this in your own words?" If they
   give a version, fold it into "Check your understanding"; if they decline, leave it out.
7. **Write the entry as a lecture using the framework** (Levels 2 and 3), with code
   demonstrations formatted as above. Put the newest entry at the top.
8. **Confirm** to the user what was saved and where (name the folder and doc), with a link.

Respect the hierarchy: folder, then topic doc, then dated entry. New information is added
under the right topic, not dumped into one place.

## Formatting rules (keep it readable and consistent)

- Use the heading levels as the framework defines them: Heading 1 for the doc title,
  Heading 2 for each dated entry, Heading 3 for the lecture sections.
- Prefer flowing prose for the lecture body. Use bullet lists only for genuine lists (a
  set of parallel items), not as a substitute for explanation.
- Use a single, consistent body font throughout, with the monospace font reserved for
  code as described above. Do not mix decorative fonts.
- Keep paragraphs short and readable. Avoid heavy styling, colours, or large images.
- Date format: YYYY-MM-DD.
- Do not use em-dashes. Use commas, colons, or parentheses instead.

## If Google Drive is not available (fallback)

If the session has no Google Drive / Docs connector:

1. Tell the user plainly that Drive is not connected in this session.
2. Offer to save the same entry, using the same framework, to a local file such as
   `My-Learning-Journal/<topic>.md` in the project. In Markdown, use fenced code blocks
   (```) for code demonstrations.
3. Only write to Drive once the connector is available.

## Notes

- Never overwrite existing entries. Always append a new dated entry.
- Never fabricate the user's own words. Include that part only when they supply it.
- Keep topic names consistent so the journal does not fragment into near-duplicate docs.
- The framework is the point of this skill. An entry that is only a list of terms has
  failed, even if the terms are correct. Write the lecture: hook, building sections with
  worked examples, synthesis, and questions, with the glossary as an appendix.

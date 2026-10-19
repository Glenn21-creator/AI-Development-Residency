---
name: learning-journal
description: "Capture teaching and learning moments into a structured study journal in Google Drive. Use this whenever I ask you to teach me, explain, make me understand, or walk me through a topic. After explaining, create or update a Google Doc in the 'My Learning Journal' folder (creating the folder, the central index doc, or a topic doc if they do not exist, or appending if they do), and organise every entry with the content framework below so the notes are clear, consistent, and easy to review."
---

# Learning Journal

This skill turns teaching moments into a lasting, well-organised study journal in the user's Google Drive, so the user can revisit and review what they learned. The heart of this skill is the **content framework** in the section below: every document and every entry must follow it, so the journal never reads as a thin or random list of facts.

## When to use this skill

Trigger it whenever the user asks to learn, with phrases such as:

- "teach me ..."
- "explain ..."
- "make me understand ..."
- "walk me through ..."
- "help me understand ..."

Teach the topic normally in the conversation first. Then run the capture process below so the lesson is saved using the framework.

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
- **The central hub doc ("My Learning Journal")** is a table of contents that links to every topic doc, newest topics first.
- **Each topic doc** holds the dated entries for that subject.

## The content framework (how every document is organised)

This is the required structure. Do not save a flat list of terms. Organise content at three levels: the document, the entry, and the concept.

### Level 1: the topic document

Each topic doc is laid out top to bottom as:

1. **Title** (Heading 1): the topic name, for example "Claude Code Hooks".
2. **About this topic** (one or two sentences): what this subject covers and why it matters.
3. **Contents** (a short bullet list): a link or jump list of the entries in the doc, newest first. Include this once the doc has more than one entry.
4. **Entries**: the dated lessons, newest at the top.

### Level 2: the entry (one per lesson)

Each entry is a dated block (Heading 2) titled `YYYY-MM-DD: <short lesson title>`. Inside it, always use these sub-sections (Heading 3), in this order:

1. **Summary**: one or two sentences capturing what was learned in this lesson.
2. **Key concepts**: the heart of the entry. Each concept is its own small block, structured as in Level 3 below.
3. **Why it matters**: one or two sentences on how this connects to the bigger picture or to earlier lessons.
4. **To review**: any open questions, points to revisit, or things that are still unclear. If none, write "Nothing outstanding."

Leave out a sub-section only if it genuinely does not apply, and never leave out Summary or Key concepts.

### Level 3: the concept block (inside Key concepts)

Each concept inside "Key concepts" uses this consistent four-part shape:

- **Technical term:** the proper term.
- **In plain English:** the simple, everyday-language explanation.
- **Example or analogy:** a short illustration, when one helps.
- **In my words:** the user's own-words understanding. Include this part only when the user actually provides it; never invent it.

List each concept as its own block so the reader can scan them. A lesson with five terms has five concept blocks, not one paragraph.

### The central hub doc

The hub doc "My Learning Journal" is organised as:

1. **Title** (Heading 1): "My Learning Journal".
2. **About** (one or two sentences): what this journal is.
3. **Contents** (bullet list): one line per topic doc, newest first, each line a link to the topic doc plus the date it was started.

## Step-by-step process (after teaching)

1. **Decide the topic title** for what was just taught (for example "Git & GitHub", "Claude Code Hooks"). Keep topic names consistent so related lessons land in the same doc.
2. **Check Google Drive is available.** If the Google Drive / Docs connector is not available in this session, do not fail silently: tell the user, and offer the local fallback below.
3. **Find or create the folder** `My Learning Journal` at the top of the user's Drive. Create it only if it does not already exist.
4. **Find or create the central hub doc** `My Learning Journal` inside that folder, laid out as described above.
5. **Find or create the topic doc** for this topic inside the folder, laid out with the Level 1 structure.
   - If it exists, append a new entry at the top of the Entries section.
   - If it is new, create it with the title and "About this topic" line, then add a link to it in the hub doc's Contents list.
6. **Ask about the user's own words.** Ask: "Want to add this in your own words?" If they give a version, put it in the "In my words" part of the relevant concept; if they decline, omit that part.
7. **Write the entry using the framework** (Levels 2 and 3). Put the newest entry at the top.
8. **Confirm** to the user what was saved and where (name the folder and doc), with a link.

Respect the hierarchy: folder, then topic doc, then dated entry, then concept blocks. New information is added under the right topic, not dumped into one place.

## Formatting rules (keep it simple and consistent)

- Use the heading levels as the framework defines them: Heading 1 for the doc title, Heading 2 for each dated entry, Heading 3 for the entry sub-sections.
- Use bold labels ("Technical term:", "In plain English:", and so on) at the start of each concept line.
- Use a single, consistent font throughout (the Doc's default body font). Do not mix fonts.
- Use short paragraphs and bullet lists. Avoid heavy styling, colours, or large images.
- Keep the same layout in every entry so the journal reads uniformly.
- Date format: YYYY-MM-DD.
- Do not use em-dashes. Use commas, colons, or parentheses instead.

## If Google Drive is not available (fallback)

If the session has no Google Drive / Docs connector:

1. Tell the user plainly that Drive is not connected in this session.
2. Offer to save the same entry, using the same framework, to a local file such as `My-Learning-Journal/<topic>.md` in the project.
3. Only write to Drive once the connector is available.

## Notes

- Never overwrite existing entries. Always append a new dated entry.
- Never fabricate the user's own words. Include that part only when they supply it.
- Keep topic names consistent so the journal does not fragment into near-duplicate docs.
- The framework is the point of this skill. If an entry would be thin, add the Summary, Why it matters, and To review sections rather than leaving a bare list of terms.

---
name: ux-best-practices
description: "Apply UX best practices when building any software, web app, site, or UI: light theme by default, consistent type and layout, clear errors, and a pre-delivery hierarchy, usability and UX-psychology check."
---

# UX Best Practices

Use this skill whenever you build or change a user-facing interface: web apps, websites, dashboards, mobile screens, forms, CLIs with prompts, or prototypes. Follow the build rules while you work, then run the pre-delivery reviews (sections 5 to 7) before handing anything over.

## 1. Core principles

- **Users come first.** Every screen should help the user finish their task with as little effort and confusion as possible.
- **Clear beats clever.** Use plain labels and familiar patterns (standard nav, form controls, icons with text labels) instead of new ones.
- **Show the system status.** Give feedback for every action: loading states, success confirmations, progress for long tasks.
- **Prevent errors, then help people recover.** Constrain inputs, confirm destructive actions, and support undo where you can.
- **Recognition over recall.** Keep options, context, and previous inputs visible. Don't make users remember things between screens.
- **Honest design.** Don't trick or pressure users: no pre-ticked opt-ins, hidden costs, fake urgency, or cancelling that is harder than signing up.

## 2. Avoid dark themes: light theme by default

- Build interfaces with a light theme: light backgrounds (white or near-white, e.g. `#FFFFFF` or `#F8F9FA`) and dark text (e.g. `#1A1A1A` to `#333333`).
- Do not use dark backgrounds for pages, panels, cards, or modals.
- Do not switch to dark mode automatically based on `prefers-color-scheme`.
- Only add a dark theme or dark-mode toggle if the user explicitly asks for one. If they do, build it as an option, keep light as the default, and check contrast separately for the dark version.
- Small dark accents are fine where they aid clarity (for example, a dark tooltip or a code block), but the overall interface stays light.

## 3. Consistent typography and layout

Define design tokens once and reuse them everywhere. Don't hard-code one-off values.

### Typography

- Use at most 2 font families (usually one for headings and one for body, or a single family).
- Use a fixed type scale (e.g., 12 / 14 / 16 / 20 / 24 / 32 / 40px). Body text is at least 16px on web.
- Keep line-height around 1.4–1.6 for body text and 1.1–1.3 for headings.
- Keep line length around 50–75 characters.
- Use a small, consistent set of font weights (e.g., 400, 600, 700).

### Layout

- Use a spacing scale based on 4 or 8px (4, 8, 12, 16, 24, 32, 48, 64).
- Use a consistent grid and max content width, with consistent alignment (left-align body text).
- Keep components identical wherever they appear: the same button looks and behaves the same on every screen.
- Keep primary actions in a consistent position across screens.
- Make the layout responsive. Test at phone (~375px), tablet (~768px), and desktop (~1280px+) widths, with no horizontal scrolling on mobile.

### Color

- Define a limited palette as tokens on a light base: primary, neutral grays, and semantic colors (success, warning, error, info).
- Never use color as the only way to convey meaning. Pair it with text or an icon.

## 4. Clear error feedback

Every error message should answer: what happened, why, and how to fix it.

- Write in plain language. No codes, stack traces, or jargon ("Error 422", "Invalid input").
- Be specific: "Password must be at least 8 characters" rather than "Invalid password".
- Don't blame the user. Use a calm, helpful tone.
- Show the error next to the field it relates to, and also summarize it at the top for long forms.
- Validate inline at the right moment: on blur or on submit, not on every keystroke while the user is still typing.
- Keep what the user typed. Never clear a form because of an error.
- Use more than color: an icon, text, and `aria-invalid` / `aria-describedby` so screen readers announce it.
- Move focus to the first error (or the error summary) on submit.
- For system or network errors, say what the user can do (retry, check connection, contact support) and provide a retry button where possible.
- Design empty states and 404 or other failure pages that point users somewhere useful.

Examples:

- Bad: "Invalid date." Good: "Enter the date as DD/MM/YYYY, for example 05/03/2026."
- Bad: "Something went wrong." Good: "We couldn't save your changes because the connection dropped. Your work is still here. Try again."

## 5. Pre-delivery review: visual hierarchy

Before delivering, check each screen:

- There is one clear primary action per screen or section, and it is the most prominent element.
- Secondary and tertiary actions are visually weaker (outline or text buttons).
- Headings follow a logical order (one H1, then H2, H3; no skipped levels).
- Size, weight, color, and spacing show what matters most. The squint test: blur your eyes and the most important thing still stands out.
- Related items are grouped together; unrelated items are separated by whitespace.
- Content follows natural reading patterns (F or Z scan), with key information near the top.
- There is not too much competing for attention: no more than one or two accent colors per view.

## 6. Pre-delivery review: usability

Run through Nielsen's 10 heuristics:

### Heuristics

- Visibility of system status (loading, saving, progress, success)
- Match with the real world (the user's language, not internal terms)
- User control and freedom (back, cancel, undo, easy exit)
- Consistency and standards (within the product and with platform conventions)
- Error prevention (constraints, confirmations for destructive actions, sensible defaults)
- Recognition rather than recall
- Flexibility and efficiency (shortcuts, autofill, remembered preferences where suitable)
- Aesthetic and minimalist design (remove what doesn't help the task)
- Help users recognize, diagnose, and recover from errors (section 4)
- Help and documentation available where tasks are complex

## 7. Pre-delivery review: psychological principles of UX

Check the design against these principles of how people perceive, decide, and remember. For each, ask the question and fix anything that fails.

### Decision-making and cognitive load

- **Hick's Law** (more choices = slower decisions): Are choices kept to what is needed? Are long option lists grouped, filtered, or progressively disclosed?
- **Miller's Law** (working memory holds about 7±2 items): Is information chunked into small groups (e.g., phone numbers, steps, menu sections)?
- **Cognitive load**: Is anything on screen that doesn't help the current task? Remove or defer it.
- **Tesler's Law** (complexity can't be removed, only moved): Is the system handling complexity (smart defaults, autofill, calculations) instead of pushing it onto the user?
- **Choice defaults**: Are defaults set to the option that is best for the user, not just for the business?

### Interaction and effort

- **Fitts's Law** (bigger, closer targets are faster to hit): Are primary actions large and placed near where the user's attention or cursor already is? Are destructive actions not right next to common ones?
- **Doherty Threshold** (responses under ~400ms keep people engaged): Does the interface respond quickly, with skeletons, spinners, or optimistic updates for anything slower?
- **Postel's Law** (be liberal in what you accept): Do inputs accept reasonable variations (spaces in card numbers, different date formats, upper/lower case) and normalize them?

### Familiarity and expectations

- **Jakob's Law** (users expect your product to work like ones they already know): Do navigation, icons, and flows follow common conventions?
- **Mental models**: Do labels and structure match how users think about the task, not how the system is built?

### Perception (Gestalt principles)

- **Proximity**: Are related items close together, and unrelated items clearly separated?
- **Similarity**: Do elements that behave the same look the same (and different things look different)?
- **Common region**: Are grouped items contained in a shared card, border, or background where helpful?
- **Continuity and alignment**: Do elements line up so the eye flows naturally through the content?
- **Figure/ground**: Is it clear what is foreground (modals, active items) versus background?

### Attention and memory

- **Von Restorff Effect** (the item that stands out is remembered): Does only the most important element (usually the primary action) stand out visually?
- **Serial Position Effect** (first and last items are remembered best): Are the most important items placed at the start or end of lists and navigation?
- **Recognition over recall**: Are options visible instead of requiring users to remember them?

### Motivation and emotion

- **Goal-Gradient Effect** (people speed up as they near a goal): Do multi-step flows show progress (step 2 of 4, progress bar)?
- **Zeigarnik Effect** (unfinished tasks stay on the mind): Are incomplete tasks or profiles shown clearly so users can resume them, without nagging?
- **Peak-End Rule** (experiences are judged by their peak and their end): Are the key moments and the final step (confirmation, success screen) clear and positive?
- **Aesthetic-Usability Effect** (attractive designs feel easier to use): Is the design polished and tidy, while not hiding real usability problems behind good looks?

Use these principles to help users, never to manipulate them (for example, don't use the Von Restorff Effect to make "Accept all" stand out over "Reject").

## 8. How to deliver

1. Fix every issue the reviews found before delivering. If something can't be fixed (for example, it is out of scope or needs a product decision), don't hide it.
2. When you hand over the work, include a short UX review summary:
   - Hierarchy: pass, or what was adjusted
   - Usability: pass, or the issues fixed
   - Psychological principles: pass, or the principles that drove changes
   - Known limitations or open questions for the user
3. Keep the summary brief: a few lines, not a full report, unless the user asks for one.

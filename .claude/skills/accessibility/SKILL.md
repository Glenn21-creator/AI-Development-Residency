---
name: accessibility
description: "Build accessible, inclusive web applications and software: conform to WCAG 2.2 Level AA, apply the three dimensions of inclusive design, run accessibility testing, and make sure the product is usable by anyone."
---

# Accessibility & Inclusive Design

Use this skill whenever you create or change a web application or software. Accessibility is not a final step or an add-on — design and build for it from the start, then confirm it with the testing in section 5 before handing anything over.

Goal: a product that is **usable by anyone**, regardless of ability, assistive technology, device, or situation.

## 1. Core commitments

- **Design for the full range of people**, not an "average" user. Disability can be permanent (blindness), temporary (a broken arm), or situational (bright sunlight, holding a baby, a noisy room).
- **Conform to WCAG 2.2 Level AA** as the baseline (section 2).
- **Apply inclusive design** so the process and outcome include people who are usually left out (section 3).
- **Build with assistive technology in mind**: screen readers, screen magnifiers, voice control, switch devices, and keyboard-only use.
- **Test with real conditions and, where possible, real people** (section 5). Automated tools catch only part of the picture.
- **Never treat accessibility as optional or "phase 2."** Retrofitting is harder and worse than building it in.

## 2. Conform to WCAG 2.2

The Web Content Accessibility Guidelines (WCAG) 2.2 are organized under four principles — **POUR**. Everything must be:

- **Perceivable** — users can perceive the information (text alternatives, captions, sufficient contrast, content not conveyed by color alone, resizable text).
- **Operable** — users can operate the interface (full keyboard access, enough time, no seizure-inducing flashes, clear navigation and focus).
- **Understandable** — content and operation are clear (readable language, predictable behavior, input help and error prevention).
- **Robust** — content works reliably with current and future user agents and assistive technologies (valid, well-structured markup; correct name, role, value for all UI components).

### Conformance levels

- **A** — minimum. Essential; the product is barely usable without it.
- **AA** — the standard target for most products and the level most laws reference. **Aim for AA.**
- **AAA** — the highest level; apply where you can, but it is not required or feasible for all content.

### What is new in WCAG 2.2

WCAG 2.2 adds **nine** success criteria over 2.1 and removes the old **4.1.1 Parsing** criterion (it is now obsolete). Check these specifically:

| Criterion | Level | What it requires |
|-----------|-------|------------------|
| 2.4.11 Focus Not Obscured (Minimum) | AA | The focused element is not entirely hidden by other content (e.g. sticky headers). |
| 2.4.12 Focus Not Obscured (Enhanced) | AAA | The focused element is not hidden at all. |
| 2.4.13 Focus Appearance | AAA | The focus indicator is large and contrasting enough to be clearly visible. |
| 2.5.7 Dragging Movements | AA | Anything done by dragging also works with a single-pointer action (tap/click). |
| 2.5.8 Target Size (Minimum) | AA | Pointer targets are at least **24×24 CSS px** (or have adequate spacing). |
| 3.2.6 Consistent Help | A | Help options (contact, FAQ) appear in a consistent place across pages. |
| 3.3.7 Redundant Entry | A | Don't make users re-enter info they already provided in the same process. |
| 3.3.8 Accessible Authentication (Minimum) | AA | No cognitive function test (e.g. remembering/transcribing, puzzles) required to log in, unless an alternative exists. |
| 3.3.9 Accessible Authentication (Enhanced) | AAA | Stricter version of 3.3.8 with fewer exceptions. |

Always confirm exact wording and levels against the official W3C document: https://www.w3.org/TR/WCAG22/

## 3. Make the design inclusive — the three dimensions

Apply the **three dimensions of inclusive design** from the Inclusive Design Research Centre (IDRC, OCAD University):

1. **Recognize diversity and uniqueness.** People vary widely; most individuals differ from the "average" in some need or goal, so a single mass solution fails many of them. Design to stretch and adapt to that range rather than to a stereotyped middle.
2. **Inclusive process and tools.** Run an open, transparent process and co-design *with* people who have diverse perspectives — especially those who can't use, or struggle with, the current design. The tools and the team should themselves be inclusive.
3. **Broader beneficial impact.** Design with awareness of the wider system and aim for benefit beyond the originally targeted group. Accessible, inclusive design tends to help everyone (a "virtuous cycle"), not only the people it was first intended for.

Reference: The Inclusive Design Guide — https://guide.inclusivedesign.ca/

## 4. Build checklist (grouped by POUR)

### Perceivable

- Provide meaningful **alt text** for informative images; use empty `alt=""` for purely decorative ones.
- Provide **captions** for video and **transcripts** for audio.
- Text contrast at least **4.5:1** (normal text) and **3:1** (large text ≥ 24px, or 19px bold); UI components and graphics at least **3:1**.
- Never use **color alone** to convey meaning — pair it with text, an icon, or a pattern.
- Content reflows and stays readable when **zoomed to 200%** and at **400%** (reflow), with no loss of information and no horizontal scrolling of body text.

### Operable

- **Everything works by keyboard**, in a logical tab order, with no keyboard traps.
- A **visible focus indicator** is always present and not obscured by other content.
- Pointer targets are at least **24×24 CSS px**; prefer **44×44 px** on touch.
- Anything done by dragging also works with a simple tap/click.
- No content **flashes** more than three times per second.
- Provide **"skip to main content"** links and clear, consistent navigation.
- Respect **`prefers-reduced-motion`**; don't force animation.

### Understandable

- Set the page **language** (`<html lang="…">`) and use plain, clear wording.
- Behavior is **predictable**: components act consistently; nothing changes context unexpectedly on focus or input.
- Form fields have **visible, programmatically associated labels** (placeholders are not labels).
- **Prevent and explain errors**: identify the field, describe the problem in plain language, suggest a fix, and keep what the user typed.
- Don't force users to re-enter information already given (Redundant Entry).

### Robust

- Use **semantic HTML first** (`button`, `nav`, `main`, `header`, `label`, headings in order); add **ARIA only where native HTML can't express the role**, and never misuse it.
- Every custom UI component exposes a correct **name, role, and value** to assistive technology, and announces state changes.
- Use **live regions** (`aria-live`) for important dynamic updates.

## 5. Accessibility testing guidelines

Run **all** of the following before delivery — no single method is sufficient.

1. **Automated scan.** Run a tool such as **axe**, **WAVE**, **Lighthouse**, or **Pa11y** to catch obvious issues (missing alt text, low contrast, missing labels). Remember automated tools find only ~30–40% of issues.
2. **Keyboard-only pass.** Unplug the mouse. Tab through the whole interface: can you reach and operate everything, in a sensible order, with a visible focus, and no traps? Can you escape every modal/menu?
3. **Screen reader pass.** Test with at least one screen reader — **NVDA** or **JAWS** (Windows), **VoiceOver** (macOS/iOS), **TalkBack** (Android). Confirm headings, labels, roles, states, and dynamic updates are announced correctly.
4. **Zoom and reflow.** Zoom the browser to **200%** and check **400%** reflow. Content must stay usable with no information loss or horizontal scrolling of text.
5. **Color and contrast.** Verify contrast ratios with a checker. View the UI in grayscale to confirm nothing relies on color alone.
6. **Content and cognitive.** Check reading level, clear instructions, consistent help, meaningful link text (no bare "click here"), and forgiving error handling.
7. **Testing with people.** Where possible, test with people who have disabilities and who use assistive technology daily. Their feedback outranks any checklist.

Record what was tested, with which tools/AT, and what was fixed or remains open.

## 6. Usable by anyone

- Support **multiple ways** to do the same thing (keyboard, mouse, touch, voice).
- Account for **situational and temporary** limitations, not only permanent disability.
- Don't assume a device, input method, connection speed, or screen size.
- Provide clear **recovery and help** so a mistake is never a dead end.
- Default to **simplicity**: less to perceive, operate, and understand benefits everyone.

## 7. Pre-delivery accessibility review

Before handing over, confirm and report:

- **WCAG 2.2 AA**: pass, or the specific criteria still open.
- **Inclusive design**: how the three dimensions were applied, and any group still underserved.
- **Testing**: which methods and assistive technologies were used (section 5) and what was fixed.
- **Known limitations or open questions** for the user — never hide an unmet criterion.

Keep the summary brief — a few lines — unless the user asks for a full report.

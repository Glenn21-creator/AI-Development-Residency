---
name: mobile-accessibility
description: Use this skill whenever you build or change any screen, control, or flow in Hyper Budget. It covers making the app work with screen readers, large text, and reduced motion, and the mobile accessibility basics (target size, contrast, keyboard and focus). Follow it for every piece of interface, and run its checks before calling a screen done.
---

# Hyper Budget: Mobile accessibility

Hyper Budget must be usable by anyone, including people who use a screen reader,
need large text, or are sensitive to motion. Many ADHD users also have other
needs, and accessible design is calmer and clearer for everyone. Build for this
from the start; do not leave it for later. The target is WCAG 2.2 Level AA.

This skill is the code-and-testing side. For tone and layout feel, pair it with
`adhd-ux-guidelines`.

## Screen readers

- Use the platform's native, semantic controls (real buttons, labels, headings)
  so screen readers (VoiceOver on iOS, TalkBack on Android) understand them.
- Every control has a clear, meaningful label that says what it does. An icon-only
  button still needs a label.
- Every image that carries meaning has a text description; purely decorative
  images are hidden from the screen reader.
- Announce important changes (for example a bucket updating or an error appearing)
  so a screen reader user is not left behind.
- Order content logically so it is read in a sensible sequence.
- Do not convey meaning by color or position alone; pair it with text.

## Large text and zoom

- Respect the user's system text-size setting. Text scales up without breaking
  the layout or cutting words off.
- Use relative text sizes, not fixed ones that ignore the system setting.
- Content reflows and stays usable when text is large; no important information is
  lost and body text does not require sideways scrolling.
- Keep body text at a readable base size (at least 16px equivalent) before scaling.

## Reduced motion

- Respect the "reduce motion" setting. When it is on, remove or greatly soften
  animations and transitions.
- Never rely on motion to convey meaning. Anything an animation shows must also be
  clear without it.
- Avoid anything that flashes more than three times a second.

## Touch, target size, and focus

- Make tap targets at least 24 by 24 CSS pixels, and prefer about 44 by 44 for
  comfortable touch.
- Keep enough space between targets so the wrong one is not tapped by mistake.
- Do not place a destructive action right next to a common one.
- Anything done by dragging also works with a simple tap.
- Everything is reachable and operable by keyboard and external switch, in a
  logical order, with a visible focus indicator that is never hidden behind other
  content.

## Understandable and forgiving

- Use plain, clear language (this fits the ADHD-friendly tone too).
- Keep behavior predictable; the same control acts the same everywhere.
- Form fields have visible labels that are linked to the field (a placeholder is
  not a label).
- Prevent and explain errors in plain words, keep what the user typed, and move
  focus to the first error. See `adhd-ux-guidelines`.
- Do not make the user re-enter information they already gave.
- Do not require a memory or puzzle test to log in; support biometric or
  paste-friendly login. See `device-security`.

## Testing (run all of these before a screen is done)

No single method is enough:

1. **Automated scan** with an accessibility checker to catch obvious issues.
2. **Screen reader pass** with VoiceOver or TalkBack: can you reach, understand,
   and operate everything, and are changes announced.
3. **Large text pass:** set system text to large and check nothing breaks or is
   cut off.
4. **Reduced motion pass:** turn it on and confirm the app is calm and complete.
5. **Contrast and color:** text contrast at least 4.5:1 (normal) or 3:1 (large),
   controls at least 3:1; check nothing relies on color alone.
6. **Keyboard and focus pass:** operate everything by keyboard with a visible
   focus and no traps.

Record what was tested and what was fixed or left open.

## Quick pre-delivery check

- Screen reader can reach, label, and operate everything; changes are announced.
- Large text and zoom do not break the layout.
- Reduced motion is respected; nothing flashes.
- Targets are big enough and well spaced; focus is always visible.
- Contrast passes and color is never the only signal.

Related: `adhd-ux-guidelines`, `device-security`, `testing`.

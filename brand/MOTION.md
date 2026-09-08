# FinanceMeta Motion System

## Purpose

Motion explains circulation. Ideas move through learning, application, publication, competition, and leadership. Interface motion should reveal that route or confirm an action.

## Signature flow field

- Draw a bounded set of paths across a ledger grid.
- Move small signals along those paths at different but stable rates.
- Let pointer position create a restrained local pull without changing the layout.
- Smooth pointer input before applying the pull and draw only a short deterministic trace of that input.
- Couple the selected operating stage to route weight and node emphasis.
- Keep labels and calls to action independent from the canvas so motion never harms readability.
- Stop continuous motion when the document is hidden.

## Timing

- Control feedback: `140ms` to `180ms`.
- Section entrance: `320ms` to `480ms`.
- Flow signals: `7s` to `14s` per route.
- Do not use spring bounce for institutional actions.

## Scroll behavior

- Use native scrolling with proximity snap points so section thresholds have gentle resistance.
- Never intercept the wheel, synthesize scroll distance, or trap the user inside a section.
- Sticky introductions may hold context while the related records continue through normal document flow.
- Text may translate into place, but its opacity must stay high enough to preserve AA contrast before intersection.

## Reduced motion

When `prefers-reduced-motion: reduce` is active:

- Render the complete network once.
- Do not run the animation frame loop.
- Remove entrance translation.
- Preserve opacity, hierarchy, and all interactive states.

## Avoid

- Random particles.
- Cursor-following decoration that competes with reading.
- Infinite marquee copy.
- Scale pulses on primary actions.
- Scroll-jacking, parallax, and motion required to understand content.

# FinanceMeta Motion System

## Purpose

Motion explains circulation. Ideas move through learning, application, publication, competition, and leadership. Interface motion should reveal that route or confirm an action.

## Signature flow field

- Draw a bounded set of paths across a ledger grid.
- Move small signals along those paths at different but stable rates.
- Let pointer position create a restrained local pull without changing the layout.
- Keep labels and calls to action independent from the canvas so motion never harms readability.
- Stop continuous motion when the document is hidden.

## Timing

- Control feedback: `140ms` to `180ms`.
- Section entrance: `320ms` to `480ms`.
- Flow signals: `7s` to `14s` per route.
- Do not use spring bounce for institutional actions.

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

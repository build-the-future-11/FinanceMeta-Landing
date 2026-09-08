# FinanceMeta Design System

## Product truth

FinanceMeta is a student-led platform for learning finance and economics by producing reviewable work. Its six program families are in development. The landing page must describe direction and standards without implying active scale, outcomes, partnerships, or research evidence that do not exist.

## Visual thesis: the capital commons

Finance is a network of decisions, incentives, evidence, and consequences. FinanceMeta turns that structure into a learning loop: learn, apply, publish, compete, and lead. The interface should feel like a public financial instrument that students can enter, inspect, and build on.

The signature visual is a flowing field of connected paths. It represents ideas becoming work, then returning to the community as evidence. It is structured, directional, and responsive. It is not a decorative particle effect.

## Identity markers

- The wordmark is direct and large enough to establish the product in the first viewport.
- The `FM` mark is drawn as a compact ledger cell with a visible baseline.
- Fine rules, coordinates, sequence numbers, and monospaced annotations create a financial-ledger rhythm.
- The five-stage operating loop appears as a continuous route, not a stack of feature cards.
- Program families are presented as an indexed field with honest development states.
- A compact section rail reports position on wide screens; mobile uses the primary section links without a floating overlay.
- The evidence threshold is a working range control. It explains the activation rule without presenting simulated data.

## Palette

- `signal`: `#0b7a35`, for primary actions, active routes, and flow signals.
- `signal-bright`: `#55e884`, for selected states and dark-surface highlights.
- `signal-deep`: `#06351b`, for full-width institutional bands.
- `paper`: `#f3f7f3`, the cool-neutral white canvas.
- `white`: `#ffffff`, for high-clarity surfaces and reversed copy.
- `ink`: `#06140b`, for primary type and the dark theme.
- `graphite`: `#435248`, for supporting copy.
- `rule`: `#c7d3c9`, for the ledger grid.

Green and white dominate. Ink and graphite are neutral structure, never a competing palette. Do not use gradients, glow blobs, purple, blue, beige, or ornamental color.

## Typography

- Display: a heavy system grotesk with a compact line height. Brand-scale type is reserved for the first viewport.
- Body: the native UI sans stack at `1rem` or larger.
- Evidence labels: the native monospace stack at `0.75rem` or larger.
- Letter spacing is always `0`.
- Headings use concrete nouns and verbs. Metadata is terse and aligned to rules.

## Layout

- Maximum interface width: `84rem`.
- First viewport: full-bleed flow field behind the brand, with the next section visible on common desktop and mobile screens.
- Sections are unframed full-width bands or constrained layouts. Do not place page sections inside floating cards.
- Repeated program records may use rows with rules. Corners stay square or use a maximum `8px` radius.
- Controls maintain stable dimensions and at least `44px` touch height.
- Program detail may use a pointer-driven tilt of less than `5deg`; the information remains flat and unchanged for touch and reduced-motion users.

## Accessibility

- Body copy must retain AA contrast in both themes.
- Every interaction must work with keyboard and touch.
- The flow field is decorative and hidden from assistive technology. Its meaning is duplicated in text.
- At 200% root text, navigation may wrap or simplify but the page must not overflow horizontally.
- Reduced-motion users receive a static, fully composed flow field.

## Avoid

- Generic SaaS card grids.
- Stock-market candlesticks, currency icons, or fake dashboards.
- Unsupported counts, impact metrics, testimonials, partner logos, and research claims.
- Floating gradient orbs, random particles, and glass panels.
- Pill-shaped text controls unless the shape communicates a state.
- Decorative animation with no relationship to the operating loop.

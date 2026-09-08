# FinanceMeta Landing

> **Repository role:** separate landing-surface repository.  
> **Canonical FinanceMeta/Finance4All member portal:** `build-the-future-11/finance4all-global-reach`  
> Do not use this repository as the portal application or deployment source unless a task explicitly targets the landing surface.

This repository is retained as a distinct FinanceMeta landing-site surface. Keep portal/auth/member-product work in the canonical portal repository and keep cross-repository links explicit.

## Verify

Use Node.js 22.13 or newer and npm 10.9.8 with the committed lockfile.

```bash
npm ci
npm run release:check
```

The release check runs source contracts, unit tests, desktop/mobile Chrome journeys, Axe accessibility analysis, ESLint, TypeScript, the production build, and immutable release-output verification. Vercel uses `npm run deploy:build`, which retains deterministic source checks without requiring a browser inside the deployment builder.

The canonical member handoff is a public client URL committed in `.env.production`. Runtime validation still rejects credentials, hashes, local hosts, alternate paths, and foreign product origins; unit tests cover the application-form fallback for invalid configuration.

## Design integrity

The persistent identity and copy rules live in `brand/`. The landing's signature visual is the pointer-responsive operating field in `src/FlowField.tsx`; it represents FinanceMeta's learn, apply, publish, compete, and lead route, couples to the visible route controls, and becomes static when reduced motion is requested. The program field is keyboard navigable, and the evidence threshold is an interactive explanation of the activation standard rather than a claimed result.

`npm run copy:lint` rejects banned marketing language, placeholder copy and metrics, testimonial scaffolding, repeated generic headings, and em dash characters in user-facing source. It is part of both release and deployment builds.

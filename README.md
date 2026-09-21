# FinanceMeta landing and member platform

This workspace contains the FinanceMeta public landing, authenticated member platform, and evidence/research registry.

## Surfaces

- Root: public landing and conversion surface.
- `Finance4allLanding/`: public directories, Supabase Auth, onboarding, portal, applications, and admin.
- `FinanceMetaLanding/`: operating registry and research experiment packages.

The landing never guesses the production member origin. Set `VITE_MEMBER_APP_URL` to a verified HTTPS member URL; otherwise production membership CTAs fail closed to on-page/contact paths. See `PROJECT_TRUTH.md` and `DEFINITION_OF_DONE.md` for exact release state.

## Verify the landing

```bash
npm ci
npm run release:check
```

## Verify the member platform

```bash
cd Finance4allLanding
npm ci
npm run typecheck
npm test
npm run lint
VITE_SUPABASE_URL=https://pnemeegkwyaicsbnbnmg.supabase.co \
VITE_SUPABASE_PUBLISHABLE_KEY=sb_publishable_CIContractOnly0000000000000000 \
VITE_AUTH_REDIRECT_ORIGIN=https://preview.financemeta.example \
npm run build
```

## Production sequence

1. Record the exact source revision and the canonical landing/member HTTPS origins.
2. Review and apply Supabase migrations through `016_public_funnel_analytics.sql`.
3. Configure the documented public environment variables and Auth redirect allowlist.
4. Enable public signup if membership is open.
5. Deploy both surfaces, then run the two-account journey and CTA matrix against those exact URLs.

Never place a Supabase service-role or other secret key in a `VITE_` variable.

## September 2026 research website

The root now serves FinanceMeta's research ecosystem. The prior Finance for All page is preserved at `/finance-for-all`; the nested member application is unchanged.

- Development: `npm run dev`
- Local release gate: `npm run release:check`
- Built preview: `npm run preview`
- Content: `src/content/`; route registry: `src/routes.ts`
- Set `VITE_SITE_URL` to the verified production HTTPS origin before building.
- `VITE_MEMBER_APP_URL` remains optional and must identify a verified member origin. Without it, member-account handoffs lead to contact.

The production build prerenders clean-route `.html` files and a sitemap. Vercel uses `cleanUrls: true`; do not add a catch-all rewrite to `index.html`, which would break page-specific metadata and hydration. The `dist/route-manifest.json` records the generated routes and page hashes.

See `docs/REBUILD_REPORT_2026-09-21.md` for the exact 93 routes, data architecture, feature inventory, verification, and remaining content/production gates.

## Improvement release candidate (21 September 2026)

See [the implementation and verification report](docs/IMPROVEMENTS_2026-09-21.md) and [release/rollback runbook](docs/RELEASE_RUNBOOK_2026-09-21.md). `npm run release:check` builds all 93 routes and runs 23 regression tests. `npm run qa:serve` provides a local-only axe audit; `npm run links:check` validates external links read-only. `npm run release:package` creates source and deployment archives with hashes. Final post-change browser QA was blocked by unavailable browser security-policy validation; do not treat this candidate as deployed or fully browser-certified.

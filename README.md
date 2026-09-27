# FinanceMeta public website

A React/Vite website for financial education, research protocols, program information and participation paths. It prerenders its route catalog and provides device-local reading lists, practice tools and HTTPS links to the separate member portal. It makes no claim of market returns or completed programs without evidence.

## What this project does

Visitors can explore research and programs, compare participation tracks, save reading items locally, export a reading list and prepare a contact email. Preparing a draft does not send it. Live market feeds are not connected. Saved public reading state belongs to the current browser, not a member account.

## Architecture and repository structure

- `src/content/`: typed editorial, research and program catalogs.
- `src/routes.ts`, `src/site.tsx`, `src/prerender.tsx`: route registry, shared shell and static rendering.
- `src/lib/`: reading persistence, discovery and finance-tool calculations.
- `public/`: downloadable resources, icons and social image.
- `scripts/`, `tests/`: content, release, interaction and metadata verification.
- `docs/`, `evidence/`: historical reports and bounded verification receipts.

The workspace may also contain independent Git repositories `Finance4allLanding/` (member portal) and `FinanceMetaLanding/` (research/registry). They are excluded from this export and have their own CI. Historical worktrees and local caches are preserved outside the tracked website source.

## Installation

Use Node 22.23.2 (see `.nvmrc`) and npm 10.9.8:

```bash
npm ci
cp .env.example .env.local
npm run dev
```

## Configuration and deployment

Set `VITE_SITE_URL` to the verified public HTTPS origin. Set `VITE_MEMBER_APP_URL` only to the verified member application. Leave `VITE_NATIVE_INTAKE_ENABLED=false` until its database migrations and live member journeys are certified. Without those settings, public handoffs use the documented contact/form fallback. Never put a secret or service-role key in a `VITE_` variable.

```bash
npm run release:check
npm run preview
```

Vercel serves the generated `dist/` with clean URLs and security headers. Do not add a catch-all rewrite that bypasses prerendered route metadata. `dist/route-manifest.json` records route hashes; `dist/release-revision.json` identifies the source revision. A local build does not certify a deployment.

## Testing and results

```bash
npm run typecheck
npm run lint
npm test
npm run release:check
npm run audit:prod
```

The current results, retained failures and release boundary are in [FINAL_RELEASE_REPORT.md](FINAL_RELEASE_REPORT.md). Older reports describe their own source snapshots and do not override that report.

Workspace-only database verification requires the portal sibling and `npm install --prefix .scratch/feature-db --no-save @electric-sql/pglite@0.5.8`, then `node scripts/test-feature-database.mjs`. It uses an isolated PostgreSQL engine with service fixtures; it does not certify hosted Supabase. Standalone portal CI runs its SQL authorization suites using Supabase PostgreSQL.

## Limitations

Production origins, Auth redirects, deployed revisions, live RLS, account journeys, privacy/safeguarding operations and rollback remain separate release gates. There is no real-market research efficacy claim or manuscript in this website repository.

## License

No standalone website license has been granted in this repository. Public source availability is not a grant of reuse rights. The rights holder must select terms before distributing it as an openly licensed package.

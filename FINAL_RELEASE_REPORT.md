# Public website release candidate — 2026-09-27

This candidate reconciles the canonical public-site implementation with the Union Project export. The member application is a separate release.

## Implemented and verified

- 117 public routes, including the Union directory, preserve research, learning, programs, reading tools and the legacy Finance for All experience.
- Union publication requires reviewed evidence, permission, safe links and current review dates. No partner records are published.
- Member handoff rejects unsafe destinations, and the sign-in page supports the configured account service. Native intake remains disabled by default.
- Release verification checks immutable revision identity, metadata, social-image integrity and security headers. Missing Twitter image-alt metadata and legacy access-label contrast were repaired.
- Node 22.23.2 is the canonical runtime. The full release gate passes 53 tests, typechecking, lint, content validation and build checks.
- All 117 routes rendered at 320 CSS pixels with no horizontal overflow, missing H1 or page errors. Accessibility checks covered ten main routes at mobile and desktop widths; the two legacy contrast findings were fixed and passed a focused rerun. Union dark theme, mobile menu dismissal, unavailable records and detail focus passed.
- Dependency audit reported zero vulnerabilities. Thirty-four external destinations were checked; one IMF reference returned HTTP 403 and requires manual review. All eight inspected application forms rendered with fields and submit controls. No application was submitted.

## Release boundaries

These results establish a public-site release candidate, not completed member onboarding. Controlled account sign-in/recovery, submission receipt handling, hosted migrations/RLS, restoration, privacy operations and accountable operational ownership remain unverified. Existing live member revision health and enabled authentication providers do not establish those workflows.

The member candidate is tracked separately in https://github.com/build-the-future-11/finance4all-global-reach/pull/134. Its database authorization tests passed in isolated CI; hosted FinanceMeta management access is unavailable to the connected Supabase account.

Historical working trees were preserved. This candidate was assembled in an isolated checkout; no original dirty repository was reset or overwritten. The execution workspace retains source-hash snapshots, test logs, failed attempts, browser scans and screenshots under `evidence/launch-execution-2026-09-27/` outside this checkout.

## Deployment procedure

1. Require the exact candidate commit's release check to pass on GitHub.
2. Deploy through the existing FinanceMeta Vercel project, keeping native intake disabled.
3. Run `npm run live:verify` against the actual deployed revision; inspect `/union`, `/signin`, `/apply` and mobile navigation in production.
4. Retain the prior production deployment `dpl_J3c69ys3gb1DZ8vLiNi8pndc357B` as the rollback target and verify its health. Do not claim a rollback exercise unless traffic was actually reverted and rechecked.

Full member-platform certification remains blocked until the separate live gates are satisfied.

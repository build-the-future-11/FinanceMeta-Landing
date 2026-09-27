# FinanceMeta launch readiness

Decision date: 2026-09-20
Decision: **NO-GO for broad public onboarding**

`PASS` means proof exists for the scope stated. It does not imply a broader production guarantee.

## Checklist

| Gate | Status | Proof / exact boundary |
| --- | --- | --- |
| Root build | PASS | Node 22.23.2 root `npm run release:check` passed. |
| Portal typecheck | PASS | Final `npm run typecheck` passed. |
| Portal lint | PASS | Final `npm run lint` passed with no output errors. |
| Unit/component tests | PASS | 122/122 across 31 files. |
| Release/security contracts | PASS | 12/12 pretest and 27/27 Node contracts. |
| Storybook | PASS | Static build completed; large Storybook-only chunks warned. |
| Portal development bundle | PASS | 1,837 modules transformed; route chunks emitted. |
| Portal release build | FAIL | Bundle compiles, then clean-source provenance correctly rejects the dirty refresh. |
| Root release deployment | FAIL | Recorded root origin serves an older build than current source and has no immutable revision receipt. |
| Portal deployment health | PASS | Canonical origin served service `financemeta-member-portal`, revision `c8293bf...`, critical route shells and required headers at 2026-09-20T04:53:00.979Z. This is the clean HEAD, not local refresh. |
| Production dependency audit | PASS | Root 0 vulnerabilities at moderate threshold; portal 0 at high threshold. |
| Browser public/auth smoke | PASS for covered routes | Confirmation run passed 12/12 in 50.0 seconds, exited 0 and released its isolated port. |
| Accessibility | PARTIAL | Six Axe routes reported zero automatic violations after fixes. Manual assistive-technology and complete route coverage remain. |
| Critical member journeys | UNVERIFIED | Controlled production email/Google/member identities unavailable. |
| Authentication | PARTIAL | Local fail-closed, redirect, timeout, password, callback and recovery contracts pass; real providers unverified. |
| Authorization | PARTIAL | Fresh-DB migration replay, two-identity RLS and 23 lifecycle assertions pass. Production policies/ledger unverified. |
| Database permissions | PARTIAL | Source grants/RLS/functions are strong and locally executed; no live receipt. |
| Input validation | PARTIAL | Auth/onboarding and sensitive functions validate; many content-table lengths lack DB constraints. |
| Rate limits | FAIL | No complete action-level rate policy for member/public writes. |
| Security headers | PASS for live portal; PARTIAL overall | Portal health verifies CSP/HSTS/frame/MIME/referrer/permissions. Root live headers are present but differ from source. |
| Secrets | PASS for source scope | No service-role browser key found; public key/project/origin contracts fail closed. Provider secret inventory was not available. |
| XSS/link handling | PASS for inspected paths | No raw HTML renderer; React escaping and external URL normalization are used. |
| CSRF | N/A / PARTIAL | Auth uses bearer/session API rather than a cookie-backed custom form server. Provider semantics remain Supabase-owned. |
| File uploads/storage | N/A for current UI | No upload UI. Migration keeps legacy avatar bucket private/inert. |
| Error handling | PARTIAL | Error boundary, deadlines, toasts/inline states and confirmed single-row mutations exist; profile degraded state still needs work. |
| Monitoring/error reporting | FAIL | No release-tagged client error service, alert policy or named operations owner. |
| Analytics | PARTIAL | Root has bounded anonymous events; portal activation/retention analytics absent; live root analytics migration/env not certified. |
| Mobile/responsive | PARTIAL | Responsive CSS and prior 390/1440 DOM checks exist; no current full device/browser matrix. |
| Performance | UNVERIFIED | Bundle sizes known; no trace, CWV or field data. |
| SEO | PARTIAL | Canonicals, robots, metadata and new static sitemaps exist. Two public origins conflict; portal social image/route metadata are incomplete. |
| Metadata/social previews | PARTIAL | Root source includes large-image metadata; deployed root is stale. Portal has summary metadata without an OG image and static metadata across routes. |
| Payments | N/A | No monetization or billing implementation. |
| Email | PARTIAL | Supabase Auth/reset and `mailto:` paths exist; actual delivery and support response are unverified. |
| Privacy | FAIL | No privacy route/notice/consent record despite personal data collection. |
| Terms/participation | FAIL | No current terms route or acceptance gate. |
| Child safeguarding | FAIL | `Under 13` is selectable with no verifiable guardian consent or approved alternative. |
| Account export/deletion | PARTIAL | Source and disposable DB lifecycle suite pass; production operation/retention ownership unverified. |
| Backups/recovery | UNVERIFIED | No current provider backup configuration or restore drill evidence. |
| Deployment configuration | PARTIAL | Vercel configs and portal exact-revision health exist; root is stale and combined rollback is undocumented. |
| CI | PARTIAL | Source workflow defects were fixed; changes have not run in hosted CI at a committed SHA. |
| Browser compatibility | UNVERIFIED beyond Chromium | No current WebKit/Firefox run. |
| Legal/trust surfaces | FAIL | Evidence qualifiers improved, but privacy/terms/child review remain blocking. |

## What is now verified

- Root source contracts, typecheck and production bundle.
- Portal TypeScript and ESLint.
- 119 component/unit tests, 27 release/security contracts and 12 toolchain tests.
- Fresh-database application of every migration on the exact CI PostgreSQL image.
- Two-identity RLS and all 23 account-lifecycle assertions in rollback-only tests.
- Zero known production npm vulnerabilities at the configured audit thresholds on the audit date.
- Live canonical portal service identity, exact clean revision, critical shell routes and security headers.
- Six public/auth routes with zero Axe-detected violations and all 12 browser assertions.
- The current release guard refuses to label a dirty tree with an immutable revision.

## What was fixed in this session

- Restored the combined CI contract: immutable runner/action/runtime pins, canonical auth origin and a real portal `release:check` script.
- Removed an overbroad source-gate false positive while preserving blocks on TODO/FIXME/stub/scaffold markers.
- Prevented Playwright from reusing unrelated local apps and assigned a dedicated configurable port.
- Added bounded web-server shutdown configuration after teardown failed.
- Updated browser tests to the current truthful homepage and evidence boundaries.
- Fixed nine automated contrast defects and two nested landmark defects.
- Added visible source/audit qualifiers to organization-reported reach metrics.
- Preserved full safe protected destinations through login, signup and onboarding.
- Added sitemaps containing only recorded public routes on each known origin.
- Required returned owner-scoped keys for single-row updates/deletes so zero affected rows cannot produce false success.

## What remains unverified

- Production migration history and RLS behavior.
- Production email confirmation, Google OAuth, recovery, onboarding, persistence, logout/login and cross-member isolation.
- Current refresh behavior after an immutable deployment.
- Root deployment parity with source.
- Provider backups and a restoration drill.
- WebKit/Firefox, assistive technology, full responsive matrix and Core Web Vitals.
- Tally application intake, contact response and email deliverability.

## Known defects

1. Root deployment is stale.
2. Portal refresh cannot produce a release revision while dirty.
3. Privacy, terms and child consent/safeguarding are absent.
4. Profile initialization failure lacks a specific retry state.
5. Member/public write rate budgets are incomplete.
6. Database constraints do not uniformly enforce client field bounds.
7. Hardcoded demo-row filters hide data rather than representing publication state.
8. Portal has no operational error reporting or funnel analytics.
9. Public route bundles initialize the Auth/Supabase provider graph.

## P0 blockers

1. Review and commit the current product refresh; pass release gates at exact SHA.
2. Deploy or retire/redirect the stale root landing.
3. Obtain qualified privacy/safeguarding decisions and implement notice, terms, consent/age enforcement and operational ownership.
4. Certify the live migration ledger and RLS at deployed SHA.
5. Pass credentialed production Auth and two-member isolation journeys.

The child-data gate needs particular care. The [US FTC COPPA rule summary](https://www.ftc.gov/legal-library/browse/rules/childrens-online-privacy-protection-rule-coppa) identifies requirements for covered online services collecting personal information from children under 13. India’s [Digital Personal Data Protection Act, 2023](https://www.indiacode.nic.in/indiacode/handle/123456789/22037?view_type=browse) and the official [Digital Personal Data Protection Rules, 2025](https://www.meity.gov.in/documents/act-and-policies/digital-personal-dataprotection-rules-2025gDOxUjMtQWa?pageTitle=Digital-Personal-Data-ProtectionRules-2025) include child-data and verifiable-consent provisions with phased commencement. Counsel must determine applicability, timing and approved implementation; engineering should fail closed meanwhile.

## P1 follow-ups

1. Add explicit profile load error/retry state.
2. Define and enforce per-action rate limits.
3. Add compatible database constraints for bounded inputs.
4. Add privacy-safe error reporting with release identity and an alert owner.
5. Establish account export/deletion and retention operations.
6. Record combined deployment rollback and database compatibility procedure.

## Post-launch candidates

- First-session artifact chooser and resumable dashboard state.
- Structured evidence passports for programs, research and editorial work.
- Verified public opportunity pages with automatic expiry.
- Member portfolio artifacts and scoped project collaboration.
- Route-specific metadata/share cards.
- Privacy-aligned product analytics and search alerts.

## Rollback and risk notes

- The portal’s clean-source revision writer is the release identity authority. Do not bypass it with an environment override or by deleting user work.
- Database migrations include security and account-lifecycle changes. Capture the live ledger and schema before applying or repairing history. Never infer safe replay from the disposable DB result.
- Keep test certifications rollback-only in production; do not create persistent test members/rows without an approved cleanup plan.
- If the refresh deploys before policy gates, disable new account creation and underage onboarding rather than silently collecting unsupported data.
- Root and portal deployments must be rolled back independently unless the product adopts one canonical surface. Record compatible pairs.

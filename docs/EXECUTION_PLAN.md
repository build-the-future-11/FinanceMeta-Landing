# FinanceMeta execution plan

Updated: 2026-09-20
Status values: `DONE`, `IN PROGRESS`, `READY`, `BLOCKED`, `BACKLOG`

Each acceptance test is a release condition. A local pass does not substitute for a production or policy acceptance test when the task names one.

## Wave 0 — preserve behavior and baseline

| ID | Priority | Area | Files likely affected | Problem | Implementation | Acceptance test | Dependencies | Status |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| W0-01 | P0 | Source control | `Finance4allLanding/` | The member tree began with extensive user-owned modifications and untracked refresh files. | Capture HEAD/branch/status, make additive edits only, never reset or clean unrelated files. | Final status retains pre-existing work; audit lists its own changes. | None | DONE |
| W0-02 | P0 | Toolchain | both `package.json`, locks, workflows | Local default Node 26 does not match release Node. | Run authoritative gates with Node 22.23.2 and npm 10.9.x. | Toolchain verifier passes and command receipts name Node 22.23.2. | Node 22 installation | DONE |
| W0-03 | P1 | Baseline | tests/build/browser/database | Prior documents contained older test counts and production claims. | Rerun source, unit, contract, browser, build, audit and database gates on current dirty state. | QA matrix records command, date, result and boundary. | W0-01/02 | DONE |
| W0-04 | P1 | Documentation | `docs/*` | No single current control plane existed for the two web surfaces. | Create master audit, architecture, execution, QA, launch and work-session ledgers. | All six files cross-reference current evidence and blockers. | W0-03 | DONE |

## Wave 1 — blockers

| ID | Priority | Area | Files likely affected | Problem | Implementation | Acceptance test | Dependencies | Status |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| W1-01 | P0 | CI | root `.github/workflows/release-check.yml`, portal `package.json` | Combined workflow invoked a missing portal script, used a noncanonical auth origin and drifted runtime/action pins. | Add portal `release:check`; pin Ubuntu 24.04, actions and Node 22.23.2; use the canonical redirect origin. | Workflow contract tests plus a clean CI run at exact SHA. | Clean review branch | IN PROGRESS: source fixed, CI run pending |
| W1-02 | P0 | Release provenance | portal working tree | Production build correctly rejects the dirty refresh. | Review changes, group/commit them, then rebuild from exact immutable SHA. | `npm run release:check` exits 0 and `/release-revision.json` equals SHA. | Owner review of dirty work | BLOCKED |
| W1-03 | P0 | Root deployment | root source, Vercel project | Public landing serves an older product than current source. | Choose deploy versus retirement; deploy current root or redirect to canonical portal landing. Add exact revision receipt. | Live title/assets/CSP match source and immutable revision; journey passes. | W1-02, hosting ownership | BLOCKED |
| W1-04 | P0 | Privacy/safeguarding | router, signup/onboarding/settings, DB migration, policy pages | No notice/terms/consent boundary exists; `Under 13` is accepted. | Obtain counsel/safeguarding decisions. Until approved, remove/deny unsupported age paths. Add plain-language notice, terms acceptance version/time, withdrawal/contact flow and required guardian verification. | Legal/safeguarding signoff; direct requests cannot bypass; versioned acceptance and withdrawal tests pass. | Qualified policy owner | BLOCKED |
| W1-05 | P0 | Production database | workflows, `supabase/migrations`, receipts | Source migrations/RLS pass locally but production equivalence is unknown. | Read canonical ledger, compare all versions, run rollback-only production RLS and lifecycle certifications. | Exact-SHA ledger and PASS receipts retained; no persistent test rows. | Authorized Supabase access | BLOCKED |
| W1-06 | P0 | Production auth | credentialed Playwright workflow | Email, Google, recovery, onboarding, persistence, logout/login and two-member isolation lack current live proof. | Provision controlled accounts/secrets; run credentialed suite at deployed SHA; clean up markers. | All critical journeys pass without retries masking failure. | W1-02/05; controlled identities | BLOCKED |

## Wave 2 — correctness and security

| ID | Priority | Area | Files likely affected | Problem | Implementation | Acceptance test | Dependencies | Status |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| W2-01 | P1 | Auth navigation | `ProtectedRoute.tsx`, Login, Signup, Onboarding, auth tests | Query/hash and signup/onboarding transitions could lose the intended protected destination. | Preserve a sanitized full portal path in router state/sessionStorage and consume it after onboarding. | Unit tests cover query/hash, OAuth, email-confirmation and onboarding return. | None | DONE |
| W2-02 | P1 | Mutation integrity | `src/hooks/portal/*`, `src/lib/confirmed-mutation.ts` | Zero-row RLS updates/deletes could be reported as success. | Require returned IDs for every single-row update/delete and centralize confirmation. Retain idempotent semantics for mark-all. | Helper tests cover success, zero-row and provider error; full suite passes. | W1-05 for live acceptance | DONE locally — 122/122 |
| W2-03 | P1 | Auth degraded state | AuthContext, ProtectedRoute, portal error UI | Profile read failure becomes null without a first-class retry state. | Add `profileStatus/profileError`, block member page assumptions and provide retry/sign-out actions. | Network failure and recovery tests; no protected mutation runs without profile state. | None | READY |
| W2-04 | P1 | Rate control | Supabase migrations/edge or gateway config, docs | Identity policies do not control request volume. | Define budgets for signup, connection, submission, registration, search and intake; enforce close to operation with privacy-safe identifiers. | Burst/parallel tests produce stable 429/domain errors and recover after window. | Architecture decision, W1-05 | BLOCKED |
| W2-05 | P1 | Input invariants | migrations, Zod/form schemas | Many database text/array fields lack server-side bounds. | Inventory production values, introduce compatible CHECK constraints, shared schemas and URL normalization. | Preflight finds no current violations; direct oversized/invalid writes fail. | W1-05 | BLOCKED |
| W2-06 | P1 | Admin ownership | role migration, provisioning runbook, tests | Founder-requested Ryan-only administration is not an enforced production policy. | Identify immutable owner UUID, audit existing roles, choose owner/admin model, implement in DB, and test normal/admin/owner identities. | Unauthorized role assignment and admin action fail; controlled owner succeeds. | Owner UUID, W1-05/06 | BLOCKED |
| W2-07 | P1 | Public link safety | markdown/mappers/tests | External links are untrusted content. | Retain protocol and credential rejection; add regression corpus for encoded/protocol edge cases. | Fuzz/corpus tests allow only intended HTTPS/HTTP behavior. | None | READY |
| W2-08 | P1 | Secrets/supply chain | workflows, env validators | CI/deploy must keep service keys and mutable actions out of browser/release. | Retain publishable-key validation, immutable action pins, least GitHub permissions and no persisted checkout credentials. | Workflow/security contracts and secret scan pass. | None | DONE |
| W2-09 | P1 | Browser harness | `playwright.config.ts` | E2E previously reused unrelated port 4173 and the first isolated runner hung on teardown. | Use dedicated configurable port, never reuse, and configure bounded SIGTERM shutdown. | Full suite exits 0, frees port 4187 and prints final summary without manual cleanup. | None | DONE — 12/12, exit 0 |
| W2-10 | P1 | Database replay | CI/local receipt | Authorization SQL needed runtime proof. | Replay exact migrations on CI PostgreSQL image; run two-identity and lifecycle suites. | Both SQL scripts exit 0; lifecycle plan reports 23/23. | Docker image | DONE locally; CI continuity remains |

## Wave 3 — UX and activation

| ID | Priority | Area | Files likely affected | Problem | Implementation | Acceptance test | Dependencies | Status |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| W3-01 | P1 | Accessibility | refresh components/CSS/e2e | Axe found contrast and nested-landmark defects. | Correct colors, selected-tab stacking and landmark elements; keep serial Axe coverage. | Six audited routes have zero automatic violations; manual keyboard/mobile review recorded. | None | DONE for automated scope |
| W3-02 | P1 | Claim trust | `Index.tsx`, `AuthLayout.tsx`, content | Reach metrics lacked visible source boundary. | Add organization-reported date and independent-audit qualifier wherever metric appears. | Browser assertion finds qualifier on public landing; content review covers auth. | None | DONE |
| W3-03 | P2 | First value | onboarding, dashboard, learning/pathway actions | New members land in a broad dashboard without one clear outcome. | After onboarding offer three small paths: complete/save a lesson, follow an opportunity, or create a research brief. Persist progress. | Controlled-user median flow ends in saved artifact; refresh/logout retains it. | W1-04/06 | BACKLOG |
| W3-04 | P2 | Public-to-auth clarity | public CTA components | Some public links enter protected routes without explaining sign-in. | Label gated destinations or show a concise interstitial preserving destination. | User test predicts next step; no CTA dead ends. | W2-01 | READY |
| W3-05 | P2 | Empty/error recovery | all portal pages | State quality is uneven across data-backed pages. | Standardize loading, empty, permission, offline, retry and stale-data states. | QA matrix adversarial states pass per route. | W2-03 | READY |
| W3-06 | P2 | Content depth | `src/content/editorial.ts`, editorial workflow | Four of twenty planned guides are complete. | Assign editor/source/review date; ship only substantive reviewed guides. | 20 guides meet word/source/review contract; no fake daily cadence. | Editorial owners | BLOCKED |
| W3-07 | P2 | Program truth | catalog, DB/admin | Visually complete programs lack confirmed dates/owners/artifacts. | Require state, owner, review date and evidence fields; hide or explicitly label incomplete records. | Every visible program passes evidence contract. | Program owners | BLOCKED |
| W3-08 | P2 | Responsive/manual QA | landing, auth, portal | Automated tests cover viewport behavior incompletely. | Record mobile/tablet/desktop matrix for navigation, map, forms, tables/dialogs and long text. | No overflow, trapped focus or inaccessible action across supported viewports. | W2-09 | READY |

## Wave 4 — performance and observability

| ID | Priority | Area | Files likely affected | Problem | Implementation | Acceptance test | Dependencies | Status |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| W4-01 | P1 | Error reporting | AppErrorBoundary, AuthContext, query client | Console-only failures cannot support operations. | Add privacy-safe error reporting with release SHA, route, error category and redaction; define alert owner. | Forced render/auth/mutation failures appear once with no email, school, bio or token. | Privacy review | BLOCKED |
| W4-02 | P2 | Public bundle | App/router/provider graph | Anonymous routes load Auth/Supabase providers and vendor code. | Split public and protected provider trees or lazy initialize Auth on auth/protected routes. | Bundle/trace proves reduction; public learning makes no session request. | W2-03 | READY |
| W4-03 | P2 | Core Web Vitals | both deployments | No real LCP/INP/CLS measurement exists. | Run trace/Lighthouse on representative mobile and desktop pages; set budgets in CI where stable. | p75 field or controlled lab targets recorded with trace evidence. | Canonical deployments | BLOCKED |
| W4-04 | P2 | Query efficiency | portal search/activity/hooks | Search sends six parallel table queries; dashboard fans out across tables. | Measure request waterfall and payload; add indexed RPC/materialized read model only if evidence warrants. | Fewer requests/bytes and equal authorization; explain plan/index evidence retained. | W1-05, measurement | BACKLOG |
| W4-05 | P2 | Product analytics | root analytics, portal event schema | Portal activation/retention cannot be measured. | Define minimal, consent-aligned event taxonomy and retention; avoid private content. | Journey creates expected bounded events; opt-out/withdrawal works where required. | W1-04 | BLOCKED |

## Wave 5 — product expansion

| ID | Priority | Area | Files likely affected | Problem | Implementation | Acceptance test | Dependencies | Status |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| W5-01 | P2 | Member artifact | new portfolio routes/tables | Work is fragmented across saves, submissions and applications. | Build an owner-controlled portfolio that references verified contributions and excludes private fields by default. | Member preview/export/share permissions pass; cross-user denial proven. | W1-04/05/06 | BACKLOG |
| W5-02 | P2 | Opportunity discovery | public route, opportunities schema/admin | Opportunity value is gated and operationally sparse. | Add public verified opportunity pages with owner, source, eligibility, deadline, expiry and moderation. | Expired/unverified records cannot appear active; source links pass. | Content operations | BACKLOG |
| W5-03 | P2 | Evidence passport | programs/research/editorials | Trust metadata is repeated in prose. | Create one structured evidence object and renderer for state/source/owner/review/outcome boundaries. | All public cards consume the same validated schema. | W3-07 | BACKLOG |
| W5-04 | P3 | Collaboration | connection/project schema | Generic connection requests are less useful than scoped collaboration. | Attach requests to a project/brief, expected contribution and expiry. | Recipient understands context; spam/rate/authorization tests pass. | W2-04 | BACKLOG |
| W5-05 | P3 | Sharing/SEO | public guides, metadata pipeline | Useful lessons lack dedicated social metadata. | Generate route-aware static/SSR metadata or pre-rendered public pages and privacy-safe share cards. | Crawler gets unique canonical title/description/image per artifact. | W4-02, canonical IA | BACKLOG |

## Wave 6 — launch polish

| ID | Priority | Area | Files likely affected | Problem | Implementation | Acceptance test | Dependencies | Status |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| W6-01 | P1 | Canonical SEO | both `public/robots.txt`, `sitemap.xml`, HTML | Sitemaps were absent and public origins disagreed. | Static sitemaps added for recorded public routes; finalize canonical ownership and automated route generation. | Search-console/crawl validation; protected routes excluded. | W1-03, canonical decision | IN PROGRESS |
| W6-02 | P1 | Release/rollback | deployment docs and provider config | Combined exact-source rollback is not recorded. | Capture root/portal project IDs, deployed SHAs, DB migration receipt, rollback target and owner. | Staging rollback drill restores known revision and preserves DB compatibility. | W1-02/03/05 | BLOCKED |
| W6-03 | P1 | Support/privacy operations | settings, contact, runbooks | Export/deletion code exists without approved response and retention operations. | Assign response owner/SLA, verify export, reviewed deletion, retention and breach contact procedures. | Controlled request completed end to end with audit record. | W1-04/05/06 | BLOCKED |
| W6-04 | P2 | Browser compatibility | QA automation/manual matrix | Chromium is the only automated browser in this audit. | Add WebKit/Firefox smoke coverage for public/auth/core member flows where stable. | Supported-browser matrix passes with documented exceptions. | W2-09 | BACKLOG |
| W6-05 | P2 | Final content | all public surfaces | Stale claims, placeholder dates or demo records can re-enter. | Run claim/source/content inventory with named approvers immediately before release. | Every visible factual claim has source/date/owner; all future work labeled. | Program/editorial owners | BLOCKED |

## Immediate next 15

1. Review and commit the preserved portal refresh as logical changes without dropping user work.
2. Run portal `release:check` on that clean SHA.
3. Decide whether the root landing remains a separate product.
4. Deploy or redirect the stale root landing and add immutable revision evidence.
5. Obtain a qualified privacy/safeguarding decision for users under 18 and especially under 13.
6. Implement approved privacy/terms/consent versioning and fail-closed age handling.
7. Read and certify the production migration ledger.
8. Run production rollback-only RLS and lifecycle certification.
9. Provision controlled email and Google identities.
10. Run the credentialed auth/onboarding/persistence/isolation journey.
11. Make every update/delete mutation require a confirmed returned row.
12. Add explicit profile-load failure/retry state.
13. Add privacy-safe release-tagged error reporting and an operational owner.
14. Define action-level rate limits and server-enforced input bounds.
15. Measure public-route network/CWV behavior before changing the provider graph.

# FinanceMeta QA matrix

Executed: 2026-09-20
Authoritative local runtime: Node 22.23.2; npm 10.9.x
Member repository HEAD: `c8293bf5b8bcc09176bb43bc1d586a8c839083c9`

## Verification table

| Check | Command | Result | Important failure/boundary | Probable root cause or conclusion |
| --- | --- | --- | --- | --- |
| Root dependency tree | `npm ls --depth=0` | PASS | None | Installed root dependencies resolve. |
| Portal dependency tree | `npm ls --depth=0` | PASS WITH DRIFT | Reports extraneous platform/wasm packages | Existing `node_modules` contains cross-platform optional artifacts; clean `npm ci` remains release authority. |
| Root release gate | `npm run release:check` under Node 22.23.2 | PASS | Initial run failed because truthful “coming soon” UI copy matched an overbroad source blocker; scanner narrowed and rerun passed. | “Coming soon” is a valid product state; TODO/FIXME/stub/scaffold remain blocked. |
| Root production audit | `npm run audit:prod` | PASS — 0 vulnerabilities | Sandbox DNS failed first; approved network retry succeeded. | Registry access required; final result current to execution time. |
| Portal typecheck | `npm run typecheck` | PASS | None | Current dirty source is type-correct. |
| Portal lint | `npm run lint` | PASS | None | Zero ESLint errors/warnings in final run. |
| Portal Vitest | `npm test` Vitest phase | PASS — 122/122 across 31 files | Error-boundary fixture intentionally prints a dynamic-import error; assertions pass. | Expected failure fixture, not suite failure. |
| Portal Node contracts | `npm test` Node phase | PASS — 27/27 | None | Database target, release revision, headers, workflows, ledger, RLS source and production verifier contracts pass. |
| Portal pretest toolchain | automatic `pretest` | PASS — 12/12 | None | Lockfile/platform/action/runtime contracts pass. |
| Targeted onboarding regression | `npx vitest run src/test/onboarding-flow.test.tsx --maxWorkers=1` | PASS — 4/4 | Earlier four-file cold run hit one existing 5-second timeout; isolated retry and final full suite passed without weakening timeout. | External-volume transform/startup contention, not reproduced in authoritative reruns. |
| Portal development build | `npm run build:dev` | PASS | Bundle is large; no CWV inference is allowed. | Final Vite run transformed 1,838 modules and emitted route chunks. |
| Portal production build | `npm run build` with canonical fixture env and expected HEAD | EXPECTED FAIL AFTER BUNDLE | `write-release-revision` rejects modified/untracked source. | Provenance guard is working; refresh must be reviewed/committed before release. |
| Storybook build | `npm run build-storybook` | PASS | Storybook-only docs bundles exceed 500 kB warning; not shipped with app. | Documentation tooling bundle size, not production bundle. |
| Portal production audit | `npm run audit:prod` | PASS — 0 vulnerabilities | Sandbox DNS failed first; approved network retry succeeded. | No known production dependency vulnerabilities at high threshold at execution time. |
| Migration replay | exact CI PostgreSQL image + all migration files | PASS | Disposable local DB only. | Every migration applies in lexical order to fresh Supabase PostgreSQL 17.6 image. |
| Two-identity RLS | `two_identity_rls_certification.sql` | PASS | Transaction rolls back; production not tested. | Owner/cross-member policy contract succeeds locally. |
| Account lifecycle RLS | `account_lifecycle_rls_certification.sql` | PASS — 23/23 | Transaction rolls back; production not tested. | Export, request/cancel, isolation and admin review contract succeeds locally. |
| Chromium public/auth journeys | `npm run test:e2e` | PASS — 12/12, exit 0, 50.0s | The first run completed assertions but hung on Vite teardown; bounded graceful shutdown was added. | Confirmation run printed final summary, exited 0 and released port 4187. |
| Axe browser audit | same Playwright suite | PASS — 6 routes, zero automatic violations | Automated scope only; not a manual WCAG certification. | Contrast and nested landmark defects were fixed. |
| Live portal health | `npm run production:verify -- --receipt /tmp/...` | PASS | Tests HTTP shell/headers/routes, not authenticated behavior or DB state. | Live service is canonical and serves clean HEAD `c8293bf...`. |
| Live root landing | `curl` HEAD + HTML | FAIL / STALE | 200 and security headers, but live metadata, assets and CSP differ from current source. | Older root build is deployed; no revision endpoint identifies it. |
| Core Web Vitals | Chrome trace/Lighthouse | UNVERIFIED | Required trace tooling unavailable; no synthetic score invented. | Needs canonical deployed URLs and trace tooling. |
| Credentialed member suite | `npm run test:e2e:credentialed` | NOT RUN | No controlled account credentials. | External secret/identity dependency. |
| Production migration/RLS | production workflows | NOT RUN | No authorized database credentials/ledger evidence. | External access dependency. |

## Build artifact evidence

### Root landing

| Artifact | Raw | Gzip |
| --- | ---: | ---: |
| HTML | 2.05 kB | 0.66 kB |
| CSS | 23.72 kB | 6.24 kB |
| JavaScript | 285.09 kB | 91.95 kB |

### Portal optimized development-mode build

| Major artifact | Raw | Gzip |
| --- | ---: | ---: |
| HTML | 2.21 kB | 0.81 kB |
| CSS | 137.60 kB | 25.30 kB |
| Application entry | 268.41 kB | 91.66 kB |
| React vendor | 180.23 kB | 59.52 kB |
| Supabase vendor | 203.21 kB | 51.93 kB |
| UI vendor | 77.41 kB | 24.31 kB |

Lazy member-route chunks range from less than 1 kB to 21.32 kB raw, with shared Portal UI at 23.59 kB raw. These figures are build output, not measured route transfer totals.

## Journey matrix

| Journey | Input/validation | Backend/persistence | Refresh/repeat/error | Result |
| --- | --- | --- | --- | --- |
| Root landing → member app | HTTPS destination plus bounded attribution/session | Optional anonymous event insert | Analytics failure does not block navigation | VERIFIED LOCALLY; live root stale |
| Anonymous → public lesson | No account | Local editorial artifact | Direct navigation and browser assertions | PASS |
| Anonymous → debrief | Slug route | Local source-linked editorial content | Unknown content and route handling source-reviewed | PASS for representative browser route; full slug matrix PARTIAL |
| Protected deep link → login → return | Sanitized `/portal` path/query/hash | Router state/sessionStorage | External/public return values fall back to `/portal` | PASS unit; live auth UNVERIFIED |
| Email signup | Trimmed display/email, password policy, provider setting | Supabase Auth | Disabled provider and confirmation-required states tested | PASS source/component; live UNVERIFIED |
| Google signup/login | Provider availability and canonical callback | Supabase OAuth | Callback errors and return-path storage tested | PASS source/component; live UNVERIFIED |
| Password recovery | Account-neutral request response | Supabase Auth email | Public browser route and component behavior tested | PASS local; delivery/live reset UNVERIFIED |
| Onboarding | Required school/community, allowed age band, required display name, bounded bio | Profile row then Auth metadata | Profile failure and metadata nonconfirmation tested; desired destination preserved | PASS local; partial-write/live recovery UNVERIFIED |
| Returning member dashboard | Existing session/profile | Multi-table activity queries | Loading/error/empty components present | UNIT/COMPONENT PARTIAL; live UNVERIFIED |
| Opportunity interest | Authenticated user | `opportunity_interests` unique/owner policy | Repeat toggles supported; removal requires returned key | LOCAL SOURCE/RLS PASS; live UNVERIFIED |
| Event registration | Authenticated user | `event_registrations` owner policy | Repeat toggle supported; cancellation requires returned key | LOCAL SOURCE/RLS PASS; live UNVERIFIED |
| Research application/review | Valid member/lead/admin | projects/applications and RLS | Status/review paths exist | LOCAL POLICY PASS; credentialed behavior UNVERIFIED |
| Network connection | Distinct members and message | `connection_requests` RLS | Status update requires returned key | LOCAL POLICY PASS; credentialed live behavior UNVERIFIED |
| Saved work | Member bookmarks/Auth metadata | DB bookmarks + metadata guides | Account switch and unconfirmed write tests | PASS local; multi-tab last-write-wins known |
| Settings persistence | Bounded profile fields | Confirmed profile update | Component reload contract plus credentialed spec source | PASS local; production persistence UNVERIFIED |
| Export/deletion | Authenticated member | security-definer RPC + RLS table | Cancel/review state and isolation | PASS 23/23 disposable DB; production UNVERIFIED |
| Admin content | Valid forms/client guard | Admin RLS/grants | Pending buttons/forms exist | PARTIAL; real admin identity UNVERIFIED |

## Adversarial state matrix

| State | Expected behavior | Evidence | Status |
| --- | --- | --- | --- |
| Anonymous direct protected URL | Redirect to login; preserve safe destination | Router contract | PASS |
| External/protocol-relative return URL | Fall back to `/portal` | Auth-navigation tests | PASS |
| Missing Supabase env | Visible disconnected notice; auth actions disabled | Component + browser tests | PASS |
| Signup disabled | Visible accurate alert; submit disabled | Component + browser tests | PASS |
| OAuth callback error | Explain failure and reference; no loop | Browser test | PASS |
| Expired/failed session initialization | Deadline, log, unauthenticated state | Source/contract test coverage | PARTIAL; real expiry not browser-tested |
| Profile query failure | Null profile after load | Source inspection | FAIL: explicit retry/degraded UX missing |
| Missing profile row/race | Create row; recover only duplicate-key race | Auth tests/source | PASS local |
| Network timeout | Auth/profile deadline and query retry | Unit/source | PARTIAL across all mutations |
| Repeated click | Many forms disable pending state | Source/component tests | PARTIAL; inventory incomplete |
| Unauthorized object ID | RLS denies cross-user rows | SQL certifications | PASS local; production UNVERIFIED |
| Zero-row RLS update/delete | Must not report success | Confirmed-row helper tests + hook source | PASS for single-row update/delete hooks |
| Multiple tabs | Auth query state isolated; metadata writes last-write-wins | Tests + documented limitation | PARTIAL |
| Refresh during onboarding | Existing metadata/profile may repopulate | Source inspection | UNVERIFIED credentialed |
| Very long school/bio | Client limits 160/1200 | Onboarding source/tests | PASS client; DB enforcement PARTIAL |
| Very long admin/member content | DB must bound | Migration inspection | FAIL/PARTIAL |
| Empty content tables | Local fallbacks/empty states | Hooks/components | PARTIAL; demo filters hide data debt |
| External API failure | Auth/content errors surfaced or fallback | Source tests | PARTIAL; no global telemetry |
| Mobile navigation/overflow | Operable at small viewport | Prior refresh DOM checks; current browser suite desktop | PARTIAL |
| Reduced motion | Canvas/scroll/marquee effects stop | Source contract | PASS source; manual device check recommended |
| XSS/unsafe markdown | React escaping and protocol sanitizer | Source inspection/tests | PASS for current renderer |
| Prompt injection/model timeout | No AI runtime | Architecture | N/A |
| File upload abuse | No active upload flow; avatar bucket made private/inert | Migration contract | N/A for current UI |
| Payment failure | No payments | Architecture | N/A |

## Manual QA still required

1. Keyboard-only pass across map pins, mobile navigation, dialogs, selects and long forms.
2. Screen-reader labels/announcements for mutation success, form errors and route changes.
3. 320/390/768/1024/1440 viewport matrix in light/dark mode with long content.
4. WebKit and Firefox smoke tests.
5. Real slow/failed network and offline transitions.
6. Controlled email confirmation, Google OAuth and reset email delivery.
7. Live two-member isolation, admin review and persistence.
8. Core Web Vitals and request waterfall traces on canonical deployments.

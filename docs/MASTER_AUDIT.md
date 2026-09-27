# FinanceMeta / Finance for All master audit

Audited: 2026-09-20
Workspace: `/Volumes/PRO-BLADE/GitHub-Every-Repo/FinanceMeta-Landing`
Member application: `Finance4allLanding/`
Audit source state: member repository `main` at `c8293bf5b8bcc09176bb43bc1d586a8c839083c9` plus preserved, uncommitted product-refresh work

## Executive summary

The workspace contains two separately built React/Vite products and a research/evidence registry:

1. the repository-root public conversion landing;
2. the nested `Finance4allLanding/` public learning, authentication, onboarding, and member portal application; and
3. `FinanceMetaLanding/`, which holds research and evidence material and is not a web runtime.

The products are substantial rather than scaffolds. The member application has Supabase Auth, a protected portal, member/admin workflows, account export and deletion requests, route-level chunking, RLS migrations, rollback-only authorization tests, and meaningful unit/browser coverage. The current local product refresh also adds a long-form homepage, public lessons, editorial content, saving, richer onboarding, and a geographic community view.

The release decision is **NO-GO for the combined product**. Local engineering checks are strong, and the deployed member portal passed its exact-revision health contract at clean HEAD. Launch remains blocked because the current refresh is an uncommitted dirty tree, the separately deployed root landing is stale relative to current source, live database migration/RLS and credentialed member journeys are not certified, and the product accepts an `Under 13` age band while providing no privacy/terms notice or verifiable-parental-consent flow. The last item requires qualified legal and safeguarding review; it is not resolved by source tests.

## Current status

| Area | Status | Evidence and boundary |
| --- | --- | --- |
| Root landing source | IMPLEMENTED / VERIFIED LOCALLY | Node 22.23.2 `npm run release:check` passed; 8 CTA contract, source, accessibility-source, typecheck, and build gates passed. |
| Root landing deployment | BROKEN / STALE | `https://finance-meta-landing.vercel.app/` returns 200 and security headers, but its title, description, theme color, bundle hashes, and CSP do not match current source. No immutable revision endpoint exists. |
| Portal public pages | IMPLEMENTED / VERIFIED LOCALLY | Homepage, evidence, learning hub, Five Foundations, debriefs, auth and recovery routes render; 12 browser assertions executed and passed. |
| Portal authentication client | IMPLEMENTED / PARTIALLY VERIFIED | Supabase configuration, redirect, password, timeout, callback, fail-closed provider state, and navigation contracts have tests. Real email/Google flows remain UNVERIFIED. |
| Onboarding | IMPLEMENTED / PARTIALLY VERIFIED | Two-stage profile and private Auth metadata flow is tested locally. Live persistence and interruption recovery remain UNVERIFIED. |
| Member portal | IMPLEMENTED / PARTIALLY VERIFIED | Dashboard, learning, labs, pathways, events, network, saved items, settings, search and account lifecycle exist. Most data-backed behavior is source/component verified, not production journey certified. |
| Authorization | IMPLEMENTED / VERIFIED LOCALLY | RLS and least-privilege migrations replayed on the exact CI PostgreSQL image; two-identity and 23-check account-lifecycle suites passed. Live policy state remains UNVERIFIED. |
| Administration | IMPLEMENTED / PARTIALLY VERIFIED | Client role guard and RLS-backed admin mutations exist. Ryan-only ownership and a real admin-versus-member production test are MISSING/UNVERIFIED. |
| Editorial library | PARTIALLY IMPLEMENTED | Four substantive source-linked guides exist; the stated twenty-article library is incomplete. |
| Opportunities/program operations | PARTIALLY IMPLEMENTED | Database workflows and six retained application/intake routes exist. Broad verified catalog, moderation, expiry, confirmed dates, and current owners are incomplete. |
| Podcast/direct messages | PLACEHOLDER | UI truthfully labels the episode library and messages as coming soon. |
| Payments | N/A | No billing or payment workflow exists. |
| AI/model runtime | N/A | Research projects are described, but no browser/server model calls exist. |
| Monitoring/analytics | PARTIAL / MISSING | Root landing has bounded anonymous Supabase event inserts. Portal has no product analytics or error-reporting service; errors use console, inline state, boundary, and toast handling. |
| Privacy/legal/safeguarding | FAIL | Account creation/onboarding collects identity, email, school/community, age band and public profile fields. No privacy or terms routes are present; under-13 selection has no consent workflow. |

## System map

### Public landing conversion

`Visitor → root React landing → CTA inventory/member-handoff guard → HTTPS member origin + bounded UTM/referral/session values → optional insert-only Supabase analytics → navigation`

The landing remains usable if analytics fails. `VITE_MEMBER_APP_URL` must point to the member origin; production refuses localhost/non-HTTPS handoffs. Root analytics uses a random session UUID, allowlisted properties and no authenticated user ID.

### Public learning and evidence

`Visitor → portal BrowserRouter → lazy public route → local editorial/catalog data or read-only public Supabase query → React rendering → source/evidence links`

The public lesson and four editorials are local artifacts. Portal data hooks sometimes fall back to local editorial content when Supabase rows are absent. Hardcoded filters also suppress known demonstration titles/IDs, which is data-cleanup debt.

### Email login and protected return

`Visitor → /portal/* → ProtectedRoute → /login with full path/query/hash → Supabase signInWithPassword → Auth state listener → profile read/ensure under RLS → original protected route`

Failures are bounded by 15-second deadlines and display messages. The current sprint fixed loss of query/hash during this round trip.

### Google OAuth

`Visitor → login/signup → remember sanitized /portal destination → Supabase OAuth → configured /auth/callback → AuthProvider session/profile → onboarding if required → saved destination`

Redirect origin and return destinations are allowlisted. The provider and callback are source-tested; a real controlled Google identity has not been exercised in this audit.

### Signup and onboarding

`Visitor → provider settings read → email/Google signup → confirmation when configured → profile ensure → public profile write → private school/age/onboarding marker in Auth metadata → member destination`

The profile write verifies a returned row. The two writes are not atomic: profile save can succeed before metadata save fails. Retry is possible, but interruption behavior needs a credentialed test. Saved editorial slugs also live in Auth metadata and are last-write-wins across tabs.

### Member data workflows

`Member UI → TanStack Query hook/mutation → Supabase Data API with user JWT → table grant + RLS/function authorization → Postgres → query invalidation → rendered state/toast`

This path serves bookmarks, applications, registrations, essays/upvotes, research, opportunities, connections, introductions, notifications, preferences, profiles and account lifecycle. There is no custom API/server-action layer; authorization therefore belongs in Postgres and is tested there.

### Admin and research review

`Privileged route → client RoleGuard for UX → Supabase mutation → database role helper/RLS/grants → database result → refreshed queue`

The client guard is not treated as the security boundary. Database policies are. This sprint also made every single-row update/delete hook require a returned owner-scoped row before reporting success.

### Account export and deletion

`Member settings → security-definer RPC bound to auth.uid() → export/request/cancel → RLS-protected request table → admin review RPC/update → member-visible state`

The disposable database suite proves owner isolation, admin review, cancellation restrictions, and 23 account-lifecycle assertions. Production policy, response ownership and retention operations remain open.

## Broken, incomplete, and misleading surfaces

| Classification | Finding | Evidence/location | User consequence |
| --- | --- | --- | --- |
| BROKEN | Public landing deployment is stale | Live HTML describes the older “FinanceMeta — Understand finance” build while root `index.html` describes “Finance for All — Financial confidence is built.” Live CSP also differs. | Visitors do not receive the audited product; root and portal tell different stories. |
| BROKEN | Portal release command refuses the current tree | `Finance4allLanding/scripts/release-revision.mjs` correctly rejected many modified/untracked paths after the bundle compiled. | Current refresh cannot produce a provenance-bound release until reviewed and committed. |
| MISSING | Privacy notice, participation terms and minor-consent workflow | No `/privacy` or `/terms` routes; `src/lib/onboarding.ts` offers `Under 13`. | Users cannot review data practices; child-data handling lacks an implemented approval boundary. |
| UNVERIFIED | Live migration ledger and RLS | Local replay passed; no authorized production ledger read or production database test ran. | Source policies may differ from production reality. |
| UNVERIFIED | Email, Google, recovery, onboarding persistence and two-account isolation | Controlled identities/secrets unavailable. | Core activation and account recovery can still fail in production. |
| PARTIALLY IMPLEMENTED | Editorial catalog | `docs/PRODUCT_REFRESH_2026-09-20.md` records 4/20 complete guides. | Return value is narrower than the planned library. |
| PLACEHOLDER | Podcast and direct messages | `src/pages/Index.tsx`, network pages. | Users can see future intent but cannot use these features. |
| PARTIALLY IMPLEMENTED | Programs/opportunities | Existing records and forms depend on live curated data; demo rows are hidden in hooks. | Empty or stale production data can make a technically present section practically weak. |
| SCAFFOLDED | Storybook | Build passes but only a small set of UI stories exists. | Design regressions across the bespoke refresh remain browser-test dependent. |
| MISSING | Product analytics/error reporting | Portal contains no event or error-reporting integration. | Activation loss, failed mutations and client crashes are hard to quantify. |
| UNVERIFIED | Core Web Vitals | No trace/Lighthouse tooling was available in this run. | Bundle output is known; real LCP/INP/CLS are not. |

## Security findings

### P0 — child-data and privacy launch boundary

The product explicitly permits `Under 13`, then collects email, school/learning community, age band and profile data. There is no privacy notice, participation terms acceptance, parental/guardian verification, or consent record. The US FTC states that COPPA applies to covered services collecting personal information from children under 13, and India’s DPDP Act/Rules include verifiable-parental-consent requirements for children. Applicability and final text require qualified counsel and safeguarding ownership; the engineering action is to fail closed until that decision is implemented.

### P0 — production authorization remains uncertified

The migration replay and RLS tests pass locally, but the production ledger and live two-member behavior were not read. Do not infer live authorization from source equality or the HTTP health check.

### Resolved P1 — silent zero-row mutations

PostgreSQL RLS can yield zero affected rows without a transport error. The audit found this in notification reads, connection responses, bookmark/upvote/registration/interest removals, application review and admin news deletion. These paths now request an owner-scoped returned key and use `requireConfirmedRow`; zero-row results fail instead of presenting success. The intentionally idempotent “mark all notifications read” operation may affect zero rows when no unread item remains.

### P1 — missing application-level rate controls

Supabase Auth provides provider controls, and anonymous contact SQL validates payloads, but ordinary member writes and public intake have no documented application rate budget. Database RLS restricts identity, not request volume. Define per-action limits for connection requests, submissions, registrations, search and public intake.

### P1 — database length constraints are incomplete

Some forms have client limits and later migrations validate sensitive functions, but initial content tables contain many unbounded text columns. A modified client can bypass HTML limits. Add DB constraints in a reviewed migration after inventorying current production values.

### Verified controls

- Browser code uses only a Supabase publishable key; service-role secrets are absent.
- Canonical project and redirect validators fail closed.
- Markdown renders React text and normalized `http/https` links; no raw HTML renderer or `dangerouslySetInnerHTML` path was found.
- Return URLs and notification links are same-origin/sanitized.
- CSP pins the member app to the canonical Supabase project and blocks framing/objects.
- Client role checks are backed by database policies, grants and trusted role administration.
- Production dependency audits reported zero known vulnerabilities at configured thresholds on 2026-09-20.

## Reliability findings

- Auth and profile operations use deadlines and isolate account changes by clearing query state and ignoring stale profile responses.
- Signup/onboarding is a two-resource write and is not transactional.
- Auth profile-fetch failure currently yields a null profile after loading. The member may reach ordinary portal routes with degraded state; add an explicit profile-load error/retry state.
- Saved guide metadata is last-write-wins and can lose concurrent tab edits; this is disclosed but should move to an owner-scoped table if it becomes important.
- Demo/stale rows are suppressed by hardcoded values in hooks. Replace these filters with an explicit database publication/archive flag and remove the rows through an auditable data migration.
- Some fetch/mutation error paths expose generic user messages while logging provider text locally. There is no centralized correlation ID or error collector.
- The first final Playwright run executed all 12 assertions but hung while terminating Vite. A bounded graceful-shutdown configuration fixed the harness; the confirmation run exited 0 with 12/12 in 50.0 seconds and released the port.

## UX and conversion findings

### Strengths

- The refreshed homepage has a specific educational mission, visible evidence boundaries, program status language, a usable map and direct learning entry.
- Public lessons provide value before signup.
- Auth pages fail closed when the provider is unavailable and explain disabled signup.
- Empty/error/loading states exist across core portal sections.
- Keyboard navigation, reduced motion, responsive navigation, focus styles and browser Axe checks are present.
- The sprint fixed nine contrast issues and two nested landmark violations found by Axe.

### Friction and trust gaps

- Two landing experiences duplicate positioning and deployment ownership. A user can encounter materially different brands depending on origin.
- Public CTAs into protected routes do not consistently explain that sign-in is the next step.
- The portal asks for school and age before presenting a privacy/participation agreement.
- Broad reach metrics were founder/organization supplied. The sprint added visible “organisation-reported; not independently audited” qualifiers on homepage and auth surfaces.
- Four completed articles cannot support a promise of a deep or daily editorial product.
- Several program and research cards are visually polished while operational dates, owners or artifacts remain unavailable. Current “coming soon” and research-boundary labels must remain.
- There is no guided “first useful artifact” after onboarding. A new member lands on a broad dashboard rather than a short lesson, saved guide or concrete application step.

## Performance findings

The root production build is 285.09 kB JavaScript / 91.95 kB gzip and 23.72 kB CSS / 6.24 kB gzip. The portal development-mode optimized build emits route chunks, but its entry graph includes 268.41 kB / 91.66 kB gzip application code, 180.23 kB / 59.52 kB React vendor, 203.21 kB / 51.93 kB Supabase vendor, 77.41 kB / 24.31 kB UI vendor, and 137.60 kB / 25.30 kB CSS. These are build artifacts, not transfer or Core Web Vitals measurements.

The portal loads Supabase/Auth on public editorial routes because `AuthProvider` wraps the full router. Splitting anonymous public routes from the authenticated provider can reduce public JavaScript and avoid an unnecessary session request. The canvas/map/animation code includes reduced-motion and visibility controls, but needs a real trace on mobile hardware. Storybook’s large documentation bundles are not shipped with the application.

## Prioritized issue register

| ID | Priority | Problem | Recommended fix | Validation |
| --- | --- | --- | --- | --- |
| FM-001 | P0 | Current refresh is not a clean, immutable release | Review preserved changes, commit them, run `release:check` from exact SHA, deploy that SHA | Clean tree; release revision equals deployed SHA |
| FM-002 | P0 | Root deployment is stale | Deploy root current source or retire it in favor of one canonical public surface | Live title/CSP/assets match source; add immutable revision |
| FM-003 | P0 | Child/privacy/terms boundary absent | Obtain legal/safeguarding decisions; add notice, terms, age policy, consent record and fail-closed enforcement | Approved copy; tested acceptance/withdrawal; underage path cannot bypass |
| FM-004 | P0 | Live schema/RLS state unknown | Read production ledger and run rollback-only production RLS jobs with authorized credentials | Exact ledger equivalence and PASS receipts at deployed SHA |
| FM-005 | P0 | Critical auth journeys unverified | Provision controlled accounts and run email, Google, recovery, onboarding, logout/login and isolation E2E | Credentialed suite passes on exact deployment |
| FM-006 | P1 | Zero-row mutations could look successful | Require returned owner-scoped row/RPC result for single-row update/delete actions | DONE locally: helper tests cover confirmed row, zero-row and provider error; full suite 122/122 |
| FM-007 | P1 | Portal has no operational monitoring | Add privacy-safe error reporting, health ownership, alert policy and release tags | Synthetic failure produces redacted event and alert |
| FM-008 | P1 | Profile initialization has no explicit degraded state | Model profile error/retry separately from unauthenticated state | Offline/500 tests show retry UI and no privileged content |
| FM-009 | P1 | Member/public writes lack rate budgets | Specify and implement provider/edge/database limits by action | Burst tests receive bounded errors without cross-user impact |
| FM-010 | P1 | Client limits are not uniformly enforced in DB | Add CHECK constraints and migration preflight for text/arrays/URLs | Direct oversized writes fail; existing rows preflight clean |
| FM-011 | P1 | Browser harness hung during teardown | Add bounded graceful shutdown for the isolated Vite server | DONE: full 12-test command exited 0 in 50.0 seconds |
| FM-012 | P2 | Two public products duplicate brand/content | Choose canonical information architecture and redirect/deprecate the other | One source of truth; all canonical/OG/CTA URLs agree |
| FM-013 | P2 | Public routes pay auth/Supabase startup cost | Mount AuthProvider only for auth/protected branches or lazy initialize | Trace shows lower public JS and no session request on lesson route |
| FM-014 | P2 | No first-value onboarding handoff | Offer a 5-minute lesson/save/application choice after profile setup | Median signup-to-first-artifact measured and target met |
| FM-015 | P2 | Demo filtering is hardcoded in hooks | Add publication/archive fields and clean database rows | No title/ID filters in client; seed and production inventories reconcile |
| FM-016 | P2 | SEO is static and incomplete | Keep new sitemaps current, add route metadata/OG images, canonical policy and structured data | Crawl test validates only public indexable routes |
| FM-017 | P2 | Portal analytics absent | Define minimal privacy-safe activation funnel with retention limits | Events reconcile with journey tests and notice |
| FM-018 | P2 | Article catalog incomplete | Complete editorial review workflow and remaining source-linked content | 20 reviewed guides with owner, sources and review date |

## High-leverage product additions

1. A first-session chooser that ends in a saved lesson, submitted interest, or research brief.
2. A resumable “continue learning/continue application” card on the dashboard.
3. A structured evidence passport for every program: owner, state, source, last review and outcome boundary.
4. Public, source-backed opportunity pages with deadlines, expiry and moderation history.
5. A member portfolio artifact that compiles saved learning, submissions and verified contributions.
6. A school/chapter launch checklist with safeguarding, consent and evidence gates.
7. Public correction and content-review history for debriefs.
8. A reviewed research brief template that separates hypothesis, data, protocol, result and limitation.
9. Shareable lesson completion cards that contain no private profile data.
10. Collaboration requests tied to a concrete project or brief instead of generic networking.
11. Saved-search alerts only after privacy/communications consent and notification controls exist.
12. A program calendar sourced from confirmed database records, never inferred marketing dates.
13. A transparent “why this opportunity” explanation based on user-selected interests, without opaque ranking.
14. A member data dashboard showing public/private fields, exports, retention state and deletion status.
15. Operational dashboards for failed auth, profile-save, application and registration funnels with release tags.
16. Route-level SEO metadata and social cards for each public guide and evidence record.

These additions should follow the P0/P1 work. They increase activation, useful artifacts, trust and defensibility without relying on invented content or engagement loops.

## Release decision

**NO-GO.** Local code quality and authorization replay are strong, and the clean deployed portal HEAD is healthy. The audited product refresh is not the deployed immutable source, the root landing is stale, production database/auth journeys are unverified, and the privacy/minor boundary is absent. Resolve FM-001 through FM-005 before broad public onboarding.

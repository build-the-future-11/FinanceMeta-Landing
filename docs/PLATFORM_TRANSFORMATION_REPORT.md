# FinanceMeta / Finance4All transformation

21 September 2026. **Implemented and verified locally; not deployed or certified for public onboarding.** The existing public rebuild was extended rather than replaced. Auth, member projects, applications, events, saved content, learning and admin functionality remain in place.

## 1. Original problems

- Public participation depended on external forms and an unsent email draft; no native cross-program intake or private review workflow existed.
- The portal's `tsc --noEmit` checked an empty solution wrapper. Its passing result concealed incompatible Supabase table contracts and real application/test type errors.
- The public site lacked generated detail pages for future event, podcast, person and chapter records, and lacked structured curricula and citation/calendar exports.
- Unknown URLs caused a React hydration mismatch between the prerendered 404 breadcrumb and the browser's requested path.
- The portal homepage asserted 100,000+ students, 1M+ impressions, partner relationships and prestigious affiliations without attached substantiation. The public partner page repeated historical names as evidence.
- Cohorts and competitions had descriptions but insufficient curriculum, deliverable and review structure. Publication/project discovery lacked author/researcher/year dimensions.
- Production portal build configuration is absent from this checkout. The release guard correctly refuses that configuration and dirty source.

## 2. Changes and architecture

Kept React/Vite/TypeScript, the public prerenderer, existing styles, Vercel deployment contracts, React Router, Supabase, TanStack Query and Radix. No runtime dependencies were added.

The public root now generates **102 routes plus 404**. Typed content drives project protocols, cohorts, publications, events, episodes, people and chapters. Records generate routes and metadata at build time. Content validation rejects broken relationships, unsafe URLs, unsupported publication/preregistration states and invalid event dates/timezones. Full article bodies remain outside ordinary route bundles.

The portal adds `intake_calls` and `intake_submissions`, `/portal/apply` and `/portal/intake-review`. Native public handoff is separately controlled by `VITE_NATIVE_INTAKE_ENABLED` and a verified member origin. The default external-form path remains usable until the native deployment is certified.

## 3. Working features

- Eight database-backed interest calls covering quantitative, financial ML, economic, investment and research engineering work, research submission, chapters and partnerships.
- Validated private applications with consent version, durable receipt, safe retry identity, duplicate-click suppression, record downloads, status history timestamps, applicant-visible review notes and withdrawal.
- Paginated applicant records and administrator queue; status filters, refresh and call availability controls.
- Five research/engineering participation tracks; staged curricula and deliverables across the six existing cohort proposals.
- Project hypothesis, baseline, evaluation, reproducibility and reference fields. Missing protocols display an explicitly **draft** planning framework, never preregistration.
- Author/year/researcher/format discovery, podcast archive/guest/topic views, people in global search, and future-ready detail templates.
- BibTeX downloads, valid-instant calendar exports, Article metadata and conditional Event structured data.
- Chapter governance and proposal guidance; competition draft rules, rubric, deliverables, eligibility requirements, timelines, result/appeal expectations and simulation boundaries.

## 4. Research infrastructure and claim discipline

Preserved all 18 project records, seven research agendas, six proposed cohorts and four full educational explainers. Preserved the FI-JEPA evidence package and registry. No project was promoted to active, preregistered, published or independently validated on the basis of code availability.

No events, episodes, people, operating chapters or research papers were invented to populate directories. Historical partner names and affiliation assertions were removed from public presentation where supporting evidence was absent. Audience/impact totals were removed. The organizer-supplied location map remains explicitly separate from verified chapters and membership counts.

## 5. UX and design

Extended the existing restrained research design, shared navigation, reading layouts, light/dark themes and responsive components. New application, track, privacy and governance pages use the same visual system. Direct-link state, filter reloads, keyboard menus, mobile menus, drafts, reading progress and recovery routes work in Chrome. The 404 hydration defect is fixed and regression-tested.

## 6. Security

Database RLS restricts submissions to their applicant and trusted admins. Column grants prevent ownership, timestamp, status and review-note spoofing on insert. A trigger in the private schema enforces deadlines, call availability, immutable answers, withdrawal state and a serialized five-submission daily cap. Unique applicant/call keys prevent duplicates. Admin UI guards are supplemented by database rules.

Exports include only the caller's intake records; account deletion cascades to them. Private answers are not written to URLs, analytics or browser persistence. Failed writes never show successful submission. Missing migrations produce a clear fallback. Member handoffs reject credential-bearing origins and cross-origin/protocol-relative paths. Strict CSP was preserved during browser testing; axe loaded from the local QA origin.

Both production dependency audits returned **zero known vulnerabilities**. This is an advisory-registry result, not proof that all security defects are absent.

## 7. Performance

Kept prerendered content, route-aware article loading, hashed assets and the shared-script budget below 100 kB compressed (approximately **92.5 kB** in the retained measurement). Native intake screens are lazy portal routes. No new media, font or runtime library dependency was added. No Lighthouse score or live Core Web Vitals result is claimed.

## 8. Verification

| Check | Result |
| --- | --- |
| Root release gate: source, accessibility/funnel contracts, lint, real typecheck, production build, route/output checks | PASS |
| Root Node regression tests | 29 passed |
| Portal real application and Vite-config typechecks | PASS |
| Portal ESLint | PASS |
| Portal Vitest | 130 passed across 33 files |
| Portal Node release/security tests | 27 passed |
| Portal toolchain tests | 12 passed |
| Portal production build | PASS in clean isolated snapshot |
| Public Chrome route inspection | 102 routes plus actual HTTP 404; no runtime/console errors |
| Public interaction checks | Search, filtering, query reload, empty states, draft, intake handoff, reading progress, keyboard and mobile navigation passed |
| Public axe scans | 30 desktop/mobile light/dark scans; zero violations in selected WCAG A/AA rules |
| Existing portal Chrome tests | 12 passed, including six public-route accessibility checks |
| Database migration replay | PASS in disposable local Supabase PostgreSQL 17.6 |
| Existing two-identity and account-lifecycle SQL suites | PASS |
| New intake SQL suite | PASS: ownership, cross-account read/write/export isolation, admin review, immutable answers, quota, deadlines, closure, consent, duplicate rejection, anonymous denial and deletion cascade |
| FI-JEPA unit suite | 4 passed |
| Research registry | PASS: seven program records and one project record |
| Production dependency audits | Zero known vulnerabilities in both applications |

The native form component suite additionally verifies whitespace rejection, absent-backend fallback, failed-write answer retention, receipt timing, concurrent-submit suppression and retry identity. It uses test doubles; real database authorization is tested separately in PostgreSQL. No real application was sent and no live authenticated journey is claimed.

The portal production build used a clean isolated source snapshot (`cfd02bcae5bb8a80729122f6cba6c5788ecaf93c`) and an explicitly nonfunctional CI publishable-key value with the repository's canonical origin. This verifies compilation and release provenance controls. It is not a usable production credential or a deployed revision. The actual working checkout remains uncommitted for review.

## 9. Remaining launch requirements

Production database migrations, deployed Auth/RLS behavior, live two-account application/reviewer journeys and deployed revision checks remain unverified. No remote schema was changed. Native public intake stays disabled by default.

Operators must confirm legal identity, privacy/retention responsibilities, minor-participant safeguarding and guardian requirements, program staffing and actual calendars. Verified author/guest/partner permissions and real research outputs are required before publishing those records. Empty directories are intentionally truthful.

## 10. Exact files and evidence

See [the exact source-file inventory](PLATFORM_CHANGED_FILES.md) and `evidence/platform-transformation-2026-09-21/changed-files.json`. Baseline source, build/test output, dependency audits, database receipts, source scan, route/browser report, screenshots and asset measurements are retained under that evidence directory. Root source is not a Git checkout; the nested member repository began clean and its diff was checked without reverting prior work.

Operational instructions: [content publishing](CONTENT_OPERATIONS.md) and [native intake deployment](../Finance4allLanding/docs/PLATFORM_INTAKE.md).

## 11. Next ten actions

1. Review and commit the member application changes; archive/version the root source in its intended repository.
2. Confirm canonical public/member deployment origins and assign release ownership.
3. Back up the canonical Supabase project and apply the reviewed pending migration through the normal release process.
4. Verify the production migration ledger and run scoped authorization certification.
5. Verify Auth email delivery, redirects, signup abuse controls and trusted administrator assignment.
6. Run two real member journeys and an administrator review on the exact deployed portal revision, including export and withdrawal.
7. Approve privacy, retention, deletion handling, age/guardian and safeguarding operations before broad onboarding.
8. Confirm cohort leads, supervision capacity, datasets, dates and selection expectations before opening a scheduled call.
9. Publish only attributable researchers, substantiated partnerships and licensed/reviewed outputs through the validated catalog.
10. Deploy the public build, verify HTTPS/headers/routes and deployed identity, then enable the native handoff and monitor actual service health.

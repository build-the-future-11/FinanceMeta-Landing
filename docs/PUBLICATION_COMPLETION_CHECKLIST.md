# FinanceMeta publication completion checklist

Prepared: 2026-09-24. Scope: public website, authenticated member platform, their production operations, and every claim or offering exposed at launch.

Current verdict: NOT READY for unrestricted public onboarding. September 21 receipts demonstrate substantial local implementation; they do not certify the current production release. This checklist is a closure plan, not a new test run or live audit.

## Completion rules

- Every unchecked item requires fresh evidence or an explicit, justified not-applicable decision. Historical failures require reinspection, not automatic assumption that they persist.
- Each gate needs an owner, status (OPEN / PASS / BLOCKED / NOT APPLICABLE), exact source revision or artifact hash, environment, timestamp, evidence location, and remaining action. Record these in a release evidence manifest.
- Complete sections 1–12 before unrestricted launch. Section 13 is conditional: each capability must either satisfy its gate or be explicitly excluded from the launch, with no active promise, collection form, or misleading CTA.
- No critical or high-impact security, privacy, access-control, data-loss, or core-journey defect may remain. Other findings must be fixed or removed from launch scope; do not call an accepted unresolved defect “nothing remaining.”
- A public information-only release and an open member platform are different release decisions. A disabled signup must not be described as a working open platform.
- This document supersedes older checklists for planning, while preserving their historical receipts. Source references: `docs/INSTITUTION_PLATFORM_2026-09-21.md`, `docs/LAUNCH_READINESS.md`, and `evidence/institution-platform-2026-09-21/verification.json`.

## 1. Freeze scope and reconcile sources

- [ ] Identify the canonical public-site source, member repository, research registry, hosting projects, production origins, and backend project; verify ownership and current remote state.
- [ ] Preserve all dirty/untracked work and existing evidence before reconciliation. Resolve duplicate or legacy checkouts without discarding unique changes.
- [ ] Review the portal intake/workspace changes and migration; commit the complete intended source, including untracked files.
- [ ] Place the public root under an intentional versioned release process: a reviewed repository or reproducible immutable source archive with hashes and remote backup.
- [ ] Record exact public/member release identities and compatible version pair. Preserve clean-source build enforcement.
- [ ] Define the launch route/feature inventory, supported browsers, supported ages/geographies, roles, and enabled application paths.
- [ ] Update `PROJECT_STATUS.md`, `NEXT.md`, `PROJECT_FINISH_CHECKLIST.md`, deployment documentation, and truth maps to agree with the final release. Remove stale operational instructions, not historical evidence.

## 2. Reproducible build and hosted CI

- [ ] Build from clean source with the repository-supported runtime and lockfiles; verify clean install succeeds for both applications.
- [ ] Pass public `release:check` and portal `release:check` at the selected source identities.
- [ ] Pass relevant unit, integration, release/security, browser, migration replay, and account-lifecycle suites. Investigate skips and failures rather than silently excluding them.
- [ ] Verify the real production environment contract; test-only snapshot values are insufficient.
- [ ] Run fresh dependency and secret scans; resolve exploitable findings and confirm privileged credentials are absent from source, archives, browser bundles, and logs.
- [ ] Ensure hosted required CI checks pass on the actual release revision, including workflow/runtime integrity checks.
- [ ] Retain build logs, test reports, dependency results, source manifests, and deployable artifacts linked to the exact revision.

## 3. Hosting, domains, and deployment identity

- [ ] Confirm the canonical public and member HTTPS origins and ownership. Decide how legacy/duplicate origins redirect or remain intentionally available.
- [ ] Verify hosting build root, install/build commands, output directory, runtime, and environment scopes for each separate application.
- [ ] Configure and validate public site URL, member handoff, Auth redirect origin, and public backend values. Reject foreign project/origin identifiers in source configuration and emitted bundles.
- [ ] Deploy the exact reviewed artifacts and retain deployment IDs, source identities, production URLs, and previous known-good versions.
- [ ] Verify TLS, deep links, refresh, real 404 responses, intended redirects, static assets, downloads, and cache invalidation on the live origins.
- [ ] Verify CSP, HSTS, frame restrictions, MIME/referrer/permissions headers and required provider connections without breaking application flows.
- [ ] Prove live content matches the selected release using revision receipts or artifact hashes; a successful deployment command alone is insufficient.

## 4. Backend migrations and data integrity

- [ ] Read the canonical backend's current migration ledger, schema, grants, policies, functions, and provider health before changing anything.
- [ ] Compare live state with all current checked-in migrations, including native intake. Do not rely on historical migration counts or assumed missing versions.
- [ ] Review migration impact and compatibility, capture backups/before-state evidence, and apply only genuinely missing reviewed changes using the supported workflow.
- [ ] Certify the resulting ledger/schema against the selected portal revision; never mark unapplied migrations as applied to clear a gate.
- [ ] Execute hosted authorization certification for anonymous, member A, member B, reviewer, and administrator roles with a controlled cleanup or rollback plan.
- [ ] Prove cross-account denial, private field protection, immutable submitted answers, reviewer boundaries, role-escalation denial, and legitimate authorized operations.
- [ ] Verify database-enforced validation, field lengths, consent versions, eligibility/deadlines, duplicate handling, and race-safe mutation behavior across enabled writes.
- [ ] Replace brittle title-based demo filtering with an explicit publication policy; verify unpublished/demo/private records cannot appear publicly.
- [ ] Define stable IDs and publication mapping between public programs/projects and member records. Verify each enabled application points to the correct record.

## 5. Authentication and complete user journeys

- [ ] Verify current signup/provider settings, correct Site URL, and exact callback/recovery allowlists on the canonical backend.
- [ ] Verify real email confirmation, recovery delivery, expiry, invalid/reused links, and Google OAuth success/cancellation/error paths.
- [ ] Exercise signup → confirmation → onboarding → dashboard using a new controlled ordinary account.
- [ ] Exercise login, persisted session, refresh, logout, protected routes, session expiry, safe return destinations, and recovery from incomplete profile creation.
- [ ] Complete real member journeys for enabled applications/intake: validation → submission → receipt → reviewer visibility → decision → member result → withdrawal/export where supported.
- [ ] Verify account/profile edits, saved items, project participation, events, and connections wherever enabled; confirm persistence after reload and across sessions.
- [ ] Verify permission denial through direct API requests as well as hidden UI controls, including closed/expired offerings.
- [ ] Verify account export and deletion end to end, including dependent records, access revocation, and documented retention exceptions.
- [ ] Remove controlled QA records/accounts after verification and retain privacy-safe receipts.

## 6. Abuse prevention and failure handling

- [ ] Define and enforce per-action server-side rate limits for enabled anonymous and member writes, including inquiry/intake/application/contact paths.
- [ ] Verify spam controls, duplicate protection, resubmission behavior, and honest success/failure responses; zero affected rows must not display false success.
- [ ] Verify safe external links, user-generated text handling, redirect validation, and applicable storage permissions.
- [ ] Verify explicit loading, empty, denied, timeout, offline/error, and retry states on all critical routes, including degraded profile initialization.
- [ ] Verify failed requests and retries cannot duplicate submissions, lose entered data unnecessarily, or silently drop user actions.
- [ ] Inventory operational secrets, restrict privileged access, and document credential rotation/revocation responsibilities.

## 7. Privacy, participation, and operational ownership

- [ ] Obtain an approved policy decision for intended audiences, ages, jurisdictions, personal-data collection, and any guardian-consent requirements; record the responsible decision-maker.
- [ ] Publish accurate privacy, participation/terms, contact, and safeguarding information matching actual behavior and providers.
- [ ] Enforce the approved age/consent policy in backend and frontend; block unsupported enrollment paths. A selectable age band alone is insufficient.
- [ ] Store necessary consent/version records and verify withdrawal behavior where applicable.
- [ ] Define retention/deletion periods, data access, export/deletion handling, backup treatment, and a named owner for requests.
- [ ] Verify analytics/logging avoid form contents, secrets, and unnecessary personal identifiers; implement applicable consent choices.
- [ ] Verify support and review channels actually reach named operators, with response expectations and escalation procedures.
- [ ] Confirm rights/permission for published names, affiliations, logos, imagery, recordings, datasets, and other third-party material.

## 8. Content and every public promise

- [ ] Review every launch route, navigation item, CTA, form, downloadable asset, and external destination against a complete inventory.
- [ ] Verify research maturity, results, program status, participant counts, affiliations, partners, and outcomes against attributable evidence; remove unsupported claims.
- [ ] Mark proposals, synthetic experiments, unavailable collections, and expressions of interest accurately. Do not imply admission, active cohorts, market alpha, or independent validation.
- [ ] For any open program, publish its owner, audience, prerequisites, dates/timezone, capacity, selection policy, deliverables, reviewer/staffing plan, and contact.
- [ ] Ensure all advertised learning resources and downloads exist, are usable, correctly attributed, and consistent with their descriptions.
- [ ] Test every form through its actual production destination, including external intake if retained; verify delivery, reviewer access, receipts, and handling policy.
- [ ] Remove placeholder/demo/dead content and resolve contradictions between public pages, portal content, registries, and policies.

## 9. Accessibility, responsive behavior, and compatibility

- [ ] Run current browser coverage across the full public route inventory and critical authenticated role journeys at the release revision.
- [ ] Verify layouts at 320, 375, 768, 1024, and 1440 px, including long content, forms, tables, menus, dialogs, and all supported themes.
- [ ] Verify keyboard-only navigation, focus order/restoration, visible focus, labels, validation announcements, dialogs, and hidden-navigation behavior.
- [ ] Run automated accessibility checks and manual screen-reader checks of core journeys; resolve findings rather than equating zero automated violations with full conformance.
- [ ] Verify zoom/text resizing, reduced motion, contrast, touch target usability, and no clipped content or unintended horizontal scrolling.
- [ ] Run supported Chromium, Firefox, and WebKit/Safari journeys; inspect at least one real mobile browser for critical interactions.
- [ ] Confirm no uncaught runtime errors, failed essential requests, hydration problems, or broken back/forward/reload behavior.

## 10. Performance, discovery, and analytics

- [ ] Define measurable launch performance budgets and test representative public and authenticated routes on constrained mobile/network conditions.
- [ ] Resolve budget failures involving loading, interaction, layout shift, oversized assets, or avoidable backend calls. Record lab evidence; collect field evidence after launch rather than inventing it.
- [ ] Verify unique page titles/descriptions, canonical URLs, sitemap, robots rules, social images/previews, structured data, redirects, and intended indexing boundaries.
- [ ] Prevent private/authenticated routes and sensitive information from appearing in public indexing or cached output.
- [ ] Verify privacy-bounded production funnel events actually persist with correct attribution, deduplication, and payload bounds if analytics is enabled.
- [ ] Ensure missing analytics configuration cannot break core user journeys; publish no conversion or usage claims without supporting data.

## 11. Monitoring, backup, and rollback

- [ ] Configure release-tagged error reporting and health checks for both surfaces and critical backend dependencies without exposing personal data.
- [ ] Assign alert recipients and incident ownership; trigger a controlled test to prove notification delivery and triage.
- [ ] Verify provider backups and retention; perform a restore drill into an isolated environment and record recovery results.
- [ ] Document and test public-site and portal rollback independently, including their compatible backend schema and environment versions.
- [ ] Preserve known-good deployment artifacts and a safe migration recovery/forward-fix procedure; avoid destructive schema rollback assumptions.
- [ ] Document operational access, support/review coverage, outage handling, dependency maintenance, and handover so one missing operator does not strand the service.

## 12. Final publication decision

- [ ] Build a final evidence manifest mapping every applicable checklist item to a passing receipt and responsible owner.
- [ ] Confirm no open launch defects, contradictory docs, untracked required source, missing migration, inaccessible form destination, or unsupported promise remains.
- [ ] Re-run live smoke and controlled role journeys after the final deployment/configuration change, tied to the exact deployed identities.
- [ ] Record the release scope, exclusions, date, deployment pair, backend certification, operating owners, and GO decision.
- [ ] Enable native intake/new enrollment only after the relevant production, privacy, and operational gates pass; verify the enabled path immediately.
- [ ] Complete an initial monitored observation window defined before launch; resolve any release failures and retain the final health record.

## 13. Conditional expansion and research-publication gates

These are not automatically required to publish an honest scoped platform. Each item must be completed if advertised as operational; otherwise explicitly exclude it from this release.

- [ ] Research result publication: release a falsifiable question, authorized/versioned data, frozen protocol, leakage controls, fair baselines, uncertainty/limitations, raw results, pinned code/environment, reproduction instructions, and claim-level review. FI-JEPA's synthetic baseline does not satisfy real-market or neural-JEPA claims.
- [ ] Active cohorts: confirm staffing, schedule, capacity, selection, safeguarding, feedback, and final-output workflow before accepting cohort applications.
- [ ] Events: confirm host, date/timezone, capacity, registration/cancellation policy, communications, and functioning calendar details.
- [ ] Podcast: obtain permissions and release the actual recording, transcript, references, and working player/download.
- [ ] Live markets: secure a suitable provider and usage rights; implement timestamps, revisions, caching, stale/error states, and source attribution before displaying live values.
- [ ] Researcher/partner profiles: verify identity, attribution, contributions, links, and publication/affiliation permissions before making public claims.
- [ ] Collaboration/tasks: implement membership, ownership, permissions, persistence, and workflow verification before advertising shared project/task management.
- [ ] Newsletter: implement consent, confirmed delivery, unsubscribe, suppression, and operational ownership before collecting subscription emails.

## Recommended execution order

1. Freeze source and launch scope; reconcile documentation and release identity.
2. Resolve code, policy, content, security, and data-contract gaps.
3. Pass clean-source CI and local database/browser gates.
4. Certify hosting, backend, providers, and controlled production journeys.
5. Complete accessibility/performance/operations evidence and final deployment smoke.
6. Issue the evidence-backed GO decision and open only the certified workflows.

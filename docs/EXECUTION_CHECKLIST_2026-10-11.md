# Finance4All execution checklist — 11 October 2026

Scope: `FinanceMeta-Landing`, `finance4all-global-reach`, `Iy-ERN`, and the public governance records in `FinanceMeta-Global`.

**Decision: unrestricted member onboarding remains NO-GO.** The public information sites and a source-verified member candidate are separate deliverables. The owner explicitly requested keeping live FinanceMeta database and controlled-account checks blocked for now. No production data or account was mutated.

This checklist reconciles all **93 publication gates** from the existing publication checklist. The separate **160-item feature backlog** is retained in [FEATURE_MEGACHECKLIST_2026-09-24.md](FEATURE_MEGACHECKLIST_2026-09-24.md); those ideas are not automatically required to publish the current scope and are not marked complete without evidence. The local machine-readable manifest indexes all 253 items with their original file and line.

## Work executed in this pass

- [x] Inventory all four repositories, canonical remotes, production origins, starting cleanliness and remote changes.
- [x] Preserve local dashboard/project navigation while integrating GitHub's newer event-account safeguards.
- [x] Reconcile IYERN's published history with its local interface and complete project links.
- [x] Fix signup while provider settings are unknown; add retry and duplicate/competing-submission guards.
- [x] Add privacy, participation and support links to account screens using the existing public information.
- [x] Add immutable IYERN release receipts, clean-source enforcement, live verification and pinned hosted CI.
- [x] Run 69 registry tests, the canonical registry validator, the 48-project validator and 12 IYERN tests.
- [x] Run candidate-history secret scans for all three web repositories with redacted reports: no leaks found in the scanned ranges.
- [x] Verify the deployed public landing and portal's exact existing revisions, route shells and security headers.
- [x] Publish reviewable candidate branches through the connected GitHub app with exact tree equality to local source.
- [ ] Finish final-head hosted CI and preserve its results.
- [ ] Promote only reviewed and certified release candidates; leave live member acceptance blocked as requested.

## Release and evidence record

| Surface | Observed evidence | Boundary |
| --- | --- | --- |
| Public landing | Live `48deeab4af0945bfcfbc1f35da38c075417b0d24`; [Release Check](https://github.com/build-the-future-11/FinanceMeta-Landing/actions/runs/38135654257) and [Production Health](https://github.com/build-the-future-11/FinanceMeta-Landing/actions/runs/38135654224) succeeded; independent read-only verifier passed | This existing source tree is preserved; documentation reconciliation is a new candidate |
| Member portal | Live `44dca095573d520d7ab1bc39242c0bb623c43dae`; read-only exact-match health passed; [candidate PR #162](https://github.com/build-the-future-11/finance4all-global-reach/pull/162) preserves #161's event safeguards and adds current interface/signup fixes | Candidate CI and production authenticated/database acceptance are separate |
| IYERN | [Candidate PR #4](https://github.com/build-the-future-11/Iy-ERN/pull/4); 12 source tests pass | Old live origin has no release receipt; the candidate adds one |
| Research registry | `fd21aef2e06d3da0c5990d35b04fffa5ee57cf72`; 69 tests pass; governance validates 48 project records | Registry integrity is not experimental success or independent reproduction |

Detailed local receipts are in the workspace's `evidence/launch-closure-20261011/` directory: exact commands, source identities, start times, exit codes and output hashes. Large local builds were deferred during sustained low memory/pageout growth; hosted CI performs the clean-install, build, browser and disposable-database gates.

## Remaining work by responsible party

1. **Engineering / release reviewer:** complete final candidate CI, inspect review diffs, promote exact revisions, verify deployment identities and preserve rollback targets. Do not merge the stacked portal chain merely because isolated tests pass.
2. **Canonical database operator:** when resumed, capture schema/ledger, compare all 15 current migrations, review backups and compatibility, then run rollback-only authorization and controlled-account acceptance. The connected VertexED database is unrelated.
3. **Product / policy operator:** establish audience/age/consent decisions, retention and deletion handling, support/review staffing and publication permissions. Implement the approved backend enforcement before opening broad enrollment.
4. **Engineering / operations:** finish server-side abuse budgets and explicit publication state, scoped monitoring with actual alert ownership, restoration and rollback drills.
5. **QA / accessibility:** complete viewport, Firefox/WebKit/real-device, screen-reader and constrained-performance measurements; retain their actual results.
6. **Program owners:** supply real staffing, artifacts, permissions and delivery evidence for any conditional program, event, podcast, newsletter or research-publication promise.

## Full publication gate checklist

Status labels: PASS = the whole stated gate has evidence; PARTIAL = bounded evidence only; PENDING_CI = execution underway; BLOCKED = required external evidence/access/decision is absent or explicitly deferred; OPEN = implementation or verification remains; CONDITIONAL = required only if the capability is included as operational.


### 1. Freeze scope and reconcile sources

- [x] **launch-001 · PASS** — Identify the canonical public-site source, member repository, research registry, hosting projects, production origins, and backend project; verify ownership and current remote state.
  - Canonical sources, remotes and clean starting work recorded; divergent histories reconciled without discarding local work. Public source is versioned and remotely backed up.

- [x] **launch-002 · PASS** — Preserve all dirty/untracked work and existing evidence before reconciliation. Resolve duplicate or legacy checkouts without discarding unique changes.
  - Canonical sources, remotes and clean starting work recorded; divergent histories reconciled without discarding local work. Public source is versioned and remotely backed up.

- [ ] **launch-003 · PARTIAL** — Review the portal intake/workspace changes and migration; commit the complete intended source, including untracked files.
  - Current source and public revision evidence recorded below. Integrated candidates require their final CI/release decision; live backend compatibility is unverified.

- [x] **launch-004 · PASS** — Place the public root under an intentional versioned release process: a reviewed repository or reproducible immutable source archive with hashes and remote backup.
  - Canonical sources, remotes and clean starting work recorded; divergent histories reconciled without discarding local work. Public source is versioned and remotely backed up.

- [ ] **launch-005 · PARTIAL** — Record exact public/member release identities and compatible version pair. Preserve clean-source build enforcement.
  - Current source and public revision evidence recorded below. Integrated candidates require their final CI/release decision; live backend compatibility is unverified.

- [ ] **launch-006 · BLOCKED** — Define the launch route/feature inventory, supported browsers, supported ages/geographies, roles, and enabled application paths.
  - Public routes and member roles are implemented. Supported ages/geographies and enrollment policy require operator decisions before unrestricted onboarding.

- [ ] **launch-007 · PARTIAL** — Update `PROJECT_STATUS.md`, `NEXT.md`, `PROJECT_FINISH_CHECKLIST.md`, deployment documentation, and truth maps to agree with the final release. Remove stale operational instructions, not historical evidence.
  - Current source and public revision evidence recorded below. Integrated candidates require their final CI/release decision; live backend compatibility is unverified.


### 2. Reproducible build and hosted CI

- [ ] **launch-008 · PENDING_CI** — Build from clean source with the repository-supported runtime and lockfiles; verify clean install succeeds for both applications.
  - Final candidate CI is running through the linked pull requests. Existing public main CI is green; do not transfer its result to a different candidate.

- [ ] **launch-009 · PENDING_CI** — Pass public `release:check` and portal `release:check` at the selected source identities.
  - Final candidate CI is running through the linked pull requests. Existing public main CI is green; do not transfer its result to a different candidate.

- [ ] **launch-010 · PARTIAL** — Pass relevant unit, integration, release/security, browser, migration replay, and account-lifecycle suites. Investigate skips and failures rather than silently excluding them.
  - Current public health and scoped source checks have receipts. Full candidate CI and authenticated/provider behavior require separate evidence.

- [ ] **launch-011 · PARTIAL** — Verify the real production environment contract; test-only snapshot values are insufficient.
  - Current public health and scoped source checks have receipts. Full candidate CI and authenticated/provider behavior require separate evidence.

- [ ] **launch-012 · PARTIAL** — Run fresh dependency and secret scans; resolve exploitable findings and confirm privileged credentials are absent from source, archives, browser bundles, and logs.
  - Current public health and scoped source checks have receipts. Full candidate CI and authenticated/provider behavior require separate evidence.

- [ ] **launch-013 · PENDING_CI** — Ensure hosted required CI checks pass on the actual release revision, including workflow/runtime integrity checks.
  - Final candidate CI is running through the linked pull requests. Existing public main CI is green; do not transfer its result to a different candidate.

- [ ] **launch-014 · PARTIAL** — Retain build logs, test reports, dependency results, source manifests, and deployable artifacts linked to the exact revision.
  - Current source and public revision evidence recorded below. Integrated candidates require their final CI/release decision; live backend compatibility is unverified.


### 3. Hosting, domains, and deployment identity

- [ ] **launch-015 · PARTIAL** — Confirm the canonical public and member HTTPS origins and ownership. Decide how legacy/duplicate origins redirect or remain intentionally available.
  - Current source and public revision evidence recorded below. Integrated candidates require their final CI/release decision; live backend compatibility is unverified.

- [ ] **launch-016 · PARTIAL** — Verify hosting build root, install/build commands, output directory, runtime, and environment scopes for each separate application.
  - Current source and public revision evidence recorded below. Integrated candidates require their final CI/release decision; live backend compatibility is unverified.

- [ ] **launch-017 · PARTIAL** — Configure and validate public site URL, member handoff, Auth redirect origin, and public backend values. Reject foreign project/origin identifiers in source configuration and emitted bundles.
  - Current source and public revision evidence recorded below. Integrated candidates require their final CI/release decision; live backend compatibility is unverified.

- [ ] **launch-018 · PARTIAL** — Deploy the exact reviewed artifacts and retain deployment IDs, source identities, production URLs, and previous known-good versions.
  - Current source and public revision evidence recorded below. Integrated candidates require their final CI/release decision; live backend compatibility is unverified.

- [ ] **launch-019 · PARTIAL** — Verify TLS, deep links, refresh, real 404 responses, intended redirects, static assets, downloads, and cache invalidation on the live origins.
  - Current public health and scoped source checks have receipts. Full candidate CI and authenticated/provider behavior require separate evidence.

- [ ] **launch-020 · PARTIAL** — Verify CSP, HSTS, frame restrictions, MIME/referrer/permissions headers and required provider connections without breaking application flows.
  - Current public health and scoped source checks have receipts. Full candidate CI and authenticated/provider behavior require separate evidence.

- [ ] **launch-021 · PARTIAL** — Prove live content matches the selected release using revision receipts or artifact hashes; a successful deployment command alone is insufficient.
  - Current source and public revision evidence recorded below. Integrated candidates require their final CI/release decision; live backend compatibility is unverified.


### 4. Backend migrations and data integrity

- [ ] **launch-022 · BLOCKED** — Read the canonical backend's current migration ledger, schema, grants, policies, functions, and provider health before changing anything.
  - Owner requested leaving canonical live database and controlled-account checks blocked on 11 October. Provider/controlled-account access or operational evidence is required; no substitute project or synthetic acceptance is allowed.

- [ ] **launch-023 · BLOCKED** — Compare live state with all current checked-in migrations, including native intake. Do not rely on historical migration counts or assumed missing versions.
  - Owner requested leaving canonical live database and controlled-account checks blocked on 11 October. Provider/controlled-account access or operational evidence is required; no substitute project or synthetic acceptance is allowed.

- [ ] **launch-024 · BLOCKED** — Review migration impact and compatibility, capture backups/before-state evidence, and apply only genuinely missing reviewed changes using the supported workflow.
  - Owner requested leaving canonical live database and controlled-account checks blocked on 11 October. Provider/controlled-account access or operational evidence is required; no substitute project or synthetic acceptance is allowed.

- [ ] **launch-025 · BLOCKED** — Certify the resulting ledger/schema against the selected portal revision; never mark unapplied migrations as applied to clear a gate.
  - Owner requested leaving canonical live database and controlled-account checks blocked on 11 October. Provider/controlled-account access or operational evidence is required; no substitute project or synthetic acceptance is allowed.

- [ ] **launch-026 · BLOCKED** — Execute hosted authorization certification for anonymous, member A, member B, reviewer, and administrator roles with a controlled cleanup or rollback plan.
  - Owner requested leaving canonical live database and controlled-account checks blocked on 11 October. Provider/controlled-account access or operational evidence is required; no substitute project or synthetic acceptance is allowed.

- [ ] **launch-027 · BLOCKED** — Prove cross-account denial, private field protection, immutable submitted answers, reviewer boundaries, role-escalation denial, and legitimate authorized operations.
  - Owner requested leaving canonical live database and controlled-account checks blocked on 11 October. Provider/controlled-account access or operational evidence is required; no substitute project or synthetic acceptance is allowed.

- [ ] **launch-028 · BLOCKED** — Verify database-enforced validation, field lengths, consent versions, eligibility/deadlines, duplicate handling, and race-safe mutation behavior across enabled writes.
  - Owner requested leaving canonical live database and controlled-account checks blocked on 11 October. Provider/controlled-account access or operational evidence is required; no substitute project or synthetic acceptance is allowed.

- [ ] **launch-029 · OPEN** — Replace brittle title-based demo filtering with an explicit publication policy; verify unpublished/demo/private records cannot appear publicly.
  - Source still uses explicit historical demo quarantine in src/lib/content-visibility.ts. Add a reviewed database publication policy and its authorization tests before claiming editorial publication control.

- [ ] **launch-030 · PARTIAL** — Define stable IDs and publication mapping between public programs/projects and member records. Verify each enabled application points to the correct record.
  - Native public intake remains gated. Verify the exact call/program mapping against canonical production records before enabling handoff.


### 5. Authentication and complete user journeys

- [ ] **launch-031 · BLOCKED** — Verify current signup/provider settings, correct Site URL, and exact callback/recovery allowlists on the canonical backend.
  - Owner requested leaving canonical live database and controlled-account checks blocked on 11 October. Provider/controlled-account access or operational evidence is required; no substitute project or synthetic acceptance is allowed.

- [ ] **launch-032 · BLOCKED** — Verify real email confirmation, recovery delivery, expiry, invalid/reused links, and Google OAuth success/cancellation/error paths.
  - Owner requested leaving canonical live database and controlled-account checks blocked on 11 October. Provider/controlled-account access or operational evidence is required; no substitute project or synthetic acceptance is allowed.

- [ ] **launch-033 · BLOCKED** — Exercise signup → confirmation → onboarding → dashboard using a new controlled ordinary account.
  - Owner requested leaving canonical live database and controlled-account checks blocked on 11 October. Provider/controlled-account access or operational evidence is required; no substitute project or synthetic acceptance is allowed.

- [ ] **launch-034 · BLOCKED** — Exercise login, persisted session, refresh, logout, protected routes, session expiry, safe return destinations, and recovery from incomplete profile creation.
  - Owner requested leaving canonical live database and controlled-account checks blocked on 11 October. Provider/controlled-account access or operational evidence is required; no substitute project or synthetic acceptance is allowed.

- [ ] **launch-035 · BLOCKED** — Complete real member journeys for enabled applications/intake: validation → submission → receipt → reviewer visibility → decision → member result → withdrawal/export where supported.
  - Owner requested leaving canonical live database and controlled-account checks blocked on 11 October. Provider/controlled-account access or operational evidence is required; no substitute project or synthetic acceptance is allowed.

- [ ] **launch-036 · BLOCKED** — Verify account/profile edits, saved items, project participation, events, and connections wherever enabled; confirm persistence after reload and across sessions.
  - Owner requested leaving canonical live database and controlled-account checks blocked on 11 October. Provider/controlled-account access or operational evidence is required; no substitute project or synthetic acceptance is allowed.

- [ ] **launch-037 · BLOCKED** — Verify permission denial through direct API requests as well as hidden UI controls, including closed/expired offerings.
  - Owner requested leaving canonical live database and controlled-account checks blocked on 11 October. Provider/controlled-account access or operational evidence is required; no substitute project or synthetic acceptance is allowed.

- [ ] **launch-038 · BLOCKED** — Verify account export and deletion end to end, including dependent records, access revocation, and documented retention exceptions.
  - Owner requested leaving canonical live database and controlled-account checks blocked on 11 October. Provider/controlled-account access or operational evidence is required; no substitute project or synthetic acceptance is allowed.

- [ ] **launch-039 · BLOCKED** — Remove controlled QA records/accounts after verification and retain privacy-safe receipts.
  - Owner requested leaving canonical live database and controlled-account checks blocked on 11 October. Provider/controlled-account access or operational evidence is required; no substitute project or synthetic acceptance is allowed.


### 6. Abuse prevention and failure handling

- [ ] **launch-040 · OPEN** — Define and enforce per-action server-side rate limits for enabled anonymous and member writes, including inquiry/intake/application/contact paths.
  - Define and implement server-side per-action budgets, then certify legitimate use, burst denial and recovery. Client button guards alone are insufficient.

- [ ] **launch-041 · PARTIAL** — Verify spam controls, duplicate protection, resubmission behavior, and honest success/failure responses; zero affected rows must not display false success.
  - Account-bound mutations, safe links, timeouts, retry and retained-draft coverage exist. This pass also closes unknown signup settings and competing submissions. Full live critical-journey acceptance remains blocked.

- [ ] **launch-042 · PARTIAL** — Verify safe external links, user-generated text handling, redirect validation, and applicable storage permissions.
  - Account-bound mutations, safe links, timeouts, retry and retained-draft coverage exist. This pass also closes unknown signup settings and competing submissions. Full live critical-journey acceptance remains blocked.

- [ ] **launch-043 · PARTIAL** — Verify explicit loading, empty, denied, timeout, offline/error, and retry states on all critical routes, including degraded profile initialization.
  - Account-bound mutations, safe links, timeouts, retry and retained-draft coverage exist. This pass also closes unknown signup settings and competing submissions. Full live critical-journey acceptance remains blocked.

- [ ] **launch-044 · PARTIAL** — Verify failed requests and retries cannot duplicate submissions, lose entered data unnecessarily, or silently drop user actions.
  - Account-bound mutations, safe links, timeouts, retry and retained-draft coverage exist. This pass also closes unknown signup settings and competing submissions. Full live critical-journey acceptance remains blocked.

- [ ] **launch-045 · BLOCKED** — Inventory operational secrets, restrict privileged access, and document credential rotation/revocation responsibilities.
  - Requires an accountable operator decision, verified permissions, credential ownership, real program staffing or demonstrated delivery; none is inferred from source or a test fixture.


### 7. Privacy, participation, and operational ownership

- [ ] **launch-046 · BLOCKED** — Obtain an approved policy decision for intended audiences, ages, jurisdictions, personal-data collection, and any guardian-consent requirements; record the responsible decision-maker.
  - Requires an accountable operator decision, verified permissions, credential ownership, real program staffing or demonstrated delivery; none is inferred from source or a test fixture.

- [ ] **launch-047 · PARTIAL** — Publish accurate privacy, participation/terms, contact, and safeguarding information matching actual behavior and providers.
  - Public /privacy and /participation information exists; account screens now link both and support. Approved audience, retention and safeguarding decisions are still outstanding.

- [ ] **launch-048 · BLOCKED** — Enforce the approved age/consent policy in backend and frontend; block unsupported enrollment paths. A selectable age band alone is insufficient.
  - Requires an accountable operator decision, verified permissions, credential ownership, real program staffing or demonstrated delivery; none is inferred from source or a test fixture.

- [ ] **launch-049 · BLOCKED** — Store necessary consent/version records and verify withdrawal behavior where applicable.
  - Owner requested leaving canonical live database and controlled-account checks blocked on 11 October. Provider/controlled-account access or operational evidence is required; no substitute project or synthetic acceptance is allowed.

- [ ] **launch-050 · BLOCKED** — Define retention/deletion periods, data access, export/deletion handling, backup treatment, and a named owner for requests.
  - Requires an accountable operator decision, verified permissions, credential ownership, real program staffing or demonstrated delivery; none is inferred from source or a test fixture.

- [ ] **launch-051 · PARTIAL** — Verify analytics/logging avoid form contents, secrets, and unnecessary personal identifiers; implement applicable consent choices.
  - Existing source and public-release contracts provide bounded evidence. Complete provider/content/operations acceptance and exact-release checks remain required; see receipts and remaining-action groups.

- [ ] **launch-052 · BLOCKED** — Verify support and review channels actually reach named operators, with response expectations and escalation procedures.
  - Requires an accountable operator decision, verified permissions, credential ownership, real program staffing or demonstrated delivery; none is inferred from source or a test fixture.

- [ ] **launch-053 · BLOCKED** — Confirm rights/permission for published names, affiliations, logos, imagery, recordings, datasets, and other third-party material.
  - Requires an accountable operator decision, verified permissions, credential ownership, real program staffing or demonstrated delivery; none is inferred from source or a test fixture.


### 8. Content and every public promise

- [ ] **launch-054 · PARTIAL** — Review every launch route, navigation item, CTA, form, downloadable asset, and external destination against a complete inventory.
  - Existing source and public-release contracts provide bounded evidence. Complete provider/content/operations acceptance and exact-release checks remain required; see receipts and remaining-action groups.

- [ ] **launch-055 · PARTIAL** — Verify research maturity, results, program status, participant counts, affiliations, partners, and outcomes against attributable evidence; remove unsupported claims.
  - Existing source and public-release contracts provide bounded evidence. Complete provider/content/operations acceptance and exact-release checks remain required; see receipts and remaining-action groups.

- [x] **launch-056 · PASS** — Mark proposals, synthetic experiments, unavailable collections, and expressions of interest accurately. Do not imply admission, active cohorts, market alpha, or independent validation.
  - Current research registry and 48-project governance validator pass. Public IYERN tests preserve an empty verified archive and inactive DOI service; proposed programs and synthetic evidence remain qualified.

- [ ] **launch-057 · BLOCKED** — For any open program, publish its owner, audience, prerequisites, dates/timezone, capacity, selection policy, deliverables, reviewer/staffing plan, and contact.
  - Requires an accountable operator decision, verified permissions, credential ownership, real program staffing or demonstrated delivery; none is inferred from source or a test fixture.

- [ ] **launch-058 · PARTIAL** — Ensure all advertised learning resources and downloads exist, are usable, correctly attributed, and consistent with their descriptions.
  - Existing source and public-release contracts provide bounded evidence. Complete provider/content/operations acceptance and exact-release checks remain required; see receipts and remaining-action groups.

- [ ] **launch-059 · BLOCKED** — Test every form through its actual production destination, including external intake if retained; verify delivery, reviewer access, receipts, and handling policy.
  - Owner requested leaving canonical live database and controlled-account checks blocked on 11 October. Provider/controlled-account access or operational evidence is required; no substitute project or synthetic acceptance is allowed.

- [ ] **launch-060 · PARTIAL** — Remove placeholder/demo/dead content and resolve contradictions between public pages, portal content, registries, and policies.
  - Existing source and public-release contracts provide bounded evidence. Complete provider/content/operations acceptance and exact-release checks remain required; see receipts and remaining-action groups.


### 9. Accessibility, responsive behavior, and compatibility

- [ ] **launch-061 · PARTIAL** — Run current browser coverage across the full public route inventory and critical authenticated role journeys at the release revision.
  - Hosted Chromium and automated accessibility coverage is required on the final candidate; authenticated roles and manual assistive-technology acceptance are not certified.

- [ ] **launch-062 · OPEN** — Verify layouts at 320, 375, 768, 1024, and 1440 px, including long content, forms, tables, menus, dialogs, and all supported themes.
  - Complete the declared viewport/browser/performance matrix with dated measurements. Current automated Chromium/source coverage is not a real-device or field-performance result.

- [ ] **launch-063 · PARTIAL** — Verify keyboard-only navigation, focus order/restoration, visible focus, labels, validation announcements, dialogs, and hidden-navigation behavior.
  - Hosted Chromium and automated accessibility coverage is required on the final candidate; authenticated roles and manual assistive-technology acceptance are not certified.

- [ ] **launch-064 · PARTIAL** — Run automated accessibility checks and manual screen-reader checks of core journeys; resolve findings rather than equating zero automated violations with full conformance.
  - Hosted Chromium and automated accessibility coverage is required on the final candidate; authenticated roles and manual assistive-technology acceptance are not certified.

- [ ] **launch-065 · PARTIAL** — Verify zoom/text resizing, reduced motion, contrast, touch target usability, and no clipped content or unintended horizontal scrolling.
  - Hosted Chromium and automated accessibility coverage is required on the final candidate; authenticated roles and manual assistive-technology acceptance are not certified.

- [ ] **launch-066 · OPEN** — Run supported Chromium, Firefox, and WebKit/Safari journeys; inspect at least one real mobile browser for critical interactions.
  - Complete the declared viewport/browser/performance matrix with dated measurements. Current automated Chromium/source coverage is not a real-device or field-performance result.

- [ ] **launch-067 · PARTIAL** — Confirm no uncaught runtime errors, failed essential requests, hydration problems, or broken back/forward/reload behavior.
  - Hosted Chromium and automated accessibility coverage is required on the final candidate; authenticated roles and manual assistive-technology acceptance are not certified.


### 10. Performance, discovery, and analytics

- [ ] **launch-068 · OPEN** — Define measurable launch performance budgets and test representative public and authenticated routes on constrained mobile/network conditions.
  - Complete the declared viewport/browser/performance matrix with dated measurements. Current automated Chromium/source coverage is not a real-device or field-performance result.

- [ ] **launch-069 · OPEN** — Resolve budget failures involving loading, interaction, layout shift, oversized assets, or avoidable backend calls. Record lab evidence; collect field evidence after launch rather than inventing it.
  - Complete the declared viewport/browser/performance matrix with dated measurements. Current automated Chromium/source coverage is not a real-device or field-performance result.

- [ ] **launch-070 · PARTIAL** — Verify unique page titles/descriptions, canonical URLs, sitemap, robots rules, social images/previews, structured data, redirects, and intended indexing boundaries.
  - Existing source and public-release contracts provide bounded evidence. Complete provider/content/operations acceptance and exact-release checks remain required; see receipts and remaining-action groups.

- [ ] **launch-071 · PARTIAL** — Prevent private/authenticated routes and sensitive information from appearing in public indexing or cached output.
  - Existing source and public-release contracts provide bounded evidence. Complete provider/content/operations acceptance and exact-release checks remain required; see receipts and remaining-action groups.

- [ ] **launch-072 · BLOCKED** — Verify privacy-bounded production funnel events actually persist with correct attribution, deduplication, and payload bounds if analytics is enabled.
  - Owner requested leaving canonical live database and controlled-account checks blocked on 11 October. Provider/controlled-account access or operational evidence is required; no substitute project or synthetic acceptance is allowed.

- [ ] **launch-073 · PARTIAL** — Ensure missing analytics configuration cannot break core user journeys; publish no conversion or usage claims without supporting data.
  - Existing source and public-release contracts provide bounded evidence. Complete provider/content/operations acceptance and exact-release checks remain required; see receipts and remaining-action groups.


### 11. Monitoring, backup, and rollback

- [ ] **launch-074 · PARTIAL** — Configure release-tagged error reporting and health checks for both surfaces and critical backend dependencies without exposing personal data.
  - Existing source and public-release contracts provide bounded evidence. Complete provider/content/operations acceptance and exact-release checks remain required; see receipts and remaining-action groups.

- [ ] **launch-075 · BLOCKED** — Assign alert recipients and incident ownership; trigger a controlled test to prove notification delivery and triage.
  - Requires an accountable operator decision, verified permissions, credential ownership, real program staffing or demonstrated delivery; none is inferred from source or a test fixture.

- [ ] **launch-076 · BLOCKED** — Verify provider backups and retention; perform a restore drill into an isolated environment and record recovery results.
  - Owner requested leaving canonical live database and controlled-account checks blocked on 11 October. Provider/controlled-account access or operational evidence is required; no substitute project or synthetic acceptance is allowed.

- [ ] **launch-077 · PARTIAL** — Document and test public-site and portal rollback independently, including their compatible backend schema and environment versions.
  - Existing source and public-release contracts provide bounded evidence. Complete provider/content/operations acceptance and exact-release checks remain required; see receipts and remaining-action groups.

- [ ] **launch-078 · PARTIAL** — Preserve known-good deployment artifacts and a safe migration recovery/forward-fix procedure; avoid destructive schema rollback assumptions.
  - Existing source and public-release contracts provide bounded evidence. Complete provider/content/operations acceptance and exact-release checks remain required; see receipts and remaining-action groups.

- [ ] **launch-079 · BLOCKED** — Document operational access, support/review coverage, outage handling, dependency maintenance, and handover so one missing operator does not strand the service.
  - Requires an accountable operator decision, verified permissions, credential ownership, real program staffing or demonstrated delivery; none is inferred from source or a test fixture.


### 12. Final publication decision

- [ ] **launch-080 · PARTIAL** — Build a final evidence manifest mapping every applicable checklist item to a passing receipt and responsible owner.
  - Every existing gate is indexed in this checklist and machine-readable manifest, with source pointers. A final all-passing release manifest is impossible while explicit blockers remain.

- [ ] **launch-081 · BLOCKED** — Confirm no open launch defects, contradictory docs, untracked required source, missing migration, inaccessible form destination, or unsupported promise remains.
  - Unrestricted launch remains NO-GO until the earlier live, policy and operational gates pass. No intake/registration activation or GO decision was issued.

- [ ] **launch-082 · BLOCKED** — Re-run live smoke and controlled role journeys after the final deployment/configuration change, tied to the exact deployed identities.
  - Owner requested leaving canonical live database and controlled-account checks blocked on 11 October. Provider/controlled-account access or operational evidence is required; no substitute project or synthetic acceptance is allowed.

- [ ] **launch-083 · BLOCKED** — Record the release scope, exclusions, date, deployment pair, backend certification, operating owners, and GO decision.
  - Unrestricted launch remains NO-GO until the earlier live, policy and operational gates pass. No intake/registration activation or GO decision was issued.

- [ ] **launch-084 · BLOCKED** — Enable native intake/new enrollment only after the relevant production, privacy, and operational gates pass; verify the enabled path immediately.
  - Unrestricted launch remains NO-GO until the earlier live, policy and operational gates pass. No intake/registration activation or GO decision was issued.

- [ ] **launch-085 · BLOCKED** — Complete an initial monitored observation window defined before launch; resolve any release failures and retain the final health record.
  - Unrestricted launch remains NO-GO until the earlier live, policy and operational gates pass. No intake/registration activation or GO decision was issued.


### 13. Conditional expansion and research-publication gates

- [ ] **launch-086 · CONDITIONAL** — Research result publication: release a falsifiable question, authorized/versioned data, frozen protocol, leakage controls, fair baselines, uncertainty/limitations, raw results, pinned code/environment, reproduction instructions, and claim-level review. FI-JEPA's synthetic baseline does not satisfy real-market or neural-JEPA claims.
  - Exclude this capability from operational claims until its stated evidence and owner requirements are met. A planning record does not satisfy the gate.

- [ ] **launch-087 · CONDITIONAL** — Active cohorts: confirm staffing, schedule, capacity, selection, safeguarding, feedback, and final-output workflow before accepting cohort applications.
  - Exclude this capability from operational claims until its stated evidence and owner requirements are met. A planning record does not satisfy the gate.

- [ ] **launch-088 · CONDITIONAL** — Events: confirm host, date/timezone, capacity, registration/cancellation policy, communications, and functioning calendar details.
  - Exclude this capability from operational claims until its stated evidence and owner requirements are met. A planning record does not satisfy the gate.

- [ ] **launch-089 · CONDITIONAL** — Podcast: obtain permissions and release the actual recording, transcript, references, and working player/download.
  - Exclude this capability from operational claims until its stated evidence and owner requirements are met. A planning record does not satisfy the gate.

- [ ] **launch-090 · CONDITIONAL** — Live markets: secure a suitable provider and usage rights; implement timestamps, revisions, caching, stale/error states, and source attribution before displaying live values.
  - Exclude this capability from operational claims until its stated evidence and owner requirements are met. A planning record does not satisfy the gate.

- [ ] **launch-091 · CONDITIONAL** — Researcher/partner profiles: verify identity, attribution, contributions, links, and publication/affiliation permissions before making public claims.
  - Exclude this capability from operational claims until its stated evidence and owner requirements are met. A planning record does not satisfy the gate.

- [ ] **launch-092 · PARTIAL** — Collaboration/tasks: implement membership, ownership, permissions, persistence, and workflow verification before advertising shared project/task management.
  - Collaboration/task source, account-bound mutations and disposable database tests are available. Live acceptance remains blocked with the other member journeys.

- [ ] **launch-093 · CONDITIONAL** — Newsletter: implement consent, confirmed delivery, unsubscribe, suppression, and operational ownership before collecting subscription emails.
  - Exclude this capability from operational claims until its stated evidence and owner requirements are met. A planning record does not satisfy the gate.

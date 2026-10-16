# Website improvement state — 15 October 2026

Read this record before continuing this improvement cycle and update it with new evidence.

## Contract

Target: the FinanceMeta-Landing public website. Preserve the separate member portal,
IYERN site, existing editorial work, all public routes and the research evidence history.
This is a website usability and engineering study, not an ML research experiment.
Question: can visitors find usable learning resources and understand contribution
availability without navigating the internal project register?

Hypothesis: four goal-based navigation destinations, immediate access to usable
resources, explicit interest-only intake, and consistent organization naming will make
the site clearer. Browser checks can establish functionality; they cannot prove improved
conversion or comprehension without a subsequent user study.

Budget: one bounded audit and implementation cycle, local checks and browser verification;
no paid compute, applications, production deployment, or private account operations.
Baseline: 68 tests pass and 172 routes render. Existing modifications are recorded in
`evidence/website-review-2026-10-15/baseline.json` and `existing-changes.patch`.

## Audit and acceptance checklist

| Issue / cause | Priority | Repair | Required evidence | State |
|---|---|---|---|---|
| Eight competing navigation destinations | High | Four goals with contextual discovery links | Desktop/mobile navigation, route coverage, keyboard dismissal | Implemented and locally verified |
| Internal register dominates the homepage | High | Lead with usable resources; retain register in Research | Home links resolve; all 48 records remain | Implemented and locally verified |
| Finance4All / FinanceMeta relationship is implicit | Medium | Explain relationship consistently in shared shell and About | Rendered copy and visual inspection | Implemented and locally verified |
| General applications imply confirmed opportunities | High | State interest-only availability before role choice and on CTA | All roles preserve destination/context; no admission promise | Implemented and locally verified |
| Four-module course follows all new articles | High | Explicit stable course curriculum and derived count/time | Catalog expansion cannot silently change curriculum | Implemented and locally verified |
| Dirty builds can claim an older source revision | High | Bind release identity to clean exact checkout; separate preview build | Dirty/mismatched/missing source rejection and archive cases | Implemented and locally verified |
| Earlier report is stale | Medium | Retain historical report; publish dated results and limits | Logs, hashes, reproducible commands | Implemented and locally verified |
| No attributable roster or verified activity stories | Medium | Keep evidence boundary; improve access to real outputs | Do not fabricate people, dates, achievements | External evidence needed |
| Cohort dates, review time, fees, staffing unconfirmed | High | Make missing commitments explicit | Accountable team must supply verified operational terms | External evidence needed |

## Verification protocol

1. Preserve baseline and existing changes; implement only evidence-backed fixes.
2. Run source, accessibility-contract, funnel, lint, build and test checks.
3. Inspect local desktop and mobile pages, keyboard navigation, route builder, role
   selection, course progress and an article; run browser accessibility checks.
4. Retain failures and corrections. Record exact scope of each result and source hashes.
5. Stop with a reviewable local artifact and explicit deployment/operational boundaries.
   A positive usability effect requires a separate study; do not infer one from passing tests.

## History

- Baseline audited: source passes existing checks, but the checks miss curriculum drift
  and release provenance. Existing editorial modifications are preserved.

- 16 October 2026: all seven implementation rows complete. Journal submission copy also
  reconciled with the existing IYERN application routes. See
  `WEBSITE_COMPLETION_2026-10-16.md` for verification, failures retained, and open operator inputs.
- Final local check: 73/73 tests, 172 prerendered routes. Clean isolated snapshot also
  passed the full release gate; this is local engineering evidence, not a deployed receipt.

- 16 October deployment follow-up: user authorized production deployment. Remaining Axe
  contrast review resolved in `evidence/deployment-2026-10-16/accessibility-review.json`;
  mobile keyboard focus and the SVG description/background repaired. All 73 local tests pass.

# Public website completion record — 16 October 2026

## Outcome and scope

The FinanceMeta-Landing public website improvement cycle is implemented and locally
verified. Its existing editorial visual style, free learning material, transparent research
status, all 48 portfolio records, and all 172 public routes are retained. The separate
member portal and IYERN application backend were outside this change. Production has not
been updated by this work.

## Changes

- Reduced the primary navigation from eight destinations to Learn, Research, Get involved,
  and About. Contextual navigation keeps specialist pages accessible and identifies the
  active section. Mobile contextual links scroll in one row rather than consuming the screen.
- Put a four-module introductory course, practice exercises, and calculators directly on
  the homepage. Replaced the large internal register panel and unavailable journal promotion
  with concise research links and usable resources.
- Explained Finance4All as FinanceMeta's public learning and research website in shared
  branding and About.
- Clarified general intake as an expression of interest before selecting a role. Preserved
  role-specific external destinations and context without implying confirmed admission,
  timing, funding, or reserved places.
- Kept the introductory course at four explicit modules (21 minutes) as the existing
  explainer library expands to ten articles. Course code now loads on course routes.
- Aligned journal guidance and route metadata with the existing external IYERN submission
  forms. No issue or accepted article is claimed without evidence.
- Made release receipts reject dirty checkouts and conflicting source revisions. Added
  `npm run check:local` and `npm run build:dev` for honest working-tree previews without a
  release identity. The production build retains the strict release gate.

## Verification

Evidence directory: `evidence/website-review-2026-10-15/` (the audit began on 15 October).

| Check | Result | Evidence |
|---|---|---|
| Source contracts, funnel, lint, TypeScript, production-mode preview build, tests | 73/73 pass; 172 prerendered routes | `local-check-4.log` |
| Full release gate in a clean isolated local snapshot | Pass, exact source revision, metadata, social image, routes and security headers | `clean-release.log`, `clean-snapshot.json` |
| Dirty source receipt writer | Rejected with exit 1; no stale receipt left | `dirty-release-rejection.log`, `final-integrity.json` |
| Production dependency audit | 0 reported vulnerabilities at check time | `dependency-audit.json` |
| Existing user changes | All baseline hashes preserved except the intentionally updated homepage assertion in `tests/site.test.mjs` | `baseline.json`, `existing-changes.patch`, `final-integrity.json` |
| Tested source vs isolated release snapshot | No source hash drift | `final-integrity.json` |
| Browser accessibility | Zero automated violations across the recorded final page/viewport/theme cases | `browser/*.json`, excluding `initial-*` records |

Browser interactions checked: route-builder choices persist after reload; menu closes on
Escape; Writer and Chapter Lead retain the correct external destinations; course progress
survives reload and resets to zero of four; search for “interest rates” returns five of 81
entries; a zero-growth calculator scenario returns 13,000 balance, 13,000 contributions,
and zero growth. Forms were not externally submitted.

At 320 CSS pixels, the homepage, Join, course, research, calculators, program comparison,
article, and search pages have no document-width overflow. Home was also checked on desktop,
in light and dark themes. These are representative browser checks, not manual inspection
of every route. Automated static route checks cover the complete route set.

Axe retains manual-review contrast items for decorative characters, SVG text backgrounds,
and partially clipped links in the horizontally scrollable contextual navigation. These
are not automated violations and do not establish complete WCAG conformance. The screenshots
record the visual result; no measured conversion or comprehension improvement is claimed.

Runtime: Node 22.22.0, within package engines. CI pins 22.23.2. The isolated snapshot uses
existing installed dependencies via a symlink; it is not an independent fresh-install run.
Snapshot revision: `bc669c7cf8935d931628451f4e612f034ed931d7`, created only in
`/private/tmp/financemeta-verified-0_zb6nk7`. No commit or push was made to this source checkout.
Documentation/evidence written after that run do not alter its tested application source.

## Failures retained and repaired

1. The first local run had one stale test expecting Projects in the primary navigation.
   Updated it to verify contextual access; no project was removed.
2. The next run exceeded the 100,000-byte shared gzip budget by 18 bytes. Extracted lazy
   course pages, then reran the full local gate successfully.
3. Browser inspection found an unsupported label on a generic homepage div and a cramped
   multi-row mobile context menu. Added a group role and changed the mobile menu layout.
4. The audit found conflicting journal submission availability text; reconciled it with
   the existing application directory and reran all checks.

The original logs and initial browser audit records are preserved rather than overwritten
with only passing outcomes.

## Remaining operational work

The website can accurately publish available resources now. Accountable owners must supply
verified contributor names and permission to publish their profiles, genuine completed-work
stories, cohort dates and capacity, expected hours, fees/funding, staffing, and review timelines
before those commitments appear as facts. The site explicitly marks missing commitments.

Publishing this candidate still requires the normal source-review and deployment process,
followed by an exact-revision production check. The clean local snapshot is not evidence of
a hosted CI run or production deployment. Member account, backend admission, and external
form-processing reliability require their respective owners' end-to-end checks.

## Reproduce

From FinanceMeta-Landing with a supported Node 22 runtime and dependencies installed:

```sh
npm run check:local
QA_PORT=4187 node scripts/qa-server.mjs
```

Inspect `http://127.0.0.1:4187/`; append `?__audit=1` to enable local diagnostics.
For a clean reviewed checkout, run `npm run release:check`. A dirty working tree deliberately
cannot produce an immutable production release receipt.

## Deployment follow-up

The user subsequently authorized publication. The previously outstanding manual contrast
review is resolved in `evidence/deployment-2026-10-16/accessibility-review.json`: inspected
text pairs meet 4.5:1; decorative glyphs are identified as non-text; keyboard navigation
scrolls clipped links into view. Mobile focus outlines are now inset, and the rate diagram
has an explicit background and complete accessible description. These targeted checks do
not constitute a full WCAG certification. The earlier local-only disposition above is
retained as history; the subsequent deployment receipt establishes live status separately.

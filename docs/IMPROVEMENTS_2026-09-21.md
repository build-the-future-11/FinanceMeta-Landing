# FinanceMeta improvement pass

The requested implementation work is complete locally. The final rendered browser verification remains blocked: the browser tool repeatedly reported that its admin-enforced security policy could not be verified. That control was not bypassed. This candidate is not deployed or certified for production.

## Checklist and results

| Requested improvement | Implemented | Verification |
| --- | --- | --- |
| Key page polish | Project section navigation, earlier contextual contribution CTA, direct protocol download, clearer evidence spacing | All 93 route outputs and internal destinations pass |
| Visual consistency | More readable card labels, tags, metadata, touch controls and article spacing; dark print styles | CSS/source checks pass; final visual inspection blocked |
| Mobile/navigation | 44 px menu controls, expanded mobile summary targets, desktop ArrowDown focus, menu reset across breakpoint, correct active groups | Typecheck/source contracts pass; post-change keyboard/viewport checks blocked |
| Research discovery | Multiword search, title/recent sorting, relevance ranking, removable filters, counts, copy-view link, URL persistence for cohort/event tabs, empty-state recovery | Pure interaction regressions pass; rendered interaction checks blocked |
| Project evidence | Brief/method/evidence/limitations/reproduction anchors, linked standards and downloadable worksheet | Anchor and route tests pass |
| Application handoffs | Resolve real project/lab names, retain role in URL, show source project, copy context before external form, explain prepare/submit/review, trim-aware validation and character feedback | Context and static form tests pass; no application sent |
| Publication reading | Article contents, stable anchors, downloadable full Markdown, copyable accurate citation, related research, print polish | All four article texts/downloads and anchors pass |
| Accessibility | Pinned local axe runner; baseline axe found low-contrast lab number, corrected; heading-level regression gate; unique reading-checkbox labels and group semantics | Baseline axe completed; post-change axe blocked. CSS contrast calculation: 1.57 before, 8.23 dark / 6.25 light after |
| Performance | Full article bodies split from shared catalog; route-appropriate module preloads; remove two unused particle dependencies and their 44 packages; protect shared JS size with a test | Vite build output: shared research JS approximately 94.7 → 85.7 kB gzip; actual zlib receipts retained |
| Links and metadata | Repair three dead citations; standard 1200 × 630 PNG share image with alt/dimensions; canonical origin honors Vite production environment files; article OG type; noindex search | 27 of 28 external links return success; IMF returns 403 to automated fetch, retained for manual verification |
| Regression coverage | Added query/filter/sort, event defaults, context resolution, stale/duplicate course storage, calculator edge cases, article anchors/downloads, bundle budget, and heading hierarchy | 23 tests pass; lint, typecheck, source/CTA contracts and release build pass |
| Release package | Allowlisted source/site archives, immutable source hash, archive checksums, evidence and deployment/rollback runbook | Clean `npm ci` + full release gate passed; all 94 HTML hashes (93 routes + 404) match the working build. Archives have SHA-256 manifests. |

The clean-install check also exposed and fixed a packaging defect: the public gate previously required sibling projects. It now scans those projects when present while keeping public `src` and `scripts` required. The source archive includes the preserved CTA contract inventory.

## Behavior changes

All six cohorts remain proposals. Empty event, episode, chapter, team and paper directories remain truthful. The working forms are still the existing Tally forms. Copying application context does not transmit it to Tally; the user pastes it into the appropriate field. The email draft remains unsent until the user sends it from their email application.

Search/filter state is shareable. Private interest-note text is never put into URLs or analytics. Invalid query identifiers are not promoted into a project record. Reading progress is device-local, deduplicated, and resettable; it is not certification.

The original Finance for All route and nested member Git repository remain unchanged during this pass. Auth, database, applications, and admin integrations were not modified. No new runtime dependencies were added. Axe and the social-image renderer are development-only.

## Performance and accessibility boundaries

The build separates a roughly 32.2 kB raw article chunk from ordinary pages. Article HTML still includes the full content before hydration. Research CSS grew from about 33.9 to 38.3 kB to support the new controls and reading layouts. Use `evidence/improvements-2026-09-21/performance.json` for exact current bytes and hashes; Vite estimates and direct zlib measurements differ slightly.

No browser trace/Lighthouse capability is installed. A local diagnostic observer records navigation, FCP, LCP and layout shifts when the audit is run, but its lone baseline result is not a representative performance benchmark. Final rendered measurements and field Core Web Vitals are unverified. Automated axe results also cannot establish complete WCAG conformance.

The local audit server and axe code never enter `dist`. The server binds loopback and uses bounded, same-origin diagnostic receipts. Post-change browser attempts were denied with: “The admin-enforced policy could not be verified, so access was not granted.” No alternate browser, raw browser driver, or indirect navigation workaround was used.

## Link corrections and sources

- SEC registration-statement citation now points to the [current official explanation](https://www.sec.gov/resources-small-businesses/going-public/what-registration-statement).
- Investor.gov IPO citation now points to the [updated official investor bulletin](https://www.investor.gov/introduction-investing/general-resources/news-alerts/alerts-bulletins/investor-bulletins-17).
- BIS monetary-policy citation now points to the [official policy-framework compendium](https://www.bis.org/mc/compendium.htm).
- The IMF monetary-policy page returns HTTP 403 to the automated checker. Access is unverified; this does not establish a broken page.

Audit methodology references: [axe API](https://github.com/dequelabs/axe-core/blob/develop/doc/API.md), [Web Vitals](https://web.dev/articles/vitals). The web-perf skill was used for the bounded performance workflow.

## Evidence and release boundary

Current evidence lives in `evidence/improvements-2026-09-21/`: release output, external-link inventory, dependency audit, per-asset hashes/sizes, CSS contrast calculation, the baseline axe receipt, and a pre-improvement source archive. The previous 744 viewport checks apply to the earlier rebuild, not to this changed candidate.

Follow `docs/RELEASE_RUNBOOK_2026-09-21.md`. Complete the browser checks after policy validation is available, then review production/member origins and organizational content before deployment. No production action was taken.

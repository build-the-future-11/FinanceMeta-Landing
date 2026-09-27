# FinanceMeta 2026 research website rebuild

Status: implemented and locally verified. Production deployment and live member-account certification are not claimed.

## 1. Executive summary

Rebuilt the public root around a research-led editorial identity, seven data-driven labs, six proposed flagship cohorts, and the full existing research catalog. Ninety-three public routes are generated as real HTML. The root remains on React 18, Vite 8, and TypeScript; no runtime dependencies were added.

Finance for All is preserved at /finance-for-all. The separate Finance4allLanding Git repository, authentication, Supabase integrations, member applications, saved content, portal, and admin remain unchanged. Baseline source was copied into evidence/rebuild-2026-09-21/baseline before edits.

## 2. Exact routes

- `/` — Research the systems moving capital.
- `/research` — Research
- `/research/labs` — Research labs
- `/research/projects` — Research projects
- `/research/cohorts` — Research cohorts
- `/research/standards` — Research standards
- `/research/fellowship` — Global Research Fellowship
- `/research/partner-programs` — Partner research programs
- `/research/special-projects` — Special research projects
- `/research/map` — Research map
- `/publications` — Publications
- `/publications/research-notes` — Research notes
- `/publications/working-papers` — Working papers
- `/publications/financedebriefed` — FinanceDebriefed
- `/publications/iyerj` — IyERJ
- `/publications/iyerj/submissions` — IyERJ submission information
- `/studio` — FinanceMeta Studio
- `/studio/visualization` — The cost of a trade
- `/media` — FinanceMeta Media
- `/podcast` — FinanceMeta Podcast
- `/events` — FinanceMeta Sessions & events
- `/open` — FinanceMeta Open
- `/open/library` — Open library
- `/open/resources` — Educational resources
- `/open/courses` — Courses
- `/open/courses/financial-systems` — Understanding financial systems
- `/challenges` — Challenges
- `/network` — FinanceMeta Network
- `/network/chapters` — Chapters
- `/network/partners` — Network partners
- `/ventures` — Ventures
- `/about` — About FinanceMeta
- `/about/team` — People & team
- `/about/partners` — Partners
- `/about/contact` — Contact
- `/join` — Join FinanceMeta
- `/search` — Search FinanceMeta
- `/finance-for-all` — Finance for All
- `/research/labs/quantitative-finance-asset-pricing` — Quantitative Finance & Asset Pricing
- `/research/labs/financial-econometrics-causal-inference` — Financial Econometrics & Causal Inference
- `/research/labs/macro-monetary-financial-economics` — Macro, Monetary & Financial Economics
- `/research/labs/market-microstructure-financial-systems` — Market Microstructure & Financial Systems
- `/research/labs/corporate-finance-private-markets` — Corporate Finance & Private Markets
- `/research/labs/machine-learning-for-finance` — Machine Learning for Finance
- `/research/labs/behavioral-household-finance` — Behavioral & Household Finance
- `/research/projects/realitycheck` — RealityCheck
- `/research/projects/causal-finance` — Causal Finance
- `/research/projects/macrocast` — MacroCast
- `/research/projects/market-frictions` — Market Frictions
- `/research/projects/capitallab` — CapitalLab
- `/research/projects/finml-benchmark` — FinML Benchmark
- `/research/projects/finance-meta-global` — FinanceMeta Global evidence workspace
- `/research/projects/fi-jepa` — FI-JEPA: learning financial representations
- `/research/projects/eigen-jepa` — Eigen-JEPA: market geometry and regimes
- `/research/projects/eigenfinance` — EigenFinance: portfolio evaluation
- `/research/projects/lgwm` — LGWM: Liquidation Graph World Models
- `/research/projects/finimmunity` — Finimmunity: financial resilience and recovery
- `/research/projects/iy-ern` — Iy-ERN economics research network
- `/research/projects/portal` — Finance for All member platform
- `/research/projects/inflation-observatory` — Student cost-of-living observatory
- `/research/projects/digital-payments-access` — Digital payments, access, and reliability atlas
- `/research/projects/youth-expectations-panel` — Youth economic expectations panel
- `/research/projects/public-company-lab` — Open company and sector research lab
- `/research/cohorts/realitycheck` — RealityCheck
- `/research/cohorts/causal-finance` — Causal Finance
- `/research/cohorts/macrocast` — MacroCast
- `/research/cohorts/market-frictions` — Market Frictions
- `/research/cohorts/capitallab` — CapitalLab
- `/research/cohorts/finml-benchmark` — FinML Benchmark
- `/publications/financedebriefed/ipo-from-private-company-to-public-market` — The complete guide to an IPO
- `/publications/financedebriefed/how-interest-rates-move-through-the-economy` — How interest rates move through the economy
- `/publications/financedebriefed/upi-payments-and-the-economics-of-a-network` — UPI and the economics of a payment network
- `/publications/financedebriefed/reading-an-economic-claim-without-getting-fooled` — How to read an economic claim without getting fooled
- `/research/sister` — SISTER
- `/research/partner-programs/yel` — YEL × FinanceMeta
- `/research/industry-projects` — Industry research projects
- `/studio/zenipath` — Zenipath
- `/studio/research-engineering` — Research Engineering
- `/studio/fintech` — FinTech Products
- `/studio/data` — Data Infrastructure
- `/media/interviews` — Interviews
- `/media/videos` — Videos
- `/open/workshops` — Workshops
- `/challenges/global-research-challenge` — Global Research Challenge
- `/challenges/economics-olympiad` — Economics Olympiad
- `/challenges/essay-prize` — FinanceMeta Essay Prize
- `/challenges/investment-case` — Finance / Investment Case Challenge
- `/ventures/axiom-pathways` — Axiom Pathways
- `/ventures/founder-network` — Founder Network
- `/ventures/venture-research` — Venture Research
- `/ventures/startup-diligence` — Startup Diligence
- `/network/community` — Community
- `/about/mission` — Mission

Legacy redirects are listed in vercel.json. Unknown deployment URLs receive the generated 404 page; there is no global 200 rewrite.

## 3. Components

Navbar, grouped mega-menu, mobile disclosures, theme toggle, Footer, Breadcrumbs, PageHeader, Section, ProjectCard, CohortCard, PublicationCard, EpisodeCard, EventCard, ResourceCard, PersonCard, StatusBadge, Tags, Directory, EmptyState, CTA, LabExplorer, ResearchMap, MethodPipeline, Markdown renderer, role picker, validated interest-note form, cost explorer, and course progress controls.

Shared lab, project, cohort, publication, and program templates replace duplicated page implementations. No raw HTML is accepted from editorial content. Native links, buttons, labels, selects, and details provide the interactive semantics.

## 4. Data architecture

- src/content/models.ts defines Lab, Project, Cohort, Publication, Person, Episode, ResearchEvent, Resource, Program, and Chapter.
- src/content/research.ts contains 7 labs, 6 proposed cohorts, 18 projects (6 new proposed studies plus all 12 legacy records), 4 existing educational explainers, and 8 available resources.
- src/content/legacy-catalog.ts preserves the pre-existing project and application catalog.
- src/content/editorial.ts preserves the four full explainers and their review dates; individual authors and first-publication dates are not invented.
- src/content/programs.ts defines 20 reusable program pages.
- src/routes.ts is the route and metadata registry. scripts/prerender.mjs emits 93 pages, a 404 page, sitemap, robots file, and a route/hash manifest.
- Organization and Article microdata are attached only to accurate available information. No Event or PodcastEpisode structured records are emitted for empty collections.

## 5. Functional features

- Keyboard-accessible desktop dropdowns, Escape handling and focus return, mobile grouped navigation, active section/page states.
- Light/dark themes, stored preference, pre-paint theme initialization, visible focus, skip link, reduced-motion behavior.
- Interactive seven-lab explorer and accessible research map with real links.
- Project search with lab/status/method/topic filters. Cohort keyword/lab search and All/Open/Upcoming/Active/Completed controls.
- Publication topic/lab/type/year filters and editorial category navigation.
- Global structured search, open-library filters, event upcoming/past switch, episode and chapter directory contracts with honest empty states.
- Search/filter values persist in the URL and can be shared or reloaded.
- Seven contribution roles linked to existing external forms. Query-aware project/lab interest.
- Validated email-draft preparation with explicit unsent state, mail-app link, and downloadable draft. No local application database is invented.
- Hypothetical trading-cost sensitivity calculator with explicit units, one-way turnover convention, and limitations.
- Four-module self-guided reading course with device-local progress and a practical exercise. No credential or completed assessment is claimed.
- Two real downloadable Markdown resources: a research protocol worksheet and a claim-review checklist.
- Print/save-as-PDF for existing explainers.
- Route-specific titles, descriptions, OpenGraph, Twitter cards, canonical URLs, sitemap, and real prerendered content.

## 6. Preserved functionality

The Finance for All landing, Framer Motion interactions on that legacy page, theme preference, bounded analytics, safe member handoff helpers, organizational contact mailbox, seven existing application destinations, all twelve legacy project records, and full educational article text. No internal contact planning data or private phone numbers were imported.

## 7. Bugs found and fixed

- Replaced absent public research routes with concrete pages and clean-URL output.
- Fixed preview clean URLs receiving homepage HTML, which caused React hydration mismatches. Pages now emit path.html files compatible with Vercel cleanUrls and Vite preview.
- Fixed initial stylesheet selection accidentally picking the legacy theme instead of the research design system. A regression test now checks CSS isolation.
- Fixed dark-mode secondary-button contrast.
- Avoided Tailwind-reserved CSS layer names in the new native CSS design system.
- Added an accessible label to the preserved landing's mobile navigation trigger.
- Kept repository availability distinct from current activity; unknown projects are never automatically called active, published, or completed.

## 8. Verification

Baseline release:check passed before changes. Final verification receipts are recorded below and in evidence/rebuild-2026-09-21. Root source lint combines TypeScript unused-symbol checks with explicit source safety rules; this is not an ESLint claim. Automated tests validate all route files, H1/metadata, all rendered internal destinations, research relations and full denominators, legacy migration, honest empty collections, resource existence, forms, deployment fallbacks, and CSS isolation.

Final `npm run release:check` passed: source completion, accessibility source contracts, eight preserved CTA contracts, TypeScript, unused-symbol/source safety lint, client and prerender builds, all 11 tests, and release-output checks. Exact command output is in `evidence/rebuild-2026-09-21/release-check.txt`.

Browser verification used the built app at `http://127.0.0.1:4180`, through the Codex browser controls:

| Check | Result |
| --- | --- |
| Complete route/viewport sweep | 93 routes × 8 widths = 744 checks; one H1 per page and no document overflow |
| Requested widths | 320, 375, 390, 430, 768, 1024, 1280, 1440 |
| Measured CSS widths after compensating for existing browser zoom | 320, 375, 390, 430, 769, 1025, 1280, 1440; two widths differ by one CSS pixel |
| Latest component changes | 16 additional checks across home, library, resources, and FI-JEPA at four widths; all passed |
| Browser console | No warnings or errors in the clean verification tab |
| Navigation | Desktop and mobile keyboard opening, disclosure expansion, Escape closing, and focus return passed |
| Directories | Project search, combined filters, reload persistence, empty open-cohort results, and global search passed |
| Join form | Role/project context, minimum-length validation, and unsent draft generation passed; nothing submitted externally |
| Interactive tools | Cost calculator changed 6.80% to -4.00% at 100 bps; course progress persisted after reload and was reset |
| Theme | Light and dark layouts inspected; dark secondary-button contrast corrected |

The preserved Finance for All page has an intentionally horizontally scrollable tab row at 320 px; an offscreen tab was flagged by the element-bounds scan, while document width remained 320 px. The new research pages had no element-bounds findings. The complete sweep preceded the final small card/header changes; the 16 targeted checks verified those changes after the final build. These are browser and source checks, not a formal WCAG/Axe certification or measured production Core Web Vitals.

All seven existing Tally application URLs returned HTTP 200 with matching form titles; no submissions were sent. A fresh npm production audit returned 0 vulnerabilities. Public-source secret-pattern scanning found no matches; this is a bounded scan, not a penetration test. The nested member repository remains clean and unchanged.

The root uses system fonts, CSS diagrams, and no stock or remote images. Final research-page JS is approximately 306.9 kB raw / 94.7 kB gzip including React and the small member helper; the 142.35 kB Framer Motion legacy chunk is separate. Research CSS is 33.93 kB / 7.46 kB gzip. These are build sizes. Aggregate browser evidence is in `evidence/rebuild-2026-09-21/browser-qa.json`; source hashes and exact route output are in `dist/route-manifest.json`.

## 9. External blockers

- Deployment credentials and the canonical final production origin were not supplied for this rebuild. Existing default origin is retained and VITE_SITE_URL is configurable. No push or deployment was performed.
- VITE_MEMBER_APP_URL must be set to the verified member origin before a direct production account handoff is enabled. Without configuration it leads to the contact path.
- Live Supabase Auth/RLS, migration state, and account journeys were not recertified because that separate application was not changed.
- No confirmed roster, journal issues, empirical paper releases, podcast recordings, events, or operating chapter records are present. Their data models and directories are implemented with truthful empty states.

## 10. Human verification

Confirm lab ownership, cohort start dates/durations and lead capacity, fellowship eligibility and six-month calendar, SISTER details, current YEL/Sintika/Locked In/USAEO agreements, Zenipath development status, editorial authors and original publication dates, final publication/review policies, and any rights to release data or artifacts. The public wording identifies working frameworks and proposals.

FI-JEPA's local synthetic M1/E1 package and the separate public neural research repository are deliberately distinguished. No investment return, real-market efficacy, peer review, affiliation, institutional sponsorship, or operating venture fund is inferred.

Existing legal/privacy/guardian requirements for the member platform remain a release consideration. No unapproved legal policy has been invented in this rebuild.

## 11. Prioritized next steps

1. Review the current public content and confirm the actual program owners, intake windows, and attribution.
2. Set verified public/member origins, deploy the reviewed build, and verify headers, redirects, and deployed revision.
3. Populate the typed collections with real reviewed papers, rosters, events, episodes, and chapter evidence.
4. Complete the separate live member-platform privacy/safeguarding and credentialed Auth/RLS release gates.

## Visitor journeys

- Professor: homepage → research → project record → standards → source repository.
- ML student: homepage ML entry → ML lab → FinML Benchmark / FI-JEPA → standards → contextual Join path.
- Student: cohorts → fellowship / course / chapters / challenges → existing application path.
- Institutional partner: about → partner programs → industry research → collaboration contact.

All four paths are implemented without requiring account creation to inspect public content.

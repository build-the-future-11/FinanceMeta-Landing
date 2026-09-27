# FinanceMeta / Finance4All feature megachecklist

Prepared 24 September 2026. Scope: public FinanceMeta website and the Finance4All member portal. This is a proposed product backlog, not an implementation or deployment receipt. All 160 items are intentionally unchecked.

## Recommendation

Build a connected journey: discover a research question → learn the prerequisites → apply → collaborate → publish attributable work → return for the next activity. Prioritize completing this journey over adding more directories.

Start with production verification, shared public/member identities, resumable applications, persistent learning progress, project membership/tasks, and dependable notifications. Macro data, richer media, challenges, and AI become worthwhile once there is real content and operating capacity.

## Basis and existing capabilities

Reviewed current route registries, the public product pages, platform pages, learning catalog, portal research workspace, notification hooks, intake/settings source, README, and the September 21 institution-platform implementation report and verification receipt. The portal HEAD inspected was `0604470b6275973038e46151d1103e128da83652`, with substantial uncommitted work; HEAD alone does not identify the inspected source. No application source was changed or tests rerun for this planning task. Live production was not inspected.

Already present in local source or the checked-in implementation record:

| Area | Existing foundation | Recommended next increment |
| --- | --- | --- |
| Discovery | Research directories, query/filter/sort, shareable URLs, cards/table views, global search | Better cross-content discovery, comparisons and saved searches |
| Education | Released explainers, five reading pathways, an existing course with local progress | Account-synced progress, assessments and meaningful feedback |
| Membership | Authentication, onboarding, profiles, recovery, settings and account lifecycle | Production verification, useful profile records and clearer privacy controls |
| Applications | Research applications, native intake, receipts, review, export and withdrawal | Resumable drafts, clear timelines, requests for changes and enrollment handoff |
| Workspace | Current/accepted projects, deadlines, saved research and reviewer queues | Explicit memberships, tasks, milestones and project discussion |
| Events | Event directories, details and calendar export architecture | Actual confirmed events, capacity, waitlists and attendance workflows |
| Research publishing | Detail-page methods/limitations, artifact fields and citation/BibTeX functionality | Verified artifacts, release history and claim-level evidence |
| Communication | Notification center and read-state hooks | Reliable workflow triggers, delivery preferences and opt-in digests |
| Administration | Content and review surfaces | Publishing controls, previews, provenance and accountable operations |

The saved verification receipt explicitly states `productionCertified: false`. This is the state of that receipt, not a new live finding. Do not mistake the older `PROJECT_STATUS.md` or finish checklist for a fresh production audit. Public catalogs and portal entities need an explicit identity/publishing contract. Availability of real mentors, events, episodes, research results and licensed data is a separate dependency from building the interface.

## How to use this checklist

- **P0:** prerequisite before broad onboarding or dependent launches.
- **P1:** next product work with direct user value.
- **P2:** expand after the core journey works.
- **P3:** optional experiments requiring demand and operating capacity.
- **N:** proposed new capability; **E:** extend an existing foundation; **C:** real content or operating process; **V:** verify/harden existing behavior. N means not established in the reviewed scope, not a proof of absence everywhere.
- **S / M / L:** relative implementation size, not delivery estimates. L usually spans UI, persistence and operational work. Effort excludes waiting for content, providers and approvals.
- Priority applies to a section unless an item specifies otherwise. Dependency statements and acceptance checks apply to every item in that section. Assign a named owner when a slice is selected.

## 01. Release foundations — P0

- [ ] **F001 · V/M** Record reproducible source snapshots and exact deployed revisions for both the public site and member portal.
- [ ] **F002 · V/M** Verify canonical domains, sign-in handoffs, OAuth callbacks, email confirmation and password recovery against the deployed applications.
- [ ] **F003 · V/L** Certify the real member/applicant/reviewer/admin journeys, including denial of another account's private records and unauthorized role actions.
- [ ] **F004 · V/M** Reconcile deployed migrations and native-intake configuration; expose intake only after the deployed workflow passes verification.
- [ ] **F005 · E/L** Give public programs, projects, events and their member records stable shared identifiers with an explicit publishing/synchronization contract.
- [ ] **F006 · C/M** Assign owners for support, privacy requests, retention and participant eligibility, with program-specific safeguarding arrangements where needed.
- [ ] **F007 · E/M** Replace title-based sample-content exclusion with explicit publication states and provenance rules enforced at public publication boundaries.
- [ ] **F008 · V/M** Rehearse rollback and backup restoration, then document who handles authentication, intake and content incidents.

Dependencies: deployment access, reviewed source, accountable operators. Done when: evidence identifies the exact deployed revisions and actual controlled-account results; a successful local build alone cannot close these items.

## 02. Discovery and public navigation — P1

- [ ] **F009 · E/M** Expand global search to consistent results across projects, publications, lessons, programs and confirmed events, with content-type filters.
- [ ] **F010 · E/S** Add a clear starting path for learners, researchers, contributors and prospective organizers, each ending at an available action.
- [ ] **F011 · E/M** Add prerequisite, workload and availability filters to program discovery using authored fields rather than guessed classifications.
- [ ] **F012 · N/M** Compare two or three programs side by side by prerequisites, expected work, dates, cost if applicable and application state.
- [ ] **F013 · N/M** Save named search/filter views to a member account; retain the existing shareable URL behavior for anonymous visitors.
- [ ] **F014 · E/M** Add related-content links connecting a project to its prerequisite lessons, methods, publications and upcoming sessions.
- [ ] **F015 · E/S** Show authorship, content type, actual update date and availability consistently in directory results.
- [ ] **F016 · E/S** Make empty search results useful through spelling alternatives, filter removal and a route to relevant available material.

Dependencies: F005 for cross-surface identities; F007 for publication rules. Done when: deep links survive reload, search never returns private content, filters work on mobile and empty/error states remain distinct.

## 03. Learning platform — P1

- [ ] **F017 · E/L** Sync reading and module progress across devices; offer an explicit merge of existing browser-local progress after sign-in.
- [ ] **F018 · E/M** Add a continue-learning panel with the last lesson, next prerequisite and an explanation of the suggested next step.
- [ ] **F019 · N/M** Add a short optional diagnostic that recommends authored learning paths and lets the learner change the recommendation.
- [ ] **F020 · N/M** Add lesson quizzes with answer explanations, attempt history and links back to the relevant material.
- [ ] **F021 · N/M** Build a searchable financial/economic glossary with plain-language definitions, examples and lesson backlinks.
- [ ] **F022 · N/M** Add private lesson notes, bookmarks within a lesson and export, keeping notes private by default.
- [ ] **F023 · E/L** Turn existing practical exercises into submissions with published rubrics and feedback from an assigned reviewer.
- [ ] **F024 · N/M** Issue verifiable completion records only for actual completion against published criteria, with correction/revocation support and no accreditation implication.

Dependencies: reviewed curriculum, account ownership, assessment authors and reviewers; F024 follows F020/F023 and finalized completion rules. Done when: progress survives sign-out/device changes, attempts are attributable and completion reflects the stated criteria.

## 04. Interactive finance and economics tools — P2

- [ ] **F025 · N/M** Add a compound-growth explorer showing contributions, compounding frequency, inflation assumptions and downloadable scenario results.
- [ ] **F026 · N/M** Add a loan amortization explorer with principal/interest breakdowns, extra-payment scenarios and clearly stated rounding assumptions.
- [ ] **F027 · N/M** Add an inflation purchasing-power explorer with either labeled hypothetical inputs or attributed dated observations.
- [ ] **F028 · N/M** Add a bond price/yield/duration explorer showing how assumptions change the educational result.
- [ ] **F029 · N/M** Add a diversification/correlation exercise with explicitly labeled synthetic scenarios and explanations of concentration risk.
- [ ] **F030 · N/L** Add a valuation sensitivity worksheet with editable assumptions, scenario comparisons and formula transparency.
- [ ] **F031 · E/M** Extend the existing trading-cost tool with saved scenarios, parameter comparisons and reproducible exports.
- [ ] **F032 · N/M** Add a model-assumptions panel and accessible result table to every calculator, with input validation and reset controls.

Dependencies: reviewed formulas, meaningful boundary-case tests and clear educational scope. Done when: results match independently calculated examples, inputs are reproducible, charts have equivalent tables and no personalized trade recommendation is implied.

## 05. Member profiles and personal workspace — P1

- [ ] **F033 · E/M** Add structured research interests, skills and availability to profiles, separating self-described information from verified information.
- [ ] **F034 · E/M** Add optional ORCID, GitHub, website and publication links with URL validation and editable visibility.
- [ ] **F035 · E/M** Give members field-level controls over what is public, member-visible or private, with a preview of each view.
- [ ] **F036 · E/M** Create a contribution portfolio from accepted project memberships and attributed artifacts, with member consent for public display.
- [ ] **F037 · E/M** Add a next-actions panel combining incomplete onboarding, active applications, assigned tasks and upcoming commitments.
- [ ] **F038 · E/M** Organize saved items into private collections spanning projects, publications, lessons and events.
- [ ] **F039 · N/M** Add optional weekly goals and private self-reflection notes without public engagement rankings.
- [ ] **F040 · E/M** Surface account export/deletion request state and give members a clear route to recover a failed request.

Dependencies: F003, F005, F006 and real contribution records. Done when: visibility preferences are enforced on data access, exports contain only the requesting member's records and profile claims retain their verification status.

## 06. Applications and intake — P1

- [ ] **F041 · E/L** Add autosaved application drafts with a visible save state, draft deletion and resume across devices.
- [ ] **F042 · E/M** Reuse permitted profile fields across applications while requiring the applicant to review every submission.
- [ ] **F043 · E/M** Show an eligibility/preparation checklist based on the particular program's published requirements.
- [ ] **F044 · E/M** Add an applicant-visible status timeline for submitted, under review, changes requested, decision and withdrawal events.
- [ ] **F045 · N/L** Add requests for clarification and versioned resubmission without rewriting the original submitted answers.
- [ ] **F046 · E/M** Add reviewer assignment, conflict declarations and overdue-review queues with access limited to the assigned scope.
- [ ] **F047 · E/M** Add published decision rubrics, structured reviewer feedback and a final decision record.
- [ ] **F048 · N/L** Add acceptance confirmation, waitlist handling and a recorded enrollment/membership handoff after acceptance.

Dependencies: F003–F006; reviewer capacity and published selection process. Done when: drafts are private, repeat submissions cannot duplicate records, submitted versions are preserved and acceptance alone does not silently enroll someone.

## 07. Cohort and program delivery — P2

- [ ] **F049 · E/M** Publish confirmed cohort dates, timezone, capacity, workload, prerequisites and named responsible staff.
- [ ] **F050 · N/L** Add a cohort workspace with its syllabus, session schedule, readings and active announcements.
- [ ] **F051 · N/L** Add assignments with deadlines, artifact submission, late-state handling and attributable feedback.
- [ ] **F052 · N/M** Add mentor office-hour availability, booking, cancellation and timezone-safe confirmations.
- [ ] **F053 · N/M** Add attendance recording with a correction process and clearly limited visibility.
- [ ] **F054 · N/M** Add private cohort feedback and issue reporting routed to a named program operator.
- [ ] **F055 · E/M** Publish participant work only with contributor permission, artifact review and accurate completion status.
- [ ] **F056 · E/M** Add an outcomes page backed by defined measures and actual records, including incomplete or withdrawn participation where relevant.

Dependencies: F048 and real program staffing/schedule; F014 links content; F105–F112 provide reminders. Done when: a pilot cohort can complete an assignment-feedback cycle and published outcomes can be traced to consented records.

## 08. Research collaboration — P1

- [ ] **F057 · N/L** Create an explicit project membership ledger with invitation, acceptance, project roles, removal and retained history.
- [ ] **F058 · N/L** Add project tasks with assignees, status, due dates and a usable list/board interface.
- [ ] **F059 · N/M** Add milestones and deliverables with owner, evidence link, due date and acceptance state.
- [ ] **F060 · N/M** Add project-scoped discussion threads with edited-state markers, reporting and moderation controls.
- [ ] **F061 · N/M** Add a shared artifact register for datasets, protocols, notebooks and results, including version and access restrictions.
- [ ] **F062 · N/M** Link selected repository issues and pull requests to project work with manual linking as the first usable release.
- [ ] **F063 · N/M** Add weekly project updates with completed work, current obstacles, next commitments and explicit evidence links.
- [ ] **F064 · N/M** Add departure and handover workflows that transfer responsibilities and promptly revoke private project access.

Dependencies: F003, F005, F048; project role definitions. Done when: an invited member can join, complete an assigned deliverable and leave, while removed/nonmembers cannot access private project data.

## 09. Research evidence and reproducibility — P1

- [ ] **F065 · E/M** Add structured hypothesis, protocol status, outcome measures and declared analysis plan to eligible project records.
- [ ] **F066 · E/L** Attach immutable protocol versions and dated amendments so readers can distinguish planned analyses from later changes.
- [ ] **F067 · E/L** Add a dataset registry with source, rights/access conditions, coverage, release date, version and checksum.
- [ ] **F068 · E/M** Add executable reproduction instructions tied to an exact code revision, environment and input snapshot.
- [ ] **F069 · E/M** Show experiment results from retained run artifacts, including failed runs, baselines and uncertainty where appropriate.
- [ ] **F070 · E/M** Connect each headline research claim to its supporting artifact and stated limitation.
- [ ] **F071 · N/L** Add independent reproduction submissions and a review process that distinguishes independence from same-team reruns.
- [ ] **F072 · E/M** Make synthetic, historical backtest, paper-trading and realized-execution evidence visibly distinct wherever applicable.

Dependencies: actual research outputs and rights-cleared data. Done when: a reader can identify exactly what was tested and retrieve the supporting artifacts; missing evidence blocks stronger claims instead of being filled with illustrative results.

## 10. Publications and journal workflow — P2

- [ ] **F073 · E/M** Extend citation exports with consistent author identifiers, versions and `CITATION.cff` links for code/data artifacts where supplied.
- [ ] **F074 · E/L** Add manuscript submission with complete author, contribution, permission and conflict declarations.
- [ ] **F075 · N/L** Add editorial triage, reviewer invitations, scoped manuscript access and deadline tracking.
- [ ] **F076 · N/L** Add versioned review/revision rounds with a clear decision trail and author response records.
- [ ] **F077 · E/M** Add publication versions, corrections, withdrawals and retraction notices while retaining historical records.
- [ ] **F078 · E/M** Provide accessible HTML alongside released PDFs, including references, equations and equivalent figure descriptions.
- [ ] **F079 · E/M** Add topic/author/publication-series feeds and subscriptions that include only actually released records.
- [ ] **F080 · C/M** Establish editorial ownership, review scope and release criteria before presenting the journal as accepting submissions or peer reviewed.

Dependencies: F006, F065–F070 and real editorial capacity; F080 precedes opening F074. Done when: one real manuscript can move through the declared process and its page accurately states what review occurred. Citation-file interoperability is documented by [GitHub](https://docs.github.com/en/enterprise-cloud%40latest/repositories/managing-your-repositorys-settings-and-features/customizing-your-repository/about-citation-files).

## 11. Markets and macro data — P2

- [ ] **F081 · E/L** Add a provider-backed macro series adapter with documented usage rights, caching, quotas and source attribution.
- [ ] **F082 · N/M** Show observation date, publication/retrieval time, units, frequency and freshness separately for every displayed series.
- [ ] **F083 · N/L** Add an as-of-date/vintage selector for providers that support revision history, retaining the original and revised observations.
- [ ] **F084 · N/M** Add rebasing, date ranges and documented transformations for series comparison, rejecting incompatible comparisons.
- [ ] **F085 · N/M** Add downloadable observations with source, units, transformation and vintage metadata where redistribution is permitted.
- [ ] **F086 · E/L** Synchronize an economic-release calendar with official schedules, timezone handling and changed-release notices.
- [ ] **F087 · N/M** Add personal macro watchlists and explicit opt-in release alerts through the notification preferences system.
- [ ] **F088 · E/M** Link each series to a plain-language explainer and relevant research, with honest stale/unavailable states.

Dependencies: provider access and reviewed usage terms, F105–F112 for alerts. Start with macro observations before considering paid quote feeds. Done when: displayed values match the provider snapshot, revisions are distinguishable and outages never appear as current data. FRED documents [real-time periods](https://fred.stlouisfed.org/docs/api/fred/realtime_period.html) and [vintage dates](https://fred.stlouisfed.org/docs/api/fred/series_vintagedates.html); support and rights must be checked for each selected series/provider.

## 12. Events and sessions — P2

- [ ] **F089 · C/S** Publish the first confirmed event with host, agenda, timezone, participation conditions and a working registration route.
- [ ] **F090 · E/L** Add capacity-aware native RSVP, confirmation, cancellation and one-registration-per-person behavior.
- [ ] **F091 · N/L** Add a fair waitlist with expiring offers and race-safe capacity allocation.
- [ ] **F092 · E/M** Extend calendar exports with stable event identifiers and accurate reschedule/cancellation information.
- [ ] **F093 · N/M** Add configurable event reminders, timezone previews and reminder opt-out.
- [ ] **F094 · N/M** Add organizer attendance/check-in tools with a correction path and limited personal-data display.
- [ ] **F095 · E/M** Publish permission-cleared recordings, captions, transcripts, slides and related reading after an event.
- [ ] **F096 · N/M** Add participant feedback with organizer summaries and a way to report an event concern.

Dependencies: real hosts/venues, F005, F006 and F105–F112. Done when: a confirmed event completes registration through follow-up, a cancellation releases capacity correctly and a reschedule does not leave misleading calendar details.

## 13. Community, chapters and mentorship — P2

- [ ] **F097 · E/M** Add opt-in collaborator discovery by interests, skills, timezone and availability, with visibility controls.
- [ ] **F098 · E/M** Extend existing connection requests with a short introduction, rate limits, reporting and blocking.
- [ ] **F099 · N/L** Add mentor matching based on declared expertise, capacity and participant preferences, with human acceptance on both sides.
- [ ] **F100 · E/L** Add a chapter organizer workspace for approved leads, local activity records, resources and annual renewal.
- [ ] **F101 · E/M** Add chapter applications and review handoff that record approvals before enabling public chapter branding/listings.
- [ ] **F102 · N/L** Add moderated topic groups with pinned resources, named moderators and clear membership rules.
- [ ] **F103 · N/L** Add research/case challenges with actual organizers, published rubrics, submission deadlines and attributable outcomes.
- [ ] **F104 · E/M** Add a consent-based alumni/contributor directory showing actual participation and artifact-backed contributions.

Dependencies: F006, F035 and moderation capacity; mentorship/chapter participation involving minors needs an implemented operating process. Done when: members can control discovery, leave groups and report concerns, and an operator can resolve a real moderation case.

## 14. Notifications and email — P1

- [ ] **F105 · E/M** Extend the existing notification center with application decisions, review requests, project assignments and event changes.
- [ ] **F106 · N/L** Add authenticated transactional email delivery for receipts and workflow changes with retry and delivery-state recording.
- [ ] **F107 · E/M** Add per-category channel preferences, digest frequency and quiet hours, explaining essential account messages separately.
- [ ] **F108 · N/M** Add optional weekly digests containing only the member's visible activity and subscribed topics.
- [ ] **F109 · N/L** Add a real newsletter subscription service with confirmation, consent records, unsubscribe and suppression handling.
- [ ] **F110 · N/M** Add subscriptions to a specific project, publication series, cohort or event topic.
- [ ] **F111 · E/M** Make notification deep links preserve the intended destination through sign-in and handle removed records clearly.
- [ ] **F112 · N/M** Deduplicate workflow notifications and add operator visibility into bounces, failed delivery and retries.

Dependencies: F003, a configured sending service and an operator for delivery problems. Done when: each tested workflow emits the intended notification once, preferences and unsubscribes are honored, and private content never enters another recipient's message. Other sections referring to notification infrastructure depend on F105–F112.

## 15. Podcast and media — P2

- [ ] **F113 · C/M** Release the first permission-cleared podcast recording with guest attribution, references and a reviewed transcript.
- [ ] **F114 · E/M** Add an accessible player with keyboard controls, speed adjustment and opt-in third-party loading where relevant.
- [ ] **F115 · E/M** Add timestamped transcript navigation so selecting a passage jumps to the corresponding recording segment.
- [ ] **F116 · N/M** Add episode chapters, resume position and saved segments with transparent local/account storage behavior.
- [ ] **F117 · E/S** Add related lesson/project/publication links to each episode's show notes.
- [ ] **F118 · N/M** Publish a valid podcast RSS feed backed by released episodes and stable media enclosures.
- [ ] **F119 · E/M** Add guest/topic proposals through the existing intake system, with consent and a clear review state.
- [ ] **F120 · E/M** Add transcript correction submissions and an editor-controlled correction history.

Dependencies: real recordings, media rights, transcript review and content storage; F113 precedes archive expansion. Done when: an actual episode can be discovered, played, read and cited, including on keyboard-only and small-screen interfaces.

## 16. Editorial and administrative operations — P1

- [ ] **F121 · E/L** Add an editorial queue spanning public and member content, with an assigned owner and clear unpublished/published state.
- [ ] **F122 · E/M** Add draft previews and review approval before public publication; record who approved the released version.
- [ ] **F123 · E/M** Add prepublication validation for author attribution, dates, identifiers, required content and external artifact links.
- [ ] **F124 · E/M** Add content version history and rollback that retain who changed what and why.
- [ ] **F125 · N/M** Add scheduled publication/expiry for time-sensitive opportunities and events, with safe handling of timezone changes.
- [ ] **F126 · E/M** Add narrowly scoped editor, program-operator and moderator permissions where the real team needs them.
- [ ] **F127 · N/M** Add link/asset integrity reports with assigned fixes and a review path for moved or withdrawn resources.
- [ ] **F128 · E/M** Add dataset, image, recording and contributor-permission records to publishing checks before assets become public.

Dependencies: F005, F007 and named editors; F126 follows an actual permission matrix. Done when: an editor can prepare/review/publish/correct a record while an unauthorized account cannot publish it, and private drafts never leak through search or feeds.

## 17. Accessibility, mobile and localization — P1

- [ ] **F129 · V/M** Audit keyboard and screen-reader completion of search, sign-in, applications, review and course exercises, then fix barriers found.
- [ ] **F130 · E/M** Improve form error summaries, error-to-field links, save-state announcements and focus recovery after navigation.
- [ ] **F131 · V/M** Check mobile target sizes, visible focus, zoom, reflow and focus obstruction across real multi-step workflows.
- [ ] **F132 · E/M** Give every interactive chart and visualization equivalent tables, descriptions and non-color-only labels.
- [ ] **F133 · E/S** Add stable reading preferences for type size, line spacing and reduced motion, extending existing theme behavior.
- [ ] **F134 · E/M** Add lightweight reading/download modes and verify useful behavior on slow connections and transient failures.
- [ ] **F135 · N/L** Add translation infrastructure and a reviewed second-language content pilot, with clear untranslated-content fallback.
- [ ] **F136 · V/M** Test dates, numbers, currencies and timezones across locales without conflating display currency with conversion.

Dependencies: representative user journeys and translated content owners. Done when: users can complete the workflows with assistive technology and narrow layouts; automated scans alone are insufficient. Use [WCAG 2.2](https://www.w3.org/TR/wcag/) and its [Understanding guidance](https://www.w3.org/WAI/WCAG22/Understanding/) for acceptance criteria including accessible authentication and minimum target size.

## 18. Support, privacy and reliability — P1

- [ ] **F137 · E/M** Add an in-product help center covering accounts, applications, contributions, privacy requests and program participation.
- [ ] **F138 · E/M** Turn support inquiries into accountable tickets with receipt, owner, state and response history visible to the requester.
- [ ] **F139 · N/M** Add a member-visible service-status page driven by real monitored states and operator incident updates.
- [ ] **F140 · E/M** Add error reporting and alert routing that redact form answers, tokens and private research content.
- [ ] **F141 · E/L** Operationalize approved retention rules, consent-version changes and deletion/export requests with auditable completion states.
- [ ] **F142 · V/M** Exercise abuse controls on sign-up, drafts, applications, connections and reports, preserving usable recovery paths.
- [ ] **F143 · V/M** Test interrupted, retried and duplicate writes in applications, RSVP, enrollment and task completion.
- [ ] **F144 · V/M** Test backup/restore and incident recovery after meaningful workflow/schema changes, then retain dated results.

Dependencies: F006, F008, real support staffing and agreed service expectations. Done when: a support request or operational failure is detected, assigned and resolved without exposing private data or silently losing a user's submission.

## 19. Product measurement and discovery — P2

- [ ] **F145 · E/M** Measure the complete discovery → application → decision → participation journey using shared entity IDs and privacy-conscious events.
- [ ] **F146 · N/M** Measure first meaningful actions such as finishing a lesson or submitting an accepted deliverable, with explicit metric definitions.
- [ ] **F147 · E/M** Measure application drop-off by step and error category without collecting answer contents.
- [ ] **F148 · N/M** Measure course exercise performance and completion by content version to identify lessons needing improvement.
- [ ] **F149 · E/M** Add aggregate unsuccessful-search reports to guide content work while minimizing retention of identifying query text.
- [ ] **F150 · N/M** Add a lightweight feedback/request board with moderation, status and links to shipped changes.
- [ ] **F151 · C/S** Interview a small group of actual learners, applicants and project leads, then revise the backlog around observed obstacles.
- [ ] **F152 · N/M** Add a public changelog describing shipped user-facing improvements and known limitations tied to released versions.

Dependencies: F005, documented collection/retention rules and enough real usage to interpret the data. Done when: metric definitions can be reproduced from events, operational dashboards are restricted appropriately and no unsupported growth/outcome claim is published.

## 20. Optional AI and advanced tools — P3

- [ ] **F153 · N/L** Pilot a cited research-library assistant restricted to released, authorized material with links to the supporting passages.
- [ ] **F154 · N/L** Pilot a lesson tutor that explains concepts, checks comprehension and distinguishes source material from generated examples.
- [ ] **F155 · N/M** Add glossary/reading-level assistance that preserves the source meaning and lets the reader inspect the original text.
- [ ] **F156 · N/L** Add evidence-gap suggestions for project authors without automatically altering research claims or releasing content.
- [ ] **F157 · N/M** Suggest project/mentor matches with visible reasons, opt-out and human acceptance; do not automate admission decisions.
- [ ] **F158 · N/L** Pilot reproducible notebook execution only after sandboxing, resource limits, data permissions and cost controls are implemented.
- [ ] **F159 · N/L** Add a published evaluation set for factual grounding, abstention, access isolation and resistance to instructions embedded in retrieved material.
- [ ] **F160 · N/M** Add AI feedback/reporting, budget caps, minimal logs and controls for excluded/private content before opening any assistant broadly.

Dependencies: a useful real corpus, confirmed demand, scoped data use and an operating budget. F159/F160 are prerequisites for broad release of F153–F158. Done when: measured results on representative questions support the stated use, private data boundaries hold and unsupported questions receive an honest limitation. These are optional product hypotheses, not a promise of financial prediction or autonomous research validity.

## Suggested implementation sequence

| Wave | Concrete outcome | Starting items | Release proof |
| --- | --- | --- | --- |
| 0 | Trustworthy working member journey | F001–F008 | Exact deployed source plus controlled account/role journeys |
| 1A | Useful discovery with authoritative records | F009–F011, F014–F016, F121–F123 | A real program is published once and discovered consistently across surfaces |
| 1B | A learner returns and continues | F017, F018, F020, F021 | Real lesson, persistent progress, reviewed quiz and resumed session |
| 1C | An applicant submits and receives a traceable outcome | F041, F043–F048, F105–F107, F111–F112 | Draft → submission → review → decision → accepted handoff |
| 2 | A team produces an attributable output | F057–F059, F061, F064–F070 | Member joins, completes a deliverable and publishes supported evidence |
| 3 | Repeat participation through staffed activities | Selected F049–F056, F089–F096, F109–F110 | One actual cohort/event and tested opt-in communication |
| 4 | Expand according to observed demand | Selected tools, macro data, media, community and publishing items | Usage evidence plus verified content/provider/operating capacity |
| 5 | Evaluate optional AI | F153 or F154 together with F159–F160 | Passed scoped evaluation and explicit decision to expand or stop |

F129–F144 apply throughout the relevant releases; accessibility and reliability are not a final cleanup phase. F151 can happen early and should influence wave selection. Waves are sequencing suggestions, not estimates or a commitment to implement all 160 items.

## Best twelve next product slices

After the P0 foundations, prioritize: F017 account-synced learning; F018 continue learning; F020 explained quizzes; F041 resumable applications; F044 application timeline; F045 revision requests; F057 project memberships; F058 tasks; F059 deliverables; F070 claim-to-evidence links; F105 workflow notifications; F122 editorial preview/approval.

Implement each as a complete slice: actual content → permission-checked persistence → usable UI → loading/empty/error/retry behavior → meaningful verification → deployed receipt. Content-backed slices may be more valuable than another technically complete empty directory.

## Deferred unless a specific need is established

Do not prioritize brokerage execution, deposits, personalized investment recommendations, public trading-performance leaderboards, speculative credentials, unrestricted private messaging or AI trading signals. They do not advance the immediate education/research participation journey. Do not buy a live-data feed, announce a cohort, enable a newsletter form or publish partner claims before the corresponding provider, staff, delivery service or source evidence exists.

## Source pointers

- [Current institution-platform report](INSTITUTION_PLATFORM_2026-09-21.md), especially existing functionality, data gaps and production boundaries.
- [Saved verification receipt](../evidence/institution-platform-2026-09-21/verification.json), explicitly local and production-uncertified.
- [Public routes](../src/routes.ts), [public product pages](../src/product-pages.tsx), [platform detail pages](../src/platform-pages.tsx), [learning catalog](../src/content/learning.ts).
- [Member research workspace](../Finance4allLanding/src/pages/portal/ResearchWorkspace.tsx), [portal routes](../Finance4allLanding/src/routes/portal.ts), [notification hooks](../Finance4allLanding/src/hooks/portal/useNotifications.ts).
- [Native intake deployment notes](../Finance4allLanding/docs/PLATFORM_INTAKE.md) and [content operations](CONTENT_OPERATIONS.md).

External references above support specific implementation criteria. Priority, scope and product sequencing are recommendations based on this workspace review, not claims made by those sources.

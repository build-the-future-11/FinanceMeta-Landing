# Application conversion study v1

Read STATE.json before continuing and update it after every session. Preserve baseline.json, earlier releases, failures and revision history. This is a product evaluation, not a novel predictive model.

## Question and mechanism
Visitors currently face inconsistent general forms, a manuscript route that falls back to membership intake, and manual copy/paste. Explicit choices, a direct external form and carried public context should reduce avoidable work. Whether those changes improve participation is untested.

## Evidence available
The 15 October 2026 Tally snapshot covers the preceding 30 days. Older general intake: 27 recorded visits, 10 starts, 8 submissions. Current general intake: 8, 2, 1. Journal and forum each have one visit and no starts. New-form visits may be internal testing. No valid website-session denominator, qualified-applicant count or activation count is available. Do not pool form visitors as unique people. Do not infer a low website conversion rate from these counts.

## Model and implementation contract
One general intake is the default for prospective contributors. Journal and preprint submissions remain separate. Chapter and institutional collaboration proposals retain appropriate dedicated intake. Public applications do not require a FinanceMeta login. Only explicit role labels, public project/lab/call identifiers, allowlisted campaign tags and QA flags travel in URLs; essays, emails, manuscript URLs and credentials do not. Typed declarations cannot be silently preaccepted. No invented availability, fee, mentor, partnership or publication claim.

A form click is application_open, not completion. Completion comes from provider records. QA sessions use fm_qa=1; their site events are suppressed and forms retain that tag. Historical aggregate Tally metrics cannot retroactively remove unidentified QA visits. Analytics persistence is a separate integration gate. Provider counts alone cannot link qualified applications to unique website sessions.

## Development and bounded verification
Use at most three implementation/review rounds, each prompted by a recorded defect. Run existing hosted build, type, security and browser suites; keep failed receipts. Do not run large local builds below 512 MiB free plus speculative memory. No paid experiments or unsolicited outreach. Five to eight consenting usability participants may later attempt realistic route-selection tasks; none are recruited or represented as tested in this release.

Development task success: a participant selects the correct general/journal/forum route, reaches it without an account or copy/paste, and can explain the next step. Record task failure and assistance. Suggested practical target for this diagnostic pilot: at least 7 of 8 complete correctly. This is a usability criterion, not a population-level conversion claim.

## Prospective confirmation gate
Before a causal experiment, validate the session denominator, server/provider-confirmed submission signal, stable variant assignment, qualification rubric, ownership, privacy arrangements, sample-size calculation and practical minimum effect. Do not launch an underpowered A/B test from these tiny baseline counts. Freeze the code, dates, allocation, independent unit, sample size, exclusion rules and effect threshold in a versioned successor protocol BEFORE opening outcomes. Until then any post-release trend is descriptive and confounded by traffic source, season, new programs, form version and outreach.

Primary endpoint: confirmed suitable applications divided by eligible human application-page sessions, by route. Quality is judged against a frozen rubric; institutional prestige is not a quality proxy. Secondary outcomes: correct-route task success, starts per form visit, submissions per start, review delay and completion of a first agreed activity. Report numerator/denominator and interval; never call a redirect a verified submission. Traffic cohorts and repeated visitors must be handled in the frozen design.

## Falsification and disposition
Keep lower conversions, weaker submission quality, failures and zero counts. A lift in clicks without more suitable applications does not support the participation hypothesis. If results are inconclusive, retain that conclusion. A changed mechanism requires v2; never overwrite the v1 baseline to make a positive result. No prospective result, independent reproduction or research-complete checkpoint is currently claimed.

## Sources
Implementation behavior checked against Tally's official [hidden field documentation](https://tally.so/help/hidden-fields), [prefill documentation](https://tally.so/help/pre-populate-form-fields) and [webhook documentation](https://tally.so/help/webhooks) on 15 October 2026. No external conversion uplift estimate is asserted.

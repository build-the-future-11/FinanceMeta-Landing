# Publishing a research record

The public catalog is typed source under `src/content/`. It is deliberately separate from private member submissions. Never copy an applicant or private reviewer record into a public directory without consent and editorial review.

## Content contract

- `models.ts`: projects, protocols, labs, cohorts/curricula, publications, episodes, people, events, chapters and programs.
- `research.ts`: public records. Empty people, event, episode and chapter arrays mean no verified entry is available; they do not generate invented detail routes.
- `curricula.ts`: planning curricula for the existing six cohorts and five research/engineering tracks. These are draft expectations, not announced calendars.
- `editorial.ts`: full educational articles; generated `editorial-index.json` keeps article bodies out of ordinary page bundles.
- `programs.ts`: reusable program content and competition governance. Competition rubrics are explicitly drafts until a cycle is announced.
- `routes.ts`: fixed and generated paths. Events, episodes, people and chapters automatically receive real detail pages when a verified record is added.

Run `npm run release:check` after editing. The catalog validator checks uniqueness, relationship targets, URL protocols, dates/timezones, evidence boundaries, publication links and frozen preregistration artifacts. The build also checks internal links, page titles, heading hierarchy, metadata, CSS isolation and shared-script size. Automated validation cannot establish the truth of a claim; retain its source record and permissions in the editorial review.

## Release requirements

**Project:** assign the lab, status, dated evidence source, results and limitations. A draft protocol is an authoring framework, not preregistration. A preregistered record needs a frozen artifact and date. A published record needs an output link. Keep advisors and researchers empty until attribution is verified.

**Publication:** identify type, available attribution, date semantics, abstract, full text or downloadable artifact, methodology and limitations. Add PDF/code/data only when accessible and licensed. The current educational records use editorial review dates; their BibTeX deliberately does not invent original publication years or individual authors.

**Event:** use an IANA timezone, explicit offset-bearing `startsAt` and `endsAt`, confirmed status, format, location, hosts, agenda and registration. A cancelled event must not invite registration. Calendar exports require valid ordered instants. Event structured data is emitted only when the start, mode and location are present. Virtual locations must be HTTPS addresses.

**Episode:** provide a real recording, guest attribution, date, topics, source notes, highlights and transcript when available. The player opens on its provider rather than silently loading a third-party tracker. Guests must consent to publication; relate them to verified people/project records.

**Person:** obtain publication permission, identify role/contributions, and write each affiliation as a relationship, such as “student at” or “previously at.” A university or employer is not a platform sponsor.

**Chapter:** provide an accountable lead, verified status, governance, location and contact. Link actual programs/events/outputs. The organizer-supplied community map is not a register of operating chapters.

**Partnership:** establish scope, accountable people, permissions and dated supporting evidence before publishing a name or logo. Historical listing names alone are insufficient.

**Competition:** publish eligibility, dates/timezones, deliverables, judging weights, conflicts, permitted tools, accessibility, appeals and any prize/fee terms before opening registration. Trading exercises use simulated capital. Retain results only with attributable outputs and permissions.

## Native application bridge

Use `/apply?call=<id>` for the public entry. The native handoff remains disabled until the portal deployment is verified. Read `Finance4allLanding/docs/PLATFORM_INTAKE.md` for database and environment configuration. Private submissions never become published research merely because a reviewer accepts them.

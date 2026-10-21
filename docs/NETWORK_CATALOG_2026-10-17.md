# FinanceMeta / Finance4All catalog reconciliation

Reconciled 17 October 2026 for the public landing site. Source records retain their
16 October review dates; this reconciliation does not claim a new live form audit.

## Sources inspected

- `../finance4all-global-reach/src/content/programs.ts`: 22 public program records,
  reviewed lifecycle states, audiences, commitments, delivery gates, and qualified actions.
- `../finance4all-global-reach/src/content/events.ts`: seven public program launch notices.
- `../finance4all-global-reach/docs/EVENT_AND_PROGRAM_REGISTRY.md` and
  `EVENT_SOURCE_RECONCILIATION.md`: prior operating-plan, launch-kit and intake reconciliation.
- `../finance4all-global-reach/src/content/catalog.ts`: the public research catalog.
  Its 12 project identities already exist in the landing research architecture.
- `../FinanceMeta-Global/registry/programs.json`, `projects.json`, and
  `finance4all_4month_projects.json`: program evidence requirements and project records.
  The public 48-project snapshot is JSON-identical to the Global registry; it is preserved.
- Existing public landing curricula, proposed cohorts, programs and research routes.

## Published structure

`src/content/network-catalog.json` is a standalone public-content snapshot so the landing
site can build without sibling repositories. `network-routes.ts` contains its route metadata.
The complete records are lazy-loaded with the catalog pages. `/programs` now lists all
22 records, with family/status filters, alias search and detail pages. Existing proposed
cohorts and the comparison page remain accessible. `/events` lists seven plans with detail
pages; `/events/calendar` retains the confirmed-event calendar. Homepage discovery links
to these directories and the complete existing 48-project register.

Public portal-relative links are mapped to equivalent landing routes where available;
otherwise they explicitly point to the separate member site. All actions are selected
through the source catalog's action eligibility rules. Queued directions retain their
aliases and no enrollment action. No private document contents, organizer contact details,
responses or operational database rows were copied.

Five event plans are on hold; two await scheduling. None receives an invented date,
registration action or calendar export. No published event inventory, Supabase schema,
application response, program activation or research outcome is changed by this update.

For future refreshes, reconcile the source records before updating both snapshot and route
metadata; preserve verifiedAt, action eligibility and source links. Do not convert an open
interest form into confirmed delivery or remove holds without new evidence.

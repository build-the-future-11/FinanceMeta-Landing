# Flaw → cause → severity → repair → required evidence

| Flaw | Cause | Severity | Repair | Required evidence / current boundary |
| --- | --- | --- | --- | --- |
| Unknown visitor-to-application conversion | Missing certified site denominator and completion linkage | P0 | Identify exact form clicks; reconcile provider receipts with qualified review records | Real sessions and provider confirmations; not yet certified |
| Manuscript selection opens membership intake | Shared fallback ignored research-submission intent | P0 | Separate general, journal and preprint routes | Passed hosted routing checks; production revisions verified (RELEASE.md) |
| Multiple general biography forms | Portal and landing use different generations of intake | P0 | Route new general traffic to 5B7blP; preserve old form/responses | Released in all three sites; original form and responses preserved |
| Copy/paste handoff | Context remained only on the website | P0 | Allowlisted hidden role/project/call fields | Published hidden-field schemas and route tests; end-to-end completion attribution still unproven |
| Important actions follow a long narrative | Organization detail precedes task choice | P1 | Early three-way IYERN task choice; keep requested organization detail | Mobile and keyboard inspection |
| Duplicate manuscript descriptions | Full papers and additional essays repeat the same material | P1 | Allow section references; make institution, repeated methods and mentorship optional (plus forum keywords) | Published schema verified: 3 journal and 4 forum fields optional |
| Typed choices and consent | Connector previously rejected structured controls | P1 | Use editor for radio buttons and explicit unchecked consent | Published: 2 journal / 3 forum radio groups and 3 / 4 required unchecked consent boxes; old question IDs retained |
| Unclear offer and next step | Eligibility/capacity/timing mixed with aspirations | P1 | Preparation, outputs, availability and confirmation information next to action | No invented commitments; response window still open |
| No dependable review ownership | No recorded queue owner | P1 | Ryan owns decisions; assistant helps triage and draft notes | Manual queue records and receipt delivery not yet demonstrated |
| Institutional names lack inspectable output links | User-reported affiliations and program totals are not artifact evidence | P1 | Add only permissioned work and named contributions when supplied | Source/permission inventory remains open |
| Proposed programs have dead-end buttons | Program launch differs from general interest | P2 | Explain proposed status and offer general research interest | No claim of challenge registration or guaranteed cohort place |
| QA pollutes tiny samples | Test visits not identified historically | P1 | Carry fm_qa and suppress website analytics for marked sessions | Focused tests passed; fm_qa preserved in form schemas; old counts remain contaminated |
| Claiming success from tests | Engineering validation is not visitor behavior | P0 | Keep result INCONCLUSIVE pending real outcome data | Frozen prospective study and sufficient evidence |

Accessibility repair: portal challenge-panel links inherited a dark foreground on a dark background. The CSS now inherits the panel foreground; the unchanged Chromium, Firefox and WebKit accessibility checks pass. Earlier failed logs are retained in local release evidence.

Engineering release is complete. The P0 measurement and prospective-outcome rows remain open; no conversion uplift or scientific model improvement is claimed.

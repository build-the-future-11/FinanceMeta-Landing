# Union Project publishing

The production list in `src/union-data.ts` is empty because this source copy
contains no reviewed partnership records. Do not populate it from organisation
logos, a mention, an application, an unaffiliated program or test fixtures.

For each proposed entry, an authorised editor must verify:

1. The organisation's identity and official public HTTPS website.
2. Public evidence that specifically substantiates its relationship with FinanceMeta.
3. Permission to publish the name and relationship description. Set
   `publicationApproved` only after this review; keep private approval records private.
4. The exact scope and whether the relationship is Active or Past. A directory
   record must not imply endorsement, accreditation, guaranteed access or outcomes.
5. The review date and next review deadline (`YYYY-MM-DD`, UTC). Overdue, future-dated
   or unapproved records are hidden, including from direct detail links.
6. For each collaboration, the public title, description, destination, Open/Closed
   status and optional deadline. Past deadlines close calls after that UTC date;
   Past relationships cannot display Open calls. No deadline means editors must
   maintain closure manually within the record's review period.

Add a unique lowercase hyphenated slug and choose an existing focus category.
All URLs must be public HTTPS navigation destinations without embedded credentials,
nonstandard ports, IP literals or local hostnames. This syntactic guard does not
verify ownership or relationship evidence; editors must do that themselves.
Text is rendered as text, never as HTML. No logos or personal contact data are needed.

Run `npm test` and the release gate in the canonical Git checkout. Review each
record visually at `/#union/<slug>`, follow its evidence and opportunity links,
and check filtering on mobile. The record test rejects invalid or duplicate entries.
Review stale entries before deploying: this static site has no editorial service or
automated reminder system. A browser left open overnight should be reloaded.

Remove publication approval to withhold an entry; preserve evidence/history in
source control. A withheld or unknown detail URL shows an unavailable state.
Email proposals are composed in the visitor's own mail client; no message is sent
automatically and no delivery confirmation is claimed.

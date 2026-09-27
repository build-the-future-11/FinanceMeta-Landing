# FinanceMeta public release candidate

The public root is independent of `Finance4allLanding/`. Do not deploy or modify that member application as part of this static-site release. The root has no Git history; the release package uses file hashes and an immutable source archive as its local identity.

## Build and review

Use Node 22.23.2 (`.nvmrc`) and npm 10.9.8. In a fresh directory, extract the source archive, then run:

```sh
rtk npm ci
rtk npm run release:check
rtk npm run preview -- --host 127.0.0.1 --port 4180 --strictPort
```

`npm ci` uses the lockfile. The build derives article summaries from the canonical editorial source, produces 93 public routes, a 404 page, article downloads, sitemap, and a route hash manifest. Full article content remains in the HTML and is loaded as a separate client chunk on article pages. The social PNG is retained in source so a fresh machine does not redraw it with different fonts.

For browser accessibility review, run `rtk npm run qa:serve` and visit `http://127.0.0.1:4181/?__audit=1`. Use the audit button; Alt+Shift+A checks an open navigation menu without closing it. Receipts are saved locally under `evidence/improvements-2026-09-21/browser-audits/`. This server binds loopback, enforces its Host and same-origin report requests, and never enters the public output. Audit light/dark, desktop/mobile, open menus, filtered results, valid/invalid Join, article, course, calculator, and the legacy page. A successful automated scan does not establish complete WCAG conformance.

## Deployment gate

- Complete the post-change browser checks recorded as blocked in the improvement report.
- Confirm `VITE_SITE_URL` is the intended public HTTPS origin. The retained default is `https://finance-meta-landing.vercel.app`.
- Set `VITE_MEMBER_APP_URL` only to a verified member origin. Without it, member sign-in goes to Contact.
- Review attribution, program ownership, partner listings, intake dates, and privacy/safeguarding requirements before opening new intake.
- Review the source archive and all environment values locally. No real `.env`, credentials, nested repositories, or node_modules are included in the release archive.
- Keep the current known-good deployment ID and its artifact before changing production. The local pre-improvement source snapshot is a recovery aid, not proof of what is deployed.
- Use the existing reviewed hosting project and `vercel.json`: `npm ci`, `npm run release:check`, `dist`, clean URLs, 15 permanent redirects, security headers. No global 200 rewrite.
- After an authorized deployment, verify the configured domain, HTTPS, canonical URLs, real 404 status, redirects, CSP, immutable asset caching, downloads, application destinations, and member handoff. Compare deployed files to release hashes and record the deployment ID.

## Package and rollback

Run `rtk npm run release:package` only after the report accurately records verification. It runs the release gate, then creates `releases/<source-id>/` with `source.tar.gz`, `site.tar.gz`, evidence, `manifest.json`, and `SHA256SUMS`. Existing packages are never overwritten.

Verify an archive before use:

```sh
rtk proxy shasum -a 256 -c SHA256SUMS
```

To recover locally, extract a retained source archive into a new empty directory and repeat `npm ci` and the release checks. Preserve the current workspace. For production rollback, restore the recorded known-good hosting deployment, then repeat live checks. Do not restore databases or the separate member repository for a public-site rollback.

Browser verification was interrupted by unavailable admin-policy validation during this pass. The release package is a review candidate, not production certification.

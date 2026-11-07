# Finance4All challenge preparation workspace

Prepared 7 November 2026 on top of SpendSmarter draft PR #131, commit
`0ee2d88b778e074996a0bd33b66f8c631bb0bd94`.

## Problem and delivered behavior

The challenge index exposed four generic legacy formats while the canonical program
catalog also contained the investment-model, backtest-falsification and Open Markets
plans. Visitors could express interest but had no working space for preparing a
concrete research brief.

The index now uses the existing competition records and their recorded availability.
The economics and essay-format pages remain discoverable, and every existing route
is retained. A new `/challenges/prepare` page provides three practice tracks:
investment models, backtest falsification, and finance/economics research.

The editor covers the question, sources and information dates, baseline, method,
evaluation, robustness, limitations, and reproduction. Track changes preserve writing.
The checklist counts started sections; it does not assess quality, score an entry,
or certify evidence. No new competition schedule, eligibility, prize or registration
is announced.

Visitors can download a Markdown brief and a versioned JSON backup. Import checks
the complete bounded schema, rejects unsupported or malformed input, and requires
confirmation before replacing the current draft. Text remains in memory in the
current tab: it is not sent to a service, stored in a URL or automatically persisted.
An unsaved-work event guard complements the visible instruction to download before
leaving. Without JavaScript, the existing research-protocol worksheet remains usable.

The new route is loaded separately to preserve the shared-script budget. Its styles
are present in prerendered HTML. No dependency or deployment configuration changed.

Browser review also found a header accessible-name mismatch: the link label omitted
the visible FinanceMeta network text. The link now derives its name from visible text
with an offscreen home suffix. A narrow-screen footer layout adjustment separates the
brand and description that previously touched at phone widths.

## Verification

- Pinned runtime: Node 22.23.2 and npm 10.9.8. Dependencies installed from the unchanged
  lockfile using the available package cache.
- `npm run check:local`: 114 tests passed; source, accessibility contracts, funnel,
  lint, TypeScript, client/SSR build and 203 prerendered routes passed.
- Eight new tests cover independent drafts, Unicode and line-break round trips,
  maximum-size valid backups, malformed/unsupported/oversized import rejection,
  presence-only progress, review exports, canonical availability, and prerendering.
- Real Firefox interactions exercised directory navigation, all eight fields, actual
  Markdown and JSON downloads, track changes, import cancellation and confirmation,
  malformed input preservation, plain-text treatment of markup, keyboard navigation,
  the unsaved-work event guard and the no-JavaScript fallback.
- Six focused WCAG A/AA scans at 1440, 390 and 320 pixels in both themes had zero
  violations after the header repair. No horizontal document overflow or application
  page error was observed. Draft text was absent from recorded network request bodies.
- Desktop and phone captures were inspected for readable labels and usable controls.
  Theme scans wait for the existing 150 ms color transition to settle.

The browser harness runs locally with a process-scoped Firefox container setting;
it changes no browser profile, repository security policy or deployed setting.
Initial harness connection/context issues, the genuine label failure, and an early
scan during the theme transition are retained with local verification evidence.

## Release boundary

This work is a draft stacked on PR #131. It preserves the earlier reading-list and
SpendSmarter work and does not merge or deploy the site. Production identity and
program-operation holds remain separate. Automated checks establish the behavior
above; they do not establish improved applicant outcomes, cross-browser acceptance,
live submission capability or competition launch readiness.

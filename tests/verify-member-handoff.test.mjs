import assert from 'node:assert/strict';
import test from 'node:test';

import {
  LANDING_ORIGIN,
  extractModuleScriptUrls,
  validateExpectedMemberAppUrl,
  verifyMemberHandoffBundle,
} from '../scripts/verify-member-handoff.mjs';

const MEMBER_APP = 'https://finance4all.example.app/';
const VALID_BUNDLE = `
  const memberApp = "${MEMBER_APP}";
  const source = "utm_source";
  const sourceValue = "financemeta_landing";
  const medium = "utm_medium";
  const mediumValue = "cta";
  const campaign = "utm_campaign";
  const campaignValue = "member_handoff";
`;

test('expected member app must be public HTTPS and immutable enough for certification', () => {
  assert.equal(validateExpectedMemberAppUrl(MEMBER_APP).href, MEMBER_APP);

  for (const bad of [
    '',
    'http://finance4all.example.app/',
    'https://localhost:5173/',
    'https://127.0.0.1/',
    'https://user:pass@finance4all.example.app/',
    'https://finance4all.example.app/#preview',
    'not-a-url',
  ]) {
    assert.throws(() => validateExpectedMemberAppUrl(bad), /member handoff check failed/);
  }
});

test('production script discovery stays on the canonical landing origin', () => {
  const html = `<!doctype html><script type="module" src="/assets/index-abc123.js"></script>`;
  assert.deepEqual(extractModuleScriptUrls(html), [
    `${LANDING_ORIGIN}assets/index-abc123.js`,
  ]);

  assert.throws(
    () => extractModuleScriptUrls('<script src="https://evil.example/app.js"></script>'),
    /must stay on the landing origin/,
  );
  assert.throws(() => extractModuleScriptUrls('<main>No script</main>'), /no script bundle/);
});

test('deployed bundle must bind the exact expected member app and attribution contract', () => {
  assert.doesNotThrow(() =>
    verifyMemberHandoffBundle({ bundleText: VALID_BUNDLE, expectedMemberAppUrl: MEMBER_APP }),
  );

  assert.throws(
    () =>
      verifyMemberHandoffBundle({
        bundleText: VALID_BUNDLE.replace(MEMBER_APP, 'https://other.example.app/'),
        expectedMemberAppUrl: MEMBER_APP,
      }),
    /not bound to expected member application/,
  );

  assert.throws(
    () =>
      verifyMemberHandoffBundle({
        bundleText: VALID_BUNDLE.replace('member_handoff', 'different_campaign'),
        expectedMemberAppUrl: MEMBER_APP,
      }),
    /missing member-handoff marker member_handoff/,
  );
});

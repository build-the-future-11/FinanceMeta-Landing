import assert from 'node:assert/strict';
import test from 'node:test';

import {
  LANDING_ORIGIN,
  extractModuleScriptUrls,
  isPublicResolvedAddress,
  validateExpectedMemberAppUrl,
  verifyMemberHandoffBundle,
  verifyMemberHandoffBundles,
  verifyPublicMemberDns,
} from '../scripts/verify-member-handoff.mjs';
import { parsePublicMemberAppUrl } from '../src/member-handoff-policy.mjs';

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

const INVALID_MEMBER_APPS = [
  '',
  'http://finance4all.example.app/',
  'https://finance4all.example.app:8443/',
  'https://finance4all.example.app/app',
  'https://finance4all.example.app/?next=/portal',
  'https://localhost:5173/',
  'https://localhost./',
  'https://app.localhost/',
  'https://app.localhost./',
  'https://member.local/',
  'https://member.local./',
  'https://intranet/',
  'https://intranet./',
  'https://127.0.0.1/',
  'https://10.0.0.1/',
  'https://169.254.169.254/',
  'https://8.8.8.8/',
  'https://[::1]/',
  'https://[2001:4860:4860::8888]/',
  'https://user:pass@finance4all.example.app/',
  'https://finance4all.example.app/#preview',
  'not-a-url',
];

test('runtime and production verifier share the same public member-app URL policy', () => {
  assert.equal(parsePublicMemberAppUrl(MEMBER_APP)?.href, MEMBER_APP);
  assert.equal(validateExpectedMemberAppUrl(MEMBER_APP).href, MEMBER_APP);

  for (const bad of INVALID_MEMBER_APPS) {
    assert.equal(parsePublicMemberAppUrl(bad), null);
    assert.throws(() => validateExpectedMemberAppUrl(bad), /member handoff check failed/);
  }
});

test('production DNS certification accepts only public unicast addresses', async () => {
  for (const address of [
    '8.8.8.8',
    '1.1.1.1',
    '2001:4860:4860::8888',
    '2606:4700:4700::1111',
  ]) {
    assert.equal(isPublicResolvedAddress(address), true, address);
  }

  for (const address of [
    '',
    'not-an-ip',
    '0.0.0.0',
    '10.0.0.5',
    '100.64.0.1',
    '127.0.0.1',
    '169.254.169.254',
    '172.16.0.1',
    '192.168.1.1',
    '192.0.2.1',
    '198.18.0.1',
    '198.51.100.1',
    '203.0.113.1',
    '224.0.0.1',
    '::',
    '::1',
    'fc00::1',
    'fd12:3456::1',
    'fe80::1',
    'ff02::1',
    '2001:db8::1',
    '::ffff:127.0.0.1',
  ]) {
    assert.equal(isPublicResolvedAddress(address), false, address);
  }

  const publicResolver = async (hostname, options) => {
    assert.equal(hostname, 'finance4all.example.app');
    assert.deepEqual(options, { all: true, verbatim: true });
    return [
      { address: '8.8.8.8', family: 4 },
      { address: '2001:4860:4860::8888', family: 6 },
    ];
  };
  assert.deepEqual(await verifyPublicMemberDns(MEMBER_APP, publicResolver), [
    { address: '8.8.8.8', family: 4 },
    { address: '2001:4860:4860::8888', family: 6 },
  ]);

  await assert.rejects(
    verifyPublicMemberDns(MEMBER_APP, async () => [
      { address: '8.8.8.8', family: 4 },
      { address: '10.0.0.5', family: 4 },
    ]),
    /must resolve only to public unicast addresses/,
  );
  await assert.rejects(
    verifyPublicMemberDns(MEMBER_APP, async () => []),
    /DNS lookup returned no addresses/,
  );
  await assert.rejects(
    verifyPublicMemberDns(MEMBER_APP, async () => {
      const error = new Error('temporary resolution failure');
      error.code = 'EAI_AGAIN';
      throw error;
    }),
    /DNS lookup failed \(EAI_AGAIN\)/,
  );
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

test('production certification requires one individual bundle to contain the full contract', () => {
  assert.doesNotThrow(() =>
    verifyMemberHandoffBundles({
      bundles: ['const unrelated = true;', VALID_BUNDLE],
      expectedMemberAppUrl: MEMBER_APP,
    }),
  );

  const urlOnlyBundle = `const memberApp = "${MEMBER_APP}";`;
  const markersOnlyBundle = VALID_BUNDLE.replace(MEMBER_APP, '');
  assert.throws(
    () =>
      verifyMemberHandoffBundles({
        bundles: [urlOnlyBundle, markersOnlyBundle],
        expectedMemberAppUrl: MEMBER_APP,
      }),
    /no individual production script bundle contains the complete member-handoff contract/,
  );

  assert.throws(
    () => verifyMemberHandoffBundles({ bundles: [], expectedMemberAppUrl: MEMBER_APP }),
    /no production script bundles were supplied/,
  );
});

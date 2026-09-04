import assert from 'node:assert/strict';
import test from 'node:test';

import {
  EXPECTED_ORIGIN,
  EXPECTED_REVISION_URL,
  EXPECTED_SOCIAL_ALT,
  EXPECTED_SOCIAL_URL,
  validateTargetUrl,
  verifyHeaders,
  verifyHtml,
  verifyReleaseRevision,
  verifySocialAsset,
} from '../scripts/verify-live.mjs';

const REVISION = '0123456789abcdef0123456789abcdef01234567';

const validHeaders = () =>
  new Headers({
    'content-type': 'text/html; charset=utf-8',
    'strict-transport-security': 'max-age=63072000; includeSubDomains',
    'content-security-policy':
      "default-src 'self'; base-uri 'self'; frame-ancestors 'none'; object-src 'none'; script-src 'self'; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; font-src 'self' data:; connect-src 'self' https:; upgrade-insecure-requests",
    'x-content-type-options': 'nosniff',
    'referrer-policy': 'strict-origin-when-cross-origin',
    'permissions-policy': 'camera=(), microphone=(), geolocation=()',
    'x-frame-options': 'DENY',
  });

const validHtml = () => `<!doctype html>
<html>
  <head>
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <meta name="description" content="FinanceMeta release verification fixture" />
    <link rel="canonical" href="${EXPECTED_ORIGIN}" />
    <meta property="og:url" content="${EXPECTED_ORIGIN}" />
    <meta property="og:image" content="${EXPECTED_SOCIAL_URL}" />
    <meta property="og:image:alt" content="${EXPECTED_SOCIAL_ALT}" />
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:image" content="${EXPECTED_SOCIAL_URL}" />
    <meta name="twitter:image:alt" content="${EXPECTED_SOCIAL_ALT}" />
    <title>FinanceMeta — Release Fixture</title>
  </head>
</html>`;

test('canonical target accepts only the exact clean production origin', () => {
  assert.equal(validateTargetUrl(EXPECTED_ORIGIN).href, EXPECTED_ORIGIN);
  assert.equal(EXPECTED_REVISION_URL, `${EXPECTED_ORIGIN}release-revision.json`);
  for (const bad of [
    'http://finance-meta-landing.vercel.app/',
    'https://finance-meta-landing.vercel.app/preview',
    'https://finance-meta-landing.vercel.app/?x=1',
    'https://finance-meta-landing.vercel.app/#fragment',
    'https://user:pass@finance-meta-landing.vercel.app/',
  ]) {
    assert.throws(() => validateTargetUrl(bad), /live release check failed/);
  }
});

test('root response headers must match the hardened production contract', () => {
  assert.doesNotThrow(() => verifyHeaders(validHeaders()));

  const missingHsts = validHeaders();
  missingHsts.delete('strict-transport-security');
  assert.throws(() => verifyHeaders(missingHsts), /strict-transport-security/);

  const badContentType = validHeaders();
  badContentType.set('content-type', 'application/json');
  assert.throws(() => verifyHeaders(badContentType), /content-type must be text\/html/);
});

test('deployed HTML must retain canonical, social and mobile metadata', () => {
  assert.doesNotThrow(() => verifyHtml(validHtml()));

  assert.throws(
    () => verifyHtml(validHtml().replace(EXPECTED_ORIGIN, 'https://example.com/')),
    /canonical URL/,
  );
  assert.throws(
    () => verifyHtml(validHtml().replace('width=device-width', 'width=1024')),
    /viewport metadata/,
  );
  assert.throws(
    () => verifyHtml(validHtml().replace('summary_large_image', 'summary')),
    /Twitter card/,
  );
});

test('release revision response must identify the exact immutable source', () => {
  const headers = new Headers({ 'content-type': 'application/json; charset=utf-8' });
  const body = JSON.stringify({ service: 'finance-meta-landing', revision: REVISION });
  assert.doesNotThrow(() => verifyReleaseRevision({ headers, body, expectedRevision: REVISION }));

  assert.throws(
    () =>
      verifyReleaseRevision({
        headers,
        body: JSON.stringify({ service: 'finance-meta-landing', revision: '89abcdef0123456789abcdef0123456789abcdef' }),
        expectedRevision: REVISION,
      }),
    /does not match expected source/,
  );
  assert.throws(
    () =>
      verifyReleaseRevision({
        headers,
        body: JSON.stringify({ service: 'other', revision: REVISION }),
        expectedRevision: REVISION,
      }),
    /service must be finance-meta-landing/,
  );
  assert.throws(
    () =>
      verifyReleaseRevision({
        headers: new Headers({ 'content-type': 'text/plain' }),
        body,
        expectedRevision: REVISION,
      }),
    /content-type must be application\/json/,
  );
  assert.throws(
    () =>
      verifyReleaseRevision({
        headers,
        body: JSON.stringify({ service: 'finance-meta-landing', revision: REVISION, branch: 'main' }),
        expectedRevision: REVISION,
      }),
    /must contain only revision and service/,
  );
});

test('social asset requires SVG content type and exact committed bytes', () => {
  const bytes = Buffer.from('<svg width="1200" height="630"><title>FinanceMeta</title></svg>');
  assert.doesNotThrow(() =>
    verifySocialAsset({
      headers: new Headers({ 'content-type': 'image/svg+xml; charset=utf-8' }),
      bytes,
      expectedBytes: bytes,
    }),
  );

  assert.throws(
    () =>
      verifySocialAsset({
        headers: new Headers({ 'content-type': 'text/plain' }),
        bytes,
        expectedBytes: bytes,
      }),
    /content-type must be image\/svg\+xml/,
  );

  assert.throws(
    () =>
      verifySocialAsset({
        headers: new Headers({ 'content-type': 'image/svg+xml' }),
        bytes: Buffer.from('different'),
        expectedBytes: bytes,
      }),
    /does not match committed source/,
  );
});

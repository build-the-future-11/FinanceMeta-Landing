import { createHash } from 'node:crypto';
import { readFileSync } from 'node:fs';
import { pathToFileURL } from 'node:url';

import { resolveReleaseRevision, validateReleaseRevision } from './release-revision.mjs';

export const EXPECTED_ORIGIN = 'https://finance-meta-landing.vercel.app/';
export const EXPECTED_SOCIAL_URL = `${EXPECTED_ORIGIN}social-preview.svg`;
export const EXPECTED_REVISION_URL = `${EXPECTED_ORIGIN}release-revision.json`;
export const EXPECTED_SOCIAL_ALT = 'FinanceMeta — Understand finance. Build with it.';

const EXPECTED_HEADERS = new Map([
  ['strict-transport-security', 'max-age=63072000; includeSubDomains'],
  [
    'content-security-policy',
    "default-src 'self'; base-uri 'self'; frame-ancestors 'none'; object-src 'none'; script-src 'self'; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; font-src 'self' data:; connect-src 'self' https:; upgrade-insecure-requests",
  ],
  ['x-content-type-options', 'nosniff'],
  ['referrer-policy', 'strict-origin-when-cross-origin'],
  ['permissions-policy', 'camera=(), microphone=(), geolocation=()'],
  ['x-frame-options', 'DENY'],
]);

const fail = (message) => {
  throw new Error(`live release check failed: ${message}`);
};

const singleMatch = (html, regex, label) => {
  const matches = [...html.matchAll(regex)];
  if (matches.length !== 1) {
    fail(`HTML must contain exactly one ${label}; found ${matches.length}`);
  }
  const value = matches[0][1]?.trim();
  if (!value) {
    fail(`HTML contains an empty ${label}`);
  }
  return value;
};

export const validateTargetUrl = (rawUrl) => {
  let target;
  try {
    target = new URL(rawUrl);
  } catch {
    fail(`target must be a valid URL, found ${rawUrl}`);
  }
  if (target.href !== EXPECTED_ORIGIN) {
    fail(`target must be the canonical production origin ${EXPECTED_ORIGIN}, found ${target.href}`);
  }
  if (target.protocol !== 'https:' || target.username || target.password || target.search || target.hash) {
    fail('target must be a clean HTTPS origin without credentials, query, or fragment');
  }
  return target;
};

export const verifyHeaders = (headers) => {
  const contentType = headers.get('content-type')?.split(';', 1)[0]?.trim().toLowerCase();
  if (contentType !== 'text/html') {
    fail(`root content-type must be text/html, found ${contentType ?? 'missing'}`);
  }

  for (const [name, expected] of EXPECTED_HEADERS) {
    const actual = headers.get(name)?.trim();
    if (actual !== expected) {
      fail(`response header ${name} must be ${expected}, found ${actual ?? 'missing'}`);
    }
  }
};

export const verifyHtml = (html) => {
  const title = singleMatch(html, /<title>([^<]+)<\/title>/gi, 'title');
  if (!title.includes('FinanceMeta')) {
    fail('title must identify FinanceMeta');
  }

  singleMatch(
    html,
    /<meta\s+name=["']description["']\s+content=["']([^"']+)["']\s*\/?\s*>/gi,
    'meta description',
  );
  const viewport = singleMatch(
    html,
    /<meta\s+name=["']viewport["']\s+content=["']([^"']+)["']\s*\/?\s*>/gi,
    'viewport metadata',
  );
  if (!/\bwidth=device-width\b/i.test(viewport) || !/\binitial-scale=1(?:\.0)?\b/i.test(viewport)) {
    fail(`viewport metadata must bind device width and initial scale, found ${viewport}`);
  }

  const canonical = singleMatch(
    html,
    /<link\s+rel=["']canonical["']\s+href=["']([^"']+)["'][^>]*>/gi,
    'canonical link',
  );
  if (canonical !== EXPECTED_ORIGIN) {
    fail(`canonical URL must be ${EXPECTED_ORIGIN}, found ${canonical}`);
  }

  const ogUrl = singleMatch(
    html,
    /<meta\s+property=["']og:url["']\s+content=["']([^"']+)["']\s*\/?\s*>/gi,
    'Open Graph URL',
  );
  if (ogUrl !== EXPECTED_ORIGIN) {
    fail(`Open Graph URL must be ${EXPECTED_ORIGIN}, found ${ogUrl}`);
  }

  const ogImage = singleMatch(
    html,
    /<meta\s+property=["']og:image["']\s+content=["']([^"']+)["']\s*\/?\s*>/gi,
    'Open Graph image',
  );
  if (ogImage !== EXPECTED_SOCIAL_URL) {
    fail(`Open Graph image must be ${EXPECTED_SOCIAL_URL}, found ${ogImage}`);
  }

  const twitterCard = singleMatch(
    html,
    /<meta\s+name=["']twitter:card["']\s+content=["']([^"']+)["']\s*\/?\s*>/gi,
    'Twitter card',
  );
  if (twitterCard !== 'summary_large_image') {
    fail(`Twitter card must be summary_large_image, found ${twitterCard}`);
  }

  const twitterImage = singleMatch(
    html,
    /<meta\s+name=["']twitter:image["']\s+content=["']([^"']+)["']\s*\/?\s*>/gi,
    'Twitter image',
  );
  if (twitterImage !== EXPECTED_SOCIAL_URL) {
    fail(`Twitter image must be ${EXPECTED_SOCIAL_URL}, found ${twitterImage}`);
  }

  const ogAlt = singleMatch(
    html,
    /<meta\s+property=["']og:image:alt["']\s+content=["']([^"']+)["']\s*\/?\s*>/gi,
    'Open Graph image alt',
  );
  const twitterAlt = singleMatch(
    html,
    /<meta\s+name=["']twitter:image:alt["']\s+content=["']([^"']+)["']\s*\/?\s*>/gi,
    'Twitter image alt',
  );
  if (ogAlt !== EXPECTED_SOCIAL_ALT || twitterAlt !== EXPECTED_SOCIAL_ALT) {
    fail('social image alt metadata must match the approved FinanceMeta description');
  }
};

export const verifySocialAsset = ({ headers, bytes, expectedBytes }) => {
  const contentType = headers.get('content-type')?.split(';', 1)[0]?.trim().toLowerCase();
  if (contentType !== 'image/svg+xml') {
    fail(`social asset content-type must be image/svg+xml, found ${contentType ?? 'missing'}`);
  }
  const actualDigest = createHash('sha256').update(bytes).digest('hex');
  const expectedDigest = createHash('sha256').update(expectedBytes).digest('hex');
  if (actualDigest !== expectedDigest) {
    fail(`deployed social asset digest ${actualDigest} does not match committed source ${expectedDigest}`);
  }
};

export const verifyReleaseRevision = ({ headers, body, expectedRevision }) => {
  const contentType = headers.get('content-type')?.split(';', 1)[0]?.trim().toLowerCase();
  if (contentType !== 'application/json') {
    fail(`release revision content-type must be application/json, found ${contentType ?? 'missing'}`);
  }

  let payload;
  try {
    payload = JSON.parse(body);
  } catch {
    fail('release revision response must contain valid JSON');
  }
  if (!payload || typeof payload !== 'object' || Array.isArray(payload)) {
    fail('release revision response must contain one JSON object');
  }
  const keys = Object.keys(payload).sort();
  if (keys.join(',') !== 'revision,service') {
    fail(`release revision response must contain only revision and service; found ${keys.join(',')}`);
  }
  if (payload.service !== 'finance-meta-landing') {
    fail(`release revision service must be finance-meta-landing, found ${payload.service ?? 'missing'}`);
  }

  let revision;
  try {
    revision = validateReleaseRevision(payload.revision, 'deployed release revision');
    expectedRevision = validateReleaseRevision(expectedRevision, 'expected release revision');
  } catch (error) {
    fail(error.message);
  }
  if (revision !== expectedRevision) {
    fail(`deployed release revision ${revision} does not match expected source ${expectedRevision}`);
  }
};

const fetchWithoutRedirect = async (url) => {
  const response = await fetch(url, {
    redirect: 'manual',
    signal: AbortSignal.timeout(15_000),
    headers: { 'user-agent': 'FinanceMeta-release-verifier/1.1' },
  });
  if (response.status >= 300 && response.status < 400) {
    fail(`unexpected redirect ${response.status} from ${url}`);
  }
  return response;
};

export const runLiveVerification = async (
  rawUrl = EXPECTED_ORIGIN,
  expectedRevision = resolveReleaseRevision(),
) => {
  const target = validateTargetUrl(rawUrl);
  expectedRevision = validateReleaseRevision(expectedRevision, 'expected release revision');

  const rootResponse = await fetchWithoutRedirect(target.href);
  if (rootResponse.status !== 200) {
    fail(`root must return HTTP 200, found ${rootResponse.status}`);
  }
  verifyHeaders(rootResponse.headers);
  verifyHtml(await rootResponse.text());

  const revisionResponse = await fetchWithoutRedirect(EXPECTED_REVISION_URL);
  if (revisionResponse.status !== 200) {
    fail(`release revision must return HTTP 200, found ${revisionResponse.status}`);
  }
  verifyReleaseRevision({
    headers: revisionResponse.headers,
    body: await revisionResponse.text(),
    expectedRevision,
  });

  const socialResponse = await fetchWithoutRedirect(EXPECTED_SOCIAL_URL);
  if (socialResponse.status !== 200) {
    fail(`social asset must return HTTP 200, found ${socialResponse.status}`);
  }
  const deployedBytes = Buffer.from(await socialResponse.arrayBuffer());
  const expectedBytes = readFileSync('public/social-preview.svg');
  verifySocialAsset({ headers: socialResponse.headers, bytes: deployedBytes, expectedBytes });

  console.log(`FinanceMeta live release check passed for ${target.href} at ${expectedRevision}`);
};

if (process.argv[1] && pathToFileURL(process.argv[1]).href === import.meta.url) {
  await runLiveVerification(process.argv[2] ?? EXPECTED_ORIGIN, process.argv[3] ?? resolveReleaseRevision());
}

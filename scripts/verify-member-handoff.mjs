import { isIP } from 'node:net';
import { pathToFileURL } from 'node:url';

export const LANDING_ORIGIN = 'https://finance-meta-landing.vercel.app/';
const EXPECTED_MEMBER_APP_ENV = 'FINANCEMETA_EXPECTED_MEMBER_APP_URL';
const REQUIRED_HANDOFF_MARKERS = [
  'utm_source',
  'financemeta_landing',
  'utm_medium',
  'cta',
  'utm_campaign',
  'member_handoff',
];

const fail = (message) => {
  throw new Error(`member handoff check failed: ${message}`);
};

const normalizeHostname = (hostname) =>
  hostname.toLowerCase().replace(/^\[(.*)\]$/, '$1');

const isNonPublicHostname = (hostname) => {
  const normalized = normalizeHostname(hostname);
  return (
    isIP(normalized) !== 0 ||
    normalized === 'localhost' ||
    normalized.endsWith('.localhost') ||
    normalized.endsWith('.local') ||
    !normalized.includes('.')
  );
};

export const validateExpectedMemberAppUrl = (rawValue) => {
  const value = String(rawValue ?? '').trim();
  if (!value) {
    fail(`${EXPECTED_MEMBER_APP_ENV} must name the canonical member application URL`);
  }

  let url;
  try {
    url = new URL(value);
  } catch {
    fail(`expected member application URL is invalid: ${value}`);
  }

  if (
    url.protocol !== 'https:' ||
    isNonPublicHostname(url.hostname) ||
    url.username ||
    url.password ||
    url.hash
  ) {
    fail(
      'expected member application URL must be public DNS HTTPS without credentials or fragments',
    );
  }

  return url;
};

export const extractModuleScriptUrls = (html, baseUrl = LANDING_ORIGIN) => {
  const scripts = [];
  const regex = /<script\b[^>]*\bsrc=["']([^"']+)["'][^>]*>/gi;
  for (const match of html.matchAll(regex)) {
    const resolved = new URL(match[1], baseUrl);
    if (resolved.origin !== new URL(baseUrl).origin) {
      fail(`production script must stay on the landing origin; found ${resolved.href}`);
    }
    scripts.push(resolved.href);
  }
  if (scripts.length === 0) {
    fail('production HTML exposes no script bundle to inspect');
  }
  return [...new Set(scripts)];
};

export const verifyMemberHandoffBundle = ({ bundleText, expectedMemberAppUrl }) => {
  const expected = validateExpectedMemberAppUrl(expectedMemberAppUrl);
  const candidates = new Set([
    expected.href,
    expected.href.endsWith('/') ? expected.href.slice(0, -1) : `${expected.href}/`,
  ]);
  if (![...candidates].some((candidate) => bundleText.includes(candidate))) {
    fail(`deployed bundle is not bound to expected member application ${expected.href}`);
  }

  for (const marker of REQUIRED_HANDOFF_MARKERS) {
    if (!bundleText.includes(marker)) {
      fail(`deployed bundle is missing member-handoff marker ${marker}`);
    }
  }
};

const fetchWithoutRedirect = async (url) => {
  const response = await fetch(url, {
    redirect: 'manual',
    signal: AbortSignal.timeout(15_000),
    headers: { 'user-agent': 'FinanceMeta-member-handoff-verifier/1.0' },
  });
  if (response.status >= 300 && response.status < 400) {
    fail(`unexpected redirect ${response.status} from ${url}`);
  }
  return response;
};

export const runMemberHandoffVerification = async (
  expectedMemberAppUrl = process.env[EXPECTED_MEMBER_APP_ENV],
) => {
  const expected = validateExpectedMemberAppUrl(expectedMemberAppUrl);

  const rootResponse = await fetchWithoutRedirect(LANDING_ORIGIN);
  if (rootResponse.status !== 200) {
    fail(`landing root must return HTTP 200, found ${rootResponse.status}`);
  }
  const html = await rootResponse.text();
  const scriptUrls = extractModuleScriptUrls(html);

  const bundleParts = [];
  for (const scriptUrl of scriptUrls) {
    const response = await fetchWithoutRedirect(scriptUrl);
    if (response.status !== 200) {
      fail(`production script ${scriptUrl} must return HTTP 200, found ${response.status}`);
    }
    const contentType = response.headers.get('content-type')?.split(';', 1)[0]?.trim().toLowerCase();
    if (!['application/javascript', 'text/javascript'].includes(contentType ?? '')) {
      fail(`production script ${scriptUrl} must be JavaScript, found ${contentType ?? 'missing'}`);
    }
    bundleParts.push(await response.text());
  }

  verifyMemberHandoffBundle({
    bundleText: bundleParts.join('\n'),
    expectedMemberAppUrl: expected.href,
  });

  console.log(`FinanceMeta member handoff check passed: ${LANDING_ORIGIN} -> ${expected.href}`);
};

if (process.argv[1] && pathToFileURL(process.argv[1]).href === import.meta.url) {
  await runMemberHandoffVerification(process.argv[2] ?? process.env[EXPECTED_MEMBER_APP_ENV]);
}

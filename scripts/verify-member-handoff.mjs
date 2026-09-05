import { lookup } from 'node:dns/promises';
import { isIP } from 'node:net';
import { pathToFileURL } from 'node:url';

import { parsePublicMemberAppUrl } from '../src/member-handoff-policy.mjs';

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

export const validateExpectedMemberAppUrl = (rawValue) => {
  const value = String(rawValue ?? '').trim();
  if (!value) {
    fail(`${EXPECTED_MEMBER_APP_ENV} must name the canonical member application URL`);
  }

  const url = parsePublicMemberAppUrl(value);
  if (!url) {
    fail(
      'expected member application URL must be public DNS HTTPS without credentials or fragments',
    );
  }

  return url;
};

const isNonPublicIpv4 = (address) => {
  const octets = address.split('.').map(Number);
  if (octets.length !== 4 || octets.some((octet) => !Number.isInteger(octet))) return true;
  const [a, b, c] = octets;
  return (
    a === 0 ||
    a === 10 ||
    a === 127 ||
    (a === 100 && b >= 64 && b <= 127) ||
    (a === 169 && b === 254) ||
    (a === 172 && b >= 16 && b <= 31) ||
    (a === 192 && b === 0 && c === 0) ||
    (a === 192 && b === 0 && c === 2) ||
    (a === 192 && b === 168) ||
    (a === 198 && (b === 18 || b === 19)) ||
    (a === 198 && b === 51 && c === 100) ||
    (a === 203 && b === 0 && c === 113) ||
    a >= 224
  );
};

const isNonPublicIpv6 = (address) => {
  const normalized = address.toLowerCase();
  if (normalized === '::' || normalized === '::1') return true;

  const mappedIpv4 = normalized.match(/::ffff:(\d+\.\d+\.\d+\.\d+)$/)?.[1];
  if (mappedIpv4) return isNonPublicIpv4(mappedIpv4);

  const firstHextet = Number.parseInt(normalized.split(':', 1)[0] || '0', 16);
  if (!Number.isFinite(firstHextet)) return true;

  return (
    (firstHextet & 0xfe00) === 0xfc00 ||
    (firstHextet & 0xffc0) === 0xfe80 ||
    (firstHextet & 0xff00) === 0xff00 ||
    normalized === '2001:db8::' ||
    normalized.startsWith('2001:db8:')
  );
};

export const isPublicResolvedAddress = (address) => {
  const value = String(address ?? '').trim();
  const family = isIP(value);
  if (family === 4) return !isNonPublicIpv4(value);
  if (family === 6) return !isNonPublicIpv6(value);
  return false;
};

export const verifyPublicMemberDns = async (
  expectedMemberAppUrl,
  resolver = lookup,
) => {
  const expected = validateExpectedMemberAppUrl(expectedMemberAppUrl);
  let records;
  try {
    records = await resolver(expected.hostname, { all: true, verbatim: true });
  } catch (error) {
    const detail = error instanceof Error && error.code ? ` (${error.code})` : '';
    fail(`member application DNS lookup failed${detail}`);
  }

  if (!Array.isArray(records) || records.length === 0) {
    fail('member application DNS lookup returned no addresses');
  }

  const invalid = records.filter((record) => !isPublicResolvedAddress(record?.address));
  if (invalid.length > 0) {
    fail('member application DNS must resolve only to public unicast addresses');
  }

  return records.map((record) => ({ address: record.address, family: record.family }));
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

export const verifyMemberHandoffBundles = ({ bundles, expectedMemberAppUrl }) => {
  const expected = validateExpectedMemberAppUrl(expectedMemberAppUrl);
  if (!Array.isArray(bundles) || bundles.length === 0) {
    fail('no production script bundles were supplied for member-handoff certification');
  }

  for (const bundleText of bundles) {
    try {
      verifyMemberHandoffBundle({
        bundleText: String(bundleText ?? ''),
        expectedMemberAppUrl: expected.href,
      });
      return;
    } catch (error) {
      if (!(error instanceof Error) || !error.message.startsWith('member handoff check failed:')) {
        throw error;
      }
    }
  }

  fail(
    `no individual production script bundle contains the complete member-handoff contract for ${expected.href}`,
  );
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
  await verifyPublicMemberDns(expected.href);

  const rootResponse = await fetchWithoutRedirect(LANDING_ORIGIN);
  if (rootResponse.status !== 200) {
    fail(`landing root must return HTTP 200, found ${rootResponse.status}`);
  }
  const html = await rootResponse.text();
  const scriptUrls = extractModuleScriptUrls(html);

  const bundles = [];
  for (const scriptUrl of scriptUrls) {
    const response = await fetchWithoutRedirect(scriptUrl);
    if (response.status !== 200) {
      fail(`production script ${scriptUrl} must return HTTP 200, found ${response.status}`);
    }
    const contentType = response.headers.get('content-type')?.split(';', 1)[0]?.trim().toLowerCase();
    if (!['application/javascript', 'text/javascript'].includes(contentType ?? '')) {
      fail(`production script ${scriptUrl} must be JavaScript, found ${contentType ?? 'missing'}`);
    }
    bundles.push(await response.text());
  }

  verifyMemberHandoffBundles({
    bundles,
    expectedMemberAppUrl: expected.href,
  });

  console.log(`FinanceMeta member handoff check passed: ${LANDING_ORIGIN} -> ${expected.href}`);
};

if (process.argv[1] && pathToFileURL(process.argv[1]).href === import.meta.url) {
  await runMemberHandoffVerification(process.argv[2] ?? process.env[EXPECTED_MEMBER_APP_ENV]);
}

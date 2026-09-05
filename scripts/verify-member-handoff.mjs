import { lookup } from 'node:dns/promises';
import { isIP } from 'node:net';
import { pathToFileURL } from 'node:url';

import { parsePublicMemberAppUrl } from '../src/member-handoff-policy.mjs';

export const LANDING_ORIGIN = 'https://finance-meta-landing.vercel.app/';
export const MAX_LANDING_HTML_BYTES = 2 * 1024 * 1024;
export const MAX_SCRIPT_BUNDLE_BYTES = 16 * 1024 * 1024;
export const MAX_SCRIPT_BUNDLES = 64;
export const MAX_TOTAL_SCRIPT_BUNDLE_BYTES = 64 * 1024 * 1024;
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
  if (
    octets.length !== 4 ||
    octets.some((octet) => !Number.isInteger(octet) || octet < 0 || octet > 255)
  ) {
    return true;
  }
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

const ipv6ToBigInt = (address) => {
  const normalized = String(address).toLowerCase();
  const halves = normalized.split('::');
  if (halves.length > 2) return null;

  const parseHalf = (half) => {
    if (!half) return [];
    const groups = [];
    for (const token of half.split(':')) {
      if (!token) return null;
      if (token.includes('.')) {
        const octets = token.split('.').map(Number);
        if (
          octets.length !== 4 ||
          octets.some((octet) => !Number.isInteger(octet) || octet < 0 || octet > 255)
        ) {
          return null;
        }
        groups.push((octets[0] << 8) | octets[1]);
        groups.push((octets[2] << 8) | octets[3]);
        continue;
      }
      if (!/^[0-9a-f]{1,4}$/.test(token)) return null;
      groups.push(Number.parseInt(token, 16));
    }
    return groups;
  };

  const left = parseHalf(halves[0]);
  const right = parseHalf(halves[1] ?? '');
  if (!left || !right) return null;

  let groups;
  if (halves.length === 1) {
    if (left.length !== 8) return null;
    groups = left;
  } else {
    const missing = 8 - left.length - right.length;
    if (missing < 1) return null;
    groups = [...left, ...Array(missing).fill(0), ...right];
  }
  if (groups.length !== 8) return null;

  return groups.reduce((value, group) => (value << 16n) | BigInt(group), 0n);
};

const ipv6InPrefix = (addressValue, prefix, prefixLength) => {
  const prefixValue = ipv6ToBigInt(prefix);
  if (addressValue === null || prefixValue === null) return false;
  const shift = BigInt(128 - prefixLength);
  return (addressValue >> shift) === (prefixValue >> shift);
};

const ipv4FromLow32 = (addressValue) => {
  const low = Number(addressValue & 0xffffffffn);
  return [
    (low >>> 24) & 0xff,
    (low >>> 16) & 0xff,
    (low >>> 8) & 0xff,
    low & 0xff,
  ].join('.');
};

const NON_PUBLIC_IPV6_PREFIXES = [
  ['::', 96],
  ['64:ff9b:1::', 48],
  ['100::', 64],
  ['100:0:0:1::', 64],
  ['2001:2::', 48],
  ['2001:10::', 28],
  ['2001:db8::', 32],
  ['3fff::', 20],
  ['5f00::', 16],
  ['fc00::', 7],
  ['fe80::', 10],
  ['fec0::', 10],
  ['ff00::', 8],
];

const isNonPublicIpv6 = (address) => {
  const normalized = address.toLowerCase();
  const addressValue = ipv6ToBigInt(normalized);
  if (addressValue === null) return true;
  if (normalized === '::' || normalized === '::1') return true;

  // IPv4-mapped IPv6 addresses are explicitly non-forwardable/non-global in
  // the IANA special-purpose registry, even when the embedded IPv4 address is
  // itself public. A DNS AAAA record must therefore never pass through them.
  if (ipv6InPrefix(addressValue, '::ffff:0:0', 96)) return true;

  // The well-known NAT64 prefix is globally reachable, but only when the
  // embedded IPv4 destination is itself public. Inspect the low 32 bits so hex
  // tail forms such as 64:ff9b::a00:1 cannot bypass the IPv4 safety policy.
  if (ipv6InPrefix(addressValue, '64:ff9b::', 96)) {
    return isNonPublicIpv4(ipv4FromLow32(addressValue));
  }

  // IPv6 text can also end in dotted IPv4 notation in compatible/translation
  // forms. Classify that tail directly in addition to the binary prefix rules.
  const embeddedIpv4 = normalized.match(/(?:^|:)(\d{1,3}(?:\.\d{1,3}){3})$/)?.[1];
  if (embeddedIpv4 && isNonPublicIpv4(embeddedIpv4)) return true;

  return NON_PUBLIC_IPV6_PREFIXES.some(([prefix, prefixLength]) =>
    ipv6InPrefix(addressValue, prefix, prefixLength),
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

  const uniqueScripts = [...new Set(scripts)];
  if (uniqueScripts.length > MAX_SCRIPT_BUNDLES) {
    fail(`production HTML exposes more than ${MAX_SCRIPT_BUNDLES} script bundles`);
  }
  return uniqueScripts;
};

export const assertBundleCollectionBounds = (
  bundles,
  maxBytes = MAX_TOTAL_SCRIPT_BUNDLE_BYTES,
) => {
  if (!Array.isArray(bundles)) {
    throw new TypeError('bundles must be an array');
  }
  if (!Number.isSafeInteger(maxBytes) || maxBytes < 1) {
    throw new TypeError('maxBytes must be a positive safe integer');
  }
  if (bundles.length > MAX_SCRIPT_BUNDLES) {
    fail(`more than ${MAX_SCRIPT_BUNDLES} production script bundles were supplied`);
  }

  const encoder = new TextEncoder();
  let totalBytes = 0;
  for (const bundle of bundles) {
    totalBytes += encoder.encode(String(bundle ?? '')).byteLength;
    if (totalBytes > maxBytes) {
      fail(`production script bundles exceed ${maxBytes} byte aggregate verification limit`);
    }
  }
  return totalBytes;
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
  assertBundleCollectionBounds(bundles);

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

export const readResponseTextBounded = async (response, maxBytes, label) => {
  if (!Number.isSafeInteger(maxBytes) || maxBytes < 1) {
    throw new TypeError('maxBytes must be a positive safe integer');
  }

  const rawLength = response.headers.get('content-length');
  if (rawLength && /^\d+$/.test(rawLength)) {
    const declaredLength = Number(rawLength);
    if (Number.isSafeInteger(declaredLength) && declaredLength > maxBytes) {
      fail(`${label} exceeds ${maxBytes} byte verification limit`);
    }
  }

  if (!response.body) {
    const text = await response.text();
    if (new TextEncoder().encode(text).byteLength > maxBytes) {
      fail(`${label} exceeds ${maxBytes} byte verification limit`);
    }
    return text;
  }

  const reader = response.body.getReader();
  const decoder = new TextDecoder();
  let totalBytes = 0;
  let text = '';

  try {
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      totalBytes += value.byteLength;
      if (totalBytes > maxBytes) {
        await reader.cancel();
        fail(`${label} exceeds ${maxBytes} byte verification limit`);
      }
      text += decoder.decode(value, { stream: true });
    }
    text += decoder.decode();
    return text;
  } finally {
    reader.releaseLock();
  }
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
  const html = await readResponseTextBounded(
    rootResponse,
    MAX_LANDING_HTML_BYTES,
    'landing HTML',
  );
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
    bundles.push(
      await readResponseTextBounded(
        response,
        MAX_SCRIPT_BUNDLE_BYTES,
        `production script ${scriptUrl}`,
      ),
    );
    assertBundleCollectionBounds(bundles);
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

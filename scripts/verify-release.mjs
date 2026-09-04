import { existsSync, readFileSync } from 'node:fs';

import { resolveReleaseRevision, validateReleaseRevision } from './release-revision.mjs';

const fail = (message) => {
  throw new Error(`release check failed: ${message}`);
};

const requiredFiles = [
  'dist/index.html',
  'dist/favicon.ico',
  'dist/social-preview.svg',
  'dist/release-revision.json',
  'public/favicon.ico',
  'public/social-preview.svg',
  'tailwind.config.js',
  'vercel.json',
];
for (const file of requiredFiles) {
  if (!existsSync(file)) {
    fail(`missing ${file}`);
  }
}

if (existsSync('tailwind_config.js')) {
  fail('duplicate tailwind_config.js must not coexist with tailwind.config.js');
}

const expectedRevision = resolveReleaseRevision();
let revisionPayload;
try {
  revisionPayload = JSON.parse(readFileSync('dist/release-revision.json', 'utf8'));
} catch (error) {
  fail(`dist/release-revision.json must contain valid JSON: ${error.message}`);
}
if (!revisionPayload || typeof revisionPayload !== 'object' || Array.isArray(revisionPayload)) {
  fail('dist/release-revision.json must contain one JSON object');
}
const revisionKeys = Object.keys(revisionPayload).sort();
if (revisionKeys.join(',') !== 'revision,service') {
  fail(`dist/release-revision.json must contain only revision and service; found ${revisionKeys.join(',')}`);
}
if (revisionPayload.service !== 'finance-meta-landing') {
  fail(`release service must be finance-meta-landing, found ${revisionPayload.service ?? 'missing'}`);
}
let builtRevision;
try {
  builtRevision = validateReleaseRevision(revisionPayload.revision, 'built release revision');
} catch (error) {
  fail(error.message);
}
if (builtRevision !== expectedRevision) {
  fail(`built release revision ${builtRevision} does not match expected source ${expectedRevision}`);
}

const html = readFileSync('dist/index.html', 'utf8');

const singleMatch = (regex, label) => {
  const matches = [...html.matchAll(regex)];
  if (matches.length !== 1) {
    fail(`built HTML must contain exactly one ${label}; found ${matches.length}`);
  }
  const value = matches[0][1]?.trim();
  if (!value) {
    fail(`built HTML contains an empty ${label}`);
  }
  return value;
};

const expectedOrigin = 'https://finance-meta-landing.vercel.app/';
const expectedSocialUrl = `${expectedOrigin}social-preview.svg`;
const expectedSocialAlt = 'FinanceMeta — Understand finance. Build with it.';
const title = singleMatch(/<title>([^<]+)<\/title>/gi, 'title');
if (!title.includes('FinanceMeta')) {
  fail('built HTML title must identify FinanceMeta');
}

singleMatch(
  /<meta\s+name=["']description["']\s+content=["']([^"']+)["']\s*\/?\s*>/gi,
  'meta description',
);
const canonical = singleMatch(
  /<link\s+rel=["']canonical["']\s+href=["']([^"']+)["'][^>]*>/gi,
  'canonical link',
);
if (canonical !== expectedOrigin) {
  fail(`canonical URL must be ${expectedOrigin}, found ${canonical}`);
}

const ogTitle = singleMatch(
  /<meta\s+property=["']og:title["']\s+content=["']([^"']+)["']\s*\/?\s*>/gi,
  'Open Graph title',
);
const ogDescription = singleMatch(
  /<meta\s+property=["']og:description["']\s+content=["']([^"']+)["']\s*\/?\s*>/gi,
  'Open Graph description',
);
const ogType = singleMatch(
  /<meta\s+property=["']og:type["']\s+content=["']([^"']+)["']\s*\/?\s*>/gi,
  'Open Graph type',
);
if (ogType !== 'website') {
  fail(`Open Graph type must be website, found ${ogType}`);
}
const ogUrl = singleMatch(
  /<meta\s+property=["']og:url["']\s+content=["']([^"']+)["']\s*\/?\s*>/gi,
  'Open Graph URL',
);
if (ogUrl !== canonical) {
  fail(`Open Graph URL must match canonical URL; found ${ogUrl}`);
}
const ogImage = singleMatch(
  /<meta\s+property=["']og:image["']\s+content=["']([^"']+)["']\s*\/?\s*>/gi,
  'Open Graph image',
);
if (ogImage !== expectedSocialUrl) {
  fail(`Open Graph image must be ${expectedSocialUrl}, found ${ogImage}`);
}
const ogImageWidth = singleMatch(
  /<meta\s+property=["']og:image:width["']\s+content=["']([^"']+)["']\s*\/?\s*>/gi,
  'Open Graph image width',
);
const ogImageHeight = singleMatch(
  /<meta\s+property=["']og:image:height["']\s+content=["']([^"']+)["']\s*\/?\s*>/gi,
  'Open Graph image height',
);
if (ogImageWidth !== '1200' || ogImageHeight !== '630') {
  fail(`Open Graph image dimensions must be 1200x630, found ${ogImageWidth}x${ogImageHeight}`);
}
const ogImageAlt = singleMatch(
  /<meta\s+property=["']og:image:alt["']\s+content=["']([^"']+)["']\s*\/?\s*>/gi,
  'Open Graph image alt',
);
if (ogImageAlt !== expectedSocialAlt) {
  fail('Open Graph image alt text must match the approved social-card description');
}

const twitterCard = singleMatch(
  /<meta\s+name=["']twitter:card["']\s+content=["']([^"']+)["']\s*\/?\s*>/gi,
  'Twitter card',
);
if (twitterCard !== 'summary_large_image') {
  fail(`Twitter card must be summary_large_image, found ${twitterCard}`);
}
const twitterTitle = singleMatch(
  /<meta\s+name=["']twitter:title["']\s+content=["']([^"']+)["']\s*\/?\s*>/gi,
  'Twitter title',
);
if (twitterTitle !== ogTitle) {
  fail('Twitter title must match Open Graph title');
}
const twitterDescription = singleMatch(
  /<meta\s+name=["']twitter:description["']\s+content=["']([^"']+)["']\s*\/?\s*>/gi,
  'Twitter description',
);
if (twitterDescription !== ogDescription) {
  fail('Twitter description must match Open Graph description');
}
const twitterImage = singleMatch(
  /<meta\s+name=["']twitter:image["']\s+content=["']([^"']+)["']\s*\/?\s*>/gi,
  'Twitter image',
);
if (twitterImage !== ogImage) {
  fail('Twitter image must match Open Graph image');
}
const twitterImageAlt = singleMatch(
  /<meta\s+name=["']twitter:image:alt["']\s+content=["']([^"']+)["']\s*\/?\s*>/gi,
  'Twitter image alt',
);
if (twitterImageAlt !== ogImageAlt) {
  fail('Twitter image alt must match Open Graph image alt');
}

if (!readFileSync('public/social-preview.svg').equals(readFileSync('dist/social-preview.svg'))) {
  fail('built social preview bytes do not match the committed source asset');
}
const socialSvg = readFileSync('public/social-preview.svg', 'utf8');
if (!/<svg\b[^>]*\bwidth=["']1200["'][^>]*\bheight=["']630["']/i.test(socialSvg)) {
  fail('social preview SVG must declare 1200x630 dimensions');
}
if (!/<title\b[^>]*>[^<]*FinanceMeta[^<]*<\/title>/i.test(socialSvg)) {
  fail('social preview SVG must include an accessible FinanceMeta title');
}

const iconHref = singleMatch(
  /<link\s+rel=["']icon["']\s+href=["']([^"']+)["'][^>]*>/gi,
  'favicon link',
);
if (!/^\/[A-Za-z0-9._/-]+$/.test(iconHref) || iconHref.includes('..')) {
  fail(`favicon href must be a safe root-relative asset path, found ${iconHref}`);
}
const builtIconPath = `dist${iconHref}`;
if (!existsSync(builtIconPath)) {
  fail(`favicon href ${iconHref} does not resolve in built output`);
}
if (!readFileSync('public/favicon.ico').equals(readFileSync(builtIconPath))) {
  fail('built favicon bytes do not match the committed source favicon');
}

if (/localhost|127\.0\.0\.1/i.test(html)) {
  fail('built HTML contains a local-only URL');
}

let vercelConfig;
try {
  vercelConfig = JSON.parse(readFileSync('vercel.json', 'utf8'));
} catch (error) {
  fail(`vercel.json must contain valid JSON: ${error.message}`);
}
const expectedVercelSchema = 'https://openapi.vercel.sh/vercel.json';
if (vercelConfig.$schema !== expectedVercelSchema) {
  fail(`vercel.json schema must be ${expectedVercelSchema}`);
}
const catchAllHeaders = vercelConfig.headers?.find((entry) => entry.source === '/(.*)')?.headers;
if (!Array.isArray(catchAllHeaders)) {
  fail('vercel.json must define catch-all response headers');
}
const headerMap = new Map();
for (const header of catchAllHeaders) {
  const key = String(header?.key ?? '').trim().toLowerCase();
  const value = String(header?.value ?? '').trim();
  if (!key || !value) {
    fail('vercel.json contains an empty response-header key or value');
  }
  if (headerMap.has(key)) {
    fail(`vercel.json contains duplicate response header ${key}`);
  }
  headerMap.set(key, value);
}
const expectedCsp = "default-src 'self'; base-uri 'self'; frame-ancestors 'none'; object-src 'none'; script-src 'self'; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; font-src 'self' data:; connect-src 'self' https:; upgrade-insecure-requests";
const requiredHeaders = new Map([
  ['strict-transport-security', 'max-age=63072000; includeSubDomains'],
  ['content-security-policy', expectedCsp],
  ['x-content-type-options', 'nosniff'],
  ['referrer-policy', 'strict-origin-when-cross-origin'],
  ['permissions-policy', 'camera=(), microphone=(), geolocation=()'],
  ['x-frame-options', 'DENY'],
]);
for (const [key, expectedValue] of requiredHeaders) {
  const actualValue = headerMap.get(key);
  if (actualValue !== expectedValue) {
    fail(`response header ${key} must be ${expectedValue}, found ${actualValue ?? 'missing'}`);
  }
}

console.log(
  `FinanceMeta release check passed for source ${expectedRevision}: build output, immutable revision identity, social metadata/assets, favicon integrity, and hardened response headers are valid.`,
);

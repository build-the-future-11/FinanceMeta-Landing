import { existsSync, readFileSync } from 'node:fs';

const fail = (message) => {
  throw new Error(`release check failed: ${message}`);
};

const requiredFiles = [
  'dist/index.html',
  'dist/favicon.ico',
  'public/favicon.ico',
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

const twitterCard = singleMatch(
  /<meta\s+name=["']twitter:card["']\s+content=["']([^"']+)["']\s*\/?\s*>/gi,
  'Twitter card',
);
if (twitterCard !== 'summary') {
  fail(`Twitter card must be summary, found ${twitterCard}`);
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
const requiredHeaders = new Map([
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
  'FinanceMeta release check passed: build output, public metadata, favicon integrity, and baseline response headers are valid.',
);

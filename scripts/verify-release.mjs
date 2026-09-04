import { existsSync, readFileSync } from 'node:fs';

const fail = (message) => {
  throw new Error(`release check failed: ${message}`);
};

const requiredFiles = [
  'dist/index.html',
  'dist/favicon.ico',
  'public/favicon.ico',
  'tailwind.config.js',
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

const title = singleMatch(/<title>([^<]+)<\/title>/gi, 'title');
if (!title.includes('FinanceMeta')) {
  fail('built HTML title must identify FinanceMeta');
}

singleMatch(
  /<meta\s+name=["']description["']\s+content=["']([^"']+)["']\s*\/?\s*>/gi,
  'meta description',
);
singleMatch(
  /<meta\s+property=["']og:title["']\s+content=["']([^"']+)["']\s*\/?\s*>/gi,
  'Open Graph title',
);
singleMatch(
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

console.log(
  'FinanceMeta release check passed: build output, favicon integrity, and baseline metadata are valid.',
);

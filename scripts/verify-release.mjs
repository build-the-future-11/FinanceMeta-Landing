import { existsSync, readFileSync } from 'node:fs';

const requiredFiles = ['dist/index.html', 'public/favicon.ico', 'tailwind.config.js'];
for (const file of requiredFiles) {
  if (!existsSync(file)) {
    throw new Error(`release check failed: missing ${file}`);
  }
}

if (existsSync('tailwind_config.js')) {
  throw new Error('release check failed: duplicate tailwind_config.js must not coexist with tailwind.config.js');
}

const html = readFileSync('dist/index.html', 'utf8');
const vercel = JSON.parse(readFileSync('vercel.json', 'utf8'));
const requiredMarkers = [
  '<title>Research the systems moving capital.',
  'name="description"',
  'property="og:title"',
  'property="og:description"',
  'property="og:type"',
  'rel="icon"',
];

for (const marker of requiredMarkers) {
  if (!html.includes(marker)) {
    throw new Error(`release check failed: built HTML missing ${marker}`);
  }
}

if (/localhost|127\.0\.0\.1/i.test(html)) {
  throw new Error('release check failed: built HTML contains a local-only URL');
}

if (vercel.outputDirectory !== 'dist' || vercel.buildCommand !== 'npm run release:check') {
  throw new Error('release check failed: root Vercel target must deploy the certified landing build');
}

const headers = JSON.stringify(vercel.headers ?? []);
for (const marker of ['Content-Security-Policy', 'X-Content-Type-Options', 'X-Frame-Options', 'Referrer-Policy']) {
  if (!headers.includes(marker)) throw new Error(`release check failed: Vercel security headers missing ${marker}`);
}

console.log('FinanceMeta release check passed: build output and baseline metadata are present.');

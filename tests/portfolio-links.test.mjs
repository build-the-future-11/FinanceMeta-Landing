import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';

const footer = readFileSync(new URL('../src/components.tsx', import.meta.url), 'utf8');
const catalog = readFileSync(new URL('../src/content/legacy-catalog.ts', import.meta.url), 'utf8');

test('FinanceMeta links its public research network without merging product identities', () => {
  for (const destination of [
    'https://finance4all-global-reach.vercel.app/',
    'https://iy-ern.vercel.app',
    'https://thebu1ld.com/network',
  ]) {
    assert.match(footer, new RegExp(destination.replaceAll('.', '\\.') ));
  }
});

test('navigation exposes the canonical project-page directory', () => {
  assert.match(footer, /\['Projects', '\/projects'\]/);
  assert.match(footer, /\['All 48 projects','\/projects'\]/);
  assert.match(catalog, /id: "portal",[\s\S]*?website: "https:\/\/finance4all-global-reach\.vercel\.app\/"/);
  assert.match(catalog, /id: "iy-ern",[\s\S]*?website: "https:\/\/iy-ern\.vercel\.app"/);
});

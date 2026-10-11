import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';

const footer = readFileSync(new URL('../src/components.tsx', import.meta.url), 'utf8');

test('FinanceMeta links its public research network without merging product identities', () => {
  for (const destination of [
    'https://finance4all-global-reach.vercel.app/',
    'https://iy-ern.vercel.app',
    'https://thebu1ld.com/network',
  ]) {
    assert.match(footer, new RegExp(destination.replaceAll('.', '\\.') ));
  }
});

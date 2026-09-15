import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';

const PATCHED_SELECTOR_PARSER = '6.1.3';

async function readJson(path) {
  return JSON.parse(await readFile(path, 'utf8'));
}

test('postcss-selector-parser stays on the patched 6.x security release', async () => {
  const [pkg, lock] = await Promise.all([
    readJson(new URL('../package.json', import.meta.url)),
    readJson(new URL('../package-lock.json', import.meta.url)),
  ]);

  assert.equal(pkg.overrides?.['postcss-selector-parser'], PATCHED_SELECTOR_PARSER);
  assert.equal(
    lock.packages?.['node_modules/postcss-selector-parser']?.version,
    PATCHED_SELECTOR_PARSER,
  );
});

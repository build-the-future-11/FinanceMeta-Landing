import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';

const PATCHED_SELECTOR_PARSER = '7.1.6';

async function readJson(path) {
  return JSON.parse(await readFile(path, 'utf8'));
}

test('postcss-selector-parser stays on the patched security release', async () => {
  const [pkg, lock] = await Promise.all([
    readJson(new URL('../package.json', import.meta.url)),
    readJson(new URL('../package-lock.json', import.meta.url)),
  ]);

  assert.equal(pkg.overrides?.['postcss-selector-parser'], PATCHED_SELECTOR_PARSER);
  const parsers = Object.entries(lock.packages).filter(([path]) => path.endsWith('node_modules/postcss-selector-parser'));
  // Tailwind 4 no longer depends on this parser. Keep the override and reject
  // vulnerable versions if another dependency brings it back into the graph.
  const parserParents = Object.values(lock.packages).filter(pkg =>
    pkg.dependencies?.['postcss-selector-parser'] || pkg.optionalDependencies?.['postcss-selector-parser']);
  assert.ok(parsers.length > 0 || parserParents.length === 0, 'a referenced selector parser must be represented in the lockfile');
  for (const [path, pkg] of parsers) assert.equal(pkg.version, PATCHED_SELECTOR_PARSER, path);
});

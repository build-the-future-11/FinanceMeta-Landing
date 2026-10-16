import { existsSync, writeFileSync, rmSync } from 'node:fs';

import { resolveReleaseRevision } from './release-revision.mjs';

if (!existsSync('dist')) {
  throw new Error('release revision writer requires an existing dist directory');
}

// A failed check must never leave a stale receipt behind.
rmSync('dist/release-revision.json', { force: true });
const revision = resolveReleaseRevision();
const payload = {
  service: 'finance-meta-landing',
  revision,
};

writeFileSync('dist/release-revision.json', `${JSON.stringify(payload)}\n`, 'utf8');
console.log(`Wrote immutable release revision ${revision}`);

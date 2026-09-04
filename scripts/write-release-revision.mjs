import { existsSync, writeFileSync } from 'node:fs';

import { resolveReleaseRevision } from './release-revision.mjs';

if (!existsSync('dist')) {
  throw new Error('release revision writer requires an existing dist directory');
}

const revision = resolveReleaseRevision();
const payload = {
  service: 'finance-meta-landing',
  revision,
};

writeFileSync('dist/release-revision.json', `${JSON.stringify(payload)}\n`, 'utf8');
console.log(`Wrote immutable release revision ${revision}`);

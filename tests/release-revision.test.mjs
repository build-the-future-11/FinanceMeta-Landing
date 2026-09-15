import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';

import { resolveReleaseRevision, validateReleaseRevision } from '../scripts/release-revision.mjs';

const SHA_A = '0123456789abcdef0123456789abcdef01234567';
const SHA_B = '89abcdef0123456789abcdef0123456789abcdef';

test('release revision accepts only immutable lowercase 40-character Git SHAs', () => {
  assert.equal(validateReleaseRevision(SHA_A), SHA_A);
  for (const bad of [
    '',
    'main',
    SHA_A.toUpperCase(),
    SHA_A.slice(0, 39),
    `${SHA_A}0`,
    'g123456789abcdef0123456789abcdef0123456',
  ]) {
    assert.throws(() => validateReleaseRevision(bad), /immutable lowercase 40-character Git SHA/);
  }
});

test('exact source binding wins over the synthetic GitHub pull-request merge SHA', () => {
  assert.equal(
    resolveReleaseRevision({
      env: { SOURCE_SHA: SHA_A, GITHUB_SHA: SHA_B },
      gitHead: () => SHA_B,
    }),
    SHA_A,
  );
});

test('source and Vercel deployment identities must agree when both are declared', () => {
  assert.equal(
    resolveReleaseRevision({
      env: { SOURCE_SHA: SHA_A, VERCEL_GIT_COMMIT_SHA: SHA_A, GITHUB_SHA: SHA_B },
      gitHead: () => SHA_B,
    }),
    SHA_A,
  );

  assert.throws(
    () =>
      resolveReleaseRevision({
        env: { SOURCE_SHA: SHA_A, VERCEL_GIT_COMMIT_SHA: SHA_B },
        gitHead: () => SHA_A,
      }),
    /release revision environment disagrees/,
  );
});

test('GitHub SHA and then git HEAD are bounded fallbacks only when stronger identities are absent', () => {
  assert.equal(resolveReleaseRevision({ env: { GITHUB_SHA: SHA_A }, gitHead: () => SHA_B }), SHA_A);
  assert.equal(resolveReleaseRevision({ env: {}, gitHead: () => SHA_B }), SHA_B);
  assert.throws(
    () => resolveReleaseRevision({ env: {}, gitHead: () => 'main' }),
    /git HEAD must be an immutable lowercase 40-character Git SHA/,
  );
});

test('release-critical workflows stay pinned to the repository Node runtime and Ubuntu 24.04', () => {
  const declaredNode = readFileSync(new URL('../.nvmrc', import.meta.url), 'utf8').trim();
  assert.equal(declaredNode, '22.22.2');

  for (const workflowPath of [
    '../.github/workflows/release-check.yml',
    '../.github/workflows/production-health.yml',
  ]) {
    const workflow = readFileSync(new URL(workflowPath, import.meta.url), 'utf8');

    assert.match(workflow, /runs-on:\s*ubuntu-24\.04/);
    assert.match(workflow, new RegExp(`node-version:\\s*['\"]${declaredNode.replaceAll('.', '\\.') }['\"]`));
    assert.doesNotMatch(workflow, /node-version:\s*['\"]?22['\"]?\s*$/m);
    assert.doesNotMatch(workflow, /runs-on:\s*ubuntu-latest/);
  }
});

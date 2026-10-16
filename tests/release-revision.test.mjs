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

test('clean checkout identity overrides event metadata but must match declared source', () => {
  const clean = () => ({ head: SHA_A, status: '' });
  assert.equal(resolveReleaseRevision({ env: { GITHUB_SHA: SHA_B }, gitState: clean }), SHA_A);
  assert.equal(resolveReleaseRevision({ env: { SOURCE_SHA: SHA_A, GITHUB_SHA: SHA_B }, gitState: clean }), SHA_A);
  assert.equal(resolveReleaseRevision({ env: {}, gitState: clean }), SHA_A);
  assert.throws(() => resolveReleaseRevision({ env: { SOURCE_SHA: SHA_B }, gitState: clean }), /does not match/);
  assert.throws(() => resolveReleaseRevision({ env: { SOURCE_SHA: SHA_A, VERCEL_GIT_COMMIT_SHA: SHA_B }, gitState: clean }), /environment disagrees/);
  assert.throws(() => resolveReleaseRevision({ env: {}, gitState: () => ({ head: 'main', status: '' }) }), /git HEAD must be/);
});

test('modified, staged and untracked files reject release even with a declared SHA', () => {
  for (const status of [' M src/main.tsx', 'M  package.json', '?? src/new.ts']) {
    assert.throws(() => resolveReleaseRevision({ env: { SOURCE_SHA: SHA_A }, gitState: () => ({ head: SHA_A, status }) }), /clean checkout/);
  }
});

test('source archives require an explicit consistent source identity', () => {
  const archive = () => null;
  for (const env of [{}, { GITHUB_SHA: SHA_A }]) assert.throws(() => resolveReleaseRevision({ env, gitState: archive }), /archive requires/);
  assert.equal(resolveReleaseRevision({ env: { SOURCE_SHA: SHA_A, GITHUB_SHA: SHA_B }, gitState: archive }), SHA_A);
  assert.equal(resolveReleaseRevision({ env: { VERCEL_GIT_COMMIT_SHA: SHA_B }, gitState: archive }), SHA_B);
  assert.throws(() => resolveReleaseRevision({ env: { SOURCE_SHA: SHA_A, VERCEL_GIT_COMMIT_SHA: SHA_B }, gitState: archive }), /environment disagrees/);
});

test('release-critical workflows stay pinned to the repository Node runtime and Ubuntu 24.04', () => {
  const declaredNode = readFileSync(new URL('../.nvmrc', import.meta.url), 'utf8').trim();
  assert.equal(declaredNode, '22.23.2');

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

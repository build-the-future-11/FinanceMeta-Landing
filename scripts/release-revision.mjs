import { execFileSync } from 'node:child_process';
import { existsSync } from 'node:fs';
import { resolve } from 'node:path';

const REVISION_PATTERN = /^[0-9a-f]{40}$/;
export const validateReleaseRevision = (value, label = 'release revision') => {
  const revision = String(value ?? '').trim();
  if (!REVISION_PATTERN.test(revision)) throw new Error(`${label} must be an immutable lowercase 40-character Git SHA, found ${revision || 'missing'}`);
  return revision;
};
export const readGitState = (cwd = process.cwd()) => {
  // An archive nested inside another repository must not inherit its HEAD.
  if (!existsSync(resolve(cwd, '.git'))) return null;
  const git = args => execFileSync('git', args, { cwd, encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'] }).trim();
  return { head: git(['rev-parse', 'HEAD']), status: git(['status', '--porcelain', '--untracked-files=all']) };
};
const readDeclaredRevision = (env, key) => {
  const raw = env[key];
  return raw == null || String(raw).trim() === '' ? null : validateReleaseRevision(raw, key);
};
export const resolveReleaseRevision = ({ env = process.env, gitState = readGitState } = {}) => {
  const sourceSha = readDeclaredRevision(env, 'SOURCE_SHA');
  const vercelSha = readDeclaredRevision(env, 'VERCEL_GIT_COMMIT_SHA');
  if (sourceSha && vercelSha && sourceSha !== vercelSha) throw new Error('release revision environment disagrees: SOURCE_SHA and VERCEL_GIT_COMMIT_SHA');
  const declared = sourceSha || vercelSha;
  const state = gitState();
  if (state) {
    if (state.status.trim()) throw new Error('Release requires a clean checkout, including untracked files. Use npm run build:dev for a local preview.');
    const head = validateReleaseRevision(state.head, 'git HEAD');
    if (declared && declared !== head) throw new Error('Declared source revision does not match the checked-out git HEAD.');
    return head;
  }
  // GitHub event SHAs can identify synthetic merges; they are not archive provenance.
  if (!declared) throw new Error('Source archive requires SOURCE_SHA or VERCEL_GIT_COMMIT_SHA. GITHUB_SHA alone is not source provenance.');
  return declared;
};

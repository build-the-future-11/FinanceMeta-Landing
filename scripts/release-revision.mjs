import { execFileSync } from 'node:child_process';
import { existsSync, readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { isDeepStrictEqual } from 'node:util';

const REVISION_PATTERN = /^[0-9a-f]{40}$/;
export const validateReleaseRevision = (value, label = 'release revision') => {
  const revision = String(value ?? '').trim();
  if (!REVISION_PATTERN.test(revision)) throw new Error(`${label} must be an immutable lowercase 40-character Git SHA, found ${revision || 'missing'}`);
  return revision;
};
export const equivalentVercelConfig = (committed, hosted) => {
  try { return isDeepStrictEqual(JSON.parse(committed), JSON.parse(hosted)); }
  catch { return false; }
};
export const readGitState = (cwd = process.cwd(), env = process.env) => {
  // An archive nested inside another repository must not inherit its HEAD.
  if (!existsSync(resolve(cwd, '.git'))) return null;
  const git = args => execFileSync('git', args, { cwd, encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'] }).trim();
  let status = git(['status', '--porcelain', '--untracked-files=all']);
  // Vercel reserializes this JSON before invoking the build. Only an exactly
  // equivalent configuration is allowed; source and semantic changes still fail.
  if (env.VERCEL === '1' && status.split('\n').some(line => line.trim() === 'M vercel.json')) {
    const committed = git(['show', 'HEAD:vercel.json']);
    const hosted = readFileSync(resolve(cwd, 'vercel.json'), 'utf8');
    if (equivalentVercelConfig(committed, hosted)) {
      status = git(['status', '--porcelain', '--untracked-files=all', '--', '.', ':(exclude)vercel.json']);
    } else {
      try {
        const before = JSON.parse(committed), after = JSON.parse(hosted);
        const keys = [...new Set([...Object.keys(before), ...Object.keys(after)])].filter(key => !isDeepStrictEqual(before[key], after[key]));
        status += `\nChanged Vercel configuration keys: ${keys.join(', ')}`;
      } catch { /* malformed configuration remains a release failure */ }
    }
  }
  return { head: git(['rev-parse', 'HEAD']), status };
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
    if (state.status.trim()) throw new Error(`Release requires a clean checkout, including untracked files. Use npm run build:dev for a local preview. Changed paths:\n${state.status}`);
    const head = validateReleaseRevision(state.head, 'git HEAD');
    if (declared && declared !== head) throw new Error('Declared source revision does not match the checked-out git HEAD.');
    return head;
  }
  // GitHub event SHAs can identify synthetic merges; they are not archive provenance.
  if (!declared) throw new Error('Source archive requires SOURCE_SHA or VERCEL_GIT_COMMIT_SHA. GITHUB_SHA alone is not source provenance.');
  return declared;
};

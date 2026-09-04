import { execFileSync } from 'node:child_process';

const REVISION_PATTERN = /^[0-9a-f]{40}$/;
const ENV_REVISION_KEYS = ['SOURCE_SHA', 'VERCEL_GIT_COMMIT_SHA', 'GITHUB_SHA'];

export const validateReleaseRevision = (value, label = 'release revision') => {
  const revision = String(value ?? '').trim();
  if (!REVISION_PATTERN.test(revision)) {
    throw new Error(`${label} must be an immutable lowercase 40-character Git SHA, found ${revision || 'missing'}`);
  }
  return revision;
};

const readGitHead = () =>
  execFileSync('git', ['rev-parse', 'HEAD'], {
    encoding: 'utf8',
    stdio: ['ignore', 'pipe', 'pipe'],
  }).trim();

export const resolveReleaseRevision = ({ env = process.env, gitHead = readGitHead } = {}) => {
  const declared = ENV_REVISION_KEYS.flatMap((key) => {
    const raw = env[key];
    if (raw == null || String(raw).trim() === '') return [];
    return [[key, validateReleaseRevision(raw, key)]];
  });

  if (declared.length > 0) {
    const distinct = new Set(declared.map(([, revision]) => revision));
    if (distinct.size !== 1) {
      const detail = declared.map(([key, revision]) => `${key}=${revision}`).join(', ');
      throw new Error(`release revision environment disagrees: ${detail}`);
    }
    return declared[0][1];
  }

  return validateReleaseRevision(gitHead(), 'git HEAD');
};

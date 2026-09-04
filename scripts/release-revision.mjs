import { execFileSync } from 'node:child_process';

const REVISION_PATTERN = /^[0-9a-f]{40}$/;

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

const readDeclaredRevision = (env, key) => {
  const raw = env[key];
  if (raw == null || String(raw).trim() === '') return null;
  return validateReleaseRevision(raw, key);
};

export const resolveReleaseRevision = ({ env = process.env, gitHead = readGitHead } = {}) => {
  const sourceSha = readDeclaredRevision(env, 'SOURCE_SHA');
  const vercelSha = readDeclaredRevision(env, 'VERCEL_GIT_COMMIT_SHA');

  if (sourceSha && vercelSha && sourceSha !== vercelSha) {
    throw new Error(
      `release revision environment disagrees: SOURCE_SHA=${sourceSha}, VERCEL_GIT_COMMIT_SHA=${vercelSha}`,
    );
  }
  if (sourceSha) return sourceSha;
  if (vercelSha) return vercelSha;

  const githubSha = readDeclaredRevision(env, 'GITHUB_SHA');
  if (githubSha) return githubSha;

  return validateReleaseRevision(gitHead(), 'git HEAD');
};

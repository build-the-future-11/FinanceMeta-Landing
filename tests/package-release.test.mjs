import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import { createHash } from 'node:crypto';
import { mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import test from 'node:test';

test('source release archives retain the build configuration and release workflows', () => {
  const directory = mkdtempSync(join(tmpdir(), 'financemeta-package-'));
  const script = fileURLToPath(new URL('../scripts/package-release.mjs', import.meta.url));
  const required = ['vite.config.ts', '.github/workflows/release-check.yml', '.github/workflows/production-health.yml'];
  const files = {
    'package.json': '{"type":"module"}',
    'package-lock.json': '{"lockfileVersion":3}',
    '.nvmrc': '22.23.2\n',
    '.gitignore': 'node_modules/\ndist/\n',
    'index.html': '<title>Packaging fixture</title>',
    'tsconfig.json': '{}',
    'postcss.config.js': 'export default {};',
    'tailwind.config.js': 'export default {};',
    'vercel.json': '{}',
    '.env.example': 'VITE_SITE_ORIGIN=\n',
    'README.md': 'Packaging fixture\n',
    'evidence/cta-matrix.json': '{}',
    'docs/IMPROVEMENTS_2026-09-21.md': 'Fixture\n',
    'docs/RELEASE_RUNBOOK_2026-09-21.md': 'Fixture\n',
    'dist/route-manifest.json': '{"routes":[]}',
    'dist/index.html': '<title>Packaging fixture</title>',
  };
  for (const path of required) files[path] = readFileSync(new URL(`../${path}`, import.meta.url), 'utf8');
  try {
    for (const path of ['src', 'public', 'scripts', 'tests', 'evidence/improvements-2026-09-21']) mkdirSync(join(directory, path), { recursive: true });
    for (const [path, contents] of Object.entries(files)) {
      mkdirSync(dirname(join(directory, path)), { recursive: true });
      writeFileSync(join(directory, path), contents);
    }
    const output = execFileSync(process.execPath, [script], { cwd: directory, encoding: 'utf8', timeout: 30_000 });
    const relativePackage = output.match(/^Release package: (.+)$/m)?.[1];
    assert.ok(relativePackage, 'packager must identify its completed package');
    const release = join(directory, relativePackage);
    const manifest = JSON.parse(readFileSync(join(release, 'manifest.json'), 'utf8'));
    const archive = join(release, 'source.tar.gz');
    const entries = new Set(execFileSync('tar', ['-tzf', archive], { encoding: 'utf8' }).trim().split('\n'));
    for (const path of required) {
      assert.ok(entries.has(path), `Source archive omits required release input: ${path}`);
      const bytes = execFileSync('tar', ['-xOf', archive, path]);
      assert.equal(bytes.toString('utf8'), files[path], `Archived ${path} must retain its exact content`);
      assert.equal(manifest.sourceHashes[path], createHash('sha256').update(bytes).digest('hex'), `Manifest must hash archived ${path}`);
    }
  } finally {
    rmSync(directory, { recursive: true, force: true });
  }
});

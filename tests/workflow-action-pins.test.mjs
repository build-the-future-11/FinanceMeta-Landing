import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';

const releaseCriticalWorkflows = [
  '.github/workflows/release-check.yml',
  '.github/workflows/production-health.yml',
];

function readWorkflow(path) {
  return readFileSync(new URL(`../${path}`, import.meta.url), 'utf8');
}

test('release-critical remote GitHub Actions are immutable SHA-pinned', () => {
  for (const path of releaseCriticalWorkflows) {
    const source = readWorkflow(path);
    const usesLines = source.split('\n').filter((line) => /^\s*uses:/.test(line));

    assert.ok(usesLines.length > 0, `${path} must contain at least one action`);
    for (const line of usesLines) {
      const match = line.match(/^\s*uses:\s*([^@\s]+)@([^\s#]+)/);
      if (!match) continue;
      const [, action, ref] = match;
      if (action.startsWith('./')) continue;
      assert.match(ref, /^[0-9a-f]{40}$/i, `${path} must SHA-pin ${action}`);
    }
  }
});

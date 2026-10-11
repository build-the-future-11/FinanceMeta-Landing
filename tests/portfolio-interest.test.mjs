import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { interestContext } from '../src/lib/reading.ts';

const portfolio = JSON.parse(readFileSync(new URL('../src/content/finance4all-portfolio.json', import.meta.url), 'utf8')).projects;
const projects = [{ slug: 'fi-jepa', name: 'FI-JEPA', lab: 'ml' }];
const labs = [{ slug: 'ml', title: 'Machine Learning for Finance' }];
const resolve = (project, lab = null) => interestContext(project, lab, projects, labs, portfolio);

for (const variant of ['canonical ID', 'lowercase route ID']) {
  test(`every portfolio contribution retains its ${variant}, title and return link`, () => {
    assert.ok(portfolio.length > 0);
    for (const entry of portfolio) {
      const token = variant === 'canonical ID' ? entry.id : entry.id.toLowerCase();
      const query = new URLSearchParams({ project: token });
      assert.deepEqual(resolve(query.get('project')), {
        project: entry.id,
        lab: undefined,
        label: `${entry.id}: ${entry.project}`,
        href: `/projects/${entry.id.toLowerCase()}`,
      }, entry.id);
    }
  });
}

test('a selected portfolio record takes precedence over an unrelated lab parameter', () => {
  const entry = portfolio[0];
  assert.deepEqual(resolve(entry.id, 'ml'), resolve(entry.id));
  assert.equal(resolve(entry.id, 'ml').project, entry.id);
});

test('research project and lab links retain their existing behavior', () => {
  const expected = {
    project: 'fi-jepa', lab: 'ml', label: 'FI-JEPA / Machine Learning for Finance',
    href: '/research/projects/fi-jepa',
  };
  assert.deepEqual(resolve('fi-jepa', 'unknown'), expected);
  assert.deepEqual(interestContext('fi-jepa', null, projects, labs), expected);
  assert.deepEqual(resolve(null, 'ml'), {
    project: undefined, lab: 'ml', label: 'Machine Learning for Finance', href: '/research/labs/ml',
  });
  const collision = [{ id: 'fi-jepa', project: 'A different portfolio entry' }];
  assert.deepEqual(interestContext('fi-jepa', null, projects, labs, collision), expected);
});

test('unknown query values cannot invent a project label or return destination', () => {
  for (const token of [null, '', 'F4A-99999', '../F4A-01', 'https://example.org', 'javascript:alert(1)']) {
    assert.deepEqual(resolve(token), { project: undefined, lab: undefined, label: '', href: undefined });
    assert.deepEqual(resolve(token, 'ml'), resolve(null, 'ml'));
  }
});

test('resolving contribution context leaves the catalogs unchanged', () => {
  const before = JSON.stringify({ portfolio, projects, labs });
  for (const entry of portfolio) resolve(entry.id.toLowerCase(), 'ml');
  assert.equal(JSON.stringify({ portfolio, projects, labs }), before);
});

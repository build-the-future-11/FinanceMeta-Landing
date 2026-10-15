import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { interestContext } from '../src/lib/reading.ts';
import { applicationForms, applicationUrl } from '../src/lib/application-routes.ts';

const projects = [{ slug: 'fi-jepa', name: 'FI-JEPA', lab: 'ml' }];
const labs = [{ slug: 'ml', title: 'Machine Learning for Finance' }];
const portfolio = [{ id: 'F4A-17', project: 'Portfolio handoff fixture' }];
const resolve = (project, lab = null) => interestContext(project, lab, projects, labs, portfolio);
const handoff = (source, search = '', route = 'join', role = 'Researcher') => new URL(applicationUrl(route, search, {
  role, project: source.project || '', lab: source.lab || '', surface: 'join',
}));

test('canonical and lowercase portfolio IDs reach the current application form', () => {
  for (const token of ['F4A-17', 'f4a-17']) {
    const source = resolve(token, 'ml');
    const url = handoff(source, `?project=${token}&lab=ml`);
    assert.equal(source.href, '/projects/f4a-17');
    assert.equal(url.pathname, '/r/5B7blP');
    assert.equal(url.searchParams.get('fm_project'), 'F4A-17');
    assert.equal(url.searchParams.has('fm_lab'), false);
  }
});

test('research projects carry their own canonical lab rather than an unrelated query', () => {
  const url = handoff(resolve('fi-jepa', 'unknown'), '?project=fi-jepa&lab=unknown');
  assert.equal(url.searchParams.get('fm_project'), 'fi-jepa');
  assert.equal(url.searchParams.get('fm_lab'), 'ml');
  const labOnly = handoff(resolve(null, 'ml'));
  assert.equal(labOnly.searchParams.has('fm_project'), false);
  assert.equal(labOnly.searchParams.get('fm_lab'), 'ml');
});

test('unknown and unsafe project IDs cannot leak through the raw search fallback', () => {
  for (const token of ['F4A-99999', '../F4A-17', 'https://example.org', 'javascript:alert(1)', '']) {
    const url = handoff(resolve(token), new URLSearchParams({ project: token, lab: 'unknown' }).toString());
    assert.equal(url.searchParams.has('fm_project'), false);
    assert.equal(url.searchParams.has('fm_lab'), false);
  }
});

test('all supported contribution roles preserve the chosen portfolio project', () => {
  for (const role of ['Researcher', 'Research Fellow', 'Engineer', 'Writer', 'Chapter Lead', 'Partner', 'Speaker / Mentor']) {
    const route = role === 'Chapter Lead' ? 'chapter' : ['Partner', 'Speaker / Mentor'].includes(role) ? 'partnership' : 'join';
    const url = handoff(resolve('F4A-17'), '', route, role);
    assert.equal(url.pathname, `/r/${applicationForms[route]}`);
    assert.equal(url.searchParams.get('fm_role'), role);
    assert.equal(url.searchParams.get('fm_project'), 'F4A-17');
  }
});

test('journal and forum destinations remain distinct from membership intake', () => {
  const paths = Object.keys(applicationForms).map(route => {
    const url = handoff(resolve('F4A-17'), '', route);
    assert.equal(url.searchParams.get('fm_route'), route);
    assert.equal(url.searchParams.get('fm_project'), 'F4A-17');
    return url.pathname;
  });
  assert.equal(new Set(paths).size, 5);
});

test('handoff keeps allowed attribution and QA markers without forwarding private query data', () => {
  const url = handoff(resolve('F4A-17'), '?utm_campaign=fall_2026&fm_qa=1&email=private@example.org&token=secret&role=Contributor');
  assert.equal(url.searchParams.get('utm_campaign'), 'fall_2026');
  assert.equal(url.searchParams.get('fm_qa'), '1');
  assert.equal(url.searchParams.get('fm_role'), 'Researcher');
  assert.equal(url.searchParams.has('email'), false);
  assert.equal(url.searchParams.has('token'), false);
});

test('Join wires unfiltered interest through the catalog before building the new application link', () => {
  const source = readFileSync(new URL('../src/join-page.tsx', import.meta.url), 'utf8');
  assert.match(source, /import\s*\{\s*portfolioProjects\s*\}\s*from\s*['"]\.\/content\/portfolio['"]/);
  assert.match(source, /interestContext\(params\.get\('project'\),params\.get\('lab'\),projects,labs,portfolioProjects\)/);
  assert.match(source, /const project=source\.project\|\|''/);
  assert.match(source, /const lab=source\.lab\|\|''/);
  assert.match(source, /applicationUrl\(selected\.href,search,\{role,project,lab,surface:'join'\}\)/);
  assert.match(source, /Choose your contribution\. Apply once\./);
  assert.doesNotMatch(source, /setPrepared|Copy application context/);
});

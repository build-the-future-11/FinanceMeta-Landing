import test from 'node:test';
import assert from 'node:assert/strict';
import { navigationGroups, navigationForPath, currentSectionLink } from '../src/lib/navigation.ts';
import { routes, render } from '../.site-build/prerender.js';

test('four visitor goals retain valid specialist destinations', () => {
  assert.deepEqual(navigationGroups.map(group => group.label), ['Learn', 'Research', 'Get involved', 'About']);
  const paths = new Set(routes.map(route => route.path));
  for (const group of navigationGroups) {
    assert.ok(paths.has(group.href));
    for (const [, href] of group.links) assert.ok(paths.has(href), href);
  }
  for (const path of ['/markets','/projects','/research/labs','/programs','/events','/podcast']) {
    assert.ok(navigationGroups.some(group => group.links.some(([, href]) => href === path)), path);
  }
});

test('nested routes select the most specific section without false prefix matches', () => {
  assert.equal(navigationForPath('/publications/financedebriefed/example')?.label, 'Learn');
  assert.equal(navigationForPath('/publications/iyerj')?.label, 'Research');
  assert.equal(navigationForPath('/programs/compare/')?.label, 'Get involved');
  assert.equal(navigationForPath('/about/team/person')?.label, 'About');
  assert.equal(navigationForPath('/research-fake'), undefined);
  assert.equal(currentSectionLink('/research/labs/example', navigationGroups[1]), '/research/labs');
  assert.equal(currentSectionLink('/learn/practice', navigationGroups[0]), '/learn/practice');
  for (const route of routes.filter(route => !['/', '/search'].includes(route.path))) {
    assert.ok(navigationForPath(route.path), `Unclassified route: ${route.path}`);
  }
});

test('the shared shell explains the brand and exposes contextual navigation before hydration', () => {
  const html = render('/learn/practice');
  assert.match(html, /aria-label="Learn navigation"/);
  assert.match(html, /The public learning and research website/);
  assert.match(html, /href="\/learn\/practice" aria-current="page"/);
  assert.match(render('/join'), /Expressions of interest/);
  assert.match(render('/join'), /not admission to a scheduled program/);
});

test('journal guidance agrees with the available external submission routes', () => {
  const html = render('/publications/iyerj/submissions');
  assert.match(html, /href="\/apply\?call=research-submission"/);
  assert.match(html, /Read IYERN requirements/);
  assert.doesNotMatch(html, /Submissions are not open|Before submissions open/);
  assert.match(render('/publications/iyerj'), /No journal issues have been released here/);
});

import test from 'node:test';
import assert from 'node:assert/strict';
import { applicationForms, applicationUrl, applicationDestination } from '../src/lib/application-routes.ts';

// Classification, not navigation: these tests do not request any remote URL.
for (const [route, id] of Object.entries(applicationForms)) {
  test(`canonical ${route} form is counted with allowlisted metadata`, () => {
    assert.equal(applicationDestination(applicationUrl(route, '?utm_source=review&fm_qa=1')), `tally.so/r/${id}`);
  });
}

for (const [label, href] of [
  ['nondefault HTTPS port', 'https://tally.so:8443/r/b5BBko'],
  ['HTTP port on HTTPS scheme', 'https://tally.so:80/r/b5BBko'],
  ['username', 'https://reviewer@tally.so/r/b5BBko'],
  ['username and password', 'https://reviewer:secret@tally.so/r/b5BBko'],
  ['password without username', 'https://:secret@tally.so/r/b5BBko'],
  ['encoded username', 'https://reviewer%40example.org@tally.so/r/b5BBko'],
  ['lookalike suffix host', 'https://tally.so.evil.test/r/b5BBko'],
  ['subdomain', 'https://forms.tally.so/r/b5BBko'],
  ['host hidden in credentials', 'https://tally.so@evil.test/r/b5BBko'],
  ['HTTP', 'http://tally.so/r/b5BBko'],
  ['unknown form', 'https://tally.so/r/not-in-registry'],
  ['extra path segment', 'https://tally.so/r/b5BBko/edit'],
  ['relative address', '/r/b5BBko'],
  ['malformed address', 'not-a-url'],
]) {
  test(`untrusted destination is not counted: ${label}`, () => {
    assert.equal(applicationDestination(href), null);
  });
}

test('explicit default HTTPS port is the same canonical origin', () => {
  assert.equal(applicationDestination('https://tally.so:443/r/b5BBko'), 'tally.so/r/b5BBko');
});

test('DNS casing does not change the canonical origin', () => {
  assert.equal(applicationDestination('https://TALLY.SO/r/b5BBko'), 'tally.so/r/b5BBko');
});

test('query values and fragment are never copied into the destination label', () => {
  assert.equal(applicationDestination('https://tally.so/r/b5BBko?note=not-a-label#section'), 'tally.so/r/b5BBko');
});

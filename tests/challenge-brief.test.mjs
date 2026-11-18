import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';
import { BACKUP_LIMIT, SECTION_LIMIT, TITLE_LIMIT, briefTracks, briefSections, briefBackup, briefMarkdown, hasBriefContent, isBriefTrack, newBrief, readBriefBackup, startedSections } from '../src/lib/challenge-brief.ts';

test('each practice track starts with an independent empty draft', () => {
  for (const track of briefTracks) {
    const draft = newBrief(track.id);
    assert.equal(draft.track, track.id);
    assert.deepEqual(Object.keys(draft.sections), briefSections.map(section => section.id));
    assert.equal(hasBriefContent(draft), false);
    draft.sections.question = 'Does the result hold?';
    assert.equal(newBrief(track.id).sections.question, '');
  }
  assert.equal(isBriefTrack('__proto__'), false);
  assert.equal(isBriefTrack(null), false);
});

test('editable backup round-trips every section, Unicode and line breaks', () => {
  const draft = newBrief('backtest-falsification');
  draft.title = 'A €100 decision: why the result changed';
  briefSections.forEach((section, index) => { draft.sections[section.id] = `${index}: naïve baseline\nData for Bengaluru → Zürich.\n<not an HTML element> & "quoted"`; });
  assert.deepEqual(readBriefBackup(briefBackup(draft)), draft);
  assert.equal(startedSections(draft).length, 8);
});

test('the largest valid backup remains importable, including JSON-escaped characters', () => {
  const draft = newBrief();
  draft.title = '\u0000'.repeat(TITLE_LIMIT);
  for (const section of briefSections) draft.sections[section.id] = '\u0000'.repeat(SECTION_LIMIT);
  const backup = briefBackup(draft);
  assert.ok(Buffer.byteLength(backup) < BACKUP_LIMIT);
  assert.deepEqual(readBriefBackup(backup), draft);
});

test('invalid, oversized and unsupported backups are rejected without mutating the current draft', () => {
  const current = newBrief();
  current.title = 'Keep my work';
  const before = briefBackup(current);
  const invalid = [
    '{', 'null', '[]',
    JSON.stringify({ ...newBrief(), version: 2 }),
    JSON.stringify({ ...newBrief(), track: 'unannounced-event' }),
    JSON.stringify({ ...newBrief(), title: 42 }),
    JSON.stringify({ ...newBrief(), title: 'x'.repeat(TITLE_LIMIT + 1) }),
    JSON.stringify({ ...newBrief(), sections: [] }),
    JSON.stringify({ ...newBrief(), sections: { question: 'Missing sections' } }),
    JSON.stringify({ ...newBrief(), sections: { ...newBrief().sections, question: null } }),
    JSON.stringify({ ...newBrief(), sections: { ...newBrief().sections, question: 'x'.repeat(SECTION_LIMIT + 1) } }),
    JSON.stringify({ ...newBrief(), sections: { ...newBrief().sections, invented: 'Unexpected section' } }),
    JSON.stringify({ ...newBrief(), registration: 'confirmed' }),
    ' '.repeat(BACKUP_LIMIT + 1),
  ];
  for (const backup of invalid) {
    assert.throws(() => readBriefBackup(backup));
    assert.equal(briefBackup(current), before);
  }
});

test('section progress counts writing only and does not treat a title or whitespace as evidence', () => {
  const draft = newBrief();
  draft.title = 'An idea';
  draft.sections.question = ' \n\t ';
  assert.equal(hasBriefContent(draft), true);
  assert.deepEqual(startedSections(draft), []);
  draft.sections.baseline = 'Equal-weight reference with the same dates';
  assert.deepEqual(startedSections(draft), ['baseline']);
});

test('review export retains the draft and marks unfinished sections without a judging score', () => {
  const draft = newBrief('global-research-challenge');
  draft.title = 'Inflation and spending\n# My private notes';
  draft.sections.question = 'Which basket changed?\nDo the weights explain the difference?';
  const output = briefMarkdown(draft);
  assert.match(output, /not an entry, registration, official rulebook or judging result/);
  assert.match(output, /Sections started: 1\/8/);
  assert.match(output, /> Inflation and spending\n> # My private notes/);
  assert.match(output, /> Which basket changed\?\n> Do the weights/);
  for (const section of briefSections) assert.ok(output.includes('## ' + section.title));
  assert.equal((output.match(/_Not yet written\._/g) || []).length, 7);
});

test('challenge discovery uses canonical program status and gives supported tracks a preparation path', () => {
  const catalog = JSON.parse(readFileSync('src/content/network-catalog.json', 'utf8'));
  const html = readFileSync('dist/challenges.html', 'utf8');
  const text = html.replaceAll('&amp;', '&').replaceAll('<!-- -->', '');
  for (const program of catalog.programs.filter(item => item.family === 'Competitions')) {
    assert.ok(text.includes(program.title), program.slug);
    assert.ok(text.includes(program.status), program.slug);
    assert.ok(text.includes(program.readiness), program.slug);
    assert.ok(html.includes('href="/programs/' + program.slug + '"'));
  }
  for (const track of briefTracks) assert.ok(html.includes('href="/challenges/prepare?track=' + track.id + '"'));
  assert.match(text, /No competition entries are accepted/);
});

test('the workspace is prerendered with its styles, privacy boundary and non-JavaScript worksheet', () => {
  const manifest = JSON.parse(readFileSync('dist/.vite/manifest.json', 'utf8'));
  const html = readFileSync('dist/challenges/prepare.html', 'utf8');
  for (const file of manifest['src/challenge-pages.tsx'].css) assert.ok(html.includes('href="/' + file + '"'));
  for (const section of briefSections) assert.ok(html.includes('id="brief-' + section.id + '"'));
  assert.match(html, /Your text stays in this tab/);
  assert.match(html, /<noscript>[\s\S]*\/resources\/research-protocol\.md/);
  assert.match(html, /Download editable backup/);
  assert.doesNotMatch(html, /name="password"|registration confirmed/);
});

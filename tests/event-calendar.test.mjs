import assert from 'node:assert/strict';
import test from 'node:test';
import { eventCalendar } from '../src/lib/citations.ts';
import { validateCatalog } from '../src/lib/content-validation.ts';

const event = {
  slug: 'research-session', title: 'Research session', description: 'Compare the evidence.',
  type: 'Research Seminar', date: '2026-11-21', time: '18:00', timezone: 'Asia/Kolkata',
  mode: 'Virtual', status: 'Upcoming',
  startsAt: '2026-11-21T18:00:00+05:30', endsAt: '2026-11-21T19:00:00+05:30',
};
const origin = 'https://example.org';
const unfold = text => text.replace(/\r\n[ \t]/g, '');
const value = (text, name) => unfold(text).split('\r\n').find(line => line.startsWith(name + ':'))?.slice(name.length + 1);
const unescapeText = text => text.replace(/\\([nN,;\\])/g, (_, character) => /[nN]/.test(character) ? '\n' : character);

test('invalid or missing end dates suppress the download without throwing', () => {
  for (const endsAt of [undefined, '', 'not-a-date', '2026-99-99T19:00:00Z', event.startsAt, '2026-11-20T19:00:00+05:30']) {
    assert.equal(eventCalendar({ ...event, endsAt }, origin), null);
  }
});

test('both exported instants require explicit timezone offsets', () => {
  for (const changed of [
    { startsAt: '2026-11-21T01:00:00' },
    { endsAt: '2026-11-22T19:00:00' },
  ]) assert.equal(eventCalendar({ ...event, ...changed }, origin), null);
});

test('catalog validation rejects an end without an offset and accepts an explicit instant', () => {
  const catalog = { labs: [], projects: [], cohorts: [], publications: [], episodes: [], people: [], chapters: [], events: [event] };
  assert.deepEqual(validateCatalog(catalog), []);
  catalog.events = [{ ...event, endsAt: '2026-11-22T19:00:00' }];
  assert.ok(validateCatalog(catalog).some(message => message.includes('end needs timezone offset')));
});

test('invalid event identifiers and origins never become calendar properties', () => {
  for (const slug of ['', '../elsewhere', 'session\r\nBEGIN:VALARM', 'session?next=other']) {
    assert.equal(eventCalendar({ ...event, slug }, origin), null);
  }
  for (const invalid of ['not a URL', 'javascript:alert(1)', 'https://user:password@example.org', 'https://example.org\r\nX-PROPERTY:yes']) {
    assert.equal(eventCalendar(event, invalid), null);
  }
});

test('canonical event URLs have one separator when the origin has a trailing slash', () => {
  const output = eventCalendar(event, origin + '/');
  assert.equal(value(output, 'URL'), 'https://example.org/events/research-session');
  assert.equal(value(output, 'UID'), 'research-session@example.org');
});

test('all newline conventions remain inside their original text property', () => {
  const text = 'Before\rEND:VEVENT\nBEGIN:VALARM\r\nAfter, semicolon; slash\\end';
  const output = eventCalendar({ ...event, title: text, description: text, location: text }, origin);
  assert.equal(output.replaceAll('\r\n', '').includes('\r'), false);
  assert.equal(output.replaceAll('\r\n', '').includes('\n'), false);
  for (const name of ['SUMMARY', 'DESCRIPTION', 'LOCATION']) {
    assert.equal(unescapeText(value(output, name)), text.replace(/\r\n|\r|\n/g, '\n'));
  }
  assert.equal(unfold(output).split('\r\n').filter(line => line === 'END:VEVENT').length, 1);
  assert.equal(unfold(output).split('\r\n').includes('BEGIN:VALARM'), false);
});

test('long UTF-8 text folds within 75 octets without losing complete characters', () => {
  const text = 'Research: Bengaluru → Zürich; 𝄞, 漢字\\notes '.repeat(12);
  const output = eventCalendar({ ...event, title: text, description: text, location: text }, origin);
  assert.ok(output.includes('\r\n '));
  for (const line of output.split('\r\n')) {
    assert.ok(Buffer.byteLength(line, 'utf8') <= 75, 'each physical line includes its continuation space within 75 octets');
    assert.equal(new TextDecoder('utf-8', { fatal: true }).decode(new TextEncoder().encode(line)), line);
  }
  for (const name of ['SUMMARY', 'DESCRIPTION', 'LOCATION']) assert.equal(unescapeText(value(output, name)), text);
});

test('folding handles the exact ASCII boundary and preserves offset/cancellation semantics', () => {
  const atBoundary = eventCalendar({ ...event, title: 'x'.repeat(67), status: 'Cancelled' }, origin);
  assert.ok(atBoundary.includes('SUMMARY:' + 'x'.repeat(67) + '\r\nDESCRIPTION:'));
  const overBoundary = eventCalendar({ ...event, title: 'x'.repeat(68) }, origin);
  assert.ok(overBoundary.includes('SUMMARY:' + 'x'.repeat(67) + '\r\n x\r\n'));
  assert.equal(value(atBoundary, 'DTSTART'), '20261121T123000Z');
  assert.equal(value(atBoundary, 'DTEND'), '20261121T133000Z');
  assert.equal(value(atBoundary, 'STATUS'), 'CANCELLED');
  assert.ok(atBoundary.endsWith('END:VCALENDAR\r\n'));
});

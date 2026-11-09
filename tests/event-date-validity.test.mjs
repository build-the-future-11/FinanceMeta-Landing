import assert from 'node:assert/strict';
import test from 'node:test';
import { eventCalendar } from '../src/lib/citations.ts';
import { validateCatalog } from '../src/lib/content-validation.ts';

const origin = 'https://example.org';
const event = {
  slug: 'research-session', title: 'Research session', description: 'Calendar validity.',
  type: 'Research Seminar', date: '2026-02-28', time: '18:00', timezone: 'Asia/Kolkata',
  mode: 'Virtual', status: 'Upcoming',
  startsAt: '2026-02-28T18:00:00+05:30', endsAt: '2026-02-28T19:00:00+05:30',
};
const errors = value => validateCatalog({
  labs: [], projects: [], cohorts: [], publications: [], episodes: [], people: [], chapters: [], events: [value],
});
const calendarValue = (output, name) => output.split('\r\n').find(line => line.startsWith(name + ':'))?.slice(name.length + 1);

test('an impossible start is rejected rather than silently exported in March', () => {
  const invalid = { ...event, startsAt: '2026-02-30T18:00:00+05:30', endsAt: '2026-03-03T19:00:00+05:30' };
  assert.ok(errors(invalid).some(message => message.includes('start')));
  assert.equal(eventCalendar(invalid, origin), null);
});

test('an impossible end is rejected rather than silently extending a meeting', () => {
  const invalid = { ...event, startsAt: '2026-02-27T18:00:00Z', endsAt: '2026-02-30T19:00:00Z' };
  assert.ok(errors(invalid).some(message => message.includes('end')));
  assert.equal(eventCalendar(invalid, origin), null);
});

test('calendar-only catalog dates reject impossible days independently of the instants', () => {
  for (const date of ['2026-02-29', '2026-02-30', '2026-04-31', '1900-02-29', '2026-00-01', '2026-13-01', '2026-01-00']) {
    assert.ok(errors({ ...event, date }).some(message => message.includes('invalid event date')), date);
  }
});

test('leap-day and month-length checks apply to both supplied instants', () => {
  for (const date of ['2026-02-29', '2026-04-31', '1900-02-29']) {
    const invalid = { ...event, startsAt: date + 'T18:00:00Z', endsAt: date + 'T19:00:00Z' };
    assert.ok(errors(invalid).some(message => message.includes('start')), date);
    assert.equal(eventCalendar(invalid, origin), null, date);
  }
});

test('midnight rollover and non-ISO parsing cannot silently change the supplied date', () => {
  for (const startsAt of ['2026-02-28T24:00:00Z', 'February 28, 2026 18:00:00Z']) {
    const invalid = { ...event, startsAt, endsAt: '2026-03-02T19:00:00Z' };
    assert.ok(errors(invalid).some(message => message.includes('start')));
    assert.equal(eventCalendar(invalid, origin), null);
  }
});

test('export rejects UTC conversions outside the four-digit calendar year range', () => {
  for (const invalid of [
    { ...event, startsAt: '0001-01-01T00:00:00+01:00', endsAt: '0001-01-01T02:00:00+01:00' },
    { ...event, startsAt: '9999-12-31T22:00:00-02:00', endsAt: '9999-12-31T23:00:00-02:00' },
  ]) assert.equal(eventCalendar(invalid, origin), null);
});

test('real leap days, ordinary month ends, explicit offsets and fractional seconds remain valid', () => {
  for (const date of ['2024-02-29', '2000-02-29', '2026-04-30', '2026-12-31']) {
    const valid = { ...event, date, startsAt: date + 'T18:00:00+05:30', endsAt: date + 'T19:00:00+05:30' };
    assert.deepEqual(errors(valid), []);
    const output = eventCalendar(valid, origin);
    assert.equal(calendarValue(output, 'DTSTART'), date.replaceAll('-', '') + 'T123000Z');
  }
  for (const [startsAt, endsAt, expected] of [
    ['2026-02-28T18:00Z', '2026-02-28T19:00Z', '20260228T180000Z'],
    ['2026-02-28T18:00:00.123Z', '2026-02-28T19:00:00.456Z', '20260228T180000Z'],
    ['2026-02-28T23:30:00-03:30', '2026-03-01T00:30:00-03:30', '20260301T030000Z'],
  ]) {
    const valid = { ...event, startsAt, endsAt };
    assert.deepEqual(errors(valid), []);
    assert.equal(calendarValue(eventCalendar(valid, origin), 'DTSTART'), expected);
  }
});

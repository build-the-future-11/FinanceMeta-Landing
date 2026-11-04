import test from 'node:test';
import assert from 'node:assert/strict';
import { createReadingListStore, readingListKey } from '../src/lib/reading-list.ts';

const a = { href: '/research/projects/a', completed: false };
const b = { href: '/publications/b', completed: false };
const c = { href: '/publications/c', completed: false };
const allowed = new Set([a.href, b.href, c.href]);
function fixture(initial = []) {
  let raw = JSON.stringify(initial);
  let readsFail = false;
  let writesFail = false;
  let accessFails = false;
  let writes = 0;
  const storage = {
    getItem(key) { assert.equal(key, readingListKey); if (readsFail) throw new Error('Read denied'); return raw; },
    setItem(key, value) { assert.equal(key, readingListKey); if (writesFail) throw new Error('Quota exceeded'); raw = value; writes += 1; },
  };
  return {
    client: () => createReadingListStore(allowed, () => { if (accessFails) throw new Error('Access denied'); return storage; }),
    stored: () => JSON.parse(raw),
    external: value => { raw = JSON.stringify(value); },
    failReads: value => { readsFail = value; },
    failWrites: value => { writesFail = value; },
    failAccess: value => { accessFails = value; },
    writes: () => writes,
  };
}

test('two tabs with the same stale snapshot retain both distinct saves', () => {
  const f = fixture(); const first = f.client(); const second = f.client();
  const shownFirst = first.restore().entries; const shownSecond = second.restore().entries;
  first.update(shownFirst, [...shownFirst, a]);
  const result = second.update(shownSecond, [...shownSecond, b]);
  assert.deepEqual(result.entries, [a, b]); assert.deepEqual(f.stored(), [a, b]);
  assert.equal(result.pending, false); assert.equal(result.storageAvailable, true);
});

test('stale removal preserves another tab’s addition and completion', () => {
  const f = fixture([a, b]); const stale = f.client(); const other = f.client();
  const shown = stale.restore().entries; const theirs = other.restore().entries;
  other.update(theirs, [a, { ...b, completed: true }, c]);
  assert.deepEqual(stale.update(shown, [b]).entries, [{ ...b, completed: true }, c]);
});

test('stale completion preserves unrelated new entries and does not resurrect removed entries', () => {
  const f = fixture([a, b]); const stale = f.client(); const shown = stale.restore().entries;
  f.external([b, c]);
  assert.deepEqual(stale.update(shown, [{ ...a, completed: true }, b]).entries, [b, c]);
});

test('a stale Save action preserves the completed state of an already-saved entry', () => {
  const f = fixture(); const stale = f.client(); const shown = stale.restore().entries;
  f.external([{ ...a, completed: true }]);
  assert.deepEqual(stale.update(shown, [a]).entries, [{ ...a, completed: true }]);
});

test('saving after an external clear does not restore untouched stale entries', () => {
  const f = fixture([a]); const client = f.client(); const shown = client.restore().entries;
  f.external([]);
  assert.deepEqual(client.update(shown, [a, b]).entries, [b]);
});

test('repeated same-render updates merge intent without losing earlier actions', () => {
  const f = fixture(); const client = f.client(); const shown = client.restore().entries;
  client.update(shown, [a]);
  assert.deepEqual(client.update(shown, [b]).entries, [a, b]);
});

test('failed writes stay visible through storage events and persist on the next edit', () => {
  const f = fixture([a]); const client = f.client(); const shown = client.restore().entries;
  f.failWrites(true);
  const failed = client.update(shown, [a, b]);
  assert.deepEqual(failed.entries, [a, b]); assert.deepEqual(f.stored(), [a]);
  assert.equal(failed.pending, true); assert.equal(failed.storageAvailable, false);
  f.external([{ ...a, completed: true }, c]);
  const restored = client.restore();
  assert.deepEqual(restored.entries, [{ ...a, completed: true }, c, b]);
  assert.equal(restored.pending, true); assert.equal(f.writes(), 0);
  f.failWrites(false);
  const retried = client.update(restored.entries, [{ ...a, completed: true }, c, { ...b, completed: true }]);
  assert.deepEqual(f.stored(), [{ ...a, completed: true }, c, { ...b, completed: true }]);
  assert.equal(retried.pending, false); assert.equal(retried.storageAvailable, true);
});

test('failed removals remain removed after another tab updates storage', () => {
  const f = fixture([a, b]); const client = f.client(); const shown = client.restore().entries;
  f.failWrites(true); client.update(shown, [b]);
  f.external([a, b, c]);
  const restored = client.restore(); assert.deepEqual(restored.entries, [b, c]);
  f.failWrites(false);
  client.update(restored.entries, [b, { ...c, completed: true }]);
  assert.deepEqual(f.stored(), [b, { ...c, completed: true }]);
});

test('failed completion does not resurrect an entry remotely removed before retry', () => {
  const f = fixture([a]); const client = f.client(); const shown = client.restore().entries;
  f.failWrites(true); client.update(shown, [{ ...a, completed: true }]);
  f.external([]);
  assert.deepEqual(client.restore().entries, []);
  f.failWrites(false); client.update([], [b]); assert.deepEqual(f.stored(), [b]);
});

test('an unsaved add followed by remove cannot resurrect on retry', () => {
  const f = fixture(); const client = f.client(); const shown = client.restore().entries;
  f.failWrites(true); const added = client.update(shown, [a]);
  const removed = client.update(added.entries, []); assert.deepEqual(removed.entries, []);
  f.external([b]); f.failWrites(false);
  assert.deepEqual(client.update(removed.entries, [c]).entries, [b, c]);
});

test('failed reads preserve local edits without overwriting unreadable remote data', () => {
  const f = fixture([a]); const client = f.client(); const shown = client.restore().entries;
  f.failReads(true);
  const failed = client.update(shown, [a, b]); assert.deepEqual(failed.entries, [a, b]);
  assert.equal(failed.pending, true); assert.equal(failed.storageAvailable, false); assert.equal(f.writes(), 0);
  assert.deepEqual(client.restore().entries, [a, b]);
  f.external([a, c]); f.failReads(false);
  const restored = client.restore(); assert.deepEqual(restored.entries, [a, c, b]);
  client.update(restored.entries, restored.entries); assert.deepEqual(f.stored(), [a, c, b]);
});

test('storage accessor failures recover without losing edits made in memory', () => {
  const f = fixture([b]); f.failAccess(true); const client = f.client();
  assert.equal(client.restore().storageAvailable, false);
  assert.deepEqual(client.update([], [a]).entries, [a]);
  f.failAccess(false); assert.deepEqual(client.update([a], [a, c]).entries, [b, a, c]);
});

test('normal storage sync and clear replace the view without writing back', () => {
  const f = fixture([a]); const client = f.client(); client.restore();
  f.external([b]); assert.deepEqual(client.restore().entries, [b]);
  f.external([]); assert.deepEqual(client.restore().entries, []); assert.equal(f.writes(), 0);
});

test('unrecognized links and duplicate entries cannot enter through an update', () => {
  const f = fixture(); const client = f.client(); client.restore();
  const result = client.update([], [a, a, { href: 'https://bad.example', completed: false }, { ...b, completed: 'yes' }]);
  assert.deepEqual(result.entries, [a]); assert.deepEqual(f.stored(), [a]);
});

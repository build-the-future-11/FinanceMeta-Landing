import test from 'node:test';
import assert from 'node:assert/strict';
import { parseReadingList } from '../src/lib/reading-list.ts';

const allowed = new Set(['/research/projects/fi-jepa', '/publications/example']);
test('reading list rejects broken storage and unexpected shapes', () => {
  for (const raw of [null, '{broken', '{}', 'null', '42']) assert.deepEqual(parseReadingList(raw, allowed), []);
});
test('restores valid read states and discards duplicates, unsafe links and removed records', () => {
  const raw = JSON.stringify([
    { href: '/research/projects/fi-jepa', completed: true, title: 'Untrusted title' },
    { href: '/research/projects/fi-jepa', completed: false },
    { href: 'https://untrusted.example', completed: false },
    { href: '/removed', completed: false },
    { href: '/publications/example', completed: 'yes' },
    null,
    { href: '/publications/example', completed: false },
  ]);
  assert.deepEqual(parseReadingList(raw, allowed), [
    { href: '/research/projects/fi-jepa', completed: true },
    { href: '/publications/example', completed: false },
  ]);
});

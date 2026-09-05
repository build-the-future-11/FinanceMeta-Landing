import assert from 'node:assert/strict';
import test from 'node:test';

import { validateExpectedMemberAppUrl } from '../scripts/verify-member-handoff.mjs';
import { parsePublicMemberAppUrl } from '../src/member-handoff-policy.mjs';

const CANONICAL = 'https://finance4all.example.app/';
const TRAILING_DOT = 'https://finance4all.example.app./';

test('member handoff accepts the canonical hostname and rejects trailing-dot aliases', () => {
  assert.equal(parsePublicMemberAppUrl(CANONICAL)?.href, CANONICAL);
  assert.equal(validateExpectedMemberAppUrl(CANONICAL).href, CANONICAL);

  assert.equal(parsePublicMemberAppUrl(TRAILING_DOT), null);
  assert.throws(
    () => validateExpectedMemberAppUrl(TRAILING_DOT),
    /member handoff check failed/,
  );
});

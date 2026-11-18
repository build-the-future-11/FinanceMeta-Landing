import test from 'node:test';
import assert from 'node:assert/strict';
import { amortize } from '../src/lib/finance-tools.ts';

// Independent references: Python decimal with 90-digit precision, a payment
// derived from (1 + rate) ** (-months), then an iterative cash-flow ledger:
// interest = balance * rate; paid = min(balance + interest, payment + extra);
// balance = max(0, balance + interest - paid). Inputs were exact decimal strings.
const references = [
  { name: 'near-zero positive rate', input: [100000, 1e-14, 20, 0],
    payment: 416.6666666666671, interest: 1.004166666666667e-10, months: 240,
    balances: [[1, 99583.33333333333], [120, 50000.00000000002], [239, 416.6666666666671]] },
  { name: 'small positive rate', input: [100000, 1e-8, 20, 0],
    payment: 416.66666708506943, interest: 0.00010041666669999942, months: 240,
    balances: [[1, 99583.33333374826], [120, 50000.000025], [239, 416.6666670815972]] },
  { name: 'ordinary fixed-rate loan', input: [100000, 6, 20, 0],
    payment: 716.4310584781649, interest: 71943.45403475958, months: 240,
    balances: [[1, 99783.56894152184], [120, 64531.41950796702], [239, 712.8667248538954]] },
  { name: 'maximum allowed rate and term', input: [1e9, 100, 50, 0],
    payment: 83333333.33333333, interest: 49000000000, months: 600,
    balances: [[1, 1e9], [300, 999999999.9627292], [599, 76923076.92307693]] },
  { name: 'maximum extra payment at a high rate', input: [1e9, 100, 50, 1e7],
    payment: 83333333.33333333, interest: 1604784850.370641, months: 28,
    balances: [[1, 990000000], [27, 78262938.80366868]] },
  { name: 'ordinary extra payments', input: [100000, 6, 30, 100],
    payment: 599.5505251527524, interest: 75937.93582281066, months: 252,
    balances: [[1, 99800.44947484725], [180, 41966.973206466435], [251, 349.0089646465731]] },
];
const close = (actual, expected, label) => {
  assert.ok(Number.isFinite(actual), `${label} must be finite; got ${actual}`);
  const tolerance = Math.max(1e-7, Math.abs(expected) * 5e-14);
  assert.ok(Math.abs(actual - expected) <= tolerance, `${label}: ${actual} != ${expected}`);
};
for (const reference of references) {
  test(`amortization matches independent cash-flow reference: ${reference.name}`, () => {
    const result = amortize(...reference.input);
    close(result.payment, reference.payment, 'payment');
    close(result.totalInterest, reference.interest, 'total interest');
    assert.equal(result.months, reference.months);
    assert.equal(result.rows.at(-1).balance, 0, 'the reported repayment month must clear the principal');
    assert.equal(result.rows.at(-1).contributed, reference.input[0]);
    for (const [month, balance] of reference.balances) close(result.rows[month - 1].balance, balance, `month ${month} balance`);
    assert.ok(result.rows.every((row, i) => Number.isFinite(row.balance) && row.balance >= 0 &&
      (i === 0 || row.balance <= result.rows[i - 1].balance)), 'balances must be finite, non-negative and non-increasing');
  });
}

test('subnormal positive rates retain fractional principal and extra payments', () => {
  for (const extra of [0, 0.01, 0.1]) {
    const result = amortize(1.1, 1e-320, 1, extra);
    // At this rate the exact correction is below floating-point precision;
    // the cash flows must converge to their zero-interest values.
    assert.ok(Math.abs(result.payment - 1.1 / 12) < 1e-15);
    assert.equal(result.months, Math.ceil(1.1 / (1.1 / 12 + extra)));
    for (const row of result.rows) {
      const expected = Math.max(0, 1.1 - row.period * (1.1 / 12 + extra));
      assert.ok(Math.abs(row.balance - expected) < 1e-14, `month ${row.period} must preserve fractional principal`);
    }
    assert.equal(result.rows.at(-1).balance, 0);
  }
});

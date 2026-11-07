import test from "node:test";
import assert from "node:assert/strict";
import { initialState, reduce, totals, projection, comparePurchase } from "../public/spendsmarter/money-core.js";

function apply(state, action) {
  const before = structuredClone(state);
  const result = reduce(state, action);
  assert.deepEqual(state, before, "actions must not mutate their input");
  const t = totals(result.state);
  assert.equal(t.available + t.spent + t.saved, 600);
  assert.ok(t.available >= 0 && t.spent >= 0 && t.saved >= 0);
  return result;
}

test("spending, saving and a shared-device decision conserve the allowance", () => {
  let state = initialState();
  for (const action of [
    { type: "BUY", id: "bus" },
    { type: "SAVE", amount: 200 },
    { type: "PARENT_APPROVE", id: "gift" }
  ]) {
    const result = apply(state, action);
    assert.equal(result.kind, "success");
    state = result.state;
  }
  assert.deepEqual(totals(state), { spent: 175, needs: 100, wants: 75, saved: 200, available: 225 });
  assert.deepEqual(state.completed, { spend: true, save: true, discuss: true });
  assert.equal(projection(state).weeks, 4);
});

test("undo of a savings-funded surprise restores the savings allocation", () => {
  let state = apply(initialState(), { type: "SAVE", amount: 200 }).state;
  state = apply(state, { type: "SHOW_SURPRISE" }).state;
  const before = totals(state);
  state = apply(state, { type: "PAY_SURPRISE", source: "savings" }).state;
  assert.equal(state.saved, 120);
  state = apply(state, { type: "REMOVE", id: state.entries[0].id }).state;
  assert.deepEqual(totals(state), before);
  assert.equal(state.surpriseApplied, false);
});

test("undo of a wallet-funded surprise leaves savings untouched", () => {
  let state = apply(initialState(), { type: "SAVE", amount: 200 }).state;
  state = apply(state, { type: "SHOW_SURPRISE" }).state;
  const before = totals(state);
  state = apply(state, { type: "PAY_SURPRISE", source: "wallet" }).state;
  state = apply(state, { type: "REMOVE", id: state.entries[0].id }).state;
  assert.deepEqual(totals(state), before);
});

test("double approval cannot charge the same request twice; undo permits another attempt", () => {
  let state = apply(initialState(), { type: "PARENT_APPROVE", id: "game" }).state;
  const second = apply(state, { type: "PARENT_APPROVE", id: "game" });
  assert.equal(second.kind, "notice");
  assert.deepEqual(second.state, state);
  const wait = apply(state, { type: "PARENT_WAIT", id: "game" });
  assert.equal(wait.kind, "notice");
  assert.equal(wait.state.parentDecision.choice, "approved");
  state = apply(state, { type: "REMOVE", id: state.entries[0].id }).state;
  const retry = apply(state, { type: "PARENT_APPROVE", id: "game" });
  assert.equal(retry.kind, "success");
  assert.equal(totals(retry.state).spent, 120);
});

test("waiting costs nothing and invalid request IDs are rejected", () => {
  const state = initialState();
  const waiting = apply(state, { type: "PARENT_WAIT", id: "craft" });
  assert.equal(waiting.kind, "success");
  assert.deepEqual(totals(waiting.state), totals(state));
  assert.equal(waiting.state.completed.discuss, true);
  const invalid = apply(state, { type: "PARENT_WAIT", id: "unknown" });
  assert.equal(invalid.kind, "notice");
  assert.deepEqual(invalid.state, state);
});

test("negative, fractional, unsafe and over-budget inputs do not change money", () => {
  const state = initialState();
  for (const amount of [-1, 0, 1.5, 601, Infinity, NaN, Number.MAX_SAFE_INTEGER + 1]) {
    const spent = apply(state, { type: "CUSTOM_SPEND", amount, category: "want" });
    assert.equal(spent.kind, "notice");
    assert.deepEqual(spent.state, state);
    const saved = apply(state, { type: "SAVE", amount });
    assert.equal(saved.kind, "notice");
    assert.deepEqual(saved.state, state);
  }
});

test("zero weekly saving has no finite goal completion estimate", () => {
  const state = apply(initialState(), { type: "WEEKLY", amount: 0 }).state;
  assert.equal(projection(state).weeks, null);
});

test("reset starts a fresh fictional week", () => {
  let state = apply(initialState(), { type: "SAVE", amount: 200 }).state;
  state = apply(state, { type: "PARENT_APPROVE", id: "craft" }).state;
  state = apply(state, { type: "RESET" }).state;
  assert.deepEqual(state, initialState());
});

test("buy-versus-save comparison changes neither balance nor purchase history", () => {
  const state = apply(initialState(), { type: "SAVE", amount: 200 }).state;
  const before = structuredClone(state);
  const comparison = comparePurchase(state, "game");
  assert.deepEqual(state, before);
  assert.equal(comparison.savedIfBuying, 200);
  assert.equal(comparison.savedIfSaving, 320);
  assert.equal(comparison.availableAfterEither, 280);
  assert.equal(comparison.weeksIfBuying, 4);
  assert.equal(comparison.weeksIfSaving, 3);
  assert.equal(comparison.weeksEarlier, 1);
});

test("comparison is unavailable for unaffordable, purchased or unknown requests", () => {
  const short = apply(initialState(), { type: "SAVE", amount: 550 }).state;
  assert.equal(comparePurchase(short, "gift"), null);
  const bought = apply(initialState(), { type: "PARENT_APPROVE", id: "gift" }).state;
  assert.equal(comparePurchase(bought, "gift"), null);
  assert.equal(comparePurchase(initialState(), "not-a-request"), null);
});

test("a zero-contribution comparison never invents a finite completion date", () => {
  const state = apply(initialState(), { type: "WEEKLY", amount: 0 }).state;
  const comparison = comparePurchase(state, "gift");
  assert.equal(comparison.weeksIfBuying, null);
  assert.equal(comparison.weeksIfSaving, null);
  assert.equal(comparison.weeksEarlier, null);
});

test("comparison uses whole-week estimates without inventing fractional time gains", () => {
  let state = apply(initialState(), { type: "SAVE", amount: 100 }).state;
  state = apply(state, { type: "WEEKLY", amount: 300 }).state;
  const comparison = comparePurchase(state, "gift");
  assert.equal(comparison.weeksIfBuying, 2);
  assert.equal(comparison.weeksIfSaving, 2);
  assert.equal(comparison.weeksEarlier, 0);
  assert.equal(comparison.savedIfSaving - comparison.savedIfBuying, 75);
});

test("saving exactly the remaining goal cost shows goal funded even with no weekly plan", () => {
  let state = apply(initialState(), { type: "SAVE", amount: 480 }).state;
  state = apply(state, { type: "WEEKLY", amount: 0 }).state;
  const comparison = comparePurchase(state, "game");
  assert.equal(comparison.availableAfterEither, 0);
  assert.equal(comparison.weeksIfBuying, null);
  assert.equal(comparison.weeksIfSaving, 0);
  assert.equal(comparison.weeksEarlier, null);
});

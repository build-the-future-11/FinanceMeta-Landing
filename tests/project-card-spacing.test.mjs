import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

// Source contracts complement the isolated Chromium geometry regression.
// They are not a substitute for the release build or live application tests.
const css = readFileSync(new URL('../src/discovery.css', import.meta.url), 'utf8');
const selector = /\.project-card\s*>\s*\.card-link\s*\+\s*\.card-link\s*\{([^}]+)\}/g;

test('only subsequent adjacent project actions receive a fixed margin', () => {
  const rules = [...css.matchAll(selector)];
  assert.equal(rules.length, 1);
  assert.match(rules[0][1], /^\s*margin-top:\s*16px;\s*$/);
});

test('project action spacing stays in the shared component layer', () => {
  const layerStart = css.indexOf('@layer fm-components {');
  const ruleStart = css.indexOf('.project-card > .card-link + .card-link');
  const mediaStart = css.indexOf('@media');
  assert.ok(layerStart >= 0 && ruleStart > layerStart);
  assert.ok(ruleStart < mediaStart, 'spacing must also apply outside media queries');
});

test('save-action spacing remains independent of the website link', () => {
  assert.match(css, /\.project-card \.save-button, \.publication-card \.save-button\s*\{\s*display:\s*flex;\s*margin-top:\s*20px;\s*\}/);
});

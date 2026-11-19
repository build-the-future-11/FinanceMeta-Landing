import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import test from 'node:test';
import postcss from 'postcss';
import tailwind from '@tailwindcss/postcss';

const legacyFile = fileURLToPath(new URL('../src/legacy/index.css', import.meta.url));
const legacySource = await readFile(legacyFile, 'utf8');
const compiled = await postcss([tailwind({ optimize: false })]).process(
  `${legacySource}\n@source inline("bg-primary text-primaryDark dark:bg-primary md:grid-cols-2 sr-only");\n`,
  { from: legacyFile },
);

function rulesWith(selector) {
  const rules = [];
  compiled.root.walkRules(rule => { if (rule.selector === selector) rules.push(rule); });
  return rules;
}

test('the legacy stylesheet compiles with its configured brand colors and class dark mode', () => {
  assert.deepEqual(compiled.warnings(), []);
  assert.ok(rulesWith('.bg-primary').some(rule => rule.nodes.some(node => node.prop === 'background-color' && node.value === '#10b981')));
  assert.ok(rulesWith('.text-primaryDark').some(rule => rule.nodes.some(node => node.prop === 'color' && node.value === '#059669')));
  assert.ok(rulesWith('.dark\\:bg-primary:is(.dark *)').length > 0);
  const unprocessed = [];
  compiled.root.walkAtRules(rule => { if (['config', 'source', 'tailwind', 'import'].includes(rule.name)) unprocessed.push(rule.toString()); });
  assert.deepEqual(unprocessed, []);
});

test('responsive and screen-reader utilities remain generated', () => {
  assert.ok(rulesWith('.md\\:grid-cols-2').some(rule => rule.parent.type === 'atrule' && rule.parent.name === 'media' && rule.parent.params.includes('48rem')));
  assert.ok(rulesWith('.sr-only').some(rule => rule.nodes.some(node => node.prop === 'position' && node.value === 'absolute')));
});

test('the main research stylesheet does not acquire Tailwind preflight or utility layers', async () => {
  const file = fileURLToPath(new URL('../src/index.css', import.meta.url));
  const result = await postcss([tailwind({ optimize: false })]).process(await readFile(file, 'utf8'), { from: file });
  const addedLayers = [];
  result.root.walkAtRules('layer', rule => {
    if (rule.params.split(',').some(name => ['theme', 'base', 'utilities'].includes(name.trim()))) addedLayers.push(rule.params);
  });
  assert.deepEqual(addedLayers, []);
});

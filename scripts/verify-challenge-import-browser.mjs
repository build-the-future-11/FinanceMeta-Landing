// Run against a built local site with Playwright available to Node.
// QA_ORIGIN defaults to scripts/qa-server.mjs; BROWSER defaults to chromium.
import assert from 'node:assert/strict';
import { createRequire } from 'node:module';
import { writeFileSync } from 'node:fs';
import { briefBackup, newBrief } from '../src/lib/challenge-brief.ts';

const require = createRequire(import.meta.url);
const playwright = require(process.env.PLAYWRIGHT_MODULE || 'playwright');
const engine = process.env.BROWSER || 'chromium';
assert.ok(['chromium', 'firefox', 'webkit'].includes(engine), 'Supported browser');
const origin = process.env.QA_ORIGIN || 'http://127.0.0.1:4181';
const browser = await playwright[engine].launch({ headless: true });
const results = [];

function backup(title) {
  const draft = newBrief();
  draft.title = title;
  draft.sections.question = 'Does the same evidence support the claim?';
  return briefBackup(draft);
}

async function check(name, scenario) {
  const page = await browser.newPage();
  const pageErrors = [];
  page.on('pageerror', error => pageErrors.push(error.message));
  try {
    await page.addInitScript(() => {
      const original = File.prototype.text;
      const reads = new Map();
      File.prototype.text = function () {
        const file = this;
        return new Promise((resolve, reject) => {
          reads.set(file.name, {
            resolve: async () => resolve(await original.call(file)),
            reject: () => reject(new Error('Fixture file read failed.')),
          });
        });
      };
      window.__briefReads = reads;
    });
    await page.goto(origin + '/challenges/prepare');
    const title = page.getByLabel('Working title', { exact: true });
    await title.fill('Keep my current writing');
    const input = page.getByLabel('Open an editable backup', { exact: true });
    const confirmation = page.getByRole('region', { name: 'Confirm backup replacement' });
    const alert = page.locator('.challenge-error[role="alert"]');
    const select = (name, contents = backup(name)) => input.setInputFiles({ name, mimeType: 'application/json', buffer: Buffer.from(contents) });
    const finish = async (name, action = 'resolve') => {
      await page.evaluate(async ({ name, action }) => {
        const read = window.__briefReads.get(name);
        if (!read) throw new Error('Missing deferred read: ' + name);
        window.__briefReads.delete(name);
        await read[action]();
        await new Promise(resolve => requestAnimationFrame(() => requestAnimationFrame(resolve)));
      }, { name, action });
    };
    const accept = () => page.getByRole('button', { name: 'Replace current draft', exact: true }).click();
    await scenario({ page, title, confirmation, alert, select, finish, accept });
    assert.deepEqual(pageErrors, [], 'No page errors');
    results.push({ name, status: 'passed' });
    console.log('PASS ' + name);
  } catch (error) {
    results.push({ name, status: 'failed', error: error.message });
    console.error('FAIL ' + name + ': ' + error.message);
  } finally {
    await page.close();
  }
}

try {
  await check('latest valid file stays selected when an earlier read finishes last', async ({ title, confirmation, select, finish, accept }) => {
    await select('earlier.json');
    await select('latest.json');
    await finish('latest.json');
    assert.match(await confirmation.textContent(), /latest\.json/);
    await title.fill('Writing added while choosing a backup');
    await finish('earlier.json');
    assert.match(await confirmation.textContent(), /latest\.json/);
    assert.equal(await title.inputValue(), 'Writing added while choosing a backup');
    await accept();
    assert.equal(await title.inputValue(), 'latest.json');
  });

  await check('accepting the latest file is not followed by an older confirmation', async ({ title, confirmation, select, finish, accept }) => {
    await select('earlier.json');
    await select('latest.json');
    await finish('latest.json');
    await accept();
    await finish('earlier.json');
    assert.equal(await title.inputValue(), 'latest.json');
    assert.equal(await confirmation.count(), 0);
  });

  await check('an older parse error cannot replace the latest success state', async ({ title, alert, select, finish, accept }) => {
    await select('invalid.json', '{');
    await select('latest.json');
    await finish('latest.json');
    await accept();
    await finish('invalid.json');
    assert.equal(await title.inputValue(), 'latest.json');
    assert.equal(await alert.textContent(), '');
  });

  await check('an older file read rejection cannot replace the latest success state', async ({ title, alert, select, finish, accept }) => {
    await select('unreadable.json');
    await select('latest.json');
    await finish('latest.json');
    await accept();
    await finish('unreadable.json', 'reject');
    assert.equal(await title.inputValue(), 'latest.json');
    assert.equal(await alert.textContent(), '');
  });

  await check('the newest invalid selection does not fall back to an older valid file', async ({ title, confirmation, alert, select, finish }) => {
    await select('earlier.json');
    await select('invalid.json', '{');
    await finish('invalid.json');
    await finish('earlier.json');
    assert.match(await alert.textContent(), /not valid JSON/);
    assert.equal(await confirmation.count(), 0);
    assert.equal(await title.inputValue(), 'Keep my current writing');
  });

  await check('an oversized newest selection also supersedes an earlier read', async ({ title, confirmation, alert, select, finish }) => {
    await select('earlier.json');
    await select('oversized.json', ' '.repeat(256 * 1024 + 1));
    await finish('earlier.json');
    assert.match(await alert.textContent(), /smaller than 256 KB/);
    assert.equal(await confirmation.count(), 0);
    assert.equal(await title.inputValue(), 'Keep my current writing');
  });

  await check('cancelling the latest preview keeps earlier reads cancelled too', async ({ page, title, confirmation, select, finish }) => {
    await select('earlier.json');
    await select('latest.json');
    await finish('latest.json');
    await page.getByRole('button', { name: 'Cancel import', exact: true }).click();
    await finish('earlier.json');
    assert.equal(await confirmation.count(), 0);
    assert.equal(await title.inputValue(), 'Keep my current writing');
  });

  await check('a single valid backup still needs confirmation and preserves every section', async ({ page, title, confirmation, select, finish, accept }) => {
    const draft = newBrief('backtest-falsification');
    draft.title = 'One valid backup';
    for (const id of Object.keys(draft.sections)) draft.sections[id] = 'Saved section: ' + id;
    await select('one.json', briefBackup(draft));
    await finish('one.json');
    assert.equal(await title.inputValue(), 'Keep my current writing');
    assert.equal(await confirmation.count(), 1);
    await accept();
    assert.equal(await title.inputValue(), draft.title);
    assert.equal(await page.getByLabel('Practice track', { exact: true }).inputValue(), draft.track);
    for (const id of Object.keys(draft.sections)) assert.equal(await page.locator('#brief-' + id).inputValue(), draft.sections[id]);
    assert.equal(await confirmation.count(), 0);
  });
} finally {
  await browser.close();
}

if (process.env.QA_EVIDENCE_FILE) writeFileSync(process.env.QA_EVIDENCE_FILE, JSON.stringify({ engine, origin, results }, null, 2) + '\n');
const failures = results.filter(result => result.status === 'failed');
console.log(`${results.length - failures.length}/${results.length} challenge backup import scenarios passed.`);
assert.equal(failures.length, 0, 'Challenge import browser regressions');

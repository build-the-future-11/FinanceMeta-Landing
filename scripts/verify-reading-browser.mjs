import { createRequire } from 'node:module';
import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import assert from 'node:assert/strict';
const require = createRequire(import.meta.url);
const { chromium } = require('../Finance4allLanding/node_modules/@playwright/test');
const origin = process.env.QA_ORIGIN || 'http://127.0.0.1:4195';
const destination = 'evidence/ui-reading-list-2026-09-25';
mkdirSync(destination, { recursive: true });
const browser = await chromium.launch({ channel: 'chrome', headless: true });
const context = await browser.newContext({ viewport: { width: 1440, height: 1000 }, reducedMotion: 'reduce' });
const page = await context.newPage();
const errors = [], scans = [];
page.on('pageerror', error => errors.push(error.message));
try {
  await page.goto(origin);
  await page.getByRole('button', { name: 'I want to research' }).click();
  assert.ok(await page.getByRole('heading', { name: 'Follow the evidence.' }).isVisible());
  await page.getByRole('button', { name: 'I want to contribute' }).click();
  assert.ok(await page.getByRole('link', { name: /Compare programs/ }).isVisible());
  await page.getByRole('button', { name: /^Save .* to reading list$/ }).click();
  await page.getByRole('link', { name: 'Reading list, 1 saved items' }).click();
  await page.getByRole('checkbox', { name: /Mark as read/ }).check();
  await page.reload();
  await page.getByRole('checkbox', { name: /Mark as read/ }).waitFor();
  assert.equal(await page.getByRole('checkbox').isChecked(), true);
  await page.getByRole('button', { name: 'Unread', exact: true }).click();
  assert.ok(await page.getByRole('heading', { name: 'You’re all caught up.' }).isVisible());
  await page.getByRole('button', { name: 'All', exact: true }).click();
  const downloadPromise = page.waitForEvent('download');
  await page.getByRole('button', { name: /Export reading list/ }).click();
  const download = await downloadPromise;
  await download.saveAs(`${destination}/reading-list.md`);
  assert.match(readFileSync(`${destination}/reading-list.md`, 'utf8'), /- \[x\].*fi-jepa/);
  const other = await context.newPage();
  await other.goto(origin + '/research/projects/fi-jepa');
  await other.getByRole('button', { name: /^Remove .* from reading list$/ }).click();
  await page.getByRole('heading', { name: 'Your next idea starts here.' }).waitFor();
  await other.close();
  await page.goto(origin + '/publications');
  await page.getByRole('button', { name: /^Save .* to reading list$/ }).first().click();
  await page.getByRole('link', { name: 'Reading list, 1 saved items' }).click();
  assert.equal(await page.locator('.saved-records article').count(), 1);
  await page.locator('.saved-records h2 a').click();
  await page.locator('.article-sidebar .save-button[aria-pressed=true]').waitFor();
  for (const width of [1440, 390, 320]) {
    await page.setViewportSize({ width, height: 1000 });
    for (const theme of ['light', 'dark']) {
      for (const path of ['/', '/reading-list', '/research', '/publications']) {
        const response = await page.goto(origin + path, { waitUntil: 'networkidle' });
        assert.equal(response.status(), 200, path);
        await page.getByRole('heading', { level: 1 }).waitFor();
        await page.evaluate(theme => { document.documentElement.dataset.theme = theme; localStorage.setItem('financemeta-theme', theme); }, theme);
        assert.equal(await page.evaluate(() => document.documentElement.scrollWidth > innerWidth + 1), false, `${path} overflow at ${width}`);
        await page.addScriptTag({ url: origin + '/__qa/axe.js' });
        const violations = await page.evaluate(async () => (await axe.run(document, { runOnly: { type: 'tag', values: ['wcag2a', 'wcag2aa', 'wcag21aa'] } })).violations.map(v => ({ id: v.id, nodes: v.nodes.map(n => ({ target: n.target, summary: n.failureSummary })) })));
        scans.push({ path, width, theme, violations });
        if ((path === '/' || path === '/reading-list') && width !== 320) await page.screenshot({ path: `${destination}/${path === '/' ? 'home' : 'reading-list'}-${width}-${theme}.png`, fullPage: true });
      }
    }
  }
  await page.goto(origin);
  await page.getByRole('button', { name: 'Menu', exact: true }).click();
  assert.ok(await page.locator('#mobile-navigation').isVisible());
  await page.keyboard.press('Escape');
  assert.equal(await page.locator('#mobile-navigation').isVisible(), false);
  await page.goto(origin + '/join');
  await page.getByRole('textbox', { name: 'What would you like to contribute?' }).fill('I would like to contribute a reproducible financial research evaluation.');
  await page.getByRole('button', { name: /Prepare email draft/ }).click();
  await page.getByRole('heading', { name: 'Your draft is ready. Nothing has been sent.' }).waitFor();
  await page.goto(origin + '/learn/glossary');
  await page.getByRole('searchbox', { name: 'Search the glossary' }).fill('zzzz-no-result');
  await page.getByRole('button', { name: 'Clear search' }).waitFor();
  for (const path of ['/learn/practice', '/open/tools', '/programs/compare']) {
    const response = await page.goto(origin + path, { waitUntil: 'networkidle' });
    assert.equal(response.status(), 200);
    await page.getByRole('heading', { level: 1 }).waitFor();
    assert.equal(await page.evaluate(() => document.documentElement.scrollWidth > innerWidth + 1), false, path);
  }
  const blocked = await browser.newContext();
  await blocked.addInitScript(() => { Object.defineProperty(Storage.prototype, 'setItem', { value() { throw new Error('Storage blocked'); } }); });
  const blockedPage = await blocked.newPage();
  await blockedPage.goto(origin);
  await blockedPage.getByRole('button', { name: /^Save .* to reading list$/ }).click();
  assert.ok(await blockedPage.getByRole('status').filter({ hasText: 'Could not save' }).isVisible());
  await blocked.close();
  writeFileSync(`${destination}/browser-report.json`, JSON.stringify({ errors, scans, interactions: ['intent picker', 'save', 'reload', 'read state', 'filter', 'markdown export', 'cross-tab sync', 'remove', 'article save state', 'mobile menu keyboard', 'storage failure'] }, null, 2));
  assert.deepEqual(errors, []);
  assert.deepEqual(scans.flatMap(scan => scan.violations.map(v => ({ ...v, path: scan.path, width: scan.width, theme: scan.theme }))), []);
  console.log(`Reading list flows and ${scans.length} responsive accessibility scans passed.`);
} finally { await browser.close(); }

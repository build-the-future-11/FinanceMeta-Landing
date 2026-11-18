// Source-bound, local-page acceptance for the Finance for All landing.
// This does not visit the live portal, submit forms, or change production state.
import assert from 'node:assert/strict';
import { spawn } from 'node:child_process';
import { once } from 'node:events';
import { mkdtempSync, readFileSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { chromium, firefox, webkit, expect } from '@playwright/test';

const origin = 'http://127.0.0.1:4181';
const evidence = mkdtempSync(join(tmpdir(), 'financemeta-browser-'));
const receipt = JSON.parse(readFileSync('dist/release-revision.json', 'utf8'));
assert.match(receipt.revision, /^[0-9a-f]{40}$/);
assert.equal(receipt.revision, process.env.SOURCE_SHA, 'Browser QA must use the exact certified source revision');
const report = { revision: receipt.revision, startedAt: new Date().toISOString(), scenarios: [], failures: [] };
const server = spawn(process.execPath, ['scripts/qa-server.mjs'], {
  env: { ...process.env, QA_PORT: '4181', QA_EVIDENCE_DIR: evidence }, stdio: ['ignore', 'pipe', 'pipe'],
});
let serverLog = '';
server.stdout.on('data', data => { serverLog += data; });
server.stderr.on('data', data => { serverLog += data; });
server.on('error', error => { serverLog += error.message; });

async function audit(page, label) {
  const violations = await page.evaluate(async () => {
    const result = await window.axe.run(document, {
      runOnly: { type: 'tag', values: ['wcag2a', 'wcag2aa', 'wcag21aa', 'wcag22aa', 'best-practice'] },
    });
    return result.violations.map(({ id, impact, help, nodes }) => ({ id, impact, help,
      nodes: nodes.map(({ target, failureSummary }) => ({ target, failureSummary })) }));
  });
  assert.deepEqual(violations, [], `${label}: automated accessibility violations`);
}

async function assertSelection(page, id) {
  const selected = page.locator('[role="tab"][aria-selected="true"]');
  await expect(selected).toHaveCount(1);
  await expect(selected).toHaveAttribute('id', `program-tab-${id}`);
  await expect(selected).toBeFocused();
  await expect(page.locator('[role="tab"][tabindex="0"]')).toHaveCount(1);
  await expect(page.locator('[role="tabpanel"]:visible')).toHaveCount(1);
  await expect(page.locator(`#program-panel-${id}`)).toBeVisible();
  const geometry = await selected.evaluate(element => {
    const box = element.getBoundingClientRect();
    const parent = element.parentElement.getBoundingClientRect();
    return { left: box.left, right: box.right, parentLeft: parent.left, parentRight: parent.right };
  });
  assert.ok(geometry.left >= geometry.parentLeft - 1 && geometry.right <= geometry.parentRight + 1,
    `Keyboard-selected ${id} must be fully visible: ${JSON.stringify(geometry)}`);
}

try {
  for (let attempt = 0; attempt < 100; attempt++) {
    if (server.exitCode !== null) throw new Error(`QA server exited: ${serverLog}`);
    try {
      const response = await fetch(`${origin}/release-revision.json`);
      if (response.ok) {
        assert.equal((await response.json()).revision, receipt.revision);
        break;
      }
    } catch { /* Wait only for this child server to bind. */ }
    if (attempt === 99) throw new Error(`QA server did not start: ${serverLog}`);
    await new Promise(resolve => setTimeout(resolve, 100));
  }
  for (const [name, engine] of Object.entries({ chromium, firefox, webkit })) {
    const browser = await engine.launch({ headless: true });
    try {
      for (const width of [340, 390, 768, 1440]) {
        const context = await browser.newContext({ viewport: { width, height: 1000 }, reducedMotion: 'reduce' });
        const page = await context.newPage();
        const errors = [];
        page.on('pageerror', error => errors.push(error.message));
        try {
          // Block all cross-origin requests: this gate exercises only the built source.
          await context.route('**/*', route => new URL(route.request().url()).origin === origin
            ? route.continue() : route.abort());
          const response = await page.goto(`${origin}/finance-for-all`, { waitUntil: 'networkidle' });
          assert.equal(response.status(), 200);
          await expect(page.getByRole('heading', { level: 1 })).toHaveCount(1);
          await page.addScriptTag({ url: `${origin}/__qa/axe.js` });
          const tabs = page.getByRole('tablist', { name: 'Program pathways' });
          const vertical = width > 820;
          await expect(tabs).toHaveAttribute('aria-orientation', vertical ? 'vertical' : 'horizontal');
          for (const theme of ['light', 'dark']) {
            if (theme === 'dark') await page.getByRole('button', { name: 'Switch to dark theme', exact: true }).click();
            await page.locator('#program-tab-learn').focus();
            await page.keyboard.press('Home');
            await assertSelection(page, 'learn');
            await audit(page, `${name}/${width}/${theme}/learn`);
            await page.keyboard.press(vertical ? 'ArrowDown' : 'ArrowRight');
            await assertSelection(page, 'experience');
            await audit(page, `${name}/${width}/${theme}/experience`);
            await page.keyboard.press('End');
            await assertSelection(page, 'lead');
            await audit(page, `${name}/${width}/${theme}/lead`);
            await page.keyboard.press(vertical ? 'ArrowRight' : 'ArrowDown');
            await assertSelection(page, 'lead');
            await page.keyboard.press(vertical ? 'ArrowDown' : 'ArrowRight');
            await assertSelection(page, 'learn');
            await page.keyboard.press(vertical ? 'ArrowUp' : 'ArrowLeft');
            await assertSelection(page, 'lead');
            await page.keyboard.press('Home');
            await page.keyboard.press('Tab');
            await expect(page.locator('#program-panel-learn')).toBeFocused();
            const focusStyle = await page.locator('#program-panel-learn').evaluate(element => ({
              width: parseFloat(getComputedStyle(element).outlineWidth), style: getComputedStyle(element).outlineStyle,
            }));
            assert.ok(focusStyle.width >= 2 && focusStyle.style !== 'none', 'Panel keyboard focus must remain visible');
            if (width <= 1100) {
              await page.getByRole('button', { name: 'Open navigation', exact: true }).click();
              const menu = page.getByRole('navigation', { name: 'Mobile navigation', exact: true });
              await expect(menu).toBeVisible();
              await audit(page, `${name}/${width}/${theme}/open-menu`);
              await menu.getByRole('link').first().focus();
              await page.keyboard.press('Escape');
              await expect(menu).toHaveCount(0);
              await expect(page.getByRole('button', { name: 'Open navigation', exact: true })).toBeFocused();
            }
            const overflow = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
            assert.ok(overflow <= 1, `${name}/${width}/${theme}: document horizontal overflow ${overflow}`);
            report.scenarios.push({ browser: name, width, theme, keyboard: 'PASS', accessibility: 'PASS', overflow });
            console.log(JSON.stringify(report.scenarios.at(-1)));
          }
          assert.deepEqual(errors, [], `${name}/${width}: runtime errors`);
        } catch (error) {
          report.failures.push({ browser: name, width, error: String(error.stack || error), runtimeErrors: errors });
          await page.screenshot({ path: join(evidence, `${name}-${width}-failure.png`), fullPage: true }).catch(() => {});
        } finally { await context.close(); }
      }
    } finally { await browser.close(); }
  }
  assert.deepEqual(report.failures, [], 'Finance for All browser acceptance failed');
  assert.equal(report.scenarios.length, 24, 'Every browser/width/theme scenario must execute');
} finally {
  report.finishedAt = new Date().toISOString();
  writeFileSync(join(evidence, 'report.json'), JSON.stringify(report, null, 2));
  console.log(`Browser evidence: ${evidence}`);
  if (report.failures.length) console.error(JSON.stringify(report.failures, null, 2));
  if (server.exitCode === null) {
    server.kill('SIGTERM');
    await Promise.race([once(server, 'exit'), new Promise(resolve => setTimeout(resolve, 3000))]);
    if (server.exitCode === null) server.kill('SIGKILL');
  }
}
console.log(`PASS: ${report.scenarios.length} source-bound browser/width/theme scenarios at ${receipt.revision}`);

import test from 'node:test';
import assert from 'node:assert/strict';
import { publications, render } from '../.site-build/prerender.js';

const required = ['ipo-from-private-company-to-public-market', 'how-interest-rates-move-through-the-economy',
  'upi-payments-and-the-economics-of-a-network', 'reading-an-economic-claim-without-getting-fooled'];

test('the four-module curriculum stays fixed as the wider library expands', () => {
  assert.ok(publications.length > required.length);
  const html = render('/open/courses/financial-systems').replaceAll('<!-- -->', '');
  const moduleLinks = [...html.matchAll(/<h3><a href="\/publications\/financedebriefed\/([^"]+)"/g)].map(match => match[1]);
  assert.deepEqual(moduleLinks, required);
  assert.match(html, /0 of 4 marked read/);
  const minutes = publications.filter(article => required.includes(article.slug)).reduce((sum, article) => sum + article.readMinutes, 0);
  for (const path of ['/open/courses', '/open/courses/financial-systems']) {
    assert.ok(render(path).replaceAll('<!-- -->', '').includes(`${minutes} minutes of reading`));
  }
});

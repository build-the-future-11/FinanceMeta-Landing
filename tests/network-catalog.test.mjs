import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import test from 'node:test';
const catalog=JSON.parse(readFileSync(new URL('../src/content/network-catalog.json',import.meta.url)));
const routes=JSON.parse(readFileSync(new URL('../dist/route-manifest.json',import.meta.url)));
const pages=new Set(routes.routes.map(route=>route.path));

test('program actions preserve holds and distinguish screening from enrollment',()=>{
 for(const p of catalog.programs){
  assert.ok(p.readiness && p.eligibility && p.dates && p.verifiedAt);
  if(!p.action)continue;
  assert.ok(p.action.available && p.action.verifiedAt);
  if(['screening','application'].includes(p.action.kind))assert.equal(p.status,'Applications open');
  assert.ok(p.action.href.startsWith('/')&&!p.action.href.startsWith('//') || /^https:\/\/(tally\.so|finance4all-global-reach\.vercel\.app)\//.test(p.action.href));
 }
});
test('event plans cannot manufacture dates, registrations or calendar downloads',()=>{
 const programs=new Set(catalog.programs.map(p=>p.slug));
 for(const e of catalog.events){
  assert.ok(['On hold','Awaiting schedule'].includes(e.status));
  assert.ok(programs.has(e.program));assert.ok(e.readiness && e.verifiedAt);
  assert.equal(e.startsAt,undefined);assert.equal(e.registrationUrl,undefined);
  const html=readFileSync(new URL(`../dist/events/${e.slug}.html`,import.meta.url),'utf8');
  assert.ok(html.includes('No confirmed date'));
  assert.ok(!html.includes('.ics'));
 }
});
test('all imported program links resolve and all detail pages are prerendered',()=>{
 const seen=new Set();
 for(const p of catalog.programs){
  assert.ok(!seen.has(p.slug));seen.add(p.slug);
  assert.ok(readFileSync(new URL(`../dist/programs/${p.slug}.html`,import.meta.url),'utf8').includes(p.title.replaceAll('&','&amp;')));
  for(const link of [p.action?.href,p.source.href,...p.related.map(r=>r.href)].filter(Boolean)){
   if(link.startsWith('/'))assert.ok(pages.has(link),`Missing route ${link}`);
  }
 }
});

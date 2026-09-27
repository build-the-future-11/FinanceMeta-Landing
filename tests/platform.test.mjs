import test from 'node:test';
import assert from 'node:assert/strict';
import { catalog, render } from '../.site-build/prerender.js';
import { validateCatalog } from '../src/lib/content-validation.ts';
import { bibtex, eventCalendar } from '../src/lib/citations.ts';
test('catalog validates and rejects unsupported claims, unsafe links and broken relationships',()=>{
 assert.deepEqual(validateCatalog(catalog),[]);
 const changed=structuredClone(catalog);changed.projects[0].status='Published';changed.projects[0].repository='javascript:alert(1)';changed.projects[0].lab='missing';
 const errors=validateCatalog(changed);assert.ok(errors.some(e=>e.includes('published without output')));assert.ok(errors.some(e=>e.includes('unsafe URL')));assert.ok(errors.some(e=>e.includes('unknown lab')));
 changed.projects[0].status='Preregistered';assert.ok(validateCatalog(changed).some(e=>e.includes('frozen artifact')));
});
test('empty directories have archive routes without invented entries',()=>{
 for(const path of ['/podcast/episodes','/podcast/topics','/podcast/guests','/programs','/privacy','/participation','/apply','/network/chapters/start'])assert.doesNotMatch(render(path),/404 \/ Page not found/);
 assert.match(render('/apply'),/Native member intake has not been enabled/);
 assert.match(render('/about/partners'),/No substantiated partnership records/);
 assert.equal(catalog.episodes.length,0);assert.equal(catalog.events.length,0);
});
test('proposed cohorts contain staged deliverables and project protocols remain drafts',()=>{
 for(const c of catalog.cohorts){const html=render('/research/cohorts/'+c.slug);assert.match(html,/Proposed curriculum/);assert.match(html,/Selection process/);assert.match(html,/Express track interest/);}
 assert.match(render('/research/projects/fi-jepa'),/Draft(?:<!-- -->)? protocol/);
});
test('BibTeX does not invent authors or original publication dates',()=>{
 const text=bibtex(catalog.publications[0]);assert.match(text,/@misc/);assert.doesNotMatch(text,/author =|year =/);assert.match(text,/Original publication date not asserted/);
});
test('calendar export respects instants and escapes line injection',()=>{
 const event={slug:'test-event',title:'Test\nEND:VEVENT',description:'Study, discuss; review',date:'2026-10-01',time:'12:00',timezone:'UTC',status:'Upcoming',startsAt:'2026-10-01T12:00:00Z',endsAt:'2026-10-01T13:00:00Z'};
 const result=eventCalendar(event,'https://example.org');assert.match(result,/DTSTART:20261001T120000Z/);assert.match(result,/Test\\nEND:VEVENT/);assert.equal((result.match(/^END:VEVENT$/gm)||[]).length,1);
 assert.equal(eventCalendar({...event,endsAt:event.startsAt},'https://example.org'),null);
});

test('unknown addresses hydrate the same recovery markup as the prerendered 404',()=>{assert.equal(render('/missing/deep/path'),render('/404'));});

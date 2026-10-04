import test from 'node:test';
import assert from 'node:assert/strict';
import { parseStart, startFromSearch, startSearch, parseSavedStart, buildStartSteps, defaultStart } from '../src/lib/start-path.ts';
const lesson = { title: 'Reviewed explainer', href: '/publications/financedebriefed/example', note: 'Evidence-led reading', kind: '5 min read' };
test('starting route validates untrusted URL choices and preserves unrelated parameters', () => {
 assert.deepEqual(startFromSearch('?start=unknown&topic=<script>&pace=12'), defaultStart);
 assert.deepEqual(parseStart(null), defaultStart);
 const state={goal:'research',topic:'evidence',pace:'deeper'};
 const search=startSearch(state,'?ref=friend&start=learn');
 assert.equal(new URLSearchParams(search).get('ref'),'friend');assert.deepEqual(startFromSearch(search),state);
});
test('saved route requires supported version and complete valid choices', () => {
 for(const raw of [null,'{','null','{"version":1}','{"version":2,"state":{}}','{"version":1,"state":{"goal":"learn","topic":"alien","pace":"quick"}}']) assert.equal(parseSavedStart(raw),null);
 assert.deepEqual(parseSavedStart(JSON.stringify({version:1,state:defaultStart})),defaultStart);
});
test('every goal/pace produces a usable route, never a claim of admission', () => {
 for(const goal of ['learn','research','contribute'])for(const topic of ['everyday','markets','evidence'])for(const pace of ['quick','deeper']){
  const steps=buildStartSteps({goal,topic,pace},lesson);assert.equal(steps.length,pace==='quick'?2:3);assert.deepEqual(steps[0],lesson);
  assert.equal(new Set(steps.map(s=>s.href)).size,steps.length);assert.ok(steps.every(s=>s.href.startsWith('/')&&!s.href.startsWith('//')));
 }
 assert.match(buildStartSteps({goal:'contribute',topic:'everyday',pace:'deeper'},lesson)[2].note,/admission is not open/);
});

import test from 'node:test';
import assert from 'node:assert/strict';
import { applicationUrl, applicationDestination } from '../src/lib/application-routes.ts';

test('membership, journal and preprint remain distinct and account-free',()=>{
 for(const [route,id] of [['join','5B7blP'],['journal','b5BBko'],['forum','RGXXLJ']]) {
  const url=new URL(applicationUrl(route));
  assert.equal(url.origin,'https://tally.so');assert.equal(url.pathname,`/r/${id}`);
  assert.equal(url.searchParams.get('fm_route'),route);
 }
});
test('application context and campaign survive without copying personal answers',()=>{
 const url=new URL(applicationUrl('join','?utm_source=chapter&utm_campaign=autumn&email=private%40example.org&message=private&fm_qa=1',{role:'Engineer',project:'fi-jepa',surface:'join'}));
 assert.equal(url.searchParams.get('fm_project'),'fi-jepa');assert.equal(url.searchParams.get('fm_role'),'Engineer');
 assert.equal(url.searchParams.get('utm_source'),'chapter');assert.equal(url.searchParams.get('fm_qa'),'1');
 assert.equal(url.searchParams.has('email'),false);assert.equal(url.searchParams.has('message'),false);
});
test('malformed metadata and unrecognized roles are dropped',()=>{
 const url=new URL(applicationUrl('join','?utm_source=private%40example.org&project=https://evil.example&role=CEO'));
 assert.equal(url.searchParams.get('utm_source'),'financemeta');assert.equal(url.searchParams.has('fm_project'),false);assert.equal(url.searchParams.has('fm_role'),false);
});
test('validated blank context overrides an unrecognized incoming project',()=>{
 const url=new URL(applicationUrl('join','?project=unknown',{project:''}));assert.equal(url.searchParams.has('fm_project'),false);
});
test('click measurement distinguishes form IDs and rejects lookalike hosts',()=>{
 assert.equal(applicationDestination(applicationUrl('journal')),'tally.so/r/b5BBko');
 for(const url of ['https://tally.so.evil.test/r/b5BBko','http://tally.so/r/b5BBko','https://tally.so/r/unknown','not-a-url'])assert.equal(applicationDestination(url),null);
});

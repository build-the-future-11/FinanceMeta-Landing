import test from 'node:test';
import assert from 'node:assert/strict';
import {readDirectoryState,directorySearch,selectDirectoryItems} from '../src/lib/directory.ts';
import {articleSections,readingProgress,tradingCosts,interestContext} from '../src/lib/reading.ts';
const items=[
 {slug:'a',title:'MacroCast',description:'Release-aware inflation forecasts',href:'/a',type:'Project',lab:'macro',status:'Proposed',methods:['Temporal holdouts'],date:'2026-09-20'},
 {slug:'b',title:'FinML Benchmark',description:'Financial model forecasts under distribution shift',href:'/b',type:'Project',lab:'ml',status:'Proposed',methods:['Temporal holdouts'],date:'2026-09-21'},
 {slug:'c',title:'FI-JEPA',description:'Financial representations',href:'/c',type:'Project',lab:'ml',status:'Repository available',methods:['Representation learning'],date:'2026-09-18'},
];
test('multiword queries match across fields and combine with filters',()=>{
 const state=readDirectoryState('?q=financial+shift&lab=ml&status=Proposed',items,['lab','status']);
 assert.deepEqual(selectDirectoryItems(items,state,['lab','status']).map(p=>p.slug),['b']);
 assert.equal(selectDirectoryItems(items,{...state,query:'no such finding'},['lab','status']).length,0);
});
test('filter and sort URLs round trip without dropping other parameters or mutating data',()=>{
 const before=JSON.stringify(items);const state=readDirectoryState('?lab=ml&sort=newest',items,['lab']);
 assert.deepEqual(selectDirectoryItems(items,state,['lab']).map(p=>p.slug),['b','c']);
 const url=directorySearch(state,'?ref=course&lab=macro',['lab']);
 assert.equal(new URLSearchParams(url).get('ref'),'course');assert.deepEqual(readDirectoryState(url,items,['lab']),state);
 assert.equal(JSON.stringify(items),before);
 assert.equal(new URLSearchParams(directorySearch({...state,query:'',selected:{},sort:'recommended'},url,['lab'])).get('lab'),null);
});
test('unknown filters and unbounded queries cannot create broken select states',()=>{
 const state=readDirectoryState('?lab=unknown&sort=wrong&q='+'x'.repeat(600),items,['lab']);
 assert.equal(state.selected.lab,'');assert.equal(state.query.length,300);assert.equal(state.sort,'recommended');
});
test('event default status and explicit All survive URL serialization',()=>{
 const defaults={status:'Upcoming'};
 const state={query:'',selected:{status:''},sort:'recommended'};
 const url=directorySearch(state,'',['status'],defaults);
 assert.equal(new URLSearchParams(url).get('status'),'');
 assert.equal(readDirectoryState(url,[],['status'],defaults).selected.status,'');
});
test('article contents use stable unique anchors even for repeated headings',()=>{
 const sections=articleSections('# Title\n\n## A question\n\nText\n\n## A question');
 assert.deepEqual(sections,[{title:'A question',id:'section-1'},{title:'A question',id:'section-3'}]);
});
test('reading progress rejects stale, duplicated, and malformed saved records',()=>{
 assert.deepEqual(readingProgress(['a','a',null,'old','b'],['a','b']),['a','b']);assert.deepEqual(readingProgress({a:true},['a']),[]);
});
test('cost calculator uses one-way turnover and preserves negative returns',()=>{
 assert.deepEqual(tradingCosts(8,12,10),{drag:1.2,net:6.8});assert.deepEqual(tradingCosts(8,12,100),{drag:12,net:-4});assert.equal(tradingCosts(-5,0,100).net,-5);
});
test('application context resolves real labels and rejects unknown query identifiers',()=>{
 const ps=[{slug:'fi-jepa',name:'FI-JEPA',lab:'ml'}];const ls=[{slug:'ml',title:'Machine Learning for Finance'}];
 assert.deepEqual(interestContext('fi-jepa',null,ps,ls),{project:'fi-jepa',lab:'ml',label:'FI-JEPA / Machine Learning for Finance',href:'/research/projects/fi-jepa'});
 assert.equal(interestContext('invented',null,ps,ls).label,'');assert.equal(interestContext(null,'ml',ps,ls).href,'/research/labs/ml');
});

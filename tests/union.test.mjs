import test from 'node:test';
import assert from 'node:assert/strict';
import { publishablePartners, collaborationIsOpen, UNION_PARTNERS } from '../src/union-data.ts';
import { publicHttpsUrl } from '../src/public-url.ts';
const today='2026-09-27';
const record={slug:'test-record',name:'Test fixture',kind:'Research',region:'Test region',summary:'Test only',website:'https://example.org',relationship:'Active',relationshipSummary:'Test only',evidenceUrl:'https://example.org/evidence',reviewedOn:today,reviewDue:'2026-10-27',publicationApproved:true,collaborations:[]};
test('Union has no unverified production affiliations',()=>assert.deepEqual(UNION_PARTNERS,[]));
test('publication excludes expired, unapproved, duplicate and unsafe records',()=>{
 assert.equal(publishablePartners([record],today).length,1);
 for(const update of [{publicationApproved:false},{reviewDue:'2026-09-26'},{reviewedOn:'2026-09-28'},{website:'https://127.0.0.1'},{evidenceUrl:'javascript:alert(1)'}]) assert.deepEqual(publishablePartners([{...record,...update}],today),[]);
 assert.deepEqual(publishablePartners([record,record],today),[]);
});
test('deadline closure respects explicit status and UTC calendar date',()=>{
 assert.equal(collaborationIsOpen({status:'Open',deadline:today},today),true);
 assert.equal(collaborationIsOpen({status:'Open',deadline:'2026-09-26'},today),false);
 assert.equal(collaborationIsOpen({status:'Closed'},today),false);
});
test('public handoffs reject private and credential-bearing destinations',()=>{
 for(const url of ['http://example.org','https://127.0.0.1','https://[::1]','https://host.local','https://user:pass@example.org','https://example.org:8443','https://localhost']) assert.equal(publicHttpsUrl(url),null,url);
 assert.equal(publicHttpsUrl('https://example.org/login').pathname,'/login');
});

import { prepareCollaborationBrief } from '../src/union-brief.ts';
const briefInput = { path: 'education', organisation: '  Test workshop  ', idea: '  Explore how students interpret inflation using public data.  ', contribution: '  A teaching plan and two hours of facilitation.  ', outcome: '  An accessible lesson with an understanding check.  ' };
test('brief preserves the selected area and user wording without implying submission',()=>{
 const text=prepareCollaborationBrief(briefInput);
 assert.match(text,/Area: Education/);
 assert.match(text,/From: Test workshop\n/);
 assert.ok(text.includes('THE IDEA\nExplore how students interpret inflation using public data.\n'));
 assert.match(text,/proposal — draft/);
 assert.match(text,/permissions to be agreed/);
 assert.ok(!prepareCollaborationBrief({...briefInput,organisation:'   '}).includes('From:'));
});
test('brief rejects whitespace-only, undersized and oversized fields before export',()=>{
 for(const [field,min,max] of [['idea',30,1000],['contribution',15,600],['outcome',15,600]]) {
  for(const value of [' '.repeat(min),'x'.repeat(min-1),'x'.repeat(max+1)]) assert.throws(()=>prepareCollaborationBrief({...briefInput,[field]:value}));
  for(const value of ['x'.repeat(min),'x'.repeat(max)]) assert.doesNotThrow(()=>prepareCollaborationBrief({...briefInput,[field]:value}));
 }
 assert.throws(()=>prepareCollaborationBrief({...briefInput,organisation:'x'.repeat(101)}));
 assert.throws(()=>prepareCollaborationBrief({...briefInput,path:'unrecognised'}));
});

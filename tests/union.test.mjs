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

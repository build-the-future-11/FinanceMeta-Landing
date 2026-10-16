import {createHash} from 'node:crypto';
import {writeFileSync} from 'node:fs';
const origin='https://finance-meta-landing.vercel.app';
const get=async path=>{const r=await fetch(origin+path,{redirect:'manual',signal:AbortSignal.timeout(30000)});return {r,body:await r.text()};};
const {r:mr,body:mb}=await get('/route-manifest.json');
if(mr.status!==200)throw Error('Manifest unavailable');
const manifest=JSON.parse(mb);const results=[];let cursor=0;
async function worker(){while(cursor<manifest.routes.length){const route=manifest.routes[cursor++];try{const {r,body}=await get(route.path);const digest=createHash('sha256').update(body).digest('hex');const expectedStatus=route.path==='/404'?404:200;results.push({path:route.path,status:r.status,statusPass:r.status===expectedStatus,hashPass:digest===manifest.hashes[route.path],h1Count:(body.match(/<h1(?:\s|>)/g)||[]).length});}catch(e){results.push({path:route.path,error:e.message});}}}
await Promise.all(Array.from({length:6},worker));
const {r:missing}=await get('/__release_missing_page_20261016');
const redirects=[];
for(const [from,to] of [['/fellowship','/research/fellowship'],['/financedebriefed','/publications/financedebriefed'],['/chapters','/network/chapters']]){const {r}=await get(from);redirects.push({from,status:r.status,location:r.headers.get('location'),pass:[301,308].includes(r.status)&&r.headers.get('location')===to});}
const failures=results.filter(x=>!x.statusPass||!x.hashPass||x.h1Count!==1);
const receipt={checkedAt:new Date().toISOString(),origin,routeCount:results.length,failures,missingStatus:missing.status,redirects,results};
writeFileSync('/private/tmp/financemeta-live-routes.json',JSON.stringify(receipt,null,2));
console.log(JSON.stringify({routeCount:results.length,failures,missingStatus:missing.status,redirects},null,2));
if(failures.length||missing.status!==404||redirects.some(r=>!r.pass))process.exitCode=1;

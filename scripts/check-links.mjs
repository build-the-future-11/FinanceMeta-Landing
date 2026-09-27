import {readdirSync,readFileSync,writeFileSync,mkdirSync,existsSync} from 'node:fs';
import {join} from 'node:path';
const files=dir=>readdirSync(dir,{withFileTypes:true}).flatMap(e=>e.isDirectory()?files(join(dir,e.name)):[join(dir,e.name)]);
const urls=new Map();for(const file of files('dist').filter(f=>f.endsWith('.html'))){for(const [,raw] of readFileSync(file,'utf8').matchAll(/href="(https?:\/\/[^"<>]+)"/g)){const url=raw.replaceAll('&amp;','&');if(url.includes('finance-meta-landing.vercel.app'))continue;if(!urls.has(url))urls.set(url,[]);urls.get(url).push(file);}}
if(!existsSync('dist/route-manifest.json')||urls.size===0)throw new Error('Run the complete build before checking links.');
const pending=[...urls];const results=[];
await Promise.all(Array.from({length:4},async()=>{while(pending.length){const [url,sources]=pending.shift();try{const response=await fetch(url,{signal:AbortSignal.timeout(20000),headers:{'User-Agent':'FinanceMeta link validation (read-only)'}});results.push({url,status:response.status,finalUrl:response.url,sources});await response.body?.cancel();}catch(error){results.push({url,status:null,error:error.message,sources});}}}));
mkdirSync('evidence/improvements-2026-09-21',{recursive:true});writeFileSync('evidence/improvements-2026-09-21/external-links.json',JSON.stringify({checkedAt:new Date().toISOString(),results},null,2));
console.log(JSON.stringify({checked:results.length,issues:results.filter(r=>!r.status||r.status>=400)},null,2));
// Upstream rate limits and access restrictions require review, not invented fixes.

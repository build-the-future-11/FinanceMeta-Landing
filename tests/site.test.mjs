import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, existsSync } from 'node:fs';
import { readdirSync } from 'node:fs';
import { gzipSync } from 'node:zlib';
import {siteOrigin as configuredOrigin,publicSiteOrigin} from '../scripts/site-origin.mjs';
import { routes, aliases, labs, projects, cohorts, publications, resources, render } from '../.site-build/prerender.js';
const htmlFor=path=>readFileSync(path==='/'?'dist/index.html':`dist${path}.html`,'utf8');
const siteOrigin=configuredOrigin();
const publicPaths=new Set(routes.map(r=>r.path));

test('canonical origins reject local addresses, credentials and accidental paths',()=>{
 assert.equal(publicSiteOrigin('https://financemeta.org/'),'https://financemeta.org');
 for(const value of ['http://financemeta.org','https://localhost','https://127.0.0.1','https://[::1]','https://user:password@financemeta.org','https://financemeta.org/path','https://financemeta.org/?query=1','https://financemeta.org/#fragment'])assert.throws(()=>publicSiteOrigin(value));
});

test('all 93 public routes have unique paths and emitted files',()=>{
 assert.equal(routes.length,93);assert.equal(publicPaths.size,routes.length);
 for(const route of routes)assert.ok(htmlFor(route.path).includes('<title>'),route.path);
});
test('all research pages are server-rendered with one H1 and meaningful metadata',()=>{
 for(const r of routes.filter(r=>r.path!=='/finance-for-all')){
  const html=htmlFor(r.path);assert.equal((html.match(/<h1[ >]/g)||[]).length,1,r.path);
  for(const value of ['data-rendered="true"','name="description"','property="og:title"','name="twitter:card"','rel="canonical"','id="main-content"'])assert.ok(html.includes(value),`${r.path}: ${value}`);
  assert.ok(html.includes(`${siteOrigin}${r.path==='/'?'':r.path}`),r.path);
  assert.ok(!html.includes('Page not found |'),r.path);
 }
});
test('every rendered internal link resolves to a route, alias, fragment, or real public file',()=>{
 const failures=[];
 for(const route of routes.filter(r=>r.path!=='/finance-for-all')){
  const html=htmlFor(route.path);
  for(const match of html.matchAll(/href="([^"]+)"/g)){
   const href=match[1].replaceAll('&amp;','&');
   if(href.startsWith('#')){if(!html.includes(`id="${href.slice(1)}"`))failures.push(`${route.path}: ${href}`);continue;}
   if(!href.startsWith('/'))continue;
   const target=href.split(/[?#]/)[0];
   if(!publicPaths.has(target)&&!aliases[target]&&!existsSync('dist'+target))failures.push(`${route.path}: ${target}`);
  }
 }
 assert.deepEqual(failures,[]);
});
test('lab, cohort, and project relations retain complete denominators',()=>{
 assert.equal(labs.length,7);assert.equal(cohorts.length,6);assert.equal(projects.length,18);
 for(const p of projects){assert.ok(labs.some(l=>l.slug===p.lab),p.slug);if(p.cohort)assert.ok(cohorts.some(c=>c.slug===p.cohort));assert.ok(p.results&&p.limitations&&p.evidence);}
 for(const c of cohorts){assert.equal(c.status,'Upcoming');assert.match(c.applicationStatus,/Proposed/);assert.ok(c.methods.length&&c.output.length);}
 assert.ok(projects.every(p=>!['Active','Published','Completed'].includes(p.status)));
});
test('legacy research projects and all four real explainers are preserved',()=>{
 for(const slug of ['fi-jepa','eigen-jepa','eigenfinance','lgwm','finimmunity','iy-ern','portal','inflation-observatory','digital-payments-access','youth-expectations-panel','public-company-lab','finance-meta-global'])assert.ok(projects.some(p=>p.slug===slug));
 assert.equal(publications.length,4);for(const p of publications){assert.ok(p.body.length>3000);assert.ok(p.readMinutes>0);assert.deepEqual(p.authors,[]);}
});
test('no invented publication, episode, event, or chapter output is shown',()=>{
 assert.match(htmlFor('/publications/working-papers'),/No working papers have been released/);
 assert.match(htmlFor('/podcast'),/first verified episode has not been published/);
 assert.match(htmlFor('/events'),/No confirmed upcoming sessions/);
 assert.match(htmlFor('/network/chapters'),/No verified operating chapters/);
 assert.match(htmlFor('/research/projects/fi-jepa'),/no real-market performance claim/i);
});
test('published resource downloads exist and unsafe protocols are absent',()=>{
 for(const r of resources.filter(r=>r.href.startsWith('/resources/')))assert.ok(existsSync('dist'+r.href));
 for(const r of routes)assert.doesNotMatch(htmlFor(r.path),/href="(?:javascript:|#")/);
});
test('navigation, search, join forms, and honest submission state are implemented',()=>{
 const join=htmlFor('/join');assert.match(join,/required=""/);assert.match(join,/minLength="30"/);assert.match(join,/does not submit or store an application/);assert.match(join,/https:\/\/tally.so\/r\/5B7blP/);
 assert.match(htmlFor('/research/projects'),/Search projects/);assert.match(htmlFor('/research/projects'),/All (?:<!-- -->)?methods/);
 assert.match(htmlFor('/'),/aria-controls="nav-Research"/);assert.match(htmlFor('/'),/Skip to main content/);
});
test('a missing URL renders a real recovery page and deployment has no catch-all 200 rewrite',()=>{
 assert.match(render('/nonexistent'),/404 \/ Page not found/);
 assert.match(readFileSync('dist/404.html','utf8'),/name="robots" content="noindex"/);
 const vercel=JSON.parse(readFileSync('vercel.json'));assert.equal(vercel.rewrites,undefined);
 assert.equal(vercel.redirects.length,Object.keys(aliases).length);
});
test('member guard and original education experience remain isolated',()=>{
 assert.ok(existsSync('src/legacy/landing.tsx'));assert.match(readFileSync('src/main.tsx','utf8'),/import\('\.\/legacy\/landing'\)/);
 assert.match(readFileSync('src/member-handoff.ts','utf8'),/hasConfiguredMemberHandoff/);
 assert.match(readFileSync('src/analytics.ts','utf8'),/user_id: null/);
});

test('prerender includes only the new design system before hydration',()=>{
 const html=htmlFor('/');const css=html.match(/<link rel="stylesheet" href="([^"]+)"/)[1];
 const source=readFileSync('dist'+css,'utf8');assert.match(source,/\.research-site/);assert.doesNotMatch(source,/\.site-shell/);
});

test('article navigation, downloads and canonical records retain full content',()=>{
 for(const p of publications){
  const html=htmlFor(`/publications/financedebriefed/${p.slug}`);
  assert.match(html,/aria-label="On this page"/);assert.match(html,/id="article-scope"/);
  assert.ok(readFileSync(`dist/resources/articles/${p.slug}.md`,'utf8').includes(p.body));
  assert.match(html,/property="og:type" content="article"/);
  assert.ok(html.includes('social-preview.png'));
 }
 const png=readFileSync('dist/social-preview.png');assert.equal(png.readUInt32BE(16),1200);assert.equal(png.readUInt32BE(20),630);
 assert.match(htmlFor('/search'),/name="robots" content="noindex"/);
});

test('shared script budget excludes the article text and local diagnostics',()=>{
 const names=readdirSync('dist/assets').filter(name=>/^(index|site|member-handoff)-.*\.js$/.test(name));
 const gzipBytes=names.reduce((sum,name)=>sum+gzipSync(readFileSync('dist/assets/'+name)).length,0);
 assert.ok(gzipBytes<100_000,`Shared JS gzip ${gzipBytes} exceeds 100 KB`);
 const site=names.find(name=>name.startsWith('site-'));const source=readFileSync('dist/assets/'+site,'utf8');
 assert.ok(!source.includes(publications[0].body.slice(0,150)));
 for(const r of routes)assert.doesNotMatch(htmlFor(r.path),/__qa\/|axe\.min/);
});

test('public pages do not skip heading levels after the page title',()=>{
 const failures=[];
 for(const r of routes.filter(r=>r.path!=='/finance-for-all')){
  const main=htmlFor(r.path).match(/<main\b[\s\S]*?<\/main>/)?.[0]||'';let previous=0;
  for(const match of main.matchAll(/<h([1-6])\b[^>]*>([\s\S]*?)<\/h[1-6]>/g)){const level=Number(match[1]);if(level>previous+1)failures.push(`${r.path}: h${previous} to h${level} ${match[2].replace(/<[^>]+>/g,'')}`);previous=level;}
 }
 assert.deepEqual(failures,[]);
});

// Exercise the actual generated homepage alongside the negative metadata fixtures.
test('built homepage satisfies the live metadata contract', async () => {
  const {readFileSync} = await import('node:fs');
  const {verifyHtml} = await import('../scripts/verify-live.mjs');
  verifyHtml(readFileSync('dist/index.html', 'utf8'));
});

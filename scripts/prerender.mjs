import { readFileSync, writeFileSync, mkdirSync, readdirSync } from 'node:fs';
import { dirname } from 'node:path';
import { createHash } from 'node:crypto';
import { render, routes, aliases, publications } from '../.site-build/prerender.js';
import {siteOrigin} from './site-origin.mjs';

const base = siteOrigin();
const template = readFileSync('dist/index.html','utf8');
const escape = value => String(value).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const css = readdirSync('dist/assets').find(name=>name.endsWith('.css')&&readFileSync(`dist/assets/${name}`,'utf8').includes('.research-site'));
if (!css) throw new Error('Public design-system CSS is missing');
const siteScript=readdirSync('dist/assets').find(name=>/^site-.*\.js$/.test(name));
const articleScript=readdirSync('dist/assets').find(name=>/^editorial-.*\.js$/.test(name));
const hashes = {};
function writePage(route, notFound=false) {
 const legacy=route.path==='/finance-for-all';
 const canonical=base+(route.path==='/'?'':route.path);
 const title=`${route.title} | FinanceMeta`;
 const meta=`<title>${escape(title)}</title><meta name="description" content="${escape(route.description)}"/><link rel="canonical" href="${canonical}"/><meta property="og:title" content="${escape(title)}"/><meta property="og:description" content="${escape(route.description)}"/><meta property="og:type" content="${route.path.startsWith('/publications/financedebriefed/')?'article':'website'}"/><meta property="og:url" content="${canonical}"/><meta property="og:image" content="${base}/social-preview.png"/><meta property="og:image:width" content="1200"/><meta property="og:image:height" content="630"/><meta property="og:image:alt" content="FinanceMeta — Research the systems moving capital"/><meta name="twitter:image:alt" content="FinanceMeta — Research the systems moving capital"/><meta name="twitter:card" content="summary_large_image"/><meta name="twitter:title" content="${escape(title)}"/><meta name="twitter:description" content="${escape(route.description)}"/><meta name="twitter:image" content="${base}/social-preview.png"/>${(notFound||route.path==='/search')?'<meta name="robots" content="noindex"/>':''}${!legacy?`<link rel="stylesheet" href="/assets/${css}"/>`:''}`;
 const preloads=legacy?'':`<link rel="modulepreload" href="/assets/${siteScript}"/>${route.path.startsWith('/publications/financedebriefed/')?`<link rel="modulepreload" href="/assets/${articleScript}"/>`:''}`;
 const body=legacy?'':render(route.path);
 const html=template.replace(/<!--site-meta-->[\s\S]*?<!--\/site-meta-->/,meta+preloads).replace('<div id="root"></div>',`<div id="root"${legacy?'':' data-rendered="true"'}>${body}</div>`);
 const file=notFound?'dist/404.html':route.path==='/'?'dist/index.html':`dist${route.path}.html`;
 mkdirSync(dirname(file),{recursive:true});writeFileSync(file,html);
 hashes[route.path]=createHash('sha256').update(html).digest('hex');
}
mkdirSync('dist/resources/articles',{recursive:true});
for(const p of publications)writeFileSync(`dist/resources/articles/${p.slug}.md`,`${p.body}\n\n---\nReviewed: ${p.date}\n\n${p.limitations}\n`);
for(const route of routes)writePage(route);
writePage({path:'/404',title:'Page not found',description:'Search the FinanceMeta research index or return to the homepage.'},true);
writeFileSync('dist/sitemap.xml',`<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${routes.filter(r=>r.path!=='/search').map(r=>`<url><loc>${base}${r.path==='/'?'':r.path}</loc></url>`).join('')}</urlset>\n`);
writeFileSync('dist/robots.txt',`User-agent: *\nAllow: /\nSitemap: ${base}/sitemap.xml\n`);
writeFileSync('dist/route-manifest.json',JSON.stringify({routes,hashes},null,2));
console.log(`Prerendered ${routes.length} public routes, 404 page, sitemap, and ${Object.keys(aliases).length} legacy redirects.`);

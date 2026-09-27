import { createRequire } from 'node:module';
import { readFileSync, mkdirSync, writeFileSync } from 'node:fs';
import assert from 'node:assert/strict';
const require=createRequire(import.meta.url);
let chromium;
try { ({chromium}=require('@playwright/test')); } catch { ({chromium}=require('../Finance4allLanding/node_modules/@playwright/test')); }
const origin=process.env.QA_ORIGIN||'http://127.0.0.1:4183';
const destination='evidence/platform-transformation-2026-09-21/browser';mkdirSync(destination,{recursive:true});
const browser=await chromium.launch({channel:'chrome',headless:true});
const context=await browser.newContext({viewport:{width:1440,height:1000},reducedMotion:'reduce'});
const page=await context.newPage();const errors=[];const checks=[];
page.on('pageerror',e=>errors.push(page.url()+': '+e.message));
page.on('console',message=>{if(message.type()==='error'&&!message.text().includes('404'))errors.push(page.url()+': '+message.text());});
try {
 for(const {path} of JSON.parse(readFileSync('dist/route-manifest.json')).routes){
  const response=await page.goto(origin+path,{waitUntil:'networkidle'});assert.equal(response.status(),200,path);await page.locator('h1').first().waitFor();assert.equal(await page.locator('h1').count(),1,path);
  assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth+1),false,`${path} desktop overflow`);checks.push({path,status:200});
 }
 const response=await page.goto(origin+'/does-not-exist');assert.equal(response.status(),404);await page.getByRole('heading',{level:1}).waitFor();
 await page.goto(origin+'/research/projects');await page.getByRole('searchbox',{name:'Search projects'}).fill('FI-JEPA');await page.waitForTimeout(120);assert.equal(await page.locator('.project-card').count(),1);await page.reload();assert.equal(await page.getByRole('searchbox',{name:'Search projects'}).inputValue(),'FI-JEPA');
 await page.getByRole('button',{name:'Reset filters'}).click();assert.equal(await page.locator('.project-card').count(),18);
 await page.getByRole('searchbox',{name:'Search projects'}).fill('nonexistent-inquiry');assert.equal(await page.locator('.project-card').count(),0);
 await page.goto(origin+'/research/cohorts');await page.getByRole('button',{name:/^Open/}).click();assert.equal(await page.locator('.cohort-card').count(),0);await page.reload();assert.equal(await page.locator('.cohort-card').count(),0);
 await page.goto(origin+'/join');await page.getByRole('textbox',{name:'What would you like to contribute?'}).fill('I would like to contribute a reproducible evaluation of financial time-series models.');await page.getByRole('button',{name:/Prepare email draft/}).click();assert.ok(await page.getByText('Your draft is ready. Nothing has been sent.').isVisible());
 await page.goto(origin+'/apply?call=financial-ml');await page.waitForTimeout(100);assert.equal(await page.getByLabel('Application area').inputValue(),'financial-ml');assert.ok(await page.getByRole('link',{name:'Open existing application form'}).isVisible());
 await page.goto(origin+'/open/courses/financial-systems');await page.getByRole('checkbox').first().check();await page.reload();await page.waitForTimeout(100);assert.equal(await page.getByRole('checkbox').first().isChecked(),true);await page.getByRole('button',{name:'Reset reading progress'}).click();assert.equal(await page.getByRole('checkbox').first().isChecked(),false);
 await page.goto(origin+'/');const menu=page.getByRole('button',{name:'Research',exact:true});await menu.focus();await page.keyboard.press('ArrowDown');assert.equal(await page.locator('#nav-Research a').first().evaluate(el=>el===document.activeElement),true);await page.keyboard.press('Escape');assert.equal(await menu.getAttribute('aria-expanded'),'false');
 const accessibility=[];
 for(const width of [1440,390]){
  await page.setViewportSize({width,height:900});
  for(const path of ['/','/research/projects','/research/cohorts/realitycheck','/research/projects/fi-jepa','/publications','/events','/podcast','/programs','/apply','/privacy','/network/chapters/start']){
   await page.goto(origin+path,{waitUntil:'networkidle'});
   assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth+1),false,`${path} ${width} overflow`);
   await page.addScriptTag({url:origin+'/__qa/axe.js'});const result=await page.evaluate(async()=>{const r=await axe.run(document,{runOnly:{type:'tag',values:['wcag2a','wcag2aa','wcag21aa']}});return r.violations.map(v=>({id:v.id,impact:v.impact,nodes:v.nodes.map(n=>n.target)}));});accessibility.push({path,width,violations:result});
  }
 }
 for(const width of [1440,390]){await page.setViewportSize({width,height:900});for(const path of ['/','/apply','/research/projects/fi-jepa','/programs']){await page.goto(origin+path,{waitUntil:'networkidle'});await page.evaluate(()=>{document.documentElement.dataset.theme='dark';localStorage.setItem('financemeta-theme','dark');});await page.addScriptTag({url:origin+'/__qa/axe.js'});const violations=await page.evaluate(async()=>{const r=await axe.run(document,{runOnly:{type:'tag',values:['wcag2a','wcag2aa','wcag21aa']}});return r.violations.map(v=>({id:v.id,impact:v.impact,nodes:v.nodes.map(n=>n.target)}));});accessibility.push({path,width,theme:'dark',violations});}}
 await page.evaluate(()=>localStorage.setItem('financemeta-theme','light'));
 await page.goto(origin+'/');await page.getByRole('button',{name:'Menu',exact:true}).click();assert.equal(await page.locator('#mobile-navigation').isVisible(),true);await page.keyboard.press('Escape');assert.equal(await page.locator('#mobile-navigation').isVisible(),false);
 await page.screenshot({path:destination+'/home-mobile.png',fullPage:true});await page.setViewportSize({width:1440,height:1000});await page.reload();await page.screenshot({path:destination+'/home-desktop.png',fullPage:true});
 writeFileSync(destination+'/report.json',JSON.stringify({checks,errors,accessibility,interactions:'search, reload, filters, empty states, draft, intake handoff, reading progress, keyboard navigation, mobile navigation, 404'},null,2));
 assert.deepEqual(errors,[],'Browser console/runtime errors');assert.deepEqual(accessibility.flatMap(x=>x.violations.map(v=>({...v,path:x.path,width:x.width}))),[],'Accessibility violations');
 console.log(`Browser verified ${checks.length} routes, interaction flows, 404, and ${accessibility.length} accessibility scans.`);
} finally { await browser.close(); }

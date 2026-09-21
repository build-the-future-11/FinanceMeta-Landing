/* This diagnostic runs only when explicitly enabled on the local QA server. */
(() => {
  let cls=0,lcp=null;const shifts=[];
  try{new PerformanceObserver(list=>{for(const e of list.getEntries()){if(!e.hadRecentInput){cls+=e.value;shifts.push({value:e.value,time:e.startTime});}}}).observe({type:'layout-shift',buffered:true});}catch{}
  try{new PerformanceObserver(list=>{for(const e of list.getEntries())lcp=e.startTime;}).observe({type:'largest-contentful-paint',buffered:true});}catch{}
  const panel=document.createElement('aside');panel.id='qa-panel';panel.setAttribute('aria-label','Local diagnostics');panel.style.cssText='position:fixed;bottom:8px;right:8px;z-index:1000;background:#fff;color:#111;border:2px solid #111;padding:8px;font:12px system-ui;max-width:320px';
  const button=document.createElement('button');button.type='button';button.textContent='Run local accessibility audit';button.style.cssText='color:#111;background:#fff;padding:8px;border:1px solid #111';
  const output=document.createElement('pre');output.id='qa-result';output.style.cssText='white-space:pre-wrap;max-height:160px;overflow:auto';output.textContent='Ready. Alt+Shift+A also audits an open menu.';
  panel.append(button,output);document.body.append(panel);
  async function audit(){
   if(button.disabled)return;button.disabled=true;output.textContent='Running…';
   const timing=performance.getEntriesByType('navigation')[0];
   const measurements={navigationMs:timing?.duration,fcpMs:performance.getEntriesByName('first-contentful-paint')[0]?.startTime,lcpMs:lcp,cumulativeLayoutShift:cls,shifts,resources:performance.getEntriesByType('resource').filter(r=>!r.name.includes('/__qa/')).map(r=>({name:new URL(r.name).pathname,duration:r.duration,transferSize:r.transferSize,encodedBodySize:r.encodedBodySize}))};
   try{
    if(!window.axe)await new Promise((resolve,reject)=>{const script=document.createElement('script');script.src='/__qa/axe.js';script.onload=resolve;script.onerror=reject;document.head.append(script);});
    const result=await window.axe.run({exclude:[['#qa-panel']]},{runOnly:{type:'tag',values:['wcag2a','wcag2aa','wcag21aa','wcag22aa','best-practice']}});
    const simplify=list=>list.map(({id,impact,help,helpUrl,nodes})=>({id,impact,help,helpUrl,nodes:nodes.map(({target,failureSummary})=>({target,failureSummary}))}));
    const report={recordedAt:new Date().toISOString(),path:location.pathname,width:innerWidth,theme:document.documentElement.dataset.theme||'light',scenario:new URLSearchParams(location.search).get('__scenario')||'page',axeVersion:window.axe.version,violations:simplify(result.violations),incomplete:simplify(result.incomplete),passes:result.passes.length,measurements};
    const saved=await fetch('/__qa/report',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(report)});
    output.textContent=JSON.stringify({violations:report.violations,incomplete:report.incomplete.map(v=>v.id),passes:report.passes,saved:saved.ok,measurements:{fcpMs:measurements.fcpMs,lcpMs:measurements.lcpMs,cls}},null,2);
   }catch(error){output.textContent='Audit failed: '+error.message;}finally{button.disabled=false;}
  }
  button.addEventListener('click',audit);document.addEventListener('keydown',e=>{if(e.altKey&&e.shiftKey&&e.code==='KeyA'){e.preventDefault();audit();}});
})();

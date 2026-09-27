export function articleSections(body:string){return body.split(/\n\n+/).flatMap((block,index)=>block.startsWith('## ')?[{title:block.slice(3),id:`section-${index}`}]:[]);}
export function readingProgress(value:unknown,slugs:string[]):string[]{return Array.isArray(value)?[...new Set(value.filter((v):v is string=>typeof v==='string'&&slugs.includes(v)))]:[];}
export function tradingCosts(gross:number,turnover:number,cost:number){const drag=turnover*cost/100;return {drag,net:gross-drag};}
export function interestContext(project:string|null,lab:string|null,projects:{slug:string;name:string;lab:string}[],labs:{slug:string;title:string}[]){
  const selected=projects.find(p=>p.slug===project);const area=labs.find(l=>l.slug===(selected?.lab||lab));
  return {project:selected?.slug,lab:area?.slug,label:[selected?.name,area?.title].filter(Boolean).join(' / '),href:selected?`/research/projects/${selected.slug}`:area?`/research/labs/${area.slug}`:undefined};
}

import type { Chapter, Cohort, Episode, Lab, Person, Project, Publication, ResearchEvent } from '../content/models';
type Catalog={labs:Lab[];projects:Project[];cohorts:Cohort[];publications:Publication[];episodes:Episode[];events:ResearchEvent[];people:Person[];chapters:Chapter[]};
export function validateCatalog(catalog:Catalog):string[]{
 const errors:string[]=[];
 const exists=(collection:keyof Catalog,slug:string)=>catalog[collection].some(item=>item.slug===slug);
 const check=(condition:unknown,message:string)=>{if(!condition)errors.push(message);};
 const link=(value:string|undefined,label:string)=>{if(!value)return;try{if(value.startsWith('/')&&!value.startsWith('//')&&!/[\\\s]/.test(value))return;const url=new URL(value);check(url.protocol==='https:'&&!url.username&&!url.password,`${label}: unsafe URL`);}catch{errors.push(`${label}: invalid URL`);}};
 for(const [name,items] of Object.entries(catalog)){
  const seen=new Set<string>();for(const item of items){check(/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(item.slug),`${name}: invalid slug`);check(!seen.has(item.slug),`${name}: duplicate ${item.slug}`);seen.add(item.slug);}
 }
 for(const p of catalog.projects){
  check(exists('labs',p.lab),`${p.slug}: unknown lab`);check(p.results&&p.limitations&&p.evidence,`${p.slug}: missing evidence boundary`);
  if(p.cohort)check(exists('cohorts',p.cohort),`${p.slug}: unknown cohort`);
  if(p.status==='Published')check(p.paper||p.publication,`${p.slug}: published without output`);
  if(p.status==='Preregistered')check(p.protocol?.status==='Frozen'&&p.protocol.frozenAt&&p.protocol.artifact,`${p.slug}: preregistration needs frozen artifact`);
  (p.relatedProjects||[]).forEach(slug=>check(exists('projects',slug),`${p.slug}: unknown related project`));
  [p.repository,p.paper,p.protocol?.artifact].forEach(url=>link(url,p.slug));p.protocol?.references.forEach(r=>link(r.url,p.slug));
 }
 for(const c of catalog.cohorts)check(exists('labs',c.lab),`${c.slug}: unknown lab`);
 for(const p of catalog.publications){check(Number.isFinite(Date.parse(p.date)),`${p.slug}: invalid date`);if(p.lab)check(exists('labs',p.lab),`${p.slug}: unknown lab`);[p.pdf,p.code,p.data].forEach(url=>link(url,p.slug));check(p.limitations,`${p.slug}: missing limitations`);}
 for(const e of catalog.episodes){link(e.mediaUrl,e.slug);check(e.mediaUrl&&e.guest&&e.guestDescription,`${e.slug}: missing recording or guest attribution`);check(Number.isFinite(Date.parse(e.date)),`${e.slug}: invalid date`);e.relatedResearch.forEach(slug=>check(exists('projects',slug),`${e.slug}: unknown research`));if(e.guestSlug)check(exists('people',e.guestSlug),`${e.slug}: unknown guest`);}
 for(const e of catalog.events){
  check(Number.isFinite(Date.parse(e.date))&&e.timezone,`${e.slug}: invalid event date or timezone`);
  try{new Intl.DateTimeFormat('en',{timeZone:e.timezone});}catch{errors.push(`${e.slug}: invalid IANA timezone`);}
  if(e.startsAt)check(/(Z|[+-]\d\d:\d\d)$/.test(e.startsAt)&&Number.isFinite(Date.parse(e.startsAt)),`${e.slug}: start needs timezone offset`);
  if(e.endsAt)check(e.startsAt&&Date.parse(e.endsAt)>Date.parse(e.startsAt),`${e.slug}: end must follow start`);
  [e.registration,e.recording].forEach(url=>link(url,e.slug));e.resources?.forEach(r=>link(r.url,e.slug));
 }
 for(const p of catalog.people){link(p.publicProfile,p.slug);p.projects?.forEach(slug=>check(exists('projects',slug),`${p.slug}: unknown project`));}
 for(const c of catalog.chapters){link(c.contact,c.slug);check(c.lead&&c.country,`${c.slug}: missing accountable lead or country`);c.eventSlugs?.forEach(slug=>check(exists('events',slug),`${c.slug}: unknown event`));c.projectSlugs?.forEach(slug=>check(exists('projects',slug),`${c.slug}: unknown project`));}
 return errors;
}

import { InstitutionHome } from './landing-home';
import { UnionPage } from './union-page';
import { Join } from './join-page';
import { ReadingListPage } from './reading-list-page';
import { Glossary, LearningPractice } from './learning-practice';
import { FinanceTools, ProgramComparison } from './feature-pages';
import { portfolioPageFor } from './portfolio-pages';
import type { ComponentType } from 'react';
const routePages: Record<string, ComponentType> = {'/': InstitutionHome, '/union': UnionPage, '/join': Join, '/reading-list': ReadingListPage, '/learn/glossary': Glossary, '/learn/practice': LearningPractice, '/open/tools': FinanceTools, '/programs/compare': ProgramComparison};
for (const path of ['/projects',...Array.from({length:48},(_,index)=>`/projects/f4a-${String(index+1).padStart(2,'0')}`)]) {
 const page=portfolioPageFor(path);if(page)routePages[path]=page;
}
import { renderToString } from 'react-dom/server';
import { Site } from './site';
export { routes, aliases } from './routes';
import { publications as summaries } from './content/research';
import { editorialExplainers } from './content/editorial';
export const publications=summaries.map(p=>({...p,body:editorialExplainers.find(a=>a.slug===p.slug)?.body||p.body}));
export { labs, projects, cohorts, resources } from './content/research';
export { portfolioProjects } from './content/portfolio';
export function render(path:string){return renderToString(<Site path={path} routePage={routePages[path]} articleBody={publications.find(p=>path.endsWith('/'+p.slug))?.body}/>);}

import { labs, projects, cohorts, episodes, events, people, chapters } from './content/research';
export const catalog={labs,projects,cohorts,publications,episodes,events,people,chapters};
export function structuredRecord(path:string,origin:string){
 const event=events.find(e=>path===`/events/${e.slug}`);
 if(event?.startsAt&&event.location&&event.mode){
  return {'@context':'https://schema.org','@type':'Event',name:event.title,description:event.description,url:origin+path,startDate:event.startsAt,...event.endsAt?{endDate:event.endsAt}:{},eventStatus:`https://schema.org/${event.status==='Cancelled'?'EventCancelled':'EventScheduled'}`,eventAttendanceMode:`https://schema.org/${event.mode==='Virtual'?'OnlineEventAttendanceMode':event.mode==='Hybrid'?'MixedEventAttendanceMode':'OfflineEventAttendanceMode'}`,location:event.mode==='Virtual'?{'@type':'VirtualLocation',url:event.location}:{'@type':'Place',name:event.location}};
 }
 const article=publications.find(p=>path.endsWith('/'+p.slug));
 if(article)return {'@context':'https://schema.org','@type':'Article',headline:article.title,description:article.abstract,url:origin+path,dateModified:article.date,...article.authors.length?{author:article.authors.map(name=>({'@type':'Person',name}))}:{}};
 return null;
}

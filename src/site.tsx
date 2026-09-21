import { useEffect } from 'react';
import { labs, projects, cohorts, publications, publicationPath } from './content/research';
import { programs } from './content/programs';
import { Breadcrumbs, Navbar, Footer, PageHeader, ProjectCard, ResearchMap } from './components';
import { Home, ResearchHome, LabPage, ProjectPage, CohortPage, ProjectsDirectory, CohortsDirectory, LabsDirectory, Standards, Fellowship, Partners } from './research-pages';
import { Join, PublicationPage, PublicationDirectory, Debriefed, Journal, JournalSubmissions, Podcast, Events, ProgramPage, ProgramIndex, Frictions, OpenLibrary, Courses, Course, Chapters, Network, Media, About, Team, Contact, Search } from './ecosystem-pages';
import { aliases, getRoute, normalizePath } from './routes';
import { trackLandingEvent } from './analytics';
function Page({path,articleBody}: {path:string;articleBody?:string}){
 const lab=labs.find(l=>path===`/research/labs/${l.slug}`);if(lab)return <LabPage lab={lab}/>;
 const project=projects.find(p=>path===`/research/projects/${p.slug}`);if(project)return <ProjectPage project={project}/>;
 const cohort=cohorts.find(c=>path===`/research/cohorts/${c.slug}`);if(cohort)return <CohortPage cohort={cohort}/>;
 const publication=publications.find(p=>path===publicationPath(p));if(publication)return <PublicationPage publication={{...publication,body:articleBody||''}}/>;
 const program=programs.find(p=>path===`/${p.slug}`);if(program)return <ProgramPage program={program}/>;
 switch(path){
 case '/':return <Home/>;
 case '/research':return <ResearchHome/>;
 case '/research/labs':return <LabsDirectory/>;
 case '/research/projects':return <ProjectsDirectory/>;
 case '/research/cohorts':return <CohortsDirectory/>;
 case '/research/standards':return <Standards/>;
 case '/research/fellowship':return <Fellowship/>;
 case '/research/partner-programs':case '/about/partners':case '/network/partners':return <Partners/>;
 case '/research/map':return <><PageHeader eyebrow="Research / Connections" title="Follow the connections." description="Navigate from a lab to its research questions, project records, and proposed cohorts."/><ResearchMap/></>;
 case '/research/special-projects':return <><PageHeader eyebrow="Research / Special projects" title="Explore a different representation." description="Experimental financial intelligence, market geometry, and systemic-risk questions. Inspect the project record before interpreting the claim."/><h2 className="sr-only">Special project records</h2><div className="card-grid">{projects.filter(p=>['fi-jepa','eigen-jepa','lgwm','finimmunity'].includes(p.slug)).map(p=><ProjectCard project={p} key={p.slug}/>)}</div></>;
 case '/publications':return <PublicationDirectory/>;
 case '/publications/research-notes':return <PublicationDirectory type="Research Note"/>;
 case '/publications/working-papers':return <PublicationDirectory type="Working Paper"/>;
 case '/publications/financedebriefed':return <Debriefed/>;
 case '/publications/iyerj':return <Journal/>;
 case '/publications/iyerj/submissions':return <JournalSubmissions/>;
 case '/studio':return <ProgramIndex section="FinanceMeta Studio" title="Labs discover. Studio builds." description="Turn research into reproducible tools, data infrastructure, visualizations, and useful products." prefix="studio"/>;
 case '/studio/visualization':return <Frictions/>;
 case '/media':return <Media/>;
 case '/podcast':return <Podcast/>;
 case '/events':return <Events/>;
 case '/open':case '/open/library':case '/open/resources':return <OpenLibrary/>;
 case '/open/courses':return <Courses/>;
 case '/open/courses/financial-systems':return <Course/>;
 case '/network':return <Network/>;
 case '/network/chapters':return <Chapters/>;
 case '/challenges':return <ProgramIndex section="Challenges" title="Put the argument to the test." description="Research, economic reasoning, essays, and financial cases. Proposed programs will open only with published rules, dates, and a transparent review process." prefix="challenges"/>;
 case '/ventures':return <ProgramIndex section="Ventures" title="Understand how ideas become businesses." description="Entrepreneurship, founder networking, venture research, and diligence education. This division does not operate an investment offering through the website." prefix="ventures"/>;
 case '/about':return <About/>;
 case '/about/team':return <Team/>;
 case '/about/contact':return <Contact/>;
 case '/join':return <Join/>;
 case '/search':return <Search/>;
 default:return <><PageHeader eyebrow="404 / Page not found" title="A question without a page." description="This address is not in the FinanceMeta index. Search the research record or return to the homepage."/><a className="button" href="/search">Search FinanceMeta ↗</a></>;
 }
}
export function Site({path:rawPath,articleBody}: {path:string;articleBody?:string}){
useEffect(()=>{const click=(event:MouseEvent)=>{const link=(event.target as Element)?.closest?.('a');if(!link)return;const url=new URL(link.href,window.location.origin);const destination=url.protocol==='mailto:'?'mailto':url.origin===window.location.origin?url.pathname:url.hostname;trackLandingEvent('landing_cta',{action:'navigate',surface:'research_website',destination});};document.addEventListener('click',click);return()=>document.removeEventListener('click',click);},[]);
const path=aliases[normalizePath(rawPath)]||normalizePath(rawPath);useEffect(()=>{const route=getRoute(path);document.title=route?`${route.title} | FinanceMeta`:'Page not found | FinanceMeta';trackLandingEvent('landing_impression',{action:'view',surface:'research_website',destination:path});},[path]);return <div className="research-site"><a className="skip-link" href="#main-content">Skip to main content</a><Navbar path={path}/><main id="main-content" tabIndex={-1}>{path!=='/'&&<Breadcrumbs path={path}/>}<Page path={path} articleBody={articleBody}/></main><Footer/></div>;}

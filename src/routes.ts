import { labs, projects, cohorts, publications, publicationPath } from './content/research';
import { programs } from './content/programs';
export type RouteRecord={path:string;title:string;description:string};
const fixed: [string,string,string][] = [
 ['/','Research the systems moving capital.','FinanceMeta connects financial markets, economic systems, and machine learning through rigorous questions and reproducible methods.'],
 ['/research','Research','Explore FinanceMeta research labs, projects, cohorts, methods, and open research infrastructure.'],
 ['/research/labs','Research labs','Seven research agendas across finance, economics, and machine learning.'],
 ['/research/projects','Research projects','Search the FinanceMeta research index by lab, status, method, and topic.'],
 ['/research/cohorts','Research cohorts','Explore six proposed flagship research cohorts and existing application paths.'],
 ['/research/standards','Research standards','The FinanceMeta working research framework: baselines, temporal holdouts, reproducibility, uncertainty, and limitations.'],
 ['/research/fellowship','Global Research Fellowship','A proposed six-month global research fellowship across seven research tracks.'],
 ['/research/partner-programs','Partner research programs','Existing collaboration listings and a framework for scoped research partnerships.'],
 ['/research/special-projects','Special research projects','Inspect experimental financial research, its public code, and its evidence boundaries.'],
 ['/research/map','Research map','Explore how FinanceMeta labs, projects, and cohorts connect.'],
 ['/publications','Publications','Open educational explainers and the FinanceMeta research publication framework.'],
 ['/publications/research-notes','Research notes','The FinanceMeta research-note series. No notes have been released in this index yet.'],
 ['/publications/working-papers','Working papers','The FinanceMeta working-paper series with explicit release and review status.'],
 ['/publications/financedebriefed','FinanceDebriefed','Markets, economics, research, and the story behind the number.'],
 ['/publications/iyerj','IyERJ','The proposed formal journal layer of the FinanceMeta research ecosystem.'],
 ['/publications/iyerj/submissions','IyERJ submission information','Prepare a manuscript for review. A confirmed journal submission cycle is not open.'],
 ['/studio','FinanceMeta Studio','Research engineering, FinTech products, data infrastructure, and visualization.'],
 ['/studio/visualization','The cost of a trade','An interactive hypothetical model of turnover and trading-cost sensitivity.'],
 ['/media','FinanceMeta Media','Podcast, interviews, videos, and research sessions.'],
 ['/podcast','FinanceMeta Podcast','Research, Markets, Builders, and Next Generation. The verified episode archive is not yet populated.'],
 ['/events','FinanceMeta Sessions & events','Research seminars, speaker sessions, workshops, competitions, and community events.'],
 ['/open','FinanceMeta Open','Available guides, research templates, code, and interactive tools.'],
 ['/open/library','Open library','Search available FinanceMeta guides, templates, code, and visual tools.'],
 ['/open/resources','Educational resources','Open educational reading and research resources from FinanceMeta.'],
 ['/open/courses','Courses','A free self-guided reading pathway through financial systems.'],
 ['/open/courses/financial-systems','Understanding financial systems','Four real reading modules with local progress tracking and a practical exercise.'],
 ['/challenges','Challenges','Proposed research, economics, writing, and financial case challenges.'],
 ['/network','FinanceMeta Network','Community, chapters, partnerships, and events organized around useful work.'],
 ['/network/chapters','Chapters','A verified chapter directory and the existing application path for local organizers.'],
 ['/network/partners','Network partners','Explore existing public collaboration listings and scoped research programs.'],
 ['/ventures','Ventures','Entrepreneurship, venture research, startup diligence education, and founder networking.'],
 ['/about','About FinanceMeta','Research in finance, economics, and machine learning connected to education and engineering.'],
 ['/about/team','People & team','Public roles and contributions, listed only with verified attribution.'],
 ['/about/partners','Partners','Existing public collaboration listings and partnership inquiries.'],
 ['/about/contact','Contact','Contact the FinanceMeta team about research, partnerships, writing, or community work.'],
 ['/join','Join FinanceMeta','Choose a research, fellowship, engineering, writing, chapter, partner, or mentor application path.'],
 ['/search','Search FinanceMeta','Search labs, projects, cohorts, publications, programs, and open resources.'],
 ['/finance-for-all','Finance for All','The financial-education initiative within FinanceMeta.'],
];
export const routes:RouteRecord[]=[...fixed.map(([path,title,description])=>({path,title,description})),...labs.map(l=>({path:`/research/labs/${l.slug}`,title:l.title,description:l.thesis})),...projects.map(p=>({path:`/research/projects/${p.slug}`,title:p.name,description:p.question})),...cohorts.map(c=>({path:`/research/cohorts/${c.slug}`,title:c.title,description:c.question})),...publications.map(p=>({path:publicationPath(p),title:p.title,description:p.abstract})),...programs.map(p=>({path:`/${p.slug}`,title:p.title,description:p.summary}))];
export const aliases:Record<string,string>={'/labs':'/research/labs','/projects':'/research/projects','/programs':'/research','/fellowship':'/research/fellowship','/sister':'/research/sister','/fintech-studio':'/studio','/zenipath':'/studio/zenipath','/financedebriefed':'/publications/financedebriefed','/iyerj':'/publications/iyerj','/community':'/network/community','/chapters':'/network/chapters','/learn':'/open','/learn/debriefs':'/publications/financedebriefed','/learn/five-foundations':'/finance-for-all','/evidence':'/research/standards'};
export const normalizePath=(path:string)=>path.replace(/\/+$/,'')||'/';
export const getRoute=(path:string)=>routes.find(r=>r.path===normalizePath(path));

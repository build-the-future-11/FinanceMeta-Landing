import { applicationDestination } from './lib/application-routes';
import { ReadingProvider, ReadingFeedback } from './reading-list';
import type { ReactNode } from 'react';
import { useEffect } from 'react';
import { Breadcrumbs, Navbar, Footer } from './components';
import { aliases, getRoute, normalizePath } from './routes';
import { trackLandingEvent } from './analytics';
export type PageRenderer = (path: string, articleBody?: string) => ReactNode;
export function Site({path:rawPath,articleBody,renderPage}: {path:string;articleBody?:string;renderPage:PageRenderer}){
useEffect(()=>{const click=(event:MouseEvent)=>{const link=(event.target as Element)?.closest?.('a');if(!link)return;const url=new URL(link.href,window.location.origin);const destination=url.protocol==='mailto:'?'mailto':url.origin===window.location.origin?url.pathname:url.hostname;const application=applicationDestination(url.href);trackLandingEvent('landing_cta',{action:application?'application_open':'navigate',surface:window.location.pathname,destination:application||destination});};document.addEventListener('click',click);return()=>document.removeEventListener('click',click);},[]);
const resolved=aliases[normalizePath(rawPath)]||normalizePath(rawPath);const path=getRoute(resolved)?resolved:'/404';useEffect(()=>{const route=getRoute(path);document.title=route?`${route.title} | FinanceMeta`:'Page not found | FinanceMeta';trackLandingEvent('landing_impression',{action:'view',surface:'research_website',destination:path});},[path]);return <ReadingProvider><div className={`research-site${path==='/'?' home-shell':''}`}><a className="skip-link" href="#main-content">Skip to main content</a><Navbar path={path}/><main id="main-content" tabIndex={-1}>{path!=='/'&&<Breadcrumbs path={path}/>}{renderPage(path,articleBody)}</main><Footer/><ReadingFeedback/></div></ReadingProvider>;}

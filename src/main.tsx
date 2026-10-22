import { loadRoutePage } from './route-pages';
import React from 'react';
import { createRoot, hydrateRoot } from 'react-dom/client';

if (window.location.pathname === '/' && window.location.hash.startsWith('#union')) {
  window.location.replace('/union' + window.location.search + window.location.hash);
}

if (window.location.pathname.replace(/\/$/,'') === '/finance-for-all') {
  void import('./legacy/landing');
} else {
  void Promise.all([import('./site'),import('./index.css'),loadRoutePage(window.location.pathname),/^\/publications\/[^/]+\/[^/]+\/?$/.test(window.location.pathname)?import('./content/editorial').then(({editorialExplainers})=>editorialExplainers.find(p=>window.location.pathname.replace(/\/$/,'').endsWith('/'+p.slug))?.body):Promise.resolve(undefined)]).then(async ([{Site},,routePage,articleBody])=>{
    const root=document.getElementById('root');
    if(!root)return;
    const Page=routePage?undefined:(await import('./route-content')).Page;
    const renderPage=(path:string,body?:string)=>routePage?React.createElement(routePage):Page?React.createElement(Page,{path,articleBody:body}):null;
    const app=<React.StrictMode><Site path={window.location.pathname} articleBody={articleBody} renderPage={renderPage}/></React.StrictMode>;
    if(root.dataset.rendered==='true')hydrateRoot(root,app);
    else createRoot(root).render(app);
  });
}

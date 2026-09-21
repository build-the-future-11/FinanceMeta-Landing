import React from 'react';
import { createRoot, hydrateRoot } from 'react-dom/client';

if (window.location.pathname.replace(/\/$/,'') === '/finance-for-all') {
  void import('./legacy/landing');
} else {
  void Promise.all([import('./site'),import('./index.css'),/^\/publications\/[^/]+\/[^/]+\/?$/.test(window.location.pathname)?import('./content/editorial').then(({editorialExplainers})=>editorialExplainers.find(p=>window.location.pathname.replace(/\/$/,'').endsWith('/'+p.slug))?.body):Promise.resolve(undefined)]).then(([{Site},,articleBody])=>{
    const root=document.getElementById('root');
    if(!root)return;
    const app=<React.StrictMode><Site path={window.location.pathname} articleBody={articleBody}/></React.StrictMode>;
    if(root.dataset.rendered==='true')hydrateRoot(root,app);
    else createRoot(root).render(app);
  });
}

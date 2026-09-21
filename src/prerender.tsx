import { renderToString } from 'react-dom/server';
import { Site } from './site';
export { routes, aliases } from './routes';
import { publications as summaries } from './content/research';
import { editorialExplainers } from './content/editorial';
export const publications=summaries.map(p=>({...p,body:editorialExplainers.find(a=>a.slug===p.slug)?.body||''}));
export { labs, projects, cohorts, resources } from './content/research';
export function render(path:string){return renderToString(<Site path={path} articleBody={publications.find(p=>path.endsWith('/'+p.slug))?.body}/>);}

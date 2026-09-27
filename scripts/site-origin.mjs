import {loadEnv} from 'vite';
export function publicSiteOrigin(value){
 const url=new URL(value);
 if(url.protocol!=='https:'||url.username||url.password||url.pathname!=='/'||url.search||url.hash||['localhost','127.0.0.1','[::1]','0.0.0.0'].includes(url.hostname)||url.hostname.endsWith('.localhost'))throw new Error('VITE_SITE_URL must be a public HTTPS origin without a path, credentials, query, or fragment');
 return url.origin;
}
export function siteOrigin(){return publicSiteOrigin(process.env.VITE_SITE_URL||loadEnv('production',process.cwd(),'VITE_').VITE_SITE_URL||'https://finance-meta-landing.vercel.app');}

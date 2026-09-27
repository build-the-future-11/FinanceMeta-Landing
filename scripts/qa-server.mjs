// Local-only browser diagnostics. Neither this server nor its scripts enter dist.
import {createServer} from 'node:http';
import {readFileSync,existsSync,statSync,mkdirSync,writeFileSync} from 'node:fs';
import {resolve,extname,sep} from 'node:path';
import {createHash} from 'node:crypto';
const root=resolve('dist');const port=Number(process.env.QA_PORT||4181);
const origin=`http://127.0.0.1:${port}`;
const evidence=resolve('evidence/improvements-2026-09-21/browser-audits');
const config=JSON.parse(readFileSync('vercel.json'));
const mime={'.html':'text/html; charset=utf-8','.js':'text/javascript','.css':'text/css','.json':'application/json','.svg':'image/svg+xml','.png':'image/png','.md':'text/markdown; charset=utf-8','.xml':'application/xml','.txt':'text/plain'};
createServer(async(req,res)=>{
 try {
  if(req.headers.host!==`127.0.0.1:${port}`){res.writeHead(403).end();return;}
  const url=new URL(req.url,origin);
  if(req.method==='POST'&&url.pathname==='/__qa/report'){
   if(req.headers.origin!==origin){res.writeHead(403).end();return;}
   let body='';for await(const chunk of req){body+=chunk;if(body.length>3_000_000){res.writeHead(413).end();return;}}
   const data=JSON.parse(body);const key=createHash('sha256').update(`${data.path}|${data.width}|${data.theme}|${data.scenario}`).digest('hex').slice(0,16);
   mkdirSync(evidence,{recursive:true});writeFileSync(`${evidence}/${key}.json`,JSON.stringify(data,null,2));res.writeHead(200,{'Content-Type':'application/json'}).end(JSON.stringify({saved:true}));return;
  }
  if(!['GET','HEAD'].includes(req.method)){res.writeHead(405).end();return;}
  let file;
  if(url.pathname==='/__qa/axe.js')file=resolve('node_modules/axe-core/axe.min.js');
  else if(url.pathname==='/__qa/audit.js')file=resolve('scripts/browser-audit.js');
  else {
   const redirect=config.redirects.find(r=>r.source===url.pathname);
   if(redirect){res.writeHead(308,{Location:redirect.destination+url.search}).end();return;}
   file=resolve(root,'.'+decodeURIComponent(url.pathname));
   if(file!==root&&!file.startsWith(root+sep)){res.writeHead(403).end();return;}
   if(file===root)file=resolve(root,'index.html');
   else if(!extname(file))file+='.html';
  }
  let status=200;if(!existsSync(file)||!statSync(file).isFile()){file=resolve(root,'404.html');status=404;}
  for(const {key,value} of config.headers[0].headers)res.setHeader(key,value);
  res.setHeader('Cache-Control','no-store');res.setHeader('Content-Type',mime[extname(file)]||'application/octet-stream');
  let body=readFileSync(file);
  if(extname(file)==='.html'&&url.searchParams.has('__audit'))body=Buffer.from(body.toString().replace('</head>','<script src="/__qa/audit.js" defer></script></head>'));
  res.writeHead(status);res.end(req.method==='HEAD'?undefined:body);
 }catch(error){res.writeHead(500).end(String(error.message));}
}).listen(port,'127.0.0.1',()=>console.log(`Local QA: ${origin}/?__audit=1`));

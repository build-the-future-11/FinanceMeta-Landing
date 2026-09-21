export type FilterKey = 'type'|'lab'|'status'|'methods'|'topics'|'year'|'country';
export type DirectoryItem = {slug:string;title:string;description:string;href:string;type:string;lab?:string;status?:string;methods?:string[];topics?:string[];year?:string;date?:string;country?:string;searchText?:string};
export type DirectoryState = {query:string;selected:Partial<Record<FilterKey,string>>;sort:'recommended'|'title'|'newest'};
export function filterValues(items:DirectoryItem[],key:FilterKey):string[] {return [...new Set(items.flatMap(item=>item[key]||[]))].sort();}
export function readDirectoryState(search:string,items:DirectoryItem[],keys:FilterKey[],defaults:Partial<Record<FilterKey,string>>={}):DirectoryState {
  const params=new URLSearchParams(search);const selected={...defaults};
  for(const key of keys){const value=params.get(key);if(value!==null)selected[key]=value===''||filterValues(items,key).includes(value)?value:(defaults[key]||'');}
  const sort=params.get('sort');return {query:(params.get('q')||'').slice(0,300),selected,sort:sort==='title'||sort==='newest'?sort:'recommended'};
}
export function directorySearch(state:DirectoryState,search:string,keys:FilterKey[],defaults:Partial<Record<FilterKey,string>>={}):string {
  const params=new URLSearchParams(search);
  state.query.trim()?params.set('q',state.query.trim()):params.delete('q');
  for(const key of keys){const value=state.selected[key]||'';value===(defaults[key]||'')?params.delete(key):params.set(key,value);}
  state.sort==='recommended'?params.delete('sort'):params.set('sort',state.sort);
  const query=params.toString();return query?'?'+query:'';
}
export function selectDirectoryItems(items:DirectoryItem[],state:DirectoryState,keys:FilterKey[]):DirectoryItem[] {
  const terms=state.query.toLocaleLowerCase().trim().split(/\s+/).filter(Boolean);
  const matches=items.filter(item=>{const text=[item.title,item.description,item.type,item.status,item.searchText,...item.topics||[],...item.methods||[]].join(' ').toLocaleLowerCase();return terms.every(term=>text.includes(term))&&keys.every(key=>!state.selected[key]||(Array.isArray(item[key])?(item[key] as string[]).includes(state.selected[key]!):item[key]===state.selected[key]));});
  if(state.sort==='title')return matches.sort((a,b)=>a.title.localeCompare(b.title));
  if(state.sort==='newest')return matches.sort((a,b)=>(b.date||b.year||'').localeCompare(a.date||a.year||'')||a.title.localeCompare(b.title));
  const rank=(item:DirectoryItem)=>terms.reduce((sum,term)=>sum+(item.title.toLowerCase().includes(term)?2:0),0);
  return terms.length?matches.sort((a,b)=>rank(b)-rank(a)):matches;
}

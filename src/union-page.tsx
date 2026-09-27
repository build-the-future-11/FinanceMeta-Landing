import { useEffect, useRef, useState } from 'react';
import { PageHeader } from './components';
import { collaborationIsOpen, PARTNER_KINDS, publishablePartners, UNION_PARTNERS, type UnionPartner } from './union-data';
import './union.css';

export function UnionPage({ records = UNION_PARTNERS }: { records?: UnionPartner[] }) {
  const [hash, setHash] = useState('');
  const [query, setQuery] = useState('');
  const [kind, setKind] = useState('All');
  const [status, setStatus] = useState('All');
  const heading = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const changed = () => setHash(window.location.hash);
    changed(); window.addEventListener('hashchange', changed);
    return () => window.removeEventListener('hashchange', changed);
  }, []);
  useEffect(() => {
    if (hash.startsWith('#union/')) { const title=heading.current?.querySelector('h1'); title?.setAttribute('tabindex','-1'); title?.focus(); }
  }, [hash]);
  const partners = publishablePartners(records);
  const detail = hash.startsWith('#union/') ? hash.slice(7) : null;
  const partner = detail ? partners.find(item => item.slug === detail) : null;
  const filtered = partners.filter(item => (kind === 'All' || item.kind === kind) && (status === 'All' || item.relationship === status)
    && [item.name,item.region,item.summary,item.relationshipSummary,...item.collaborations.map(c=>c.title)].join(' ').toLowerCase().includes(query.trim().toLowerCase()));
  return <div className="union-page" ref={heading}>
    <PageHeader eyebrow="The Union Project" title={detail ? partner?.name ?? 'Partner record unavailable' : 'Collaboration with a clear purpose.'} description={detail ? 'Relationship scope, public evidence and reviewed collaboration opportunities.' : 'Explore FinanceMeta relationships and shared opportunities. Every published record identifies the scope, status and evidence behind the collaboration.'}/>
    {detail ? <section className="section"><a className="text-link" href="#union">Back to partner directory</a>{partner ? <>
      <dl className="union-facts">{[['Focus',partner.kind],['Region',partner.region],['Relationship',partner.relationship],['Last reviewed',partner.reviewedOn],['Review due',partner.reviewDue]].map(([label,value])=><div key={label}><dt>{label}</dt><dd>{value}</dd></div>)}</dl>
      <p>{partner.summary}</p><h2>The collaboration</h2><p>{partner.relationshipSummary}</p>
      <div className="page-actions"><a className="text-link" href={partner.website}>Visit partner website</a><a className="text-link" href={partner.evidenceUrl}>Read relationship evidence</a></div>
      <h2>Programs &amp; opportunities</h2>{partner.collaborations.length ? <ul className="union-records">{partner.collaborations.map((item,index)=>{
        const open=partner.relationship==='Active' && collaborationIsOpen(item);
        return <li key={index}><p className="eyebrow">{open?'Open':'Closed'}{item.deadline?` · Deadline ${item.deadline} (UTC)`:''}</p><h3>{item.title}</h3><p>{item.description}</p><a className="text-link" href={item.url}>{open?'View opportunity':'View program record'}<span className="sr-only">: {item.title}</span></a></li>;
      })}</ul> : <p>No public collaboration opportunities are listed for this partner.</p>}
    </> : <p>This record is not currently published. It may be awaiting review or the link may be incorrect.</p>}</section>
    : <section className="section" id="union"><h2 className="sr-only">Partner directory</h2>{partners.length===0 ? <div className="union-empty">
      <div><h3>No verified partners published yet.</h3><p>Partner listings will appear after the relationship and permission to publish have been reviewed. No partner affiliations are being claimed here.</p></div>
      <div><h3>Build something together.</h3><p>Propose a research collaboration, learning program or community initiative. Include your organisation, a public website and the work you would like to do.</p><a className="text-link" href="mailto:financeforalledu@gmail.com?subject=Union%20Project%20collaboration">Propose a Union collaboration</a></div>
    </div> : <>
      <div className="filter-bar" role="search" aria-label="Find Union partners">
        <label>Search partners<input type="search" maxLength={200} value={query} onChange={e=>setQuery(e.target.value)} placeholder="Name, region or collaboration"/></label>
        <label>Focus<select value={kind} onChange={e=>setKind(e.target.value)}><option value="All">All focus areas</option>{PARTNER_KINDS.map(item=><option key={item}>{item}</option>)}</select></label>
        <label>Relationship<select value={status} onChange={e=>setStatus(e.target.value)}><option value="All">All relationships</option><option>Active</option><option>Past</option></select></label>
        <button className="reset-button" type="button" onClick={()=>{setQuery('');setKind('All');setStatus('All');}}>Clear filters</button>
      </div><p role="status">{filtered.length} {filtered.length===1?'partner':'partners'} found</p>
      {filtered.length ? <ul className="union-records">{filtered.map(item=><li key={item.slug}><p className="eyebrow">{item.kind} · {item.relationship}</p><h3><a href={`#union/${item.slug}`}>{item.name}</a></h3><p>{item.region}</p><p>{item.summary}</p></li>)}</ul> : <p>No partners match these filters.</p>}
    </>}</section>}
  </div>;
}

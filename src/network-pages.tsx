import { Arrow, Directory, LinkButton, PageHeader, Section, StatusBadge } from './components';
import catalog from './content/network-catalog.json';
import { EventsCalendar } from './events-calendar';
import { cohorts } from './content/research';
import type { ComponentType } from 'react';
import './network-catalog.css';

function CatalogNav() {
  return <nav className="section-nav" aria-label="Explore Finance4All"><a href="/programs">Programs</a><a href="/projects">All 48 projects</a><a href="/research/projects">Research briefs</a><a href="/events">Events & launch plans</a></nav>;
}
export function NetworkPrograms() {
  return <><PageHeader eyebrow="FinanceMeta / Finance4All / IYERN" title="Find your next contribution." description="Explore education, research, publishing, competitions, building and community programs. Each listing explains what is available and what still needs to happen."/><CatalogNav/><p className="fine-print">{catalog.programs.length} program records · Sources reviewed {catalog.sourceVerifiedAt} · Reconciled {catalog.reconciledAt}. Interest and screening are separate from admission or program delivery.</p><Directory label="Search all programs" filters={['type','status']} items={catalog.programs.map(p=>({slug:p.slug,title:p.title,description:p.status+' · '+p.summary,href:'/programs/'+p.slug,type:p.family,status:p.status,searchText:[...p.aliases,p.organization,p.audience].join(' ')}))}/><details className="catalog-legacy"><summary>Explore proposed research cohorts and participation tracks</summary><ul>{cohorts.map(c=><li key={c.slug}><a className="text-link" href={"/research/cohorts/"+c.slug}>{c.title}<Arrow/></a> · {c.status}</li>)}</ul><a className="text-link" href="/programs/compare">Compare participation tracks<Arrow/></a></details></>;
}
export function NetworkEvents() {
  return <><PageHeader eyebrow="Events / In the works" title="Ideas worth gathering around." description="Discover workshops, research challenges and build events in preparation. These launch plans have no confirmed dates; holds and scheduling requirements are shown on each record."/><CatalogNav/><p className="fine-print">{catalog.events.length} launch plans · Five on hold, two awaiting schedule · Source review {catalog.sourceVerifiedAt}. No scheduled event was verified in these records.</p><Directory label="Search event plans" filters={['type','status']} items={catalog.events.map(e=>({slug:e.slug,title:e.title,description:e.status+' · '+e.summary,href:'/events/'+e.slug,type:e.type,status:e.status,searchText:e.host+' '+e.readiness}))}/><Section title="Looking for confirmed dates?"><p>Launch plans stay separate from the confirmed-event calendar.</p><a className="text-link" href="/events/calendar">View the calendar<Arrow/></a></Section></>;
}
function ProgramRecord({slug}:{slug:string}) {
  const p=catalog.programs.find(item=>item.slug===slug)!;
  const events=catalog.events.filter(e=>e.program===slug);
  return <><PageHeader eyebrow={`${p.organization} / ${p.family}`} title={p.title} description={p.summary}><LinkButton href="/programs" secondary>All programs</LinkButton></PageHeader><StatusBadge>{p.status}</StatusBadge><div className="catalog-detail"><div><Section title="The idea"><p>{p.purpose}</p></Section><Section title="What you would contribute"><p>{p.deliverable}</p></Section><Section title="Who it is for"><p>{p.audience}</p><p>{p.eligibility}</p></Section><Section title="Current availability"><p>{p.readiness}</p><p>{p.selection}</p>{p.action && <a className="button" href={p.action.href}>{p.action.label}<Arrow/></a>}</Section>{events.length>0&&<Section title="Related event plans">{events.map(e=><p key={e.slug}><a className="text-link" href={'/events/'+e.slug}>{e.title}<Arrow/></a> · {e.status}</p>)}</Section>}{p.related.length>0&&<Section title="Explore further">{p.related.map(r=><p key={r.href}><a className="text-link" href={r.href}>{r.label}<Arrow/></a></p>)}</Section>}</div><aside><h2>At a glance</h2><dl><dt>Dates</dt><dd>{p.dates}</dd><dt>Time commitment</dt><dd>{p.commitment}</dd><dt>Format</dt><dd>{p.format}</dd><dt>Source reviewed</dt><dd>{p.verifiedAt}</dd></dl><a className="text-link" href={p.source.href}>{p.source.title}<Arrow/></a>{p.aliases.length>0&&<p className="fine-print">Also recorded as: {p.aliases.join('; ')}.</p>}</aside></div></>;
}
function EventPlan({slug}:{slug:string}) {
  const e=catalog.events.find(item=>item.slug===slug)!;
  const program=catalog.programs.find(p=>p.slug===e.program);
  return <><PageHeader eyebrow={`${e.host} / ${e.type} plan`} title={e.title} description={e.summary}><LinkButton href="/events" secondary>All event plans</LinkButton></PageHeader><StatusBadge>{e.status}</StatusBadge><Section title="Before this event can run"><p>{e.readiness}</p></Section><Section title="Schedule & participation"><p>No confirmed date, deadline or registration is announced in this record. This plan is not a scheduled event or a calendar invitation.</p>{program&&<a className="button secondary" href={'/programs/'+program.slug}>Explore {program.title}<Arrow/></a>}</Section><p className="fine-print">Source reviewed {e.verifiedAt}. This notice reflects the FinanceMeta / Finance4All program planning record.</p></>;
}
export function networkPageFor(path:string): ComponentType | undefined {
  if(path==='/programs')return NetworkPrograms;
  if(path==='/events')return NetworkEvents;
  if(path==='/events/calendar')return EventsCalendar;
  const program=catalog.programs.find(p=>path==='/programs/'+p.slug);
  if(program)return ()=> <ProgramRecord slug={program.slug}/>;
  const event=catalog.events.find(e=>path==='/events/'+e.slug);
  if(event)return ()=> <EventPlan slug={event.slug}/>;
}

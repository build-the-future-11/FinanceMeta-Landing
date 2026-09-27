import type { Publication, ResearchEvent } from '../content/models';
export function bibtex(p: Publication) {
 const escape=(s:string)=>s.replace(/[\\{}%&#_$]/g,c=>'\\'+c).replace(/[\r\n]+/g,' ');
 const fields=[`title = {${escape(p.title)}}`,...(p.authors.length?[`author = {${p.authors.map(escape).join(' and ')}}`]:[]),`howpublished = {${escape(p.type)}}`,`note = {Editorial review date: ${escape(p.date)}. Original publication date not asserted.}`];
 return `@misc{financemeta_${p.slug.replaceAll('-','_')},\n  ${fields.join(',\n  ')}\n}`;
}
export function eventCalendar(event: ResearchEvent, origin: string) {
 if (!event.startsAt || !event.endsAt || !Number.isFinite(Date.parse(event.startsAt)) || Date.parse(event.endsAt)<=Date.parse(event.startsAt)) return null;
 const stamp=(s:string)=>new Date(s).toISOString().replace(/[-:]/g,'').replace(/\.\d{3}/,'');
 const escape=(s:string)=>s.replace(/\\/g,'\\\\').replace(/\r?\n/g,'\\n').replace(/,/g,'\\,').replace(/;/g,'\\;');
 return ['BEGIN:VCALENDAR','VERSION:2.0','PRODID:-//FinanceMeta//Events//EN','BEGIN:VEVENT',`UID:${event.slug}@${new URL(origin).hostname}`,`DTSTAMP:${stamp(event.startsAt)}`,`DTSTART:${stamp(event.startsAt)}`,`DTEND:${stamp(event.endsAt)}`,`SUMMARY:${escape(event.title)}`,`DESCRIPTION:${escape(event.description)}`,`LOCATION:${escape(event.location||event.mode||'')}`,`URL:${origin}/events/${event.slug}`,`STATUS:${event.status==='Cancelled'?'CANCELLED':'CONFIRMED'}`,'END:VEVENT','END:VCALENDAR',''].join('\r\n');
}

import type { Publication, ResearchEvent } from '../content/models';
import { parseEventInstant } from './event-time.ts';
export function bibtex(p: Publication) {
 const escape=(s:string)=>s.replace(/[\\{}%&#_$]/g,c=>'\\'+c).replace(/[\r\n]+/g,' ');
 const fields=[`title = {${escape(p.title)}}`,...(p.authors.length?[`author = {${p.authors.map(escape).join(' and ')}}`]:[]),`howpublished = {${escape(p.type)}}`,`note = {Editorial review date: ${escape(p.date)}. Original publication date not asserted.}`];
 return `@misc{financemeta_${p.slug.replaceAll('-','_')},\n  ${fields.join(',\n  ')}\n}`;
}
export function eventCalendar(event: ResearchEvent, origin: string) {
 if (!event.startsAt || !event.endsAt) return null;
 const start=parseEventInstant(event.startsAt),end=parseEventInstant(event.endsAt);
 // Export drops fractional seconds, so the serialized end must still follow the start.
 if (start===null || end===null || Math.floor(end/1000)<=Math.floor(start/1000)) return null;
 if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(event.slug) || /[\u0000-\u0020\u007f]/.test(origin)) return null;
 let site:URL;
 try { site=new URL(origin); } catch { return null; }
 if (!['http:','https:'].includes(site.protocol) || site.username || site.password) return null;
 const stamp=(s:string)=>new Date(s).toISOString().replace(/[-:]/g,'').replace(/\.\d{3}/,'');
 const escape=(s:string)=>s.replace(/\\/g,'\\\\').replace(/\r\n|\r|\n/g,'\\n').replace(/,/g,'\\,').replace(/;/g,'\\;');
 // RFC 5545 sections 3.1 and 3.3.11: fold at 75 UTF-8 octets,
 // counting the continuation space and keeping every code point intact.
 const encoder=new TextEncoder();
 const fold=(line:string)=>{
  let result='',bytes=0;
  for(const character of line){
   const width=encoder.encode(character).length;
   if(bytes+width>75){result+='\r\n ';bytes=1;}
   result+=character;bytes+=width;
  }
  return result;
 };
 return ['BEGIN:VCALENDAR','VERSION:2.0','PRODID:-//FinanceMeta//Events//EN','BEGIN:VEVENT',`UID:${event.slug}@${site.hostname}`,`DTSTAMP:${stamp(event.startsAt)}`,`DTSTART:${stamp(event.startsAt)}`,`DTEND:${stamp(event.endsAt)}`,`SUMMARY:${escape(event.title)}`,`DESCRIPTION:${escape(event.description)}`,`LOCATION:${escape(event.location||event.mode||'')}`,`URL:${site.origin}/events/${event.slug}`,`STATUS:${event.status==='Cancelled'?'CANCELLED':'CONFIRMED'}`,'END:VEVENT','END:VCALENDAR',''].map(fold).join('\r\n');
}


import { getApplicationSearch } from './analytics';
import { useEffect, useState } from 'react';
import { Arrow, PageHeader, LinkButton, Section } from './components';
import { interestContext } from './lib/reading';
import { projects, labs } from './content/research';
import { applicationUrl, type ApplicationRoute } from './lib/application-routes';

const generalForm: ApplicationRoute='join';
const partnerForm: ApplicationRoute='partnership';
const roles=[
 {title:'Researcher',what:'Read, test, analyze, and reproduce. Help turn a lab question into evidence.',skills:'Statistics, domain knowledge, critical reading, or a method you can contribute.',gain:'Practice building a reproducible research record with collaborators.',href:generalForm},
 {title:'Research Fellow',what:'Express interest in the proposed six-month research fellowship.',skills:'Preparation for a sustained research project and an explicit question.',gain:'A proposed path from literature and protocol to a final research artifact.',href:generalForm},
 {title:'Engineer',what:'Build evaluation tools, data pipelines, visualizations, or a scoped product.',skills:'Software development, testing, data engineering, or accessible interface design.',gain:'Build tools with a concrete research or learning use case.',href:generalForm},
 {title:'Writer',what:'Turn financial and economic ideas into careful, sourced explanations.',skills:'Clear writing, source evaluation, editing, and a willingness to revise.',gain:'Develop a writing sample and an editorial review practice.',href:generalForm},
 {title:'Chapter Lead',what:'Propose a local team, a regular activity, and a first reviewable output.',skills:'Local organization, accountability, and a realistic operating plan.',gain:'Develop a research or learning community with a defined purpose.',href:'chapter' as ApplicationRoute},
 {title:'Partner',what:'Bring a research question, data resource, program, or institutional collaboration.',skills:'A named project owner, a clear scope, and any necessary data permissions.',gain:'Explore a collaboration with explicit responsibilities and outputs.',href:partnerForm},
 {title:'Speaker / Mentor',what:'Explain your work, review a method, or help a team ask a better question.',skills:'Relevant experience and a clearly scoped contribution.',gain:'Share methods and experience with an emerging research network.',href:partnerForm},
];

export function Join() {
 const [role,setRole]=useState('Researcher');
 const [search,setSearch]=useState('');
 useEffect(()=>{
  setSearch(getApplicationSearch());
  const value=new URLSearchParams(window.location.search).get('role');
  if(roles.some(item=>item.title===value))setRole(value!);
 },[]);
 const params=new URLSearchParams(search);
 const project=projects.find(item=>item.slug===params.get('project'))?.slug||'';
 const lab=labs.find(item=>item.slug===params.get('lab'))?.slug||'';
 const source=interestContext(project,lab,projects,labs);
 const selected=roles.find(item=>item.title===role)!;
 const href=applicationUrl(selected.href,search,{role,project,lab,surface:'join'});
 return <>
  <PageHeader eyebrow="Join FinanceMeta" title="Choose your contribution. Apply once." description="Research a question, build a tool, write an explanation, or organize a local group. Tell us where you want to contribute; the team reviews fit and available capacity."/>
  <p className="fine-print">You can apply without creating a FinanceMeta account. Already have a manuscript? <a href="/apply?call=research-submission">Choose journal review or the preprint forum.</a></p>
  <div className="role-picker" role="group" aria-label="Contribution roles">{roles.map(item=><button type="button" key={item.title} aria-pressed={role===item.title} onClick={()=>{setRole(item.title);const url=new URL(window.location.href);url.searchParams.set('role',item.title);window.history.replaceState(null,'',url);}}>{item.title}<Arrow/></button>)}</div>
  <section className="join-layout"><div className="role-description">
   <p className="eyebrow">Your contribution / {role}</p><h2>{selected.what}</h2>
   {source.href&&<div className="interest-context"><p className="eyebrow">Your research interest</p><a href={source.href}>{source.label}<Arrow/></a></div>}
   <dl><dt>Useful preparation</dt><dd>{selected.skills}</dd><dt>What you can work toward</dt><dd>{selected.gain}</dd><dt>Commitment</dt><dd>Share your availability in the form. Hours, supervision and scope are agreed before participation.</dd><dt>Availability</dt><dd>Expressions of interest are open. Proposed cohorts do not yet have confirmed dates or places.</dd><dt>Fees and funding</dt><dd>No confirmed participation fee, stipend or funding arrangement is published for proposed programs.</dd></dl>
   <div className="application-actions"><LinkButton href={href}>Start {selected.href==='chapter'?'chapter':selected.href==='partnership'?'collaboration':'general'} application</LinkButton><p className="fine-print">Opens Tally. Your selected role and public research context travel with the link. You review and submit your answers there.</p></div>
  </div><aside className="text-panel"><h2>Have these ready</h2><ul className="question-list"><li>An email you check regularly.</li><li>A short description of your interests and preparation.</li><li>A work example, if you have one. Independent learning and small projects count.</li><li>Your realistic availability.</li></ul><h3>After you apply</h3><ol className="application-steps"><li><strong>Confirmation</strong><span>Keep the Tally confirmation and a copy of your answers.</span></li><li><strong>Review</strong><span>The team considers your interests, preparation and available capacity.</span></li><li><strong>Next step</strong><span>If a suitable opportunity is available, agree the first task and expectations before joining.</span></li></ol><p>No review deadline or place is guaranteed. You do not need another general application for each interest.</p><a href="/privacy">Read the privacy information</a></aside></section>
  <Section title="A question before applying?" description="Use email for a question or an accessibility request. An email draft is separate from an application."><a className="text-link" href="mailto:financeforalledu@gmail.com?subject=FinanceMeta%20application%20question">Ask the team a question <Arrow/></a><p>For corrections or withdrawal, use the same address and identify the form you submitted. Do not email confidential datasets or identity documents.</p></Section>
 </>;
}

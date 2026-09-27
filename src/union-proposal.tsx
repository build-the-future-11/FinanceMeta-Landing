import { useRef, useState } from 'react';
import { collaborationPaths, prepareCollaborationBrief, type CollaborationPath } from './union-brief';

const Arrow = () => <span aria-hidden="true">↗</span>;

export function UnionIntroduction() {
  return <>
    <header className="union-hero">
      <div className="union-hero-copy">
        <p className="eyebrow"><span className="union-dot" aria-hidden="true"/> FinanceMeta / The Union Project</p>
        <h1>Better questions.<br/><em>Shared work.</em></h1>
        <p className="union-deck">Bring a research question, a learning idea, or a community initiative. Give it a clear purpose—and people to build it with.</p>
        <div className="page-actions"><a className="button union-primary" href="#proposal">Shape a collaboration <Arrow/></a><a className="text-link" href="/research/projects">Explore our research <Arrow/></a></div>
        <p className="union-hero-note">For students, researchers, educators and organisations.</p>
      </div>
      <aside className="union-principles" aria-labelledby="union-principles-title">
        <p className="eyebrow">The starting point</p>
        <h2 id="union-principles-title">A shared question.<br/>A useful outcome.</h2>
        <ol>{[['Purpose','What is worth understanding or making?'],['Contribution','What can each person bring to the work?'],['Evidence','What will there be to read, use or examine?']].map(([title,description],i)=><li key={title}><span className="union-step" aria-hidden="true">0{i+1}</span><div><h3>{title}</h3><p>{description}</p></div></li>)}</ol>
        <p className="union-principles-note">Start small. Agree the scope. Make the work useful.</p>
      </aside>
    </header>
    <nav className="union-page-nav" aria-label="On this page"><a href="#collaboration-paths"><span>01</span> Find your starting point <span aria-hidden="true">↓</span></a><a href="#proposal"><span>02</span> Prepare a brief <span aria-hidden="true">↓</span></a><a href="#union"><span>03</span> Partner directory <span aria-hidden="true">↓</span></a></nav>
  </>;
}

export function UnionProposal() {
  const [path, setPath] = useState<CollaborationPath>('research');
  const [organisation, setOrganisation] = useState('');
  const [idea, setIdea] = useState('');
  const [contribution, setContribution] = useState('');
  const [outcome, setOutcome] = useState('');
  const [brief, setBrief] = useState('');
  const [error, setError] = useState('');
  const [copyStatus, setCopyStatus] = useState('');
  const resultHeading = useRef<HTMLHeadingElement>(null);
  const selected = collaborationPaths.find(item => item.id === path)!;
  const changed = () => { setBrief(''); setError(''); setCopyStatus(''); };
  return <>
    <section className="union-paths" id="collaboration-paths" aria-labelledby="union-paths-title">
      <div className="union-section-heading"><p className="eyebrow">01 / A place to begin</p><h2 id="union-paths-title">What would you like to work on?</h2><p>Choose a direction. Use the prompts to turn an early idea into a conversation.</p></div>
      <div className="union-path-layout">
        <div className="union-path-options" role="group" aria-label="Collaboration area">{collaborationPaths.map((item,i)=><button key={item.id} type="button" aria-pressed={path===item.id} aria-controls="union-path-guide" onClick={()=>{setPath(item.id);changed();}}><span className="union-path-number">0{i+1}</span><span>{item.label}</span><span aria-hidden="true">{path===item.id?'↗':'→'}</span></button>)}</div>
        <div id="union-path-guide" className="union-path-guide" aria-live="polite"><p className="eyebrow">{selected.label} / Collaboration guide</p><h3>{selected.title}</h3><p>{selected.description}</p><dl><div><dt>What you could bring</dt><dd>{selected.contribution}</dd></div><div><dt>What you could make</dt><dd>{selected.outcome}</dd></div></dl></div>
      </div>
    </section>
    <section className="union-proposal" id="proposal" aria-labelledby="union-proposal-title">
      <div className="union-proposal-intro"><p className="eyebrow">02 / From interest to an idea</p><h2 id="union-proposal-title">A good brief opens<br/><em>a better conversation.</em></h2><p>Three questions are enough to begin. Prepare a short proposal, review it, then use the collaboration form to get in touch.</p><div className="union-local-note"><strong>Your idea stays with you.</strong><p>This brief is kept only on this page. Nothing is sent or saved to an account. Copy or download it before leaving.</p></div><a className="text-link" href="https://tally.so/r/2EWxzb">Already have a proposal? Open the form <Arrow/></a></div>
      <form className="union-brief-form" onSubmit={event=>{event.preventDefault();try{setBrief(prepareCollaborationBrief({path,organisation,idea,contribution,outcome}));setError('');setCopyStatus('');requestAnimationFrame(()=>resultHeading.current?.focus());}catch(cause){setError(cause instanceof Error?cause.message:'Review your proposal and try again.');}}}>
        <div className="union-form-caption"><span className="eyebrow">Your collaboration brief</span><span className="union-path-pill">{selected.label}</span></div>
        <label htmlFor="union-organisation">Your name or organisation <span className="union-optional">Optional</span></label><input id="union-organisation" autoComplete="off" value={organisation} maxLength={100} onChange={event=>{setOrganisation(event.target.value);changed();}}/>
        <label htmlFor="union-idea">What is the idea?</label><textarea id="union-idea" rows={4} required minLength={30} maxLength={1000} value={idea} placeholder="A question to explore, a problem to understand, or something to create…" aria-describedby="union-idea-help" onChange={event=>{setIdea(event.target.value);changed();}}/><p id="union-idea-help" className="fine-print">30–1,000 characters. A specific starting point is enough.</p>
        <label htmlFor="union-contribution">What could you contribute?</label><textarea id="union-contribution" rows={3} required minLength={15} maxLength={600} value={contribution} placeholder="Relevant skills, time, an audience, or resources you can share…" onChange={event=>{setContribution(event.target.value);changed();}}/>
        <label htmlFor="union-outcome">What would a useful outcome look like?</label><textarea id="union-outcome" rows={3} required minLength={15} maxLength={600} value={outcome} placeholder="Something another person could read, use, learn from, or build on…" onChange={event=>{setOutcome(event.target.value);changed();}}/>
        <p className="fine-print">Please leave out private datasets, account details and sensitive personal information.</p><p role="alert" className="union-form-error">{error}</p><button className="button union-primary" type="submit">Prepare my brief <Arrow/></button>
        {brief&&<div className="union-brief-result"><h3 ref={resultHeading} tabIndex={-1}>Your brief is ready.</h3><p>Review it below. Nothing has been sent.</p><pre>{brief}</pre><div className="page-actions"><button className="button secondary" type="button" onClick={async()=>{try{await navigator.clipboard.writeText(brief);setCopyStatus('Brief copied. Paste it into the collaboration form.');}catch{setCopyStatus('Copy is unavailable. Select the brief above or download it.');}}}>Copy brief</button><a className="text-link" href={`data:text/plain;charset=utf-8,${encodeURIComponent(brief)}`} download="financemeta-collaboration-brief.txt">Download brief <span aria-hidden="true">↓</span></a></div><p role="status">{copyStatus}</p><a className="button union-primary" href="https://tally.so/r/2EWxzb">Continue to collaboration form <Arrow/></a><p className="fine-print">Copy your brief first. Opening the form does not transfer the draft or submit a proposal.</p></div>}
      </form>
    </section>
  </>;
}

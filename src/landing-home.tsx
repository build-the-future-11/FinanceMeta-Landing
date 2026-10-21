import { useEffect, useRef, useState } from 'react';
import { Arrow, LabExplorer, StatusBadge } from './components';
import { labs, projects, publications, publicationPath } from './content/research';
import { SaveButton } from './reading-list';
import { buildStartSteps, defaultStart, parseSavedStart, startFromSearch, startGoals, startSearch, startStorageKey, type StartState } from './lib/start-path';
import './landing-home.css';

const topicLabels = { everyday: 'Everyday economics', markets: 'Markets & investing', evidence: 'Research & evidence' };
const goalLabels = { learn: 'Understand the basics', research: 'Explore research', contribute: 'Make a contribution' };
const lessonSlugs = { everyday: 'how-interest-rates-move-through-the-economy', markets: 'ipo-from-private-company-to-public-market', evidence: 'reading-an-economic-claim-without-getting-fooled' };

function RateIllustration() {
  const [paused, setPaused] = useState(false);
  return <div className={`finance-particles${paused ? ' is-paused' : ''}`}>
    <svg className="field-illustration" viewBox="0 0 520 360" role="img" aria-labelledby="rate-diagram-title rate-diagram-desc">
      <title id="rate-diagram-title">One decision. Many connections.</title>
      <desc id="rate-diagram-desc">Three luminous layers represent policy, banks, and everyday life. A conceptual illustration of how financial decisions connect, not market data.</desc>
      <defs>
        <pattern id="finance-particle-grid" width="12" height="12" patternUnits="userSpaceOnUse"><circle cx="6" cy="6" r="1.7" fill="currentColor"/><path d="M0 2V6M-2 4H2M10 4H14M12 2V6" stroke="currentColor" strokeWidth=".7" opacity=".55"/></pattern>
        <radialGradient id="finance-particle-halo"><stop stopColor="#72d99b" stopOpacity=".2"/><stop offset="1" stopColor="#72d99b" stopOpacity="0"/></radialGradient>
        <linearGradient id="finance-particle-light" x1="0" y1="0" x2="1" y2="1"><stop stopColor="#8be6a8" stopOpacity=".15"/><stop offset=".5" stopColor="#c6f291"/><stop offset="1" stopColor="#4dbb87" stopOpacity=".3"/></linearGradient>
        <mask id="finance-particle-mask"><rect x="-126" y="-126" width="252" height="252" fill="url(#finance-particle-grid)" style={{ color: 'white' }}/></mask>
      </defs>
      <ellipse cx="260" cy="205" rx="245" ry="155" fill="url(#finance-particle-halo)"/>
      <g className="particle-connections" stroke="#a8e7a0" strokeWidth="1" strokeDasharray="2 7" opacity=".24"><path d="M48 120V270M260 18V168M472 120V270"/></g>
      {[{ y: 255, label: 'Everyday life', tone: 'base' }, { y: 180, label: 'Banks', tone: 'middle' }, { y: 105, label: 'Policy', tone: 'top' }].map(({ y, label, tone }) => <g key={tone} transform={`translate(260 ${y})`}>
        <g className={`particle-layer particle-layer-${tone}`}>
          <g transform="matrix(.83 .39 -.83 .39 0 0)">
            <rect x="-126" y="-126" width="252" height="252" fill="#113929" fillOpacity=".4" stroke="#86dca0" strokeOpacity=".16"/>
            <rect x="-126" y="-126" width="252" height="252" fill="url(#finance-particle-light)" mask="url(#finance-particle-mask)"/>
            <g mask="url(#finance-particle-mask)"><path className="particle-scan" d="M-115-126V126" stroke="#e0ffb5" strokeWidth="25"/></g>
          </g>
          <circle cx="0" cy="0" r="3" fill="#d3ffa7"/>
        </g>
        <text x="205" y="-18" textAnchor="end" fill="#c7dfc8" fontSize="10" letterSpacing="1.1">{label.toUpperCase()}</text>
      </g>)}
    </svg>
    <div className="particle-footer"><span>One decision. Many connections.</span><button type="button" aria-pressed={paused} onClick={() => setPaused(!paused)}>{paused ? 'Resume motion' : 'Pause motion'}</button></div>
  </div>;
}

function StartingPoint() {
  const [state, setState] = useState<StartState>(defaultStart);
  const [ready, setReady] = useState(false);
  const [notice, setNotice] = useState('');
  const [manualLink, setManualLink] = useState('');
  const [offline, setOffline] = useState(false);
  const linkInput = useRef<HTMLInputElement>(null);
  useEffect(() => {
    const restore = () => {
      if (new URLSearchParams(location.search).has('start')) setState(startFromSearch(location.search));
      else {
        try { const saved = parseSavedStart(localStorage.getItem(startStorageKey)); setState(saved ?? defaultStart); if (saved) setNotice('Your saved choices have been restored from this browser.'); }
        catch { setNotice('Browser storage is unavailable. You can still choose a route and copy or download it.'); }
      }
      setManualLink(''); setReady(true);
    };
    restore(); window.addEventListener('popstate', restore);
    const connection = () => setOffline(!navigator.onLine); connection();
    window.addEventListener('offline', connection); window.addEventListener('online', connection);
    return () => { window.removeEventListener('popstate', restore); window.removeEventListener('offline', connection); window.removeEventListener('online', connection); };
  }, []);
  useEffect(() => { if (manualLink) { linkInput.current?.focus(); linkInput.current?.select(); } }, [manualLink]);
  const lesson = publications.find(p => p.slug === lessonSlugs[state.topic]);
  const steps = lesson ? buildStartSteps(state, { title: lesson.title, href: publicationPath(lesson), note: lesson.abstract, kind: `${lesson.readMinutes} min read · Open explainer` }) : [];
  function change(next: StartState) {
    setState(next); setNotice(''); setManualLink('');
    history.pushState(null, '', location.pathname + startSearch(next, location.search) + '#your-route');
  }
  function remember() {
    try { localStorage.setItem(startStorageKey, JSON.stringify({ version: 1, state })); setNotice('Choices saved on this browser. They are not linked to a member account.'); }
    catch { setNotice('Could not save on this browser. Copy the route link or download your route to keep it.'); }
  }
  async function share() {
    const href = location.origin + location.pathname + startSearch(state) + '#your-route';
    try { await navigator.clipboard.writeText(href); setNotice('Route link copied. It contains your choices, not personal information.'); setManualLink(''); }
    catch { setManualLink(href); setNotice('Clipboard is unavailable. Select and copy the route link below.'); }
  }
  function download() {
    const text = ['Finance4All — Your starting route', `${goalLabels[state.goal]} / ${topicLabels[state.topic]}`, 'Self-guided. No account required for the linked reading.', '', ...steps.flatMap((step, i) => [`${i + 1}. ${step.title}`, step.kind, step.note, new URL(step.href, location.origin).href, '']), 'Program listings are not confirmation of admission. General financial education, not personal financial advice.'].join('\n');
    const url = URL.createObjectURL(new Blob([text], { type: 'text/plain;charset=utf-8' }));
    const anchor = document.createElement('a'); anchor.href = url; anchor.download = 'finance4all-my-route.txt'; anchor.click(); setTimeout(() => URL.revokeObjectURL(url), 1000);
    setNotice('Your route file is ready to download. It contains links and next steps.');
  }
  return <section id="your-route" className="route-builder" aria-labelledby="route-title">
    <div className="home-section-heading"><div><p className="home-kicker">01 / A little direction</p><h2 id="route-title">Curiosity is enough.<br/><em>Start where you are.</em></h2></div><p>A short route through our open library.<br/>Choose what interests you. We’ll connect the dots.</p></div>
    <div className="route-layout">
      <div className="route-controls">
        <fieldset disabled={!ready}><legend>What brings you here?</legend><div className="route-goals">{startGoals.map((goal, i) => <label key={goal} className={state.goal === goal ? 'is-selected' : ''}><input type="radio" name="start-goal" checked={state.goal === goal} value={goal} onChange={() => change({ ...state, goal })}/><span className="goal-number">0{i+1}</span><span>{goalLabels[goal]}</span><span aria-hidden="true">↗</span></label>)}</div></fieldset>
        <label className="route-topic">What are you curious about?<select disabled={!ready} value={state.topic} onChange={e => change({ ...state, topic: e.target.value as StartState['topic'] })}>{Object.entries(topicLabels).map(([value,label]) => <option key={value} value={value}>{label}</option>)}</select></label>
        <fieldset className="route-pace" disabled={!ready}><legend>Choose your pace</legend><div>{(['quick','deeper'] as const).map(pace => <label key={pace}><input type="radio" name="start-pace" checked={state.pace === pace} onChange={() => change({ ...state, pace })}/><span>{pace === 'quick' ? 'A quick start' : 'Go a little deeper'}</span></label>)}</div></fieldset>
        <p className="route-privacy">No signup. No personal profile.<br/>Just a useful place to begin.</p>
      </div>
      <div className="route-result" aria-busy={!ready}>
        <div className="route-result-top"><span className="home-kicker">Your field notes</span><span aria-live="polite">{steps.length} steps · {state.pace === 'quick' ? 'Quick start' : 'Go deeper'}</span></div>
        <h3>{state.goal === 'learn' ? 'From “what?” to “why?”' : state.goal === 'research' ? 'Turn a question into a method.' : 'Find where your ideas fit.'}</h3>
        {offline && <p className="route-message" role="status">You’re offline. Your route is still here; reconnect before opening another page.</p>}
        {steps.length ? <ol className="route-steps">{steps.map((step, i) => <li key={step.href}><span className="route-step-number" aria-hidden="true">{i+1}</span><div><p className="home-kicker">{step.kind}</p><a href={step.href}>{step.title}<Arrow/></a><p>{step.note}</p></div></li>)}</ol> : <div className="route-message" role="status"><p>This reading route isn’t available right now.</p><a href="/learn">Browse all learning pathways <Arrow/></a></div>}
        <div className="route-actions"><button type="button" disabled={!ready} onClick={remember}>Remember choices</button><button type="button" disabled={!ready} onClick={() => { void share(); }}>Copy route link</button><button type="button" disabled={!ready || !steps.length} onClick={download}>Download route <span aria-hidden="true">↓</span></button></div>
        <p className="route-feedback" role="status">{notice || 'Saved choices stay on this device. You can change them at any time.'}</p>
        {manualLink && <label className="route-topic">Your route link<input ref={linkInput} value={manualLink} readOnly onFocus={e => e.target.select()}/></label>}
        <noscript><p>Enable JavaScript to customize a route. The reading links above are ready to use.</p></noscript>
      </div>
    </div>
  </section>;
}

export function InstitutionHome() {
  const featured = publications.find(p => p.slug === lessonSlugs.everyday);
  const featuredProjects = projects.filter(p => ['fi-jepa','macrocast','realitycheck'].includes(p.slug));
  return <div className="landing-home">
    <section className="field-hero" aria-labelledby="field-hero-title">
      <div className="field-hero-copy"><p className="home-kicker"><span className="field-signal" aria-hidden="true"/> Knowledge without barriers</p><h1 id="field-hero-title">Money is<br/>everywhere.<br/><em>Understanding it<br/>should be, too.</em></h1><p>Make sense of finance. Ask better questions.<br/>Explore the ideas that shape your everyday life.</p><div className="field-hero-actions"><a href="#your-route" className="field-button">Find my starting point <Arrow/></a><a href="/learn" className="field-link">Explore the library <Arrow/></a></div><div className="hero-caption"><span aria-hidden="true">↳</span><p>Open to the curious.<br/>No finance background required.</p></div></div>
      <aside className="field-feature" aria-label="Featured open reading"><div className="field-feature-top"><span>THE FIELD GUIDE</span><span>01 / Everyday economics</span></div><RateIllustration/><div className="field-feature-copy"><p className="home-kicker">Start with a better question</p><h2>{featured ? <a href={publicationPath(featured)}>When rates change,<br/>what changes for you?</a> : 'Follow the connections.'}</h2><p>A small change at the centre can travel a long way. Trace it through households, businesses and the wider economy.</p>{featured && <div className="field-feature-bottom"><a href={publicationPath(featured)} className="field-link">Read the explainer <Arrow/></a><span>{featured.readMinutes} min read</span></div>}</div></aside>
    </section>
    <div className="field-principles" role="group" aria-label="Our approach"><p><span aria-hidden="true">01</span> Free to read</p><p><span aria-hidden="true">02</span> Questions before conclusions</p><p><span aria-hidden="true">03</span> Evidence you can inspect</p><a href="/research/standards">Our standards <Arrow/></a></div>
    <section className="home-available" aria-labelledby="network-discovery-title">
      <div className="home-section-heading"><div><p className="home-kicker">Across Finance4All & FinanceMeta</p><h2 id="network-discovery-title">Find your people.<br/><em>Find your next question.</em></h2></div><p>From a first workshop to a research contribution. Explore what’s open, what’s being built and what’s coming next.</p></div>
      <div className="available-grid">
        <a href="/programs"><span className="home-kicker">22 program records</span><h3>Learn. Research. Contribute.</h3><p>Finance4 Impact, Labs, IYERN, publishing, chapters and more. See who each program is for and how to take part.</p><span className="field-link">Explore all programs <Arrow/></span></a>
        <a href="/projects"><span className="home-kicker">48 project records</span><h3>Get closer to the work.</h3><p>Explore the full project register, from financial research to learning tools, with current status and next steps.</p><span className="field-link">Browse all projects <Arrow/></span></a>
        <a href="/events"><span className="home-kicker">7 event plans</span><h3>Something to work toward.</h3><p>Workshops, Open Markets, Quant Arena and the Studio Buildathon. Dates await confirmation; launch holds are shown.</p><span className="field-link">Explore event plans <Arrow/></span></a>
      </div>
    </section>
    <section className="home-available" aria-labelledby="available-title">
      <div className="home-section-heading"><div><p className="home-kicker">Ready when you are</p><h2 id="available-title">Something useful.<br/><em>Right now.</em></h2></div><p>Read, practice or explore an assumption. These resources are free to use without an account.</p></div>
      <div className="available-grid">
        <a href="/open/courses/financial-systems"><span className="home-kicker">Read / Four modules</span><h3>Understand financial systems</h3><p>A self-paced introduction to markets, interest rates, payments and economic evidence.</p><span className="field-link">Start the course <Arrow/></span></a>
        <a href="/learn/practice"><span className="home-kicker">Practice / Explained answers</span><h3>Test your reasoning</h3><p>Work through a question, check your answer and see the explanation.</p><span className="field-link">Try a question <Arrow/></span></a>
        <a href="/open/tools"><span className="home-kicker">Explore / Interactive tools</span><h3>Change an assumption</h3><p>Explore growth, loan payments and inflation with clearly stated assumptions.</p><span className="field-link">Open calculators <Arrow/></span></a>
      </div>
    </section>
    <StartingPoint/>
    <section className="home-map" aria-labelledby="home-map-title"><div className="home-section-heading"><div><p className="home-kicker">02 / The bigger picture</p><h2 id="home-map-title">One question.<br/><em>Many ways in.</em></h2></div><p>Follow an idea from a familiar problem to the research behind it. This is a map of our subjects, not a map of claimed impact.</p></div><div className="subject-map"><a href="/learn/economics"><span className="map-label">Start with life</span><h3>Why does<br/>everything cost more?</h3><p>Prices, policy and everyday choices.</p><span>Understand economics <Arrow/></span></a><div className="map-bridge" aria-hidden="true"><i/><span>Follow the question</span><i/></div><a href="/research"><span className="map-label">Follow the evidence</span><h3>How would<br/>we find out?</h3><p>Models, data and fair comparisons.</p><span>Explore the research <Arrow/></span></a><div className="map-bridge" aria-hidden="true"><i/><span>Make it useful</span><i/></div><a href="/open"><span className="map-label">Put it to work</span><h3>What can<br/>we build together?</h3><p>Open guides, tools and contributions.</p><span>Find open resources <Arrow/></span></a></div><a className="field-link map-all" href="/research/map">Explore all {labs.length} research agendas <Arrow/></a></section>
    <section className="home-reading" aria-labelledby="home-reading-title"><div className="home-section-heading"><div><p className="home-kicker">03 / Good questions, explained</p><h2 id="home-reading-title">Less jargon.<br/><em>More understanding.</em></h2></div><a className="field-link" href="/publications/financedebriefed">All explainers <Arrow/></a></div><div className="home-reading-grid">{publications.slice(0,3).map((p,i) => <article key={p.slug}><a className={`reading-cover reading-cover-${i}`} href={publicationPath(p)} aria-label={`Read ${p.title}`}><span>FinanceDebriefed</span><strong aria-hidden="true">{['IPO','%','→'][i]}</strong><span>{p.readMinutes} MIN READ <Arrow/></span></a><div className="reading-card-copy"><p className="home-kicker">Open explainer / Reviewed {p.date}</p><h3><a href={publicationPath(p)}>{p.title}</a></h3><p>{p.abstract}</p><SaveButton href={publicationPath(p)}/></div></article>)}</div></section>
    <section className="home-research" aria-labelledby="home-research-title"><div className="home-section-heading"><div><p className="home-kicker">04 / Inside the research</p><h2 id="home-research-title">Big ideas.<br/><em>Visible limitations.</em></h2></div><p>A repository is a starting point, not proof. Read the question, the methods and what has yet to be established.</p></div><div className="home-research-rows">{featuredProjects.map((p,i) => <article key={p.slug}><span className="research-row-number">0{i+1}</span><div><h3><a href={'/research/projects/'+p.slug}>{p.name}<Arrow/></a></h3><p>{p.question}</p></div><StatusBadge>{p.status}</StatusBadge></article>)}</div><div className="home-research-links"><a className="field-link" href="/research">Browse the research index <Arrow/></a><a className="field-link" href="/projects">View all project records and their status <Arrow/></a></div><details className="home-labs"><summary>Explore the {labs.length} research agendas <span aria-hidden="true">+</span></summary><LabExplorer/></details></section>
    <section className="home-resource" aria-labelledby="home-resource-title"><div><p className="home-kicker">05 / Work you can inspect</p><h2 id="home-resource-title">Make the next question<br/><em>a better one.</em></h2><p>Our open explainers include source links and review dates. Use the research worksheet to record your own question, assumptions and evidence before drawing a conclusion.</p></div><div className="resource-actions"><a href="/resources/research-protocol.md" className="field-button" download="research-protocol.md">Download the research worksheet <span aria-hidden="true">↓</span></a><a href="/open/library" className="field-link">Browse available resources <Arrow/></a><a href="/research/standards" className="field-link">Read our research standards <Arrow/></a></div></section>
    <section className="home-invitation" aria-labelledby="home-invitation-title"><p className="home-kicker">A question is a good beginning</p><h2 id="home-invitation-title">Bring your curiosity.<br/><em>Find your next step.</em></h2><p>Learn something new, explore a research idea,<br/>or help someone else make sense of it.</p><div><a href="#your-route" className="field-button">Build my route <Arrow/></a><a href="/join" className="field-link">Ways to get involved <Arrow/></a></div><small>General financial education. Not personal financial advice.</small></section>
  </div>;
}

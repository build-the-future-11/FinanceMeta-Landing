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
  return <svg className="field-illustration" viewBox="0 0 520 340" role="img" aria-labelledby="rate-diagram-title rate-diagram-desc">
    <title id="rate-diagram-title">One decision. Many connections.</title><desc id="rate-diagram-desc">A conceptual diagram connecting a policy rate to banks, households and businesses. It is not market data.</desc>
    <defs><pattern id="field-dots" width="20" height="20" patternUnits="userSpaceOnUse"><circle cx="1" cy="1" r="1" fill="#36664f" opacity=".22"/></pattern></defs>
    <rect width="520" height="340" fill="url(#field-dots)"/>
    <g fill="none" stroke="#43705b" strokeWidth="1.4"><path d="M110 170H204M292 170H407M248 150V90H407M248 190V250H407"/><path d="m399 83 8 7-8 7m0 66 8 7-8 7m0 66 8 7-8 7"/></g>
    <circle cx="100" cy="170" r="62" fill="#173e2e"/><text x="100" y="164" textAnchor="middle" fill="#eff6df" fontSize="15">POLICY</text><text x="100" y="187" textAnchor="middle" fill="#dcf796" fontFamily="Georgia,serif" fontSize="27">rate</text>
    <rect x="201" y="144" width="94" height="52" rx="26" fill="#f8f7ef" stroke="#43705b"/><text x="248" y="176" textAnchor="middle" fill="#173e2e" fontSize="16">Banks</text>
    <g fill="#173e2e" fontSize="15"><text x="335" y="65">Households</text><text x="335" y="145">Businesses</text><text x="335" y="225">Investors</text></g>
    <g fill="#d0e8b7" stroke="#43705b"><circle cx="426" cy="90" r="18"/><circle cx="426" cy="170" r="18"/><circle cx="426" cy="250" r="18"/></g>
    <text x="32" y="316" fill="#466351" fontSize="11" letterSpacing="1.8">A FIELD GUIDE TO THE FINANCIAL SYSTEM</text>
  </svg>;
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
    <div className="field-principles" aria-label="Our approach"><p><span aria-hidden="true">01</span> Free to read</p><p><span aria-hidden="true">02</span> Questions before conclusions</p><p><span aria-hidden="true">03</span> Evidence you can inspect</p><a href="/research/standards">Our standards <Arrow/></a></div>
    <StartingPoint/>
    <section className="home-map" aria-labelledby="home-map-title"><div className="home-section-heading"><div><p className="home-kicker">02 / The bigger picture</p><h2 id="home-map-title">One question.<br/><em>Many ways in.</em></h2></div><p>Follow an idea from a familiar problem to the research behind it. This is a map of our subjects, not a map of claimed impact.</p></div><div className="subject-map"><a href="/learn/economics"><span className="map-label">Start with life</span><h3>Why does<br/>everything cost more?</h3><p>Prices, policy and everyday choices.</p><span>Understand economics <Arrow/></span></a><div className="map-bridge" aria-hidden="true"><i/><span>Follow the question</span><i/></div><a href="/research"><span className="map-label">Follow the evidence</span><h3>How would<br/>we find out?</h3><p>Models, data and fair comparisons.</p><span>Explore the research <Arrow/></span></a><div className="map-bridge" aria-hidden="true"><i/><span>Make it useful</span><i/></div><a href="/open"><span className="map-label">Put it to work</span><h3>What can<br/>we build together?</h3><p>Open guides, tools and contributions.</p><span>Find open resources <Arrow/></span></a></div><a className="field-link map-all" href="/research/map">Explore all {labs.length} research agendas <Arrow/></a></section>
    <section className="home-reading" aria-labelledby="home-reading-title"><div className="home-section-heading"><div><p className="home-kicker">03 / Good questions, explained</p><h2 id="home-reading-title">Less jargon.<br/><em>More understanding.</em></h2></div><a className="field-link" href="/publications/financedebriefed">All explainers <Arrow/></a></div><div className="home-reading-grid">{publications.slice(0,3).map((p,i) => <article key={p.slug}><a className={`reading-cover reading-cover-${i}`} href={publicationPath(p)} aria-label={`Read ${p.title}`}><span>FinanceDebriefed</span><strong aria-hidden="true">{['IPO','%','→'][i]}</strong><span>{p.readMinutes} MIN READ <Arrow/></span></a><div className="reading-card-copy"><p className="home-kicker">Open explainer / Reviewed {p.date}</p><h3><a href={publicationPath(p)}>{p.title}</a></h3><p>{p.abstract}</p><SaveButton href={publicationPath(p)}/></div></article>)}</div></section>
    <section className="home-research" aria-labelledby="home-research-title"><div className="home-section-heading"><div><p className="home-kicker">04 / Inside the research</p><h2 id="home-research-title">Big ideas.<br/><em>Visible limitations.</em></h2></div><p>A repository is a starting point, not proof. Read the question, the methods and what has yet to be established.</p></div><div className="home-research-rows">{featuredProjects.map((p,i) => <article key={p.slug}><span className="research-row-number">0{i+1}</span><div><h3><a href={'/research/projects/'+p.slug}>{p.name}<Arrow/></a></h3><p>{p.question}</p></div><StatusBadge>{p.status}</StatusBadge></article>)}</div><a className="field-link" href="/research">Browse all project records <Arrow/></a><details className="home-labs"><summary>Explore the {labs.length} research agendas <span aria-hidden="true">+</span></summary><LabExplorer/></details></section>
    <section className="home-journal" aria-labelledby="home-journal-title"><div className="journal-object" aria-hidden="true"><span>FINANCEMETA / ECONOMIC INQUIRY</span><strong>IyERJ<span>Ideas deserve<br/>a closer look.</span></strong><div className="journal-rule"/><small>PROPOSED JOURNAL<br/>ECONOMICS · METHODS · DEBATE</small></div><div><p className="home-kicker">05 / A space for serious thinking</p><h2 id="home-journal-title">Have an argument<br/><em>worth developing?</em></h2><p>Explore the proposed journal’s scope, standards and manuscript expectations. Give your question a structure before you give it an audience.</p><p className="journal-availability">A confirmed submission cycle is not open. Reading the guidelines does not submit a manuscript.</p><div className="journal-links"><a href="/publications/iyerj" className="field-link">Discover the journal <Arrow/></a><a href="/publications/iyerj/submissions" className="field-link">Read submission guidance <Arrow/></a></div></div></section>
    <section className="home-invitation" aria-labelledby="home-invitation-title"><p className="home-kicker">A question is a good beginning</p><h2 id="home-invitation-title">Bring your curiosity.<br/><em>Find your next step.</em></h2><p>Learn something new, explore a research idea,<br/>or help someone else make sense of it.</p><div><a href="#your-route" className="field-button">Build my route <Arrow/></a><a href="/join" className="field-link">Ways to get involved <Arrow/></a></div><small>General financial education. Not personal financial advice.</small></section>
  </div>;
}

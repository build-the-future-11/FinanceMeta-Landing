import { useEffect, useRef, useState } from 'react';
import { Arrow, LinkButton, PageHeader, Section, StatusBadge } from './components';
import catalog from './content/network-catalog.json';
import { BACKUP_LIMIT, TITLE_LIMIT, SECTION_LIMIT, briefTracks, briefSections, briefBackup, briefMarkdown, hasBriefContent, isBriefTrack, newBrief, readBriefBackup, startedSections } from './lib/challenge-brief';
import type { ChallengeBrief, BriefSectionId } from './lib/challenge-brief';
import './challenge-workspace.css';

export function ChallengesDirectory() {
  const competitions = catalog.programs.filter(program => program.family === 'Competitions');
  return <>
    <PageHeader eyebrow="Finance4All / Challenges" title="Put the argument to the test." description="Explore the challenge plans, understand their current availability, and prepare a research brief you can keep working on.">
      <LinkButton href="/challenges/prepare">Prepare a research brief</LinkButton>
    </PageHeader>
    <p className="evidence-note">No competition entries are accepted on this site. Interest forms request updates; each program page explains what still needs to be confirmed.</p>
    <Section title="Explore the challenge plans">
      <div className="card-grid two">
        {competitions.map(program => <article className="text-panel challenge-card" key={program.slug}>
          <StatusBadge>{program.status}</StatusBadge>
          <h3><a href={'/programs/' + program.slug}>{program.title}</a></h3>
          <p>{program.summary}</p>
          <p className="fine-print">{program.readiness}</p>
          <div className="page-actions">
            <a className="text-link" href={'/programs/' + program.slug}>Read the program brief<Arrow /></a>
            {isBriefTrack(program.slug) && <a className="text-link" href={'/challenges/prepare?track=' + program.slug}>Start a practice brief<Arrow /></a>}
          </div>
        </article>)}
      </div>
    </Section>
    <Section title="Economics and writing formats">
      <p>The proposed <a href="/challenges/economics-olympiad">Economics Olympiad</a> and <a href="/challenges/essay-prize">FinanceMeta Essay Prize</a> remain available as planning records. Their submissions are closed while rules and a confirmed cycle are developed.</p>
    </Section>
    <Section title="Get an idea ready for review">
      <p>Choose a question, identify the evidence and write down a fair test. The preparation workspace gives you track-specific prompts, a section checklist and downloadable notes. It works without an account.</p>
      <div className="page-actions"><LinkButton href="/challenges/prepare">Open the workspace</LinkButton><LinkButton href="/research/standards" secondary>Read the research standards</LinkButton></div>
    </Section>
  </>;
}

function downloadFile(contents: string, filename: string, type: string) {
  const url = URL.createObjectURL(new Blob([contents], { type }));
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.append(link);
  link.click();
  link.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

export function ChallengePreparation() {
  const [draft, setDraft] = useState<ChallengeBrief>(() => newBrief());
  const importVersion = useRef(0);
  const [savedSnapshot, setSavedSnapshot] = useState('');
  const [pendingImport, setPendingImport] = useState<ChallengeBrief | null>(null);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [ready, setReady] = useState(false);
  const track = briefTracks.find(item => item.id === draft.track)!;
  const program = catalog.programs.find(item => item.slug === draft.track)!;
  const started = startedSections(draft);
  const dirty = hasBriefContent(draft) && briefBackup(draft) !== savedSnapshot;

  useEffect(() => {
    const selected = new URLSearchParams(window.location.search).get('track');
    if (isBriefTrack(selected)) setDraft(current => ({ ...current, track: selected }));
    setReady(true);
    return () => { importVersion.current += 1; };
  }, []);

  useEffect(() => {
    if (!dirty) return;
    const warn = (event: BeforeUnloadEvent) => { event.preventDefault(); event.returnValue = ''; };
    window.addEventListener('beforeunload', warn);
    return () => window.removeEventListener('beforeunload', warn);
  }, [dirty]);

  function updateSection(id: BriefSectionId, value: string) {
    setDraft(current => ({ ...current, sections: { ...current.sections, [id]: value } }));
    setMessage('');
  }

  function exportBrief(format: 'markdown' | 'json') {
    try {
      const backup = briefBackup(draft);
      downloadFile(format === 'markdown' ? briefMarkdown(draft) : backup, 'finance4all-' + draft.track + '-brief.' + (format === 'markdown' ? 'md' : 'json'), format === 'markdown' ? 'text/markdown;charset=utf-8' : 'application/json;charset=utf-8');
      setSavedSnapshot(backup);
      setError('');
      setMessage(format === 'markdown' ? 'Brief download started. Keep the file for review.' : 'Editable backup download started. Open that file here to continue later.');
    } catch {
      setError('The download could not start. Your draft is still here; try again before leaving.');
    }
  }

  async function importBrief(file: File | undefined) {
    if (!file) return;
    const version = ++importVersion.current;
    setError('');
    setMessage('');
    setPendingImport(null);
    try {
      if (file.size > BACKUP_LIMIT) throw new Error('Choose a brief backup smaller than 256 KB.');
      const text = await file.text();
      // A slower earlier file must not replace the latest selection or its error.
      if (version !== importVersion.current) return;
      setPendingImport(readBriefBackup(text));
    } catch (reason) {
      if (version === importVersion.current) setError(reason instanceof Error ? reason.message : 'The backup could not be opened. Your current draft has not changed.');
    }
  }

  function acceptImport() {
    if (!pendingImport) return;
    setDraft(pendingImport);
    setSavedSnapshot(briefBackup(pendingImport));
    setPendingImport(null);
    setError('');
    setMessage('Backup opened. You can continue editing the brief.');
  }

  return <>
    <PageHeader eyebrow="Challenges / Preparation workspace" title="Build a brief someone can test." description="Turn an idea into a question, a fair comparison and a reproducible plan. Choose a practice track, work through the prompts, and download your draft.">
      <LinkButton href="/challenges" secondary>Explore the challenge plans</LinkButton>
    </PageHeader>
    <p className="evidence-note">This workspace prepares notes; it does not register or submit an entry. Your text stays in this tab. Download it before refreshing or leaving.</p>
    <noscript><p className="evidence-note">Enable JavaScript to edit and download a brief. You can also <a href="/resources/research-protocol.md" download>download the research protocol worksheet</a>.</p></noscript>
    <div className="challenge-workspace">
      <div>
        <section className="challenge-panel" aria-labelledby="choose-brief">
          <h2 id="choose-brief">1. Choose your brief</h2>
          <label htmlFor="brief-track">Practice track</label>
          <select id="brief-track" value={draft.track} disabled={!ready} onChange={event => {
            const selected = event.target.value;
            if (!isBriefTrack(selected)) return;
            setDraft(current => ({ ...current, track: selected }));
            setMessage('Track changed. Your written sections have been kept.');
          }}>{briefTracks.map(item => <option key={item.id} value={item.id}>{item.label}</option>)}</select>
          <p>{track.focus}</p>
          <ul className="challenge-prompts">{track.prompts.map(prompt => <li key={prompt}>{prompt}</li>)}</ul>
          <details><summary>Current program availability</summary><p><StatusBadge>{program.status}</StatusBadge></p><p>{program.readiness}</p><a href={'/programs/' + program.slug}>Read the program record<Arrow /></a></details>
        </section>
        <section className="challenge-panel" aria-labelledby="write-brief">
          <h2 id="write-brief">2. Make the test clear</h2>
          <p>Write only what you can support. You can leave a section unfinished and return to it later.</p>
          <label htmlFor="brief-title">Working title</label>
          <input id="brief-title" type="text" value={draft.title} disabled={!ready} maxLength={TITLE_LIMIT} onChange={event => { setDraft(current => ({ ...current, title: event.target.value })); setMessage(''); }} />
          <p className="fine-print">Up to {TITLE_LIMIT} characters.</p>
          {briefSections.map(section => <div className="challenge-field" key={section.id}>
            <label htmlFor={'brief-' + section.id}>{section.title}</label>
            <p className="fine-print" id={'hint-' + section.id}>{section.prompt}</p>
            <textarea id={'brief-' + section.id} aria-describedby={'hint-' + section.id} value={draft.sections[section.id]} disabled={!ready} rows={5} maxLength={SECTION_LIMIT} onChange={event => updateSection(section.id, event.target.value)} />
            <span className="fine-print challenge-character-count">{draft.sections[section.id].length.toLocaleString('en')} / 4,000 characters</span>
          </div>)}
        </section>
      </div>
      <aside className="challenge-sidebar" aria-labelledby="draft-progress">
        <section className="challenge-panel">
          <h2 id="draft-progress">Your draft</h2>
          <p><strong>{started.length} of {briefSections.length}</strong> sections started.</p>
          <progress value={started.length} max={briefSections.length} aria-label="Sections with written text" />
          <p className="fine-print">This checks for text, not research quality. Use the checklist to find gaps.</p>
          <ul className="challenge-checklist">{briefSections.map(section => <li key={section.id}>
            <a href={'#brief-' + section.id}>{section.title}</a><span>{started.includes(section.id) ? 'Started' : 'Not started'}</span>
          </li>)}</ul>
          <div className="challenge-downloads">
            <button type="button" className="button" disabled={!ready} onClick={() => exportBrief('markdown')}>Download brief</button>
            <button type="button" className="button secondary" disabled={!ready} onClick={() => exportBrief('json')}>Download editable backup</button>
          </div>
          <p className="fine-print">The brief is a Markdown text file. The JSON backup can be reopened here. Neither download sends your work to Finance4All.</p>
          <label htmlFor="brief-backup">Open an editable backup</label>
          <input id="brief-backup" type="file" accept=".json,application/json" disabled={!ready} onChange={event => { const file = event.target.files?.[0]; event.target.value = ''; void importBrief(file); }} />
          {pendingImport && <div className="challenge-import" role="region" aria-label="Confirm backup replacement">
            <p>Open “{pendingImport.title.trim() || 'Untitled research brief'}”? This replaces the text in this tab. Download your current draft first if you want to keep it.</p>
            <div className="page-actions"><button type="button" className="button secondary" onClick={acceptImport}>Replace current draft</button><button type="button" className="text-button" onClick={() => { setPendingImport(null); setMessage('Import cancelled. Your draft is unchanged.'); }}>Cancel import</button></div>
          </div>}
          <p role="status" aria-live="polite">{message}</p>
          <p role="alert" className="challenge-error">{error}</p>
        </section>
        <section className="challenge-panel">
          <h2>Before you share it</h2>
          <p>Check source links and permissions, challenge your assumptions, and keep any negative findings. Agree the scope and contribution credit before bringing someone else into the work.</p>
          <a className="text-link" href="/research/standards">Research standards<Arrow /></a>
        </section>
      </aside>
    </div>
  </>;
}

import { useState } from 'react';
import { SaveButton, useReadingList, readingCatalog } from './reading-list';

export function ReadingListPage() {
  const { entries, ready, update } = useReadingList();
  const [filter, setFilter] = useState('All');
  const complete = entries.filter(entry => entry.completed).length;
  const visible = entries.filter(entry => filter === 'All' || (filter === 'Read' ? entry.completed : !entry.completed));
  function download() {
    const text = '# My FinanceMeta reading list\n\n' + entries.map(entry => {
      const item = readingCatalog.find(item => item.href === entry.href)!;
      return `- [${entry.completed ? 'x' : ' '}] [${item.title}](${window.location.origin}${entry.href}) — ${item.type}, ${item.detail}`;
    }).join('\n');
    const url = URL.createObjectURL(new Blob([text], { type: 'text/markdown' }));
    const a = document.createElement('a'); a.href = url; a.download = 'financemeta-reading-list.md'; a.click();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  }
  return <div className="reading-workspace"><header className="page-header"><p className="eyebrow">Your personal library</p><h1>Keep a good question close.</h1><p className="page-deck">A place for the research and ideas you want to return to. Saved on this browser, without an account.</p></header>
    <div className="reading-toolbar"><div><strong>{entries.length} saved</strong><span>{complete} read · {entries.length - complete} to explore</span></div><button type="button" className="button secondary" disabled={!entries.length} onClick={download}>Export reading list ↗</button></div>
    <div className="tabs" role="group" aria-label="Filter reading list">{['All', 'Unread', 'Read'].map(value => <button type="button" key={value} aria-pressed={filter === value} onClick={() => setFilter(value)}>{value}</button>)}</div>
    {!ready ? <p role="status">Loading your reading list…</p> : !entries.length ? <section className="reading-empty"><span aria-hidden="true">＋</span><h2>Your next idea starts here.</h2><p>Save project records and explainers using “Save for later”. They’ll be waiting here when you return.</p><div className="hero-actions"><a href="/research" className="button">Explore research ↗</a><a href="/publications" className="button secondary">Browse explainers ↗</a></div></section> : !visible.length ? <div className="reading-empty"><h2>{filter === 'Read' ? 'No finished reads yet.' : 'You’re all caught up.'}</h2><p>Switch to All to see your saved collection.</p></div> : <div className="saved-records">{visible.map(entry => {
      const item = readingCatalog.find(item => item.href === entry.href)!;
      return <article key={entry.href}><div><p className="eyebrow">{item.type} / {item.detail}</p><h2><a href={entry.href}>{item.title} ↗</a></h2><p>{item.description}</p></div><div className="saved-record-actions"><label><input type="checkbox" checked={entry.completed} onChange={() => update(entries.map(current => current.href === entry.href ? { ...current, completed: !current.completed } : current))} /> Mark as read<span className="sr-only">: {item.title}</span></label><SaveButton href={entry.href} /></div></article>;
    })}</div>}
    <p className="fine-print reading-privacy">Your list does not sync between devices. Clearing browser data removes it; export a copy to keep it.</p>
  </div>;
}

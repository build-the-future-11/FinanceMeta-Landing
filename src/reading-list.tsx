import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import { projects, publications, publicationPath } from './content/research';
import { parseReadingList, readingListKey, type SavedEntry } from './lib/reading-list';

export const readingCatalog = [
  ...projects.map(p => ({ href: `/research/projects/${p.slug}`, title: p.name, description: p.question, type: 'Research record', detail: p.status })),
  ...publications.map(p => ({ href: publicationPath(p), title: p.title, description: p.abstract, type: 'Explainer', detail: `${p.readMinutes} min read` })),
];
const allowed = new Set(readingCatalog.map(item => item.href));
type ReadingState = { entries: SavedEntry[]; ready: boolean; message: string; update: (entries: SavedEntry[]) => void };
const ReadingContext = createContext<ReadingState>({ entries: [], ready: false, message: '', update: () => {} });

export function ReadingProvider({ children }: { children: ReactNode }) {
  const [entries, setEntries] = useState<SavedEntry[]>([]);
  const [ready, setReady] = useState(false);
  const [message, setMessage] = useState('');
  useEffect(() => {
    const restore = () => {
      try { setEntries(parseReadingList(localStorage.getItem(readingListKey), allowed)); }
      catch { setMessage('Browser storage is unavailable. Changes will last only while this page is open.'); }
      setReady(true);
    };
    restore();
    const sync = (event: StorageEvent) => { if (event.key === readingListKey || event.key === null) restore(); };
    window.addEventListener('storage', sync);
    return () => window.removeEventListener('storage', sync);
  }, []);
  useEffect(() => {
    if (message !== 'Reading list updated on this browser.') return;
    const timer = setTimeout(() => setMessage(''), 5000);
    return () => clearTimeout(timer);
  }, [message]);
  function update(next: SavedEntry[]) {
    setEntries(next);
    try { localStorage.setItem(readingListKey, JSON.stringify(next)); setMessage('Reading list updated on this browser.'); }
    catch { setMessage('Could not save to this browser. Changes will last only while this page is open.'); }
  }
  return <ReadingContext.Provider value={{ entries, ready, message, update }}>{children}</ReadingContext.Provider>;
}

export const useReadingList = () => useContext(ReadingContext);

export function SaveButton({ href }: { href: string }) {
  const { entries, ready, update } = useContext(ReadingContext);
  const saved = entries.some(entry => entry.href === href);
  const title = readingCatalog.find(item => item.href === href)?.title;
  return <button type="button" className="save-button" disabled={!ready} aria-pressed={saved} aria-label={`${saved ? 'Remove' : 'Save'} ${title} ${saved ? 'from' : 'to'} reading list`} onClick={() => update(saved ? entries.filter(entry => entry.href !== href) : [...entries, { href, completed: false }])}><span aria-hidden="true">{saved ? '✓' : '+'}</span> {saved ? 'Saved' : 'Save for later'}</button>;
}

export function ReadingListLink() {
  const { entries } = useContext(ReadingContext);
  return <a href="/reading-list" className="reading-list-link" aria-label={`Reading list, ${entries.length} saved items`}><svg width="18" height="20" viewBox="0 0 18 20" fill="none" aria-hidden="true"><path d="M4 2h10v16l-5-3-5 3V2Z" stroke="currentColor" strokeWidth="1.5" /></svg><span className="saved-count">{entries.length}</span></a>;
}

export function ReadingFeedback() {
  const { message } = useContext(ReadingContext);
  return <p className="reading-feedback" role="status">{message}</p>;
}

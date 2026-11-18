export type SavedEntry = { href: string; completed: boolean };
export const readingListKey = 'financemeta-reading-list-v1';

export function parseReadingList(raw: string | null, allowed: Set<string>): SavedEntry[] {
  try {
    const parsed: unknown = JSON.parse(raw || '[]');
    if (!Array.isArray(parsed)) return [];
    const seen = new Set<string>();
    return parsed.filter((entry): entry is SavedEntry => {
      if (!entry || typeof entry !== 'object' || typeof entry.href !== 'string' ||
        !allowed.has(entry.href) || typeof entry.completed !== 'boolean' || seen.has(entry.href)) return false;
      seen.add(entry.href);
      return true;
    }).map(({ href, completed }) => ({ href, completed }));
  } catch { return []; }
}

type ReadingChange = { href: string; kind: 'add' | 'remove' | 'complete'; completed: boolean };
type ReadingStorage = Pick<Storage, 'getItem' | 'setItem'>;

function readingChanges(before: SavedEntry[], after: SavedEntry[]): ReadingChange[] {
  const previous = new Map(before.map(entry => [entry.href, entry]));
  const next = new Map(after.map(entry => [entry.href, entry]));
  const changes: ReadingChange[] = [];
  for (const entry of before) {
    const replacement = next.get(entry.href);
    if (!replacement) changes.push({ ...entry, kind: 'remove' });
    else if (replacement.completed !== entry.completed) changes.push({ ...replacement, kind: 'complete' });
  }
  for (const entry of after) {
    if (!previous.has(entry.href)) changes.push({ ...entry, kind: 'add' });
  }
  return changes;
}

function applyReadingChanges(entries: SavedEntry[], changes: ReadingChange[]): SavedEntry[] {
  const merged = new Map(entries.map(entry => [entry.href, entry]));
  for (const change of changes) {
    if (change.kind === 'remove') merged.delete(change.href);
    // A stale completion edit must not resurrect an entry removed in another tab.
    else if ((change.kind === 'add' && !merged.has(change.href)) ||
      (change.kind === 'complete' && merged.has(change.href))) {
      merged.set(change.href, { href: change.href, completed: change.completed });
    }
  }
  return [...merged.values()].map(entry => ({ ...entry }));
}

/** Retains local intent while reconciling each edit with the latest browser data.
 * localStorage has no atomic read/modify/write transaction: truly simultaneous
 * writers can still race. This prevents stale UI snapshots overwriting unrelated
 * changes that have already reached storage; it is not a cross-tab lock.
 */
export function createReadingListStore(allowed: Set<string>, getStorage: () => ReadingStorage) {
  let entries: SavedEntry[] = [];
  let pending: ReadingChange[] = [];
  const snapshot = (storageAvailable: boolean) => ({ entries, pending: pending.length > 0, storageAvailable });
  const sanitize = (value: SavedEntry[]) => parseReadingList(JSON.stringify(value), allowed);

  function restore() {
    try {
      entries = applyReadingChanges(parseReadingList(getStorage().getItem(readingListKey), allowed), pending);
      return snapshot(true);
    } catch {
      // A denied storage read must not discard the user's current in-memory list.
      return snapshot(false);
    }
  }

  function update(before: SavedEntry[], next: SavedEntry[]) {
    // Compare the view that produced the action, not a later render or full snapshot.
    const changes = readingChanges(sanitize(before), sanitize(next));
    pending.push(...changes);
    let storage: ReadingStorage;
    try {
      storage = getStorage();
      entries = applyReadingChanges(parseReadingList(storage.getItem(readingListKey), allowed), pending);
    } catch {
      entries = applyReadingChanges(entries, changes);
      return snapshot(false);
    }
    try {
      storage.setItem(readingListKey, JSON.stringify(entries));
      pending = [];
      return snapshot(true);
    } catch {
      // Keep pending edits across storage events and retry them on the next update.
      return snapshot(false);
    }
  }

  return { restore, update };
}

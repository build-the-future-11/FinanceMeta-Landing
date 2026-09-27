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

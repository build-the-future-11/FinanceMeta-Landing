export const applicationForms = {
  join: '5B7blP', journal: 'b5BBko', forum: 'RGXXLJ',
  chapter: 'XxaB1j', partnership: '2EWxzb',
} as const;
export type ApplicationRoute = keyof typeof applicationForms;
export const attributionKeys = ['utm_source', 'utm_medium', 'utm_campaign'] as const;
const safeTag = /^[a-zA-Z0-9_-]{1,80}$/;
const roles = ['Researcher', 'Research Fellow', 'Engineer', 'Writer', 'Chapter Lead', 'Partner', 'Speaker / Mentor'];

// Only public routing metadata travels to Tally. Never forward arbitrary query strings.
export function applicationUrl(route: ApplicationRoute, search = '', context: Record<string, string> = {}) {
  const input = new URLSearchParams(search);
  const url = new URL(`https://tally.so/r/${applicationForms[route]}`);
  url.searchParams.set('fm_version', 'conversion-v1');
  url.searchParams.set('fm_route', route);
  for (const key of attributionKeys) {
    const value = input.get(key);
    if (value && safeTag.test(value)) url.searchParams.set(key, value);
  }
  if (!url.searchParams.has('utm_source')) url.searchParams.set('utm_source', 'financemeta');
  if (!url.searchParams.has('utm_medium')) url.searchParams.set('utm_medium', 'website');
  for (const key of ['project', 'lab', 'call', 'surface']) {
    const value = context[key] ?? input.get(key);
    if (value && safeTag.test(value)) url.searchParams.set(`fm_${key}`, value);
  }
  const role = context.role || input.get('role');
  if (role && roles.includes(role)) url.searchParams.set('fm_role', role);
  if (input.get('fm_qa') === '1') url.searchParams.set('fm_qa', '1');
  return url.href;
}

export function applicationDestination(href: string) {
  try {
    const url = new URL(href);
    if (url.origin !== 'https://tally.so' || url.username || url.password) return null;
    const id = url.pathname.match(/^\/r\/([a-zA-Z0-9]+)$/)?.[1];
    if (!id || !Object.values(applicationForms).some(value => value === id)) return null;
    return `tally.so/r/${id}`;
  } catch { return null; }
}

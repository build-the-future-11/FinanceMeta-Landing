export type NavigationGroup = {
  label: string;
  href: string;
  links: readonly (readonly [string, string])[];
};

export const navigationGroups: readonly NavigationGroup[] = [
  { label: 'Learn', href: '/learn', links: [
    ['Learning pathways', '/learn'], ['Explainers', '/publications/financedebriefed'],
    ['Practice', '/learn/practice'], ['Glossary', '/learn/glossary'],
    ['Calculators', '/open/tools'], ['Open resources', '/open'], ['Market sources', '/markets'],
  ] },
  { label: 'Research', href: '/research', links: [
    ['Research index', '/research'], ['Labs', '/research/labs'], ['All projects', '/projects'],
    ['Standards', '/research/standards'], ['Publications', '/publications'], ['Journal', '/publications/iyerj'],
  ] },
  { label: 'Get involved', href: '/join', links: [
    ['Express interest', '/join'], ['Programs', '/programs'], ['Submission options', '/apply'],
    ['Community', '/network'], ['Events', '/events'], ['Podcast', '/podcast'],
  ] },
  { label: 'About', href: '/about', links: [
    ['Our purpose', '/about'], ['People', '/about/team'], ['Contact', '/about/contact'],
    ['Union Project', '/union'], ['Privacy', '/privacy'], ['Participation', '/participation'],
  ] },
];

const within = (path: string, prefix: string) => path === prefix || path.startsWith(prefix + '/');

export function navigationForPath(path: string): NavigationGroup | undefined {
  const normalized = path.replace(/\/+$/, '') || '/';
  // Specific routes take precedence over their broader research/publication parents.
  const categories = [
    ['/learn', '/open', '/markets', '/publications/financedebriefed', '/reading-list', '/finance-for-all'],
    ['/research', '/projects', '/labs', '/publications', '/studio'],
    ['/join', '/apply', '/programs', '/network', '/events', '/podcast', '/media', '/challenges', '/ventures'],
    ['/about', '/union', '/privacy', '/participation', '/signin'],
  ];
  const index = categories.findIndex(prefixes => prefixes.some(prefix => within(normalized, prefix)));
  return index < 0 ? undefined : navigationGroups[index];
}

export function currentSectionLink(path: string, group: NavigationGroup): string | undefined {
  return [...group.links].sort((a, b) => b[1].length - a[1].length)
    .find(([, href]) => within(path.replace(/\/+$/, '') || '/', href))?.[1];
}

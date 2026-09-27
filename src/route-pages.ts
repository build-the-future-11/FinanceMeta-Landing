// Load interactive tool code only on the route that uses it, before hydration.
export async function loadRoutePage(rawPath: string) {
  const path = rawPath.replace(/\/+$/, '');
  if (path === '/union') return (await import('./union-page')).UnionPage;
  if (path === '/join') return (await import('./join-page')).Join;
  if (path === '/reading-list') return (await import('./reading-list-page')).ReadingListPage;
  if (path === '/learn/glossary' || path === '/learn/practice') {
    const pages = await import('./learning-practice');
    return path === '/learn/glossary' ? pages.Glossary : pages.LearningPractice;
  }
  if (path === '/open/tools' || path === '/programs/compare') {
    const pages = await import('./feature-pages');
    return path === '/open/tools' ? pages.FinanceTools : pages.ProgramComparison;
  }
  return undefined;
}

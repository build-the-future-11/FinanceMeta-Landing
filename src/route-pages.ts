// Load interactive tool code only on the route that uses it, before hydration.
export async function loadRoutePage(rawPath: string) {
  const path = rawPath.replace(/\/+$/, '');
  if (path === '') return (await import('./landing-home')).InstitutionHome;
  if (path === '/union') return (await import('./union-page')).UnionPage;
  if (path === '/open/courses' || path === '/open/courses/financial-systems') {
    const pages = await import('./course-pages');
    return path === '/open/courses' ? pages.Courses : pages.Course;
  }
  if (path === '/programs' || (path.startsWith('/programs/') && path !== '/programs/compare') || path === '/events' || path.startsWith('/events/')) {
    const page = (await import('./network-pages')).networkPageFor(path);
    if (page) return page;
  }
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
  if (path === '/projects' || /^\/projects\/f4a-\d{2}$/.test(path)) {
    const pages = await import('./portfolio-pages');
    const page = pages.portfolioPageFor(path);
    if (page) return page;
  }
  return (await import('./route-content')).Page;
}

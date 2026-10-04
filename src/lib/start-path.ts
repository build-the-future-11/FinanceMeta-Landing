export const startGoals = ['learn', 'research', 'contribute'] as const;
export const startTopics = ['everyday', 'markets', 'evidence'] as const;
export type StartState = { goal: typeof startGoals[number]; topic: typeof startTopics[number]; pace: 'quick' | 'deeper' };
export const defaultStart: StartState = { goal: 'learn', topic: 'everyday', pace: 'quick' };
export const startStorageKey = 'finance4all-start-v1';
export function parseStart(value: unknown): StartState {
  const input = value && typeof value === 'object' ? value as Record<string, unknown> : {};
  return {
    goal: startGoals.includes(input.goal as StartState['goal']) ? input.goal as StartState['goal'] : 'learn',
    topic: startTopics.includes(input.topic as StartState['topic']) ? input.topic as StartState['topic'] : 'everyday',
    pace: input.pace === 'deeper' ? 'deeper' : 'quick',
  };
}
export function startFromSearch(search: string): StartState {
  const p = new URLSearchParams(search);
  return parseStart({ goal: p.get('start'), topic: p.get('topic'), pace: p.get('pace') });
}
export function startSearch(state: StartState, search = ''): string {
  const p = new URLSearchParams(search); const clean = parseStart(state);
  p.set('start', clean.goal); p.set('topic', clean.topic); p.set('pace', clean.pace);
  return '?' + p.toString();
}
export function parseSavedStart(raw: string | null): StartState | null {
  if (!raw) return null;
  try { const record = JSON.parse(raw); if (record?.version !== 1 || !startGoals.includes(record?.state?.goal) || !startTopics.includes(record?.state?.topic) || !['quick','deeper'].includes(record?.state?.pace)) return null; return parseStart(record.state); }
  catch { return null; }
}
export type RouteStep = { title: string; href: string; note: string; kind: string };
export function buildStartSteps(state: StartState, lesson: RouteStep): RouteStep[] {
  const clean = parseStart(state);
  const steps: RouteStep[] = [lesson];
  if (clean.goal === 'research') {
    steps.push({ title: 'Learn how we evaluate a claim', href: '/research/standards', note: 'Baselines, uncertainty and the limits of a result.', kind: 'Research standards' });
    if (clean.pace === 'deeper') steps.push({ title: 'Find a research question', href: '/research', note: 'Inspect the status and evidence behind each project.', kind: 'Project records' });
  } else if (clean.goal === 'contribute') {
    steps.push({ title: 'Find a way to contribute', href: '/apply', note: 'Read the available paths before expressing interest.', kind: 'Participation guide' });
    if (clean.pace === 'deeper') steps.push({ title: 'Compare the proposed programs', href: '/programs/compare', note: 'Curricula and expectations. Cohort admission is not open.', kind: 'Proposed programs' });
  } else {
    steps.push({ title: 'Try it for yourself', href: '/learn/practice', note: 'Reason through a question, then read the explanation.', kind: 'Practice' });
    if (clean.pace === 'deeper') steps.push({ title: 'Follow a reading pathway', href: clean.topic === 'markets' ? '/learn/markets' : clean.topic === 'evidence' ? '/learn/quantitative-finance' : '/learn/economics', note: 'Connect this idea to the next one at your own pace.', kind: 'Self-guided pathway' });
  }
  return steps;
}

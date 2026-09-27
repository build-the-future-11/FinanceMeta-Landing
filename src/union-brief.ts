export const collaborationPaths = [
  { id: 'research', label: 'Research', title: 'Investigate a shared question.', description: 'Bring a question, a method or a dataset. Define an inquiry that others can examine and build on.', contribution: 'A research question, relevant expertise, or data you have permission to use.', outcome: 'A reproducible analysis, a documented method, or a carefully bounded research note.' },
  { id: 'education', label: 'Education', title: 'Make a difficult idea accessible.', description: 'Turn financial concepts into a learning experience with a clear audience and a practical purpose.', contribution: 'An audience, subject expertise, a teaching approach, or an accessible venue.', outcome: 'A lesson, workshop plan, or learning resource with a way to check understanding.' },
  { id: 'community', label: 'Community', title: 'Bring people around useful work.', description: 'Start with a shared interest, then give the group a concrete activity and clear responsibilities.', contribution: 'A local community, an organising team, or a specific challenge to work through.', outcome: 'A scoped discussion, a community resource, or a plan for a shared project.' },
] as const;

export type CollaborationPath = typeof collaborationPaths[number]['id'];
export type CollaborationBrief = { path: CollaborationPath; organisation: string; idea: string; contribution: string; outcome: string };

export function prepareCollaborationBrief(input: CollaborationBrief): string {
  const selected = collaborationPaths.find(item => item.id === input.path);
  if (!selected) throw new Error('Choose a collaboration area.');
  const organisation = input.organisation.trim();
  const idea = input.idea.trim();
  const contribution = input.contribution.trim();
  const outcome = input.outcome.trim();
  if (organisation.length > 100) throw new Error('Keep the name to 100 characters.');
  if (idea.length < 30 || idea.length > 1000) throw new Error('Describe your idea in 30–1,000 characters.');
  if (contribution.length < 15 || contribution.length > 600) throw new Error('Describe your contribution in 15–600 characters.');
  if (outcome.length < 15 || outcome.length > 600) throw new Error('Describe the outcome in 15–600 characters.');
  return ['FINANCEMETA / UNION PROJECT', 'Collaboration proposal — draft', '', `Area: ${selected.label}`, ...(organisation ? [`From: ${organisation}`] : []), '', 'THE IDEA', idea, '', 'WHAT I CAN CONTRIBUTE', contribution, '', 'A USEFUL OUTCOME', outcome, '', 'Scope, responsibilities, timing and publication permissions to be agreed.'].join('\n');
}

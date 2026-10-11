import snapshot from './finance4all-portfolio.json';

export type PortfolioProject = {
  id: string;
  project: string;
  wave: string;
  portfolio_state: string;
  next_action: string;
  activation_gate: string;
  owner: string;
  reviewer: string;
  decision: string;
  evidence_level: string;
  gate_review: string;
};

export const portfolioMetadata = {
  id: snapshot.portfolio_id,
  planningWindow: snapshot.planning_window,
  lastReconciled: snapshot.last_reconciled,
  statusBoundary: snapshot.status_boundary,
  controls: snapshot.controls,
};

export const portfolioProjects = snapshot.projects as PortfolioProject[];
export const portfolioSlug = (project: PortfolioProject) => project.id.toLowerCase();
export const portfolioStateLabel = (value: string) => value.replaceAll('_', ' ').toLowerCase();


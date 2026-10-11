import { Arrow, CTA, Directory, Section, StatusBadge } from './components';
import { portfolioMetadata, portfolioProjects, portfolioSlug, portfolioStateLabel } from './content/portfolio';
import type { PortfolioProject } from './content/portfolio';
import type { DirectoryItem } from './lib/directory';
import type { ComponentType } from 'react';

const registryUrl = 'https://github.com/build-the-future-11/FinanceMeta-Global/blob/main/registry/finance4all_4month_projects.json';

export const portfolioItems: DirectoryItem[] = portfolioProjects.map(project => ({
  slug: portfolioSlug(project),
  title: project.project,
  description: project.next_action,
  href: `/projects/${portfolioSlug(project)}`,
  type: project.wave,
  status: portfolioStateLabel(project.portfolio_state),
  topics: [project.decision, project.evidence_level],
  date: project.gate_review,
  searchText: `${project.id} ${project.activation_gate} ${project.owner} ${project.reviewer}`,
}));

function PortfolioCard({ project }: { project: PortfolioProject }) {
  const href = `/projects/${portfolioSlug(project)}`;
  return <article className="portfolio-record-row">
    <div className="portfolio-record-id"><strong>{project.id}</strong><span>{project.wave}</span></div>
    <div className="portfolio-record-copy">
      <h3><a href={href}>{project.project}</a></h3>
      <p>{project.next_action}</p>
    </div>
    <div className="portfolio-record-state">
      <StatusBadge>{portfolioStateLabel(project.portfolio_state)}</StatusBadge>
      <span>{project.evidence_level.toLowerCase()}</span>
    </div>
    <a className="portfolio-record-open" href={href} aria-label={`Open ${project.id}: ${project.project}`}><span>View record</span><Arrow /></a>
  </article>;
}

export function PortfolioDirectory() {
  const counts = new Map<string, number>();
  for (const project of portfolioProjects) counts.set(project.portfolio_state, (counts.get(project.portfolio_state) || 0) + 1);
  return <>
    <header className="portfolio-masthead">
      <div className="portfolio-introduction">
        <p className="eyebrow">FinanceMeta / Public project register</p>
        <h1>Projects, with the record left intact.</h1>
        <p className="portfolio-deck">A public index of 48 proposed, gated, and locally prototyped initiatives. Each record states what exists, what comes next, and what must be true before activation.</p>
        <nav className="portfolio-reference-links" aria-label="Portfolio references">
          <a href="/research/projects">Research index <Arrow /></a>
          <a href={registryUrl}>Source registry <Arrow /></a>
        </nav>
      </div>
      <aside className="portfolio-register-note" aria-label="Register details">
        <p>Register / {portfolioMetadata.id}</p>
        <dl>
          <div><dt>Records</dt><dd>{portfolioProjects.length}</dd></div>
          <div><dt>Planning window</dt><dd><time dateTime={portfolioMetadata.planningWindow.start}>{portfolioMetadata.planningWindow.start}</time> — <time dateTime={portfolioMetadata.planningWindow.end}>{portfolioMetadata.planningWindow.end}</time></dd></div>
          <div><dt>Last reconciled</dt><dd><time dateTime={portfolioMetadata.lastReconciled}>{portfolioMetadata.lastReconciled}</time></dd></div>
        </dl>
      </aside>
    </header>
    <section className="portfolio-status-ledger" aria-labelledby="portfolio-status-title">
      <div><p className="eyebrow">Current distribution</p><h2 id="portfolio-status-title">Portfolio states</h2></div>
      <dl>
        {[...counts].map(([state, count]) => <div key={state}><dt>{portfolioStateLabel(state)}</dt><dd>{count}</dd></div>)}
      </dl>
    </section>
    <aside className="portfolio-boundary" aria-label="Evidence boundary"><span>Evidence boundary</span><p>{portfolioMetadata.statusBoundary}</p></aside>
    <section className="portfolio-index" aria-labelledby="portfolio-index-title">
      <div className="portfolio-index-heading"><div><p className="eyebrow">Canonical index</p><h2 id="portfolio-index-title">All project records</h2></div><p>Search by project, action, gate, owner, or review state.</p></div>
      <div className="portfolio-directory">
        <Directory items={portfolioItems} filters={['type', 'status', 'topics']} label="Search all FinanceMeta projects">
          {item => <PortfolioCard project={portfolioProjects.find(project => portfolioSlug(project) === item.slug)!} />}
        </Directory>
      </div>
    </section>
  </>;
}

export function PortfolioProjectPage({ project }: { project: PortfolioProject }) {
  return <>
    <header className="portfolio-record-header">
      <div>
        <a className="portfolio-back-link" href="/projects"><span aria-hidden="true">←</span> All project records</a>
        <p className="eyebrow">FinanceMeta / {project.id} / {project.wave}</p>
        <h1>{project.project}</h1>
        <p className="portfolio-record-deck">{project.next_action}</p>
      </div>
      <dl className="portfolio-record-summary">
        <div><dt>State</dt><dd>{portfolioStateLabel(project.portfolio_state)}</dd></div>
        <div><dt>Evidence</dt><dd>{project.evidence_level.toLowerCase()}</dd></div>
        <div><dt>Decision</dt><dd>{project.decision.toLowerCase().replaceAll('_', ' ')}</dd></div>
        <div><dt>Gate review</dt><dd><time dateTime={project.gate_review}>{project.gate_review}</time></dd></div>
      </dl>
    </header>
    <div className="detail-layout portfolio-detail">
      <div className="detail-main">
        <Section eyebrow="01 / Decision" title="Current control state">
          <div className="portfolio-decision"><StatusBadge>{project.decision.replaceAll('_', ' ')}</StatusBadge><p>This is a planning and execution-control record. It is not a claim that the project has launched, produced results, secured a partner, or passed independent review.</p></div>
        </Section>
        <Section eyebrow="02 / Work" title="Next action"><p className="lead-paragraph">{project.next_action}</p></Section>
        <Section eyebrow="03 / Gate" title="Activation conditions"><p className="portfolio-gate-copy">{project.activation_gate}</p><p className="fine-print">Every listed condition must be resolved through the appropriate evidence and review process before activation.</p></Section>
        <Section eyebrow="04 / Controls" title="Portfolio-wide requirements">
          <ul className="question-list">
            <li>Named owner and reviewer are required for activation.</li>
            <li>Result-bearing runs require a frozen protocol and integrity gate.</li>
            <li>Human-participant work requires applicable approval and consent.</li>
            <li>Financial work is limited to research, general education, descriptive comparison, and synthetic or sandbox demonstrations.</li>
          </ul>
        </Section>
      </div>
      <aside className="detail-aside">
        <p className="eyebrow">Canonical record</p>
        <dl>
          <dt>Project ID</dt><dd>{project.id}</dd>
          <dt>Wave</dt><dd>{project.wave}</dd>
          <dt>Portfolio state</dt><dd>{portfolioStateLabel(project.portfolio_state)}</dd>
          <dt>Decision</dt><dd>{project.decision}</dd>
          <dt>Evidence level</dt><dd>{project.evidence_level}</dd>
          <dt>Owner</dt><dd>{project.owner}</dd>
          <dt>Reviewer</dt><dd>{project.reviewer}</dd>
          <dt>Gate review</dt><dd><time dateTime={project.gate_review}>{project.gate_review}</time></dd>
          <dt>Registry reconciliation</dt><dd><time dateTime={portfolioMetadata.lastReconciled}>{portfolioMetadata.lastReconciled}</time></dd>
        </dl>
        <a className="text-link" href={registryUrl}>Inspect canonical registry <span aria-hidden="true">↗</span></a>
      </aside>
    </div>
    <CTA title="Help move a held project responsibly." description="Begin with a specific contribution, the project ID, and the evidence or review step you can support." href={`/join?role=Contributor&project=${project.id}`} action="Discuss a contribution" />
  </>;
}

export function portfolioPageFor(path: string): ComponentType | undefined {
  if (path === '/projects') return PortfolioDirectory;
  const project = portfolioProjects.find(item => path === `/projects/${portfolioSlug(item)}`);
  return project ? () => <PortfolioProjectPage project={project} /> : undefined;
}


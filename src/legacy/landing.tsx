import React, { useEffect, useRef, useState } from "react";
import { createRoot } from "react-dom/client";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { trackLandingEvent } from "../analytics";
import { getMemberAppBaseUrl, getMemberHandoffUrl, getMemberPublicUrl } from "../member-handoff";
import "./index.css";

type Program = {
  title: string;
  description: string;
  status: "Open resource" | "In development" | "Planned";
  path: string;
};

const PROGRAM_GROUPS: { id: string; label: string; title: string; copy: string; programs: Program[] }[] = [
  {
    id: "learn",
    label: "Learn",
    title: "Build financial understanding that travels with you.",
    copy: "Free resources and structured learning for students who want to understand the systems behind everyday financial decisions.",
    programs: [
      { title: "Digital courses", description: "Clear, sourced lessons with explicit learning objectives and practical exercises.", status: "Open resource", path: "/learn" },
      { title: "Global literacy outreach", description: "A workshop model for financial foundations, consumer awareness, and economic confidence.", status: "In development", path: "/programs" },
      { title: "School visits", description: "Facilitated sessions for schools, educators, and student communities.", status: "Planned", path: "/events" },
    ],
  },
  {
    id: "experience",
    label: "Experience",
    title: "Put ideas under real pressure.",
    copy: "Research, publishing, competition, and industry work that turns knowledge into something visible and reviewable.",
    programs: [
      { title: "Live industry projects", description: "Scoped briefs, working teams, milestones, and reviewed outputs.", status: "In development", path: "/programs" },
      { title: "Economics Olympiad", description: "A competition built around reasoning, evidence, and transparent evaluation.", status: "Planned", path: "/events" },
      { title: "FinanceMeta Labs", description: "Reproducible student research across finance, economics, data, and technology.", status: "In development", path: "/research" },
    ],
  },
  {
    id: "lead",
    label: "Lead",
    title: "Create a stronger financial culture around you.",
    copy: "Paths for students to publish, host, organise, and bring high-quality financial education into their communities.",
    programs: [
      { title: "School clubs", description: "A local leadership model with operating standards, curriculum, and evidence records.", status: "Planned", path: "/events" },
      { title: "Economics journal", description: "Student analysis with editorial review, citations, and a corrections policy.", status: "In development", path: "/research" },
      { title: "Student podcast", description: "Interviews and explainers with source notes, guest consent, and published recordings.", status: "Planned", path: "/research" },
    ],
  },
];

const META_PROJECTS = [
  { number: "01", name: "FinanceMeta Labs", type: "Research", copy: "Research questions, experiments, repositories, papers, and preserved limitations." },
  { number: "02", name: "Economics Journal", type: "Publishing", copy: "Long-form student analysis with editorial discipline and visible sources." },
  { number: "03", name: "Finance Debriefs", type: "Editorial", copy: "Timely financial and economic ideas made useful without becoming advice." },
  { number: "04", name: "Industry Projects", type: "Build", copy: "Real briefs, accountable teams, working artifacts, and external review." },
  { number: "05", name: "Student Podcast", type: "Media", copy: "Conversations with builders, researchers, educators, and operators." },
  { number: "06", name: "Economics Olympiad", type: "Competition", copy: "Rigorous economic reasoning through a transparent competitive format." },
];

const memberAppUrl = getMemberAppBaseUrl();

function trackCta(action: string, surface: string, destination: string, handoff = false) {
  return () => trackLandingEvent(handoff ? "member_handoff_started" : "landing_cta", { action, surface, destination });
}

function initialDarkMode() {
  try {
    const saved = window.localStorage.getItem("financemeta-theme");
    if (saved === "dark" || saved === "light") return saved === "dark";
  } catch {
    // Theme preference still works for the current session when storage is unavailable.
  }
  return window.matchMedia?.("(prefers-color-scheme: dark)").matches ?? false;
}

function BrandMark({ compact = false }: { compact?: boolean }) {
  return (
    <span className="brand-lockup">
      <span className="brand-symbol" aria-hidden="true"><i /><i /><i /></span>
      <span className="brand-copy">
        <strong>Finance for All</strong>
        {!compact && <small>A Finance Meta initiative</small>}
      </span>
    </span>
  );
}

function Arrow() {
  return <span className="arrow" aria-hidden="true">↗</span>;
}

function SpotlightPanel({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const onPointerMove = (event: React.PointerEvent<HTMLDivElement>) => {
    const node = ref.current;
    if (!node) return;
    const rect = node.getBoundingClientRect();
    node.style.setProperty("--spot-x", `${event.clientX - rect.left}px`);
    node.style.setProperty("--spot-y", `${event.clientY - rect.top}px`);
  };
  return <div ref={ref} onPointerMove={onPointerMove} className={`spotlight-panel ${className}`}>{children}</div>;
}

export function App() {
  const [darkMode, setDarkMode] = useState(initialDarkMode);
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeGroup, setActiveGroup] = useState(0);
  const programTabs = useRef<(HTMLButtonElement | null)[]>([]);
  const prefersReducedMotion = useReducedMotion();
  const active = PROGRAM_GROUPS[activeGroup];

  const moveProgramTab = (key: string) => {
    const lastIndex = PROGRAM_GROUPS.length - 1;
    const nextIndex = key === "Home"
      ? 0
      : key === "End"
        ? lastIndex
        : key === "ArrowRight"
          ? (activeGroup + 1) % PROGRAM_GROUPS.length
          : key === "ArrowLeft"
            ? (activeGroup - 1 + PROGRAM_GROUPS.length) % PROGRAM_GROUPS.length
            : activeGroup;
    setActiveGroup(nextIndex);
    programTabs.current[nextIndex]?.focus();
  };

  useEffect(() => {
    document.documentElement.classList.toggle("dark", darkMode);
    try { window.localStorage.setItem("financemeta-theme", darkMode ? "dark" : "light"); } catch { /* noop */ }
  }, [darkMode]);

  useEffect(() => {
    trackLandingEvent("landing_impression", { action: "view", surface: "finance_for_all_landing" });
  }, []);

  return (
    <div className="site-shell">
      <a className="skip-link" href="#main-content">Skip to main content</a>
      <header className="site-header">
        <div className="header-inner">
          <a href="#top" aria-label="Finance for All home"><BrandMark /></a>
          <nav className="desktop-nav" aria-label="Primary navigation">
            <a href="#programs">Programs</a>
            <a href="#schools">Schools & clubs</a>
            <a href="#meta">Finance Meta</a>
            <a href="#standard">Evidence</a>
          </nav>
          <div className="header-actions">
            <button className="theme-button" type="button" onClick={() => setDarkMode((value) => !value)} aria-label={darkMode ? "Switch to light theme" : "Switch to dark theme"} aria-pressed={darkMode}>
              <span aria-hidden="true">{darkMode ? "☀" : "◐"}</span>
            </button>
            {memberAppUrl ? (
              <a className="header-portal" data-cta-id="header-member-login" href={getMemberHandoffUrl("/login")} onClick={trackCta("member_login", "header", "/login", true)}>Member portal <Arrow /></a>
            ) : (
              <a className="header-portal" data-cta-id="header-get-involved" href="#join">Get involved <Arrow /></a>
            )}
            <button className="menu-button" type="button" aria-label={menuOpen ? "Close navigation" : "Open navigation"} onClick={() => setMenuOpen((value) => !value)} aria-expanded={menuOpen} aria-controls="mobile-menu"><span /><span /></button>
          </div>
        </div>
        <AnimatePresence>
          {menuOpen && (
            <motion.nav id="mobile-menu" className="mobile-menu" initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} aria-label="Mobile navigation">
              {[ ["Programs", "#programs"], ["Schools & clubs", "#schools"], ["Finance Meta", "#meta"], ["Evidence", "#standard"] ].map(([label, href]) => <a key={href} href={href} onClick={() => setMenuOpen(false)}>{label}<Arrow /></a>)}
            </motion.nav>
          )}
        </AnimatePresence>
      </header>

      <main id="main-content" tabIndex={-1}>
        <section id="top" className="hero-section">
          <div className="hero-grid" aria-hidden="true" />
          <div className="hero-inner">
            <motion.div className="hero-copy" initial={prefersReducedMotion ? false : { opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: .7 }}>
              <p className="eyebrow"><span /> Financial education, made participatory</p>
              <h1>Financial confidence<br />is built, <em>not inherited.</em></h1>
              <p className="hero-lede">Finance for All helps students understand money, economics, and financial systems through learning, research, real projects, and leadership.</p>
              <div className="hero-actions">
                <a className="button button-primary" data-cta-id="hero-programs" href="#programs" onClick={trackCta("program_discovery", "hero", "#programs")}>Explore programs <Arrow /></a>
                {memberAppUrl && <a className="button button-secondary" data-cta-id="hero-member-signup" href={getMemberHandoffUrl("/signup")} onClick={trackCta("member_signup", "hero", "/signup", true)}>Join the network</a>}
              </div>
              <div className="hero-note"><span>For students</span><span>For schools</span><span>For partners</span></div>
            </motion.div>

            <motion.div initial={prefersReducedMotion ? false : { opacity: 0, scale: .97 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: .7, delay: .1 }}>
              <SpotlightPanel className="access-panel">
                <div className="panel-topline"><span>Access now</span><span className="live-indicator"><i /> Public resources</span></div>
                <a className="access-feature" href={getMemberPublicUrl("/learn/five-foundations", "#programs")}>
                  <span className="access-index">01</span>
                  <span><small>Open lesson</small><strong>Five Foundations</strong><em>35 minutes · Grades 9–12</em></span>
                  <Arrow />
                </a>
                <div className="access-list">
                  <a href={getMemberPublicUrl("/research", "#meta")}><span>02</span><strong>Explore research</strong><Arrow /></a>
                  <a href={getMemberPublicUrl("/events", "#schools")}><span>03</span><strong>Events & chapters</strong><Arrow /></a>
                  <a href="mailto:financeforalledu@gmail.com?subject=Bring%20Finance%20for%20All%20to%20our%20school"><span>04</span><strong>Bring us to your school</strong><Arrow /></a>
                </div>
                <div className="signal-graphic" aria-hidden="true"><i /><i /><i /><i /><i /></div>
              </SpotlightPanel>
            </motion.div>
          </div>
        </section>

        <section className="intent-strip" aria-label="Ways to participate">
          <div className="intent-inner">
            <p>Start where you are.</p>
            {["Learn the foundations", "Join a project", "Lead a club", "Work with us"].map((item, index) => <a href={index === 0 ? getMemberPublicUrl("/learn", "#programs") : index === 2 ? "#schools" : index === 3 ? "#join" : "#programs"} key={item}><span>0{index + 1}</span>{item}</a>)}
          </div>
        </section>

        <section id="programs" className="section program-section">
          <div className="section-heading split-heading">
            <div><p className="eyebrow"><span /> Programs</p><h2>One mission.<br /><em>Multiple ways in.</em></h2></div>
            <p>Students do not all learn in the same way. Finance for All connects foundational education with research, publishing, competition, projects, and local leadership.</p>
          </div>

          <div className="program-explorer">
            <div className="program-tabs" role="tablist" aria-label="Program pathways">
              {PROGRAM_GROUPS.map((group, index) => (
                <button
                  key={group.id}
                  ref={(element) => { programTabs.current[index] = element; }}
                  type="button"
                  role="tab"
                  tabIndex={activeGroup === index ? 0 : -1}
                  aria-selected={activeGroup === index}
                  onClick={() => setActiveGroup(index)}
                  onKeyDown={(event) => {
                    if (["ArrowRight", "ArrowLeft", "Home", "End"].includes(event.key)) {
                      event.preventDefault();
                      moveProgramTab(event.key);
                    }
                  }}
                  className={activeGroup === index ? "active" : ""}
                >
                  <span>0{index + 1}</span>{group.label}
                </button>
              ))}
            </div>
            <div className="program-stage" role="tabpanel">
              <AnimatePresence mode="wait">
                <motion.div key={active.id} initial={prefersReducedMotion ? false : { opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: .28 }}>
                  <div className="program-intro"><p>{active.copy}</p><h3>{active.title}</h3></div>
                  <div className="program-list">
                    {active.programs.map((program, index) => (
                      <a key={program.title} href={getMemberPublicUrl(program.path, "#programs")} className="program-row">
                        <span className="row-number">0{index + 1}</span>
                        <span className="row-main"><strong>{program.title}</strong><small>{program.description}</small></span>
                        <span className={`status status-${program.status.toLowerCase().replace(" ", "-")}`}>{program.status}</span>
                        <Arrow />
                      </a>
                    ))}
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
        </section>

        <section id="schools" className="school-section">
          <div className="school-inner">
            <div className="school-copy">
              <p className="eyebrow light"><span /> Schools & clubs</p>
              <h2>Bring financial learning into the room.</h2>
              <p>Finance for All is building formats for workshops, school visits, and student-led clubs. Each format is designed around clear ownership, safeguarding, reviewed materials, and honest reporting.</p>
              <a className="button button-light" data-cta-id="school-partnership" href="mailto:financeforalledu@gmail.com?subject=School%20or%20club%20partnership" onClick={trackCta("school_contact", "schools", "mailto")}>Start a conversation <Arrow /></a>
            </div>
            <ol className="school-steps">
              {[
                ["01", "Choose the format", "A school visit, workshop series, club, or custom collaboration."],
                ["02", "Agree the standard", "Audience, learning goals, consent, timing, ownership, and reporting."],
                ["03", "Deliver and document", "Run the work, collect appropriate evidence, and publish only what is verified."],
              ].map(([number, title, copy]) => <li key={number}><span>{number}</span><div><strong>{title}</strong><p>{copy}</p></div></li>)}
            </ol>
          </div>
        </section>

        <section id="meta" className="section meta-section">
          <div className="section-heading meta-heading">
            <p className="eyebrow"><span /> The wider ecosystem</p>
            <h2>Finance for All is one part of <em>Finance Meta.</em></h2>
            <p>Finance Meta is the umbrella for research, publishing, media, technical builds, industry work, and competition.</p>
          </div>
          <div className="meta-grid">
            {META_PROJECTS.map((project, index) => (
              <article className={`meta-card meta-card-${index + 1}`} key={project.name}>
                <div className="meta-card-top"><span>{project.number}</span><small>{project.type}</small></div>
                <div><h3>{project.name}</h3><p>{project.copy}</p></div>
                <a href={getMemberPublicUrl(project.type === "Research" ? "/research" : project.type === "Competition" ? "/events" : "/programs", "#meta")} aria-label={`Explore ${project.name}`}><Arrow /></a>
              </article>
            ))}
          </div>
        </section>

        <section id="standard" className="standard-section">
          <div className="standard-inner">
            <div><p className="eyebrow"><span /> Our standard</p><h2>Evidence before applause.</h2></div>
            <div className="standard-copy">
              <p>Programs are not labelled active because they sound good. Research is not presented as a result because code runs. Partnerships, reach, outcomes, and student work appear publicly only when there is a reviewable record behind them.</p>
              <div className="standard-grid">
                {[ ["Named owner", "Someone is accountable."], ["Clear method", "The work can be followed."], ["Visible limits", "Uncertainty stays attached."], ["Reviewable output", "There is something to inspect."] ].map(([title, copy], index) => <div key={title}><span>0{index + 1}</span><strong>{title}</strong><small>{copy}</small></div>)}
              </div>
              <a className="text-link" data-cta-id="evidence-boundary" href={getMemberPublicUrl("/evidence", "#standard")}>Read the public evidence boundary <Arrow /></a>
            </div>
          </div>
        </section>

        <section id="join" className="section join-section">
          <SpotlightPanel className="join-panel">
            <div className="join-orbit" aria-hidden="true"><i /><i /><i /></div>
            <p className="eyebrow light"><span /> Take part</p>
            <h2>Learn something useful.<br />Build something <em>worth sharing.</em></h2>
            <p>Join as a student, bring Finance for All to a school, contribute to a Finance Meta project, or explore a partnership.</p>
            <div className="hero-actions">
              {memberAppUrl && <a className="button button-light" data-cta-id="join-member-signup" href={getMemberHandoffUrl("/signup")} onClick={trackCta("member_signup", "join", "/signup", true)}>Create member account <Arrow /></a>}
              <a className="button button-ghost-light" data-cta-id="join-partnership" href="mailto:financeforalledu@gmail.com?subject=Finance%20for%20All%20partnership">Partner with us</a>
            </div>
          </SpotlightPanel>
        </section>
      </main>

      <footer className="site-footer">
        <div className="footer-top"><BrandMark /><p>Financial learning, research, and opportunity<br />built with evidence and made to travel.</p></div>
        <div className="footer-links"><a href="#programs">Programs</a><a href="#schools">Schools</a><a href="#meta">Finance Meta</a><a href="mailto:financeforalledu@gmail.com">Contact</a></div>
        <div className="footer-bottom"><span>© 2026 Finance for All</span><span>Education, not financial advice.</span></div>
      </footer>
    </div>
  );
}

const rootElement = document.getElementById("root");
if (rootElement) {
  createRoot(rootElement).render(<React.StrictMode><App /></React.StrictMode>);
}

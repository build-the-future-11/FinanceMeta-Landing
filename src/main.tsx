import React, { useEffect, useState } from "react";
import { createRoot } from "react-dom/client";
import { motion, useReducedMotion } from "framer-motion";
import { ArrowDownRight, ArrowUpRight, Moon, Sun } from "lucide-react";
import { FlowField } from "./FlowField";
import "./index.css";
import { getMemberHandoffUrl, hasConfiguredMemberHandoff } from "./member-handoff";

type Program = {
  code: string;
  verb: string;
  title: string;
  description: string;
  output: string;
};

const PROGRAMS: Program[] = [
  {
    code: "01/AXIOM",
    verb: "Learn",
    title: "Axiom Pathways",
    description: "Structured pathways from first principles to practical finance, economics, and quantitative reasoning.",
    output: "A worked model or analysis",
  },
  {
    code: "02/STUDIO",
    verb: "Build",
    title: "FinTech Studio",
    description: "A place to turn a financial question into a tool, model, experiment, or student-led product.",
    output: "A testable prototype",
  },
  {
    code: "03/LABS",
    verb: "Research",
    title: "FinanceMeta Labs",
    description: "Student investigation across markets, economics, computational finance, data, and financial technology.",
    output: "A reproducible investigation",
  },
  {
    code: "04/CHAPTERS",
    verb: "Connect",
    title: "Global Chapters",
    description: "A local operating model for students to run discussions, projects, and FinanceMeta programs together.",
    output: "A local operating record",
  },
  {
    code: "05/DEBRIEF",
    verb: "Publish",
    title: "The Debrief",
    description: "Student analysis that makes a financial or economic idea clearer, better sourced, and open to review.",
    output: "A sourced article or briefing",
  },
  {
    code: "06/CHALLENGE",
    verb: "Compete",
    title: "Challenges and Competitions",
    description: "Applied work judged on reasoning, evidence, communication, and decisions made under constraints.",
    output: "A judged submission",
  },
];

const PRINCIPLES = [
  ["01", "Build before you badge", "Work should leave behind an analysis, model, article, project, event, or other inspectable output."],
  ["02", "Evidence before scale", "Impact and outcome claims require records, artifacts, and people who can verify them."],
  ["03", "Students lead the work", "Mentors, educators, and partners should raise the quality bar without taking ownership away from students."],
  ["04", "Finance is a connected system", "Markets, incentives, policy, behavior, and technology are studied together."],
] as const;

const OPERATING_ROUTE = ["Learn", "Apply", "Publish", "Compete", "Lead"] as const;

function initialDarkMode() {
  try {
    const savedTheme = window.localStorage.getItem("financemeta-theme");
    if (savedTheme === "dark" || savedTheme === "light") return savedTheme === "dark";
  } catch {
    // Storage can be unavailable in private or restricted browser contexts.
  }
  return window.matchMedia?.("(prefers-color-scheme: dark)").matches ?? true;
}

function BrandMark() {
  return (
    <span className="brand-mark" aria-hidden="true">
      <span>FM</span>
    </span>
  );
}

export function App() {
  const [darkMode, setDarkMode] = useState(initialDarkMode);
  const [activeProgram, setActiveProgram] = useState(0);
  const prefersReducedMotion = useReducedMotion();
  const memberHandoffConfigured = hasConfiguredMemberHandoff();
  const memberHandoffUrl = getMemberHandoffUrl();
  const selectedProgram = PROGRAMS[activeProgram];

  useEffect(() => {
    document.documentElement.classList.toggle("dark", darkMode);
    try {
      window.localStorage.setItem("financemeta-theme", darkMode ? "dark" : "light");
    } catch {
      // Theme selection remains functional for this session when storage is unavailable.
    }
  }, [darkMode]);

  return (
    <div className="site-shell">
      <a className="skip-link" href="#main-content">Skip to main content</a>

      <header className="site-header">
        <div className="site-header__inner">
          <a href="#top" className="brand-lockup" aria-label="FinanceMeta home">
            <BrandMark />
            <span className="brand-lockup__name">FinanceMeta</span>
          </a>

          <nav aria-label="Primary navigation" className="primary-nav">
            <a href="#programs">Programs</a>
            <a href="#principles">Principles</a>
            <a href="#join">Join</a>
          </nav>

          <div className="header-actions">
            <button
              type="button"
              onClick={() => setDarkMode((value) => !value)}
              className="icon-button"
              aria-label={darkMode ? "Switch to light theme" : "Switch to dark theme"}
              title={darkMode ? "Switch to light theme" : "Switch to dark theme"}
              aria-pressed={darkMode}
            >
              {darkMode ? <Sun size={18} /> : <Moon size={18} />}
            </button>
            <a href="#join" className="header-cta">Enter the network</a>
          </div>
        </div>

        <nav aria-label="Mobile navigation" className="mobile-nav">
          <a href="#programs">Programs</a>
          <a href="#principles">Principles</a>
          <a href="#join">Join</a>
        </nav>
      </header>

      <main id="main-content" tabIndex={-1}>
        <section id="top" className="hero">
          <FlowField darkMode={darkMode} reducedMotion={Boolean(prefersReducedMotion)} />
          <div className="hero__wash" aria-hidden="true" />
          <div className="hero__inner">
            <motion.div
              initial={prefersReducedMotion ? false : { opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: prefersReducedMotion ? 0 : 0.42 }}
              className="hero__copy"
            >
              <div className="field-label"><span>FIELD 01</span><span>STUDENT FINANCE</span></div>
              <h1 aria-label="FinanceMeta"><span>Finance</span><span className="hero__meta">Meta</span></h1>
              <p className="hero__statement">Understand finance. Then use it to build something reviewable.</p>
              <p className="hero__detail">
                A student-led system for learning, research, publishing, competition, and practical financial work.
              </p>
              <div className="hero__actions">
                <a href="#programs" className="button button--primary">
                  Explore programs <ArrowDownRight size={18} aria-hidden="true" />
                </a>
                <a href="mailto:financeforalledu@gmail.com?subject=FinanceMeta%20Partnership" className="button button--quiet">
                  Discuss a partnership <ArrowUpRight size={18} aria-hidden="true" />
                </a>
              </div>
            </motion.div>

            <div className="flow-index" aria-label="FinanceMeta operating route">
              <div className="flow-index__head"><span>OPERATING ROUTE</span><span>01-05</span></div>
              <ol>
                {OPERATING_ROUTE.map((stage, index) => (
                  <li key={stage}><span>0{index + 1}</span><strong>{stage}</strong></li>
                ))}
              </ol>
              <p>Ideas move forward only when the work can be inspected.</p>
            </div>
          </div>

          <div className="hero__status" aria-label="Current program status">
            <span>PROGRAM FAMILIES <strong>06</strong></span>
            <span>CURRENT STATE <strong>IN DEVELOPMENT</strong></span>
            <span>ACTIVATION RULE <strong>REVIEWABLE OUTPUT</strong></span>
          </div>
        </section>

        <section id="programs" className="programs-section">
          <div className="section-shell programs-layout">
            <div className="section-intro">
              <div className="section-index"><span>02</span><span>PROGRAM FIELD</span></div>
              <h2>Six routes into the same system.</h2>
              <p>
                These six program families are in development. A program becomes active only after a named lead, operating record, and reviewable output exist.
              </p>
            </div>

            <div className="program-browser">
              <div className="program-list" role="group" aria-label="FinanceMeta program families">
                {PROGRAMS.map((program, index) => (
                  <button
                    type="button"
                    key={program.code}
                    className="program-row"
                    data-active={index === activeProgram}
                    aria-pressed={index === activeProgram}
                    onMouseEnter={() => setActiveProgram(index)}
                    onFocus={() => setActiveProgram(index)}
                    onClick={() => setActiveProgram(index)}
                  >
                    <span className="program-row__code">{program.code}</span>
                    <span className="program-row__verb">{program.verb}</span>
                    <span className="program-row__title">{program.title}</span>
                    <ArrowUpRight size={17} aria-hidden="true" />
                  </button>
                ))}
              </div>

              <motion.article
                key={selectedProgram.code}
                initial={prefersReducedMotion ? false : { opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: prefersReducedMotion ? 0 : 0.22 }}
                className="program-detail"
                aria-live="polite"
              >
                <div className="program-detail__signal" aria-hidden="true">
                  <span>{String(activeProgram + 1).padStart(2, "0")}</span>
                  <i />
                </div>
                <div className="program-detail__state">STATE / IN DEVELOPMENT</div>
                <h3>{selectedProgram.title}</h3>
                <p>{selectedProgram.description}</p>
                <dl>
                  <div><dt>Route</dt><dd>{selectedProgram.verb}</dd></div>
                  <div><dt>Expected output</dt><dd>{selectedProgram.output}</dd></div>
                </dl>
              </motion.article>
            </div>
          </div>
        </section>

        <section id="principles" className="principles-section">
          <div className="section-shell principles-layout">
            <div className="section-intro section-intro--light">
              <div className="section-index"><span>03</span><span>EVIDENCE LEDGER</span></div>
              <h2>Every claim leaves a trail.</h2>
              <p>FinanceMeta measures progress through work that can be read, tested, challenged, and improved.</p>
            </div>

            <div className="principle-ledger">
              {PRINCIPLES.map(([number, title, description]) => (
                <article key={title}>
                  <span>{number}</span>
                  <h3>{title}</h3>
                  <p>{description}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section id="join" className="join-section">
          <div className="section-shell join-layout">
            <div>
              <div className="section-index"><span>04</span><span>ENTRY POINT</span></div>
              <h2>Enter through the work.</h2>
            </div>
            <div className="join-copy">
              <p>
                Join as a student, chapter lead, mentor, educator, university, or ecosystem partner. The member portal is the operational entry point.
              </p>
              <div className="join-actions">
                <a
                  href={memberHandoffUrl}
                  data-member-handoff={memberHandoffConfigured ? "configured" : "fallback"}
                  aria-label={memberHandoffConfigured ? "Open FinanceMeta member portal" : "Apply to FinanceMeta"}
                  className="button button--ink"
                >
                  {memberHandoffConfigured ? "Open member portal" : "Apply to FinanceMeta"}
                  <ArrowUpRight size={18} aria-hidden="true" />
                </a>
                <a href="mailto:financeforalledu@gmail.com?subject=FinanceMeta%20Partnership" className="text-link">
                  Discuss a partnership <ArrowUpRight size={17} aria-hidden="true" />
                </a>
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="site-footer">
        <div className="section-shell footer-layout">
          <a href="#top" className="brand-lockup" aria-label="Back to FinanceMeta home">
            <BrandMark /><span className="brand-lockup__name">FinanceMeta</span>
          </a>
          <p>Student-led finance, economics, research, and building.</p>
          <span>Understand by doing.</span>
        </div>
      </footer>
    </div>
  );
}

const rootElement = document.getElementById("root");
if (rootElement) {
  createRoot(rootElement).render(
    <React.StrictMode>
      <App />
    </React.StrictMode>,
  );
}

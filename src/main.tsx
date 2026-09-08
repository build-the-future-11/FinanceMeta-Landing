import React, { useEffect, useRef, useState } from "react";
import { createRoot } from "react-dom/client";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import {
  ArrowDown,
  ArrowDownRight,
  ArrowLeft,
  ArrowRight,
  ArrowUpRight,
  Check,
  Moon,
  Sun,
} from "lucide-react";
import { FlowField } from "./FlowField";
import "./index.css";
import { getMemberHandoffUrl, hasConfiguredMemberHandoff } from "./member-handoff";

type Program = {
  code: string;
  verb: string;
  title: string;
  description: string;
  entry: string;
  output: string;
};

const PROGRAMS: Program[] = [
  {
    code: "01/AXIOM",
    verb: "Learn",
    title: "Axiom Pathways",
    description: "Structured pathways from first principles to practical finance, economics, and quantitative reasoning.",
    entry: "A question worth modelling",
    output: "A worked model or analysis",
  },
  {
    code: "02/STUDIO",
    verb: "Build",
    title: "FinTech Studio",
    description: "A place to turn a financial question into a tool, model, experiment, or student-led product.",
    entry: "A defined user or constraint",
    output: "A testable prototype",
  },
  {
    code: "03/LABS",
    verb: "Research",
    title: "FinanceMeta Labs",
    description: "Student investigation across markets, economics, computational finance, data, and financial technology.",
    entry: "A falsifiable research question",
    output: "A reproducible investigation",
  },
  {
    code: "04/CHAPTERS",
    verb: "Connect",
    title: "Global Chapters",
    description: "A local operating model for students to run discussions, projects, and FinanceMeta programs together.",
    entry: "A named lead and local plan",
    output: "A local operating record",
  },
  {
    code: "05/DEBRIEF",
    verb: "Publish",
    title: "The Debrief",
    description: "Student analysis that makes a financial or economic idea clearer, better sourced, and open to review.",
    entry: "A claim and its source trail",
    output: "A sourced article or briefing",
  },
  {
    code: "06/CHALLENGE",
    verb: "Compete",
    title: "Challenges and Competitions",
    description: "Applied work judged on reasoning, evidence, communication, and decisions made under constraints.",
    entry: "A brief with clear constraints",
    output: "A judged submission",
  },
];

const PRINCIPLES = [
  ["01", "Build before you badge", "Work should leave behind an analysis, model, article, project, event, or other inspectable output."],
  ["02", "Evidence before scale", "Impact and outcome claims require records, artifacts, and people who can verify them."],
  ["03", "Students lead the work", "Mentors, educators, and partners should raise the quality bar without taking ownership away from students."],
  ["04", "Finance is a connected system", "Markets, incentives, policy, behavior, and technology are studied together."],
] as const;

const OPERATING_ROUTE = [
  ["Learn", "Frame the question and understand the system around it."],
  ["Apply", "Put a model against data, a decision, or a real constraint."],
  ["Publish", "Expose the method, sources, limits, and resulting work."],
  ["Compete", "Defend the decisions under review and time pressure."],
  ["Lead", "Help another team run the same route with a higher standard."],
] as const;

const EVIDENCE_STEPS = [
  ["Direction stated", "The intent is clear, but there is not yet an accountable owner or operating evidence."],
  ["Lead named", "A person owns the route. The program still needs a durable record of the work."],
  ["Record opened", "Activity is documented. A reviewable output is still required before activation."],
  ["Output reviewed", "A named lead, operating record, and inspectable output now support an active status."],
] as const;

const SECTION_LINKS = [
  ["top", "Field"],
  ["programs", "Programs"],
  ["method", "Method"],
  ["principles", "Standards"],
  ["join", "Enter"],
] as const;

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

function Reveal({ children, className = "", delay = 0 }: { children: React.ReactNode; className?: string; delay?: number }) {
  const prefersReducedMotion = useReducedMotion();
  return (
    <motion.div
      className={className}
      initial={prefersReducedMotion ? false : { opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.22 }}
      transition={{ duration: prefersReducedMotion ? 0 : 0.48, delay, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  );
}

function SectionRail({ activeSection }: { activeSection: string }) {
  return (
    <nav className="section-rail" aria-label="Page sections">
      {SECTION_LINKS.map(([id, label], index) => (
        <a key={id} href={`#${id}`} data-current={activeSection === id} aria-current={activeSection === id ? "location" : undefined}>
          <span>{String(index + 1).padStart(2, "0")}</span>
          <strong>{label}</strong>
        </a>
      ))}
    </nav>
  );
}

function ProofGate() {
  const [step, setStep] = useState(0);
  const [label, detail] = EVIDENCE_STEPS[step];
  const ready = step === EVIDENCE_STEPS.length - 1;

  return (
    <div className="proof-gate">
      <div className="proof-gate__topline">
        <span>EVIDENCE THRESHOLD</span>
        <strong>{ready ? "ELIGIBLE FOR ACTIVATION" : "IN DEVELOPMENT"}</strong>
      </div>
      <div className="proof-gate__readout" aria-live="polite">
        <span>{String(step + 1).padStart(2, "0")}</span>
        <div>
          <h3>{label}</h3>
          <p>{detail}</p>
        </div>
      </div>
      <div className="proof-gate__control">
        <div className="proof-gate__track" aria-hidden="true">
          <span style={{ width: `${(step / (EVIDENCE_STEPS.length - 1)) * 100}%` }} />
        </div>
        <input
          aria-label="Evidence threshold"
          type="range"
          min="0"
          max={EVIDENCE_STEPS.length - 1}
          step="1"
          value={step}
          onChange={(event) => setStep(Number(event.currentTarget.value))}
        />
        <div className="proof-gate__ticks" aria-hidden="true">
          {EVIDENCE_STEPS.map(([name], index) => (
            <span key={name} data-complete={index <= step}>{String(index + 1).padStart(2, "0")}</span>
          ))}
        </div>
      </div>
      <ul>
        {EVIDENCE_STEPS.slice(1).map(([name], index) => (
          <li key={name} data-complete={step > index}>
            <Check size={15} aria-hidden="true" />
            {name}
          </li>
        ))}
      </ul>
    </div>
  );
}

export function App() {
  const [darkMode, setDarkMode] = useState(initialDarkMode);
  const [activeProgram, setActiveProgram] = useState(0);
  const [programDirection, setProgramDirection] = useState(1);
  const [activeRoute, setActiveRoute] = useState(0);
  const [activeSection, setActiveSection] = useState("top");
  const prefersReducedMotion = useReducedMotion();
  const memberHandoffConfigured = hasConfiguredMemberHandoff();
  const memberHandoffUrl = getMemberHandoffUrl();
  const selectedProgram = PROGRAMS[activeProgram];
  const detailRef = useRef<HTMLElement>(null);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", darkMode);
    try {
      window.localStorage.setItem("financemeta-theme", darkMode ? "dark" : "light");
    } catch {
      // Theme selection remains functional for this session when storage is unavailable.
    }
  }, [darkMode]);

  useEffect(() => {
    const sections = SECTION_LINKS.map(([id]) => document.getElementById(id)).filter(Boolean) as HTMLElement[];
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries.filter((entry) => entry.isIntersecting).sort((a, b) => b.intersectionRatio - a.intersectionRatio);
        if (visible[0]?.target.id) setActiveSection(visible[0].target.id);
      },
      { rootMargin: "-28% 0px -58%", threshold: [0, 0.2, 0.6] },
    );
    sections.forEach((section) => observer.observe(section));
    return () => observer.disconnect();
  }, []);

  const selectProgram = (next: number) => {
    const normalized = (next + PROGRAMS.length) % PROGRAMS.length;
    setProgramDirection(normalized >= activeProgram ? 1 : -1);
    setActiveProgram(normalized);
  };

  const moveProgramFocus = (next: number) => {
    const normalized = (next + PROGRAMS.length) % PROGRAMS.length;
    selectProgram(normalized);
    window.requestAnimationFrame(() => document.getElementById(`program-${normalized}`)?.focus());
  };

  const handleProgramKeys = (event: React.KeyboardEvent<HTMLDivElement>) => {
    if (event.key === "ArrowDown" || event.key === "ArrowRight") {
      event.preventDefault();
      moveProgramFocus(activeProgram + 1);
    }
    if (event.key === "ArrowUp" || event.key === "ArrowLeft") {
      event.preventDefault();
      moveProgramFocus(activeProgram - 1);
    }
    if (event.key === "Home" || event.key === "End") {
      event.preventDefault();
      moveProgramFocus(event.key === "Home" ? 0 : PROGRAMS.length - 1);
    }
  };

  const handleDetailPointer = (event: React.PointerEvent<HTMLElement>) => {
    if (prefersReducedMotion || event.pointerType === "touch") return;
    const bounds = event.currentTarget.getBoundingClientRect();
    const x = (event.clientX - bounds.left) / bounds.width - 0.5;
    const y = (event.clientY - bounds.top) / bounds.height - 0.5;
    event.currentTarget.style.setProperty("--tilt-x", `${y * -3.5}deg`);
    event.currentTarget.style.setProperty("--tilt-y", `${x * 4.5}deg`);
  };

  const resetDetailPointer = () => {
    detailRef.current?.style.setProperty("--tilt-x", "0deg");
    detailRef.current?.style.setProperty("--tilt-y", "0deg");
  };

  return (
    <div className="site-shell">
      <a className="skip-link" href="#main-content">Skip to main content</a>
      <div className="top-progress" aria-hidden="true"><span style={{ transform: `scaleX(${SECTION_LINKS.findIndex(([id]) => id === activeSection) / (SECTION_LINKS.length - 1)})` }} /></div>
      <SectionRail activeSection={activeSection} />

      <header className="site-header">
        <div className="site-header__inner">
          <a href="#top" className="brand-lockup" aria-label="FinanceMeta home">
            <BrandMark />
            <span className="brand-lockup__name">FinanceMeta</span>
          </a>

          <nav aria-label="Primary navigation" className="primary-nav">
            {SECTION_LINKS.slice(1, 4).map(([id, label]) => (
              <a key={id} href={`#${id}`} data-current={activeSection === id}>{label}</a>
            ))}
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
            <a href="#join" className="header-cta">Enter the network <ArrowDownRight size={15} aria-hidden="true" /></a>
          </div>
        </div>

        <nav aria-label="Mobile navigation" className="mobile-nav">
          <a href="#programs">Programs</a>
          <a href="#method">Method</a>
          <a href="#principles">Standards</a>
          <a href="#join">Enter</a>
        </nav>
      </header>

      <main id="main-content" tabIndex={-1}>
        <section id="top" className="hero" aria-labelledby="hero-title">
          <FlowField darkMode={darkMode} reducedMotion={Boolean(prefersReducedMotion)} activeRoute={activeRoute} />
          <div className="hero__wash" aria-hidden="true" />
          <div className="hero__coordinates" aria-hidden="true"><span>19.0760 N</span><span>OPEN FIELD / 001</span><span>72.8777 E</span></div>
          <div className="hero__inner">
            <motion.div
              initial={prefersReducedMotion ? false : { opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: prefersReducedMotion ? 0 : 0.52, ease: [0.22, 1, 0.36, 1] }}
              className="hero__copy"
            >
              <div className="field-label"><span>FIELD 01 / OPEN FINANCE</span><span>STUDENT-LED</span></div>
              <h1 id="hero-title" aria-label="FinanceMeta"><span>Finance</span><span className="hero__meta">Meta</span></h1>
              <p className="hero__statement">Study the system. Build the evidence.</p>
              <p className="hero__detail">
                A student-led operating layer for finance, economics, research, publishing, and applied work. Every route ends in something another person can inspect.
              </p>
              <div className="hero__actions">
                <a href="#programs" className="button button--primary button--signal">
                  <span>Explore the field</span><ArrowDownRight size={18} aria-hidden="true" />
                </a>
                <a href="mailto:financeforalledu@gmail.com?subject=FinanceMeta%20Partnership" className="button button--quiet">
                  <span>Discuss a partnership</span><ArrowUpRight size={18} aria-hidden="true" />
                </a>
              </div>
            </motion.div>

            <div className="flow-index">
              <div className="flow-index__head"><span>OPERATING ROUTE</span><span>{String(activeRoute + 1).padStart(2, "0")}/05</span></div>
              <ol aria-label="FinanceMeta operating route">
                {OPERATING_ROUTE.map(([stage], index) => (
                  <li key={stage}>
                    <button type="button" data-active={index === activeRoute} aria-pressed={index === activeRoute} onClick={() => setActiveRoute(index)}>
                      <span>0{index + 1}</span><strong>{stage}</strong><i aria-hidden="true" />
                    </button>
                  </li>
                ))}
              </ol>
              <AnimatePresence mode="wait" initial={false}>
                <motion.p
                  key={activeRoute}
                  initial={prefersReducedMotion ? false : { opacity: 0, y: 4 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -4 }}
                  transition={{ duration: prefersReducedMotion ? 0 : 0.18 }}
                  aria-live="polite"
                >
                  {OPERATING_ROUTE[activeRoute][1]}
                </motion.p>
              </AnimatePresence>
            </div>
          </div>

          <div className="hero__status" aria-label="Current program status">
            <span>PROGRAM FAMILIES <strong>06</strong></span>
            <span>CURRENT STATE <strong>IN DEVELOPMENT</strong></span>
            <span>ACTIVATION RULE <strong>REVIEWABLE OUTPUT</strong></span>
            <a href="#programs">ENTER FIELD <ArrowDown size={14} aria-hidden="true" /></a>
          </div>
        </section>

        <section id="programs" className="programs-section" aria-labelledby="programs-title">
          <div className="section-shell programs-layout">
            <Reveal className="section-intro">
              <div className="section-index"><span>02</span><span>PROGRAM FIELD</span></div>
              <h2 id="programs-title">Six routes. One standard.</h2>
              <p>
                These six program families are in development. A route becomes active only after a named lead, operating record, and reviewable output exist.
              </p>
              <div className="program-pagination" aria-label="Program controls">
                <button type="button" onClick={() => selectProgram(activeProgram - 1)} aria-label="Previous program" title="Previous program"><ArrowLeft size={18} /></button>
                <span><strong>{String(activeProgram + 1).padStart(2, "0")}</strong> / {String(PROGRAMS.length).padStart(2, "0")}</span>
                <button type="button" onClick={() => selectProgram(activeProgram + 1)} aria-label="Next program" title="Next program"><ArrowRight size={18} /></button>
              </div>
            </Reveal>

            <div className="program-browser">
              <div className="program-list" role="group" aria-label="FinanceMeta program families" onKeyDown={handleProgramKeys}>
                {PROGRAMS.map((program, index) => (
                  <button
                    type="button"
                    id={`program-${index}`}
                    key={program.code}
                    className="program-row"
                    data-active={index === activeProgram}
                    aria-pressed={index === activeProgram}
                    onMouseEnter={() => selectProgram(index)}
                    onFocus={() => selectProgram(index)}
                    onClick={() => selectProgram(index)}
                  >
                    <span className="program-row__code">{program.code}</span>
                    <span className="program-row__verb">{program.verb}</span>
                    <span className="program-row__title">{program.title}</span>
                    <ArrowUpRight size={17} aria-hidden="true" />
                  </button>
                ))}
              </div>

              <article
                ref={detailRef}
                className="program-detail"
                onPointerMove={handleDetailPointer}
                onPointerLeave={resetDetailPointer}
                aria-live="polite"
              >
                <div className="program-detail__plane" aria-hidden="true"><span>{selectedProgram.verb.toUpperCase()}</span></div>
                <AnimatePresence mode="wait" initial={false}>
                  <motion.div
                    key={selectedProgram.code}
                    className="program-detail__content"
                    initial={prefersReducedMotion ? false : { opacity: 0, x: 18 * programDirection }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -12 * programDirection }}
                    transition={{ duration: prefersReducedMotion ? 0 : 0.24, ease: [0.22, 1, 0.36, 1] }}
                  >
                    <div className="program-detail__signal" aria-hidden="true">
                      <span>{String(activeProgram + 1).padStart(2, "0")}</span><i />
                    </div>
                    <div className="program-detail__state">STATE / IN DEVELOPMENT</div>
                    <h3>{selectedProgram.title}</h3>
                    <p>{selectedProgram.description}</p>
                    <dl>
                      <div><dt>Route</dt><dd>{selectedProgram.verb}</dd></div>
                      <div><dt>Entry point</dt><dd>{selectedProgram.entry}</dd></div>
                      <div><dt>Expected output</dt><dd>{selectedProgram.output}</dd></div>
                    </dl>
                  </motion.div>
                </AnimatePresence>
              </article>
            </div>
          </div>
        </section>

        <section id="method" className="method-section" aria-labelledby="method-title">
          <div className="method-grid" aria-hidden="true" />
          <div className="section-shell method-layout">
            <Reveal className="section-intro method-intro">
              <div className="section-index"><span>03</span><span>OPERATING METHOD</span></div>
              <h2 id="method-title">The work has to move.</h2>
              <p>Learning is the start of the route, not the finish. Each stage adds a stronger public record.</p>
            </Reveal>

            <ol className="route-sequence">
              {OPERATING_ROUTE.map(([stage, description], index) => (
                <motion.li
                  key={stage}
                  initial={prefersReducedMotion ? false : { x: index % 2 ? 18 : -18 }}
                  whileInView={{ x: 0 }}
                  viewport={{ once: false, amount: 0.65 }}
                  transition={{ duration: prefersReducedMotion ? 0 : 0.36 }}
                >
                  <span>0{index + 1}</span>
                  <h3>{stage}</h3>
                  <p>{description}</p>
                  <i aria-hidden="true" />
                </motion.li>
              ))}
            </ol>
          </div>
        </section>

        <section id="principles" className="principles-section" aria-labelledby="principles-title">
          <div className="section-shell principles-layout">
            <Reveal className="section-intro section-intro--light">
              <div className="section-index"><span>04</span><span>EVIDENCE STANDARD</span></div>
              <h2 id="principles-title">A claim earns space after the evidence does.</h2>
              <p>Move the threshold to see what separates a stated direction from an active, inspectable program.</p>
            </Reveal>

            <ProofGate />

            <div className="principle-ledger">
              {PRINCIPLES.map(([number, title, description], index) => (
                <motion.article
                  key={title}
                  initial={prefersReducedMotion ? false : { opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.5 }}
                  transition={{ duration: prefersReducedMotion ? 0 : 0.36, delay: index * 0.04 }}
                >
                  <span>{number}</span><h3>{title}</h3><p>{description}</p>
                </motion.article>
              ))}
            </div>
          </div>
        </section>

        <section id="join" className="join-section" aria-labelledby="join-title">
          <div className="section-shell join-layout">
            <Reveal>
              <div className="section-index"><span>05</span><span>ENTRY POINT</span></div>
              <h2 id="join-title">Bring a question. Leave a record.</h2>
            </Reveal>
            <Reveal className="join-copy" delay={0.06}>
              <p>
                Join as a student, chapter lead, mentor, educator, university, or ecosystem partner. The member portal is the operational entry point.
              </p>
              <div className="join-actions">
                <a
                  href={memberHandoffUrl}
                  data-member-handoff={memberHandoffConfigured ? "configured" : "fallback"}
                  aria-label={memberHandoffConfigured ? "Open FinanceMeta member portal" : "Apply to FinanceMeta"}
                  className="button button--ink button--signal"
                >
                  <span>{memberHandoffConfigured ? "Open member portal" : "Apply to FinanceMeta"}</span>
                  <ArrowUpRight size={18} aria-hidden="true" />
                </a>
                <a href="mailto:financeforalledu@gmail.com?subject=FinanceMeta%20Partnership" className="text-link">
                  Discuss a partnership <ArrowUpRight size={17} aria-hidden="true" />
                </a>
              </div>
              <dl className="join-ledger">
                <div><dt>Students</dt><dd>Learn, build, research, publish, and lead.</dd></div>
                <div><dt>Institutions</dt><dd>Mentor work, host review, or support a local route.</dd></div>
              </dl>
            </Reveal>
          </div>
        </section>
      </main>

      <footer className="site-footer">
        <div className="section-shell footer-layout">
          <a href="#top" className="brand-lockup" aria-label="Back to FinanceMeta home">
            <BrandMark /><span className="brand-lockup__name">FinanceMeta</span>
          </a>
          <p>Student-led finance, economics, research, and building.</p>
          <a href="#top">Return to field <ArrowUpRight size={14} aria-hidden="true" /></a>
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

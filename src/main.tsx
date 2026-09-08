import React, { useEffect, useState } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import { getMemberHandoffUrl, hasConfiguredMemberHandoff } from "./member-handoff";

type Program = {
  eyebrow: string;
  title: string;
  description: string;
};

const PROGRAMS: Program[] = [
  {
    eyebrow: "LEARN",
    title: "Axiom Pathways",
    description:
      "Structured pathways that help students move from first principles to practical finance, economics, and quantitative thinking.",
  },
  {
    eyebrow: "BUILD",
    title: "FinTech Studio",
    description:
      "A place to turn ideas into real financial tools, models, experiments, and student-led products with visible outcomes.",
  },
  {
    eyebrow: "RESEARCH",
    title: "FinanceMeta Labs",
    description:
      "Student research and experimentation across markets, economics, computational finance, data, and emerging financial technology.",
  },
  {
    eyebrow: "CONNECT",
    title: "Global Chapters",
    description:
      "Local communities that bring FinanceMeta programs, discussions, projects, and collaboration to students around the world.",
  },
  {
    eyebrow: "PUBLISH",
    title: "The Debrief",
    description:
      "Student-facing analysis and commentary that makes important financial and economic ideas clearer, sharper, and easier to engage with.",
  },
  {
    eyebrow: "COMPETE",
    title: "Challenges & Competitions",
    description:
      "Applied experiences that reward rigorous thinking, evidence, communication, and creative problem solving rather than passive participation.",
  },
];

const PRINCIPLES = [
  ["01", "Build before you badge", "Work should leave behind something inspectable: an analysis, model, article, project, or event."],
  ["02", "Evidence over hype", "Claims about impact or outcomes should be backed by records, outputs, and people who can verify them."],
  ["03", "Student-led, globally connected", "Students lead the work while mentors, educators, and partners raise the quality bar."],
  ["04", "Finance explains the world", "Markets, incentives, policy, behavior, and technology are treated as connected systems."],
] as const;

function initialDarkMode() {
  try {
    const savedTheme = window.localStorage.getItem("financemeta-theme");
    if (savedTheme === "dark" || savedTheme === "light") {
      return savedTheme === "dark";
    }
  } catch {
    // Storage can be unavailable in private or restricted browser contexts.
  }
  return window.matchMedia?.("(prefers-color-scheme: dark)").matches ?? true;
}

export function App() {
  const [darkMode, setDarkMode] = useState(initialDarkMode);
  const memberHandoffConfigured = hasConfiguredMemberHandoff();
  const memberHandoffUrl = getMemberHandoffUrl();

  useEffect(() => {
    document.documentElement.classList.toggle("dark", darkMode);
    try {
      window.localStorage.setItem("financemeta-theme", darkMode ? "dark" : "light");
    } catch {
      // Theme selection remains functional for this session when storage is unavailable.
    }
  }, [darkMode]);

  return (
    <div className="min-h-screen bg-[#f6f7f4] text-slate-950 transition-colors duration-200 dark:bg-[#0a0f0d] dark:text-slate-50">
      <a className="skip-link" href="#main-content">Skip to main content</a>

      <header className="sticky top-0 z-50 border-b border-slate-200 bg-[#f6f7f4]/95 dark:border-white/10 dark:bg-[#0a0f0d]/95">
        <div className="mx-auto flex min-h-16 max-w-7xl items-center justify-between gap-5 px-6 lg:px-8">
          <a href="#top" className="flex items-center gap-3" aria-label="FinanceMeta home">
            <div className="flex h-9 w-9 items-center justify-center rounded-md bg-emerald-500 text-sm font-black text-[#07110d]">
              FM
            </div>
            <div>
              <div className="text-sm font-bold tracking-[0.08em]">FinanceMeta</div>
              <div className="hidden text-xs text-slate-500 dark:text-slate-400 sm:block">
                Finance · economics · building · research
              </div>
            </div>
          </a>

          <nav aria-label="Primary navigation" className="hidden items-center gap-1 md:flex">
            <a className="rounded-md px-3 py-2 text-sm font-medium text-slate-600 hover:bg-slate-200/60 hover:text-slate-950 dark:text-slate-300 dark:hover:bg-white/5 dark:hover:text-white" href="#programs">Programs</a>
            <a className="rounded-md px-3 py-2 text-sm font-medium text-slate-600 hover:bg-slate-200/60 hover:text-slate-950 dark:text-slate-300 dark:hover:bg-white/5 dark:hover:text-white" href="#why">Principles</a>
            <a className="rounded-md px-3 py-2 text-sm font-medium text-slate-600 hover:bg-slate-200/60 hover:text-slate-950 dark:text-slate-300 dark:hover:bg-white/5 dark:hover:text-white" href="#join">Join</a>
          </nav>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setDarkMode((value) => !value)}
              className="inline-flex min-h-10 items-center rounded-md border border-slate-300 px-3 text-xs font-semibold text-slate-600 transition-colors hover:border-slate-400 hover:text-slate-950 dark:border-white/15 dark:text-slate-300 dark:hover:border-white/30 dark:hover:text-white"
              aria-label={darkMode ? "Switch to light theme" : "Switch to dark theme"}
              aria-pressed={darkMode}
            >
              {darkMode ? "Light" : "Dark"}
            </button>
            <a
              href="#join"
              className="inline-flex min-h-10 items-center rounded-md bg-emerald-500 px-4 text-sm font-bold text-[#07110d] transition-colors hover:bg-emerald-400"
            >
              Get involved
            </a>
          </div>
        </div>
      </header>

      <main id="main-content" tabIndex={-1}>
        <section id="top" className="border-b border-slate-200 dark:border-white/10">
          <div className="mx-auto grid max-w-7xl gap-12 px-6 py-20 lg:grid-cols-[minmax(0,1.2fr)_minmax(300px,0.8fr)] lg:items-end lg:px-8 lg:py-28">
            <div className="max-w-4xl">
              <div className="mb-6 flex items-center gap-3 text-xs font-bold uppercase tracking-[0.14em] text-emerald-600 dark:text-emerald-400">
                <span className="h-px w-8 bg-emerald-500" aria-hidden="true" />
                Student-led finance and economics platform
              </div>

              <h1 className="max-w-4xl text-5xl font-black leading-[0.96] tracking-[-0.05em] sm:text-6xl lg:text-7xl">
                Understand finance.
                <span className="block text-slate-500 dark:text-slate-300">Then use it to build.</span>
              </h1>

              <p className="mt-7 max-w-2xl text-lg leading-8 text-slate-600 dark:text-slate-300">
                FinanceMeta brings learning, research, publishing, competitions, chapters, and practical projects into one operating system for students who want more than passive financial literacy.
              </p>

              <div className="mt-9 flex flex-col gap-3 sm:flex-row">
                <a
                  href="#programs"
                  className="inline-flex min-h-11 items-center justify-center rounded-md bg-emerald-500 px-5 text-sm font-bold text-[#07110d] transition-colors hover:bg-emerald-400"
                >
                  Explore programs
                </a>
                <a
                  href="mailto:financeforalledu@gmail.com?subject=FinanceMeta%20Partnership"
                  className="inline-flex min-h-11 items-center justify-center rounded-md border border-slate-300 px-5 text-sm font-semibold transition-colors hover:bg-slate-200/60 dark:border-white/15 dark:hover:bg-white/5"
                >
                  Partner with FinanceMeta
                </a>
              </div>
            </div>

            <aside className="border-t border-slate-200 pt-6 dark:border-white/10 lg:border-l lg:border-t-0 lg:pl-8 lg:pt-0" aria-label="FinanceMeta operating model">
              <div className="text-sm font-bold">A platform built around output.</div>
              <p className="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-400">
                Programs are expected to produce visible work, not just attendance. The operating loop is deliberately simple.
              </p>
              <ol className="mt-6 divide-y divide-slate-200 border-y border-slate-200 dark:divide-white/10 dark:border-white/10">
                {[
                  ["01", "Learn", "Build strong mental models."],
                  ["02", "Apply", "Use them on real questions and projects."],
                  ["03", "Publish", "Make the reasoning reviewable."],
                  ["04", "Compete", "Test judgment under constraints."],
                  ["05", "Lead", "Bring the work into a community."],
                ].map(([number, title, copy]) => (
                  <li key={number} className="grid grid-cols-[42px_90px_1fr] gap-3 py-3 text-sm">
                    <span className="font-mono text-xs text-emerald-600 dark:text-emerald-400">{number}</span>
                    <span className="font-bold">{title}</span>
                    <span className="text-slate-500 dark:text-slate-400">{copy}</span>
                  </li>
                ))}
              </ol>
            </aside>
          </div>
        </section>

        <section id="programs" className="mx-auto max-w-7xl px-6 py-20 lg:px-8 lg:py-24">
          <div className="grid gap-8 lg:grid-cols-[0.7fr_1.3fr]">
            <div className="max-w-xl">
              <div className="text-xs font-bold uppercase tracking-[0.14em] text-emerald-600 dark:text-emerald-400">Programs</div>
              <h2 className="mt-4 text-4xl font-black tracking-[-0.04em] sm:text-5xl">Six ways to turn interest into capability.</h2>
              <p className="mt-5 text-lg leading-8 text-slate-600 dark:text-slate-300">
                These program families are in development. A program is described as active only after a named lead, operating record, and reviewable output exist.
              </p>
            </div>

            <div className="border-y border-slate-200 dark:border-white/10">
              {PROGRAMS.map((program, index) => (
                <article
                  key={program.title}
                  className="grid gap-3 border-b border-slate-200 py-6 last:border-b-0 dark:border-white/10 sm:grid-cols-[58px_180px_1fr] sm:gap-5"
                >
                  <div className="font-mono text-xs text-slate-400">0{index + 1}</div>
                  <div>
                    <div className="text-xs font-bold uppercase tracking-[0.12em] text-emerald-600 dark:text-emerald-400">{program.eyebrow}</div>
                    <h3 className="mt-1 text-xl font-black tracking-tight">{program.title}</h3>
                  </div>
                  <p className="leading-7 text-slate-600 dark:text-slate-400">{program.description}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section id="why" className="border-y border-slate-200 bg-white py-20 dark:border-white/10 dark:bg-white/[0.02] lg:py-24">
          <div className="mx-auto max-w-7xl px-6 lg:px-8">
            <div className="grid gap-8 lg:grid-cols-[0.75fr_1.25fr]">
              <div className="max-w-xl">
                <div className="text-xs font-bold uppercase tracking-[0.14em] text-emerald-600 dark:text-emerald-400">Operating principles</div>
                <h2 className="mt-4 text-4xl font-black tracking-[-0.04em] sm:text-5xl">Finance education should produce capability.</h2>
                <p className="mt-5 text-lg leading-8 text-slate-600 dark:text-slate-300">
                  The goal is not another certificate. It is sharper judgment, stronger technical skills, better questions, and work you can actually show.
                </p>
              </div>

              <div className="divide-y divide-slate-200 border-y border-slate-200 dark:divide-white/10 dark:border-white/10">
                {PRINCIPLES.map(([number, title, description]) => (
                  <div key={title} className="grid gap-3 py-5 sm:grid-cols-[52px_220px_1fr] sm:gap-5">
                    <div className="font-mono text-xs text-emerald-600 dark:text-emerald-400">{number}</div>
                    <div className="font-bold">{title}</div>
                    <div className="text-sm leading-6 text-slate-600 dark:text-slate-400">{description}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section id="join" className="mx-auto max-w-7xl px-6 py-20 lg:px-8 lg:py-24">
          <div className="border border-slate-300 bg-[#102019] p-8 text-white dark:border-white/10 sm:p-10 lg:p-12">
            <div className="grid items-end gap-10 lg:grid-cols-[1fr_auto]">
              <div>
                <div className="text-xs font-bold uppercase tracking-[0.14em] text-emerald-400">Join FinanceMeta</div>
                <h2 className="mt-4 max-w-3xl text-4xl font-black tracking-[-0.04em] sm:text-5xl">
                  Come to learn. Stay because you are building something worth sharing.
                </h2>
                <p className="mt-5 max-w-2xl text-lg leading-8 text-slate-300">
                  Students, chapter leads, mentors, educators, universities, and ecosystem partners can plug into FinanceMeta in different ways.
                </p>
              </div>

              <div className="flex min-w-[220px] flex-col gap-3">
                <a
                  href={memberHandoffUrl}
                  data-member-handoff={memberHandoffConfigured ? "configured" : "fallback"}
                  aria-label={memberHandoffConfigured ? "Open FinanceMeta member portal" : "Apply to FinanceMeta"}
                  className="inline-flex min-h-11 items-center justify-center rounded-md bg-emerald-400 px-5 text-center text-sm font-black text-[#07110d] transition-colors hover:bg-emerald-300"
                >
                  {memberHandoffConfigured ? "Open member portal" : "Apply to FinanceMeta"}
                </a>
                <a
                  href="mailto:financeforalledu@gmail.com?subject=FinanceMeta%20Partnership"
                  className="inline-flex min-h-11 items-center justify-center rounded-md border border-white/20 px-5 text-center text-sm font-bold transition-colors hover:border-emerald-400 hover:text-emerald-300"
                >
                  Explore a partnership
                </a>
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t border-slate-200 px-6 py-8 text-sm text-slate-500 dark:border-white/10 dark:text-slate-400">
        <div className="mx-auto flex max-w-7xl flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>FinanceMeta · Student-led finance, economics, research, and building.</div>
          <div>Understand by doing.</div>
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

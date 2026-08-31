import React, { useEffect, useState } from "react";
import { createRoot } from "react-dom/client";
import { motion, useReducedMotion } from "framer-motion";
import "./index.css";

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
  "Build before you badge",
  "Evidence over hype",
  "Student-led, globally connected",
  "Finance as a tool for understanding the world",
];

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

function App() {
  const [darkMode, setDarkMode] = useState(initialDarkMode);
  const prefersReducedMotion = useReducedMotion();

  useEffect(() => {
    document.documentElement.classList.toggle("dark", darkMode);
    try {
      window.localStorage.setItem("financemeta-theme", darkMode ? "dark" : "light");
    } catch {
      // Theme selection remains functional for this session when storage is unavailable.
    }
  }, [darkMode]);

  return (
    <div className="min-h-screen bg-[#f5f7f5] text-slate-950 transition-colors duration-300 dark:bg-[#08100d] dark:text-white">
      <a className="skip-link" href="#main-content">Skip to main content</a>
      <header className="sticky top-0 z-50 border-b border-slate-200/70 bg-[#f5f7f5]/90 backdrop-blur-xl dark:border-white/10 dark:bg-[#08100d]/85">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4 lg:px-8">
          <a href="#top" className="flex items-center gap-3" aria-label="FinanceMeta home">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-500 font-black text-[#07110d]">
              FM
            </div>
            <div>
              <div className="text-sm font-semibold tracking-[0.22em] text-emerald-500">FINANCEMETA</div>
              <div className="text-xs text-slate-500 dark:text-slate-400">Learn · Build · Research · Compete</div>
            </div>
          </a>

          <nav aria-label="Primary navigation" className="hidden items-center gap-7 text-sm font-medium md:flex">
            <a className="hover:text-emerald-500" href="#programs">Programs</a>
            <a className="hover:text-emerald-500" href="#why">Why FinanceMeta</a>
            <a className="hover:text-emerald-500" href="#join">Join</a>
          </nav>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setDarkMode((value) => !value)}
              className="rounded-full border border-slate-300 px-3 py-2 text-xs font-semibold text-slate-600 transition hover:border-emerald-500 hover:text-emerald-500 dark:border-white/15 dark:text-slate-300"
              aria-label={darkMode ? "Switch to light theme" : "Switch to dark theme"}
              aria-pressed={darkMode}
            >
              {darkMode ? "Light" : "Dark"}
            </button>
            <a
              href="#join"
              className="rounded-full bg-emerald-500 px-4 py-2 text-sm font-bold text-[#07110d] transition hover:bg-emerald-400"
            >
              Get involved
            </a>
          </div>
        </div>
        <nav aria-label="Mobile navigation" className="flex justify-center gap-6 border-t border-slate-200/70 px-6 py-3 text-sm font-semibold dark:border-white/10 md:hidden">
          <a className="hover:text-emerald-500" href="#programs">Programs</a>
          <a className="hover:text-emerald-500" href="#why">Why</a>
          <a className="hover:text-emerald-500" href="#join">Join</a>
        </nav>
      </header>

      <main id="main-content" tabIndex={-1}>
        <section className="relative overflow-hidden border-b border-slate-200/70 dark:border-white/10">
          <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_top_left,rgba(16,185,129,0.18),transparent_34%),radial-gradient(circle_at_80%_25%,rgba(52,211,153,0.12),transparent_30%)]" />
          <div className="mx-auto grid max-w-7xl gap-14 px-6 py-24 lg:grid-cols-[1.3fr_0.7fr] lg:px-8 lg:py-32">
            <motion.div
              initial={prefersReducedMotion ? false : { opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: prefersReducedMotion ? 0 : 0.55 }}
            >
              <div className="mb-7 inline-flex items-center gap-2 rounded-full border border-emerald-500/25 bg-emerald-500/10 px-4 py-2 text-xs font-bold uppercase tracking-[0.18em] text-emerald-600 dark:text-emerald-400">
                A student finance ecosystem, not another course library
              </div>
              <h1 className="max-w-4xl text-5xl font-black leading-[0.98] tracking-[-0.05em] sm:text-6xl lg:text-7xl">
                Understand finance.
                <span className="block text-emerald-500">Build with it.</span>
              </h1>
              <p className="mt-7 max-w-2xl text-lg leading-8 text-slate-600 dark:text-slate-300">
                FinanceMeta brings learning, research, publishing, competitions, chapters, and real projects into one student-led platform for people who want to do more than memorize terminology.
              </p>
              <div className="mt-9 flex flex-col gap-3 sm:flex-row">
                <a
                  href="#programs"
                  className="rounded-xl bg-emerald-500 px-6 py-3.5 text-center font-bold text-[#07110d] shadow-[0_14px_35px_rgba(16,185,129,0.22)] transition hover:-translate-y-0.5 hover:bg-emerald-400"
                >
                  Explore the ecosystem
                </a>
                <a
                  href="mailto:financeforalledu@gmail.com"
                  className="rounded-xl border border-slate-300 px-6 py-3.5 text-center font-bold transition hover:border-emerald-500 hover:text-emerald-500 dark:border-white/15"
                >
                  Partner with FinanceMeta
                </a>
              </div>
            </motion.div>

            <motion.aside
              initial={prefersReducedMotion ? false : { opacity: 0, scale: 0.97 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: prefersReducedMotion ? 0 : 0.55, delay: prefersReducedMotion ? 0 : 0.08 }}
              className="self-end rounded-3xl border border-slate-200 bg-white/80 p-7 shadow-2xl shadow-emerald-950/5 backdrop-blur dark:border-white/10 dark:bg-white/[0.045]"
            >
              <div className="text-xs font-bold uppercase tracking-[0.22em] text-emerald-500">The FinanceMeta loop</div>
              <div className="mt-6 space-y-5">
                {[
                  ["01", "Learn", "Build strong mental models."],
                  ["02", "Apply", "Turn concepts into projects and analysis."],
                  ["03", "Publish", "Explain what you learned with evidence."],
                  ["04", "Compete", "Test your thinking under pressure."],
                  ["05", "Lead", "Bring the ecosystem to your own community."],
                ].map(([number, title, copy]) => (
                  <div key={number} className="grid grid-cols-[44px_1fr] gap-4">
                    <div className="text-sm font-black text-emerald-500">{number}</div>
                    <div>
                      <div className="font-bold">{title}</div>
                      <div className="mt-1 text-sm leading-6 text-slate-500 dark:text-slate-400">{copy}</div>
                    </div>
                  </div>
                ))}
              </div>
            </motion.aside>
          </div>
        </section>

        <section id="programs" className="mx-auto max-w-7xl px-6 py-24 lg:px-8">
          <div className="max-w-3xl">
            <div className="text-sm font-black uppercase tracking-[0.2em] text-emerald-500">Programs</div>
            <h2 className="mt-4 text-4xl font-black tracking-[-0.035em] sm:text-5xl">One platform. Multiple ways to grow.</h2>
            <p className="mt-5 text-lg leading-8 text-slate-600 dark:text-slate-300">
              Choose the lane that matches how you learn best, then move between them as your skills, ambition, and projects get deeper.
            </p>
          </div>

          <div className="mt-12 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {PROGRAMS.map((program, index) => (
              <motion.article
                key={program.title}
                initial={prefersReducedMotion ? false : { opacity: 0, y: 14 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{ duration: prefersReducedMotion ? 0 : 0.4, delay: prefersReducedMotion ? 0 : index * 0.04 }}
                className="group rounded-2xl border border-slate-200 bg-white p-6 transition hover:-translate-y-1 hover:border-emerald-500/60 hover:shadow-xl hover:shadow-emerald-950/5 dark:border-white/10 dark:bg-white/[0.035]"
              >
                <div className="text-xs font-black tracking-[0.2em] text-emerald-500">{program.eyebrow}</div>
                <h3 className="mt-4 text-2xl font-black tracking-tight">{program.title}</h3>
                <p className="mt-3 leading-7 text-slate-600 dark:text-slate-400">{program.description}</p>
              </motion.article>
            ))}
          </div>
        </section>

        <section id="why" className="border-y border-slate-200 bg-white py-24 dark:border-white/10 dark:bg-white/[0.025]">
          <div className="mx-auto grid max-w-7xl gap-12 px-6 lg:grid-cols-2 lg:px-8">
            <div>
              <div className="text-sm font-black uppercase tracking-[0.2em] text-emerald-500">Why FinanceMeta</div>
              <h2 className="mt-4 text-4xl font-black tracking-[-0.035em] sm:text-5xl">Finance education should produce capability.</h2>
              <p className="mt-6 max-w-xl text-lg leading-8 text-slate-600 dark:text-slate-300">
                The goal is not to collect another certificate. It is to leave with sharper judgment, stronger technical skills, better questions, and work you can actually show.
              </p>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              {PRINCIPLES.map((principle, index) => (
                <div key={principle} className="rounded-2xl border border-slate-200 p-6 dark:border-white/10">
                  <div className="text-sm font-black text-emerald-500">0{index + 1}</div>
                  <div className="mt-8 text-xl font-black leading-snug">{principle}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section id="join" className="mx-auto max-w-7xl px-6 py-24 lg:px-8">
          <div className="overflow-hidden rounded-3xl bg-[#0d1c16] p-8 text-white shadow-2xl shadow-emerald-950/15 sm:p-12 lg:p-14">
            <div className="grid items-end gap-10 lg:grid-cols-[1fr_auto]">
              <div>
                <div className="text-sm font-black uppercase tracking-[0.2em] text-emerald-400">Join the network</div>
                <h2 className="mt-4 max-w-3xl text-4xl font-black tracking-[-0.04em] sm:text-5xl">
                  Come to learn. Stay to build something worth sharing.
                </h2>
                <p className="mt-5 max-w-2xl text-lg leading-8 text-slate-300">
                  Students, chapter leads, mentors, educators, universities, and ecosystem partners can all plug into FinanceMeta in different ways.
                </p>
              </div>
              <div className="flex flex-col gap-3 sm:flex-row lg:flex-col">
                <a
                  href="mailto:financeforalledu@gmail.com?subject=FinanceMeta%20-%20Get%20Involved"
                  className="rounded-xl bg-emerald-400 px-6 py-3.5 text-center font-black text-[#07110d] transition hover:bg-emerald-300"
                >
                  Get involved
                </a>
                <a
                  href="mailto:financeforalledu@gmail.com?subject=FinanceMeta%20Partnership"
                  className="rounded-xl border border-white/20 px-6 py-3.5 text-center font-black transition hover:border-emerald-400 hover:text-emerald-300"
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
          <div>Built for people who want to understand by doing.</div>
        </div>
      </footer>
    </div>
  );
}

const rootElement = document.getElementById("root");

if (!rootElement) {
  throw new Error("Root element not found");
}

createRoot(rootElement).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);

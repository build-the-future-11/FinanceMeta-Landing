import React, { useEffect, useState } from "react";
import { createRoot } from "react-dom/client";
import { motion, useReducedMotion } from "framer-motion";
import "./index.css";
import { getMemberHandoffUrl, hasConfiguredMemberHandoff } from "./member-handoff";

type Program = {
  eyebrow: string;
  title: string;
  description: string;
};

type Lab = {
  code: string;
  title: string;
  focus: string;
  outputs: string;
};

type Cohort = {
  title: string;
  status: string;
  description: string;
  artifact: string;
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

const LABS: Lab[] = [
  {
    code: "FM-L01",
    title: "Financial ML & Representation Lab",
    focus:
      "Representation learning, forecasting, tabular and time-series ML, calibration, regime shift, and failure analysis.",
    outputs:
      "Reproducible experiments, benchmark cards, negative-result notes, and paper-ready technical reports.",
  },
  {
    code: "FM-L02",
    title: "Markets & Execution Lab",
    focus:
      "Market microstructure, liquidity, execution, transaction costs, event studies, and trading-system evaluation.",
    outputs:
      "Backtests with realistic costs, execution simulations, data-quality audits, and falsification reports.",
  },
  {
    code: "FM-L03",
    title: "Macro, Policy & Payments Lab",
    focus:
      "Monetary policy, payment systems, macro transmission, incentives, institutions, and economic policy analysis.",
    outputs:
      "Policy briefs, replication studies, causal-design memos, data notebooks, and debate-ready evidence packs.",
  },
  {
    code: "FM-L04",
    title: "Corporate Finance & Private Markets Lab",
    focus:
      "Valuation, capital structure, IRR mechanics, private-market assumptions, operating models, and scenario analysis.",
    outputs:
      "Transparent models, investment memos, sensitivity maps, and assumption-integrity reviews.",
  },
];

const COHORTS: Cohort[] = [
  {
    title: "Financial ML Research Cohort",
    status: "FORMING",
    description:
      "A bounded research group for leakage-resistant financial ML, representation learning, regime testing, calibration, and strong baseline comparisons.",
    artifact:
      "Target artifact: reproducible repository plus a technical report suitable for external review when the evidence supports it.",
  },
  {
    title: "Quant Research & Backtesting Cohort",
    status: "FORMING",
    description:
      "Build and falsify systematic hypotheses with explicit data provenance, transaction costs, walk-forward evaluation, and adversarial checks.",
    artifact:
      "Target artifact: research notebook, backtest specification, failure log, and final out-of-sample result.",
  },
  {
    title: "Market Microstructure Cohort",
    status: "SCOPING",
    description:
      "Study liquidity, spread dynamics, price impact, order-flow signals, and execution quality without turning toy simulations into trading claims.",
    artifact:
      "Target artifact: data study or execution simulator with documented assumptions and stress tests.",
  },
  {
    title: "Economics, Policy & Payments Cohort",
    status: "FORMING",
    description:
      "Work on monetary policy, payment rails, macro transmission, incentives, public data, and empirical policy questions.",
    artifact:
      "Target artifact: replication, policy research note, empirical notebook, or structured debate brief.",
  },
];

const RESEARCH_GATES = [
  ["01", "Pre-register", "Write the question, hypothesis, primary metric, split, and stopping rule before the result is known."],
  ["02", "Audit data", "Track source provenance, look-ahead risk, survivorship bias, leakage, missingness, and universe changes."],
  ["03", "Beat real baselines", "Compare against simple statistical, economic, and persistence baselines before adding complexity."],
  ["04", "Price the strategy", "For market studies, include fees, slippage, turnover, liquidity constraints, and implementation assumptions."],
  ["05", "Stress regimes", "Test across time periods, volatility conditions, assets, sectors, and intentionally adverse slices."],
  ["06", "Falsify", "Actively search for the condition that breaks the claim; null and negative results stay publishable internally."],
  ["07", "Hold out evidence", "Keep final confirmatory evaluation separate from model selection and exploratory analysis."],
] as const;

const PRINCIPLES = [
  ["01", "Build before you badge", "Work should leave behind something inspectable: an analysis, model, article, project, or event."],
  ["02", "Evidence over hype", "Claims about impact or outcomes should be backed by records, outputs, and people who can verify them."],
  ["03", "Student-led, globally connected", "Students lead the work while mentors, educators, and partners raise the quality bar."],
  ["04", "Finance explains the world", "Markets, incentives, policy, behavior, and technology are treated as connected systems."],
] as const;

const CHANNELS = [
  {
    title: "FinanceMeta Podcast",
    status: "LAUNCHING",
    description:
      "Long-form conversations with researchers, investors, economists, operators, and student builders. Episodes should leave listeners with models, methods, and questions to investigate.",
  },
  {
    title: "The Debrief",
    status: "EDITORIAL",
    description:
      "Research explainers, market structure notes, policy analysis, paper breakdowns, and student work with sources and claim boundaries.",
  },
  {
    title: "FinanceMeta Live",
    status: "PROGRAMMING",
    description:
      "Research talks, live market-analysis sessions, policy simulations, founder/operator conversations, and methodology workshops.",
  },
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

export function App() {
  const [darkMode, setDarkMode] = useState(initialDarkMode);
  const prefersReducedMotion = useReducedMotion();
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

          <nav aria-label="Primary navigation" className="hidden items-center gap-1 lg:flex">
            <a className="rounded-md px-3 py-2 text-sm font-medium text-slate-600 hover:bg-slate-200/60 hover:text-slate-950 dark:text-slate-300 dark:hover:bg-white/5 dark:hover:text-white" href="#labs">Labs</a>
            <a className="rounded-md px-3 py-2 text-sm font-medium text-slate-600 hover:bg-slate-200/60 hover:text-slate-950 dark:text-slate-300 dark:hover:bg-white/5 dark:hover:text-white" href="#cohorts">Cohorts</a>
            <a className="rounded-md px-3 py-2 text-sm font-medium text-slate-600 hover:bg-slate-200/60 hover:text-slate-950 dark:text-slate-300 dark:hover:bg-white/5 dark:hover:text-white" href="#research-standard">Method</a>
            <a className="rounded-md px-3 py-2 text-sm font-medium text-slate-600 hover:bg-slate-200/60 hover:text-slate-950 dark:text-slate-300 dark:hover:bg-white/5 dark:hover:text-white" href="#channels">Media</a>
            <a className="rounded-md px-3 py-2 text-sm font-medium text-slate-600 hover:bg-slate-200/60 hover:text-slate-950 dark:text-slate-300 dark:hover:bg-white/5 dark:hover:text-white" href="#programs">Programs</a>
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

        <nav
          aria-label="Mobile navigation"
          className="flex items-center justify-center gap-1 overflow-x-auto border-t border-slate-200 px-3 py-2 dark:border-white/10 lg:hidden"
        >
          <a className="whitespace-nowrap rounded-md px-3 py-2 text-sm font-semibold" href="#labs">Labs</a>
          <a className="whitespace-nowrap rounded-md px-3 py-2 text-sm font-semibold" href="#cohorts">Cohorts</a>
          <a className="whitespace-nowrap rounded-md px-3 py-2 text-sm font-semibold" href="#channels">Media</a>
          <a className="whitespace-nowrap rounded-md px-3 py-2 text-sm font-semibold" href="#join">Join</a>
        </nav>
      </header>

      <main id="main-content" tabIndex={-1}>
        <section id="top" className="border-b border-slate-200 dark:border-white/10">
          <div className="mx-auto grid max-w-7xl gap-12 px-6 py-20 lg:grid-cols-[minmax(0,1.2fr)_minmax(300px,0.8fr)] lg:items-end lg:px-8 lg:py-28">
            <motion.div
              initial={prefersReducedMotion ? false : { opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: prefersReducedMotion ? 0 : 0.35 }}
              className="max-w-4xl"
            >
              <div className="mb-6 flex items-center gap-3 text-xs font-bold uppercase tracking-[0.14em] text-emerald-600 dark:text-emerald-400">
                <span className="h-px w-8 bg-emerald-500" aria-hidden="true" />
                Research · markets · policy · building
              </div>

              <h1 className="max-w-4xl text-5xl font-black leading-[0.96] tracking-[-0.05em] sm:text-6xl lg:text-7xl">
                Understand finance.
                <span className="block text-slate-500 dark:text-slate-300">Then produce evidence.</span>
              </h1>

              <p className="mt-7 max-w-2xl text-lg leading-8 text-slate-600 dark:text-slate-300">
                FinanceMeta is a student-led operating system for rigorous financial research, quantitative experimentation, economics, publishing, chapters, and practical projects. The standard is simple: make the work inspectable.
              </p>

              <div className="mt-9 flex flex-col gap-3 sm:flex-row">
                <a
                  href="#cohorts"
                  className="inline-flex min-h-11 items-center justify-center rounded-md bg-emerald-500 px-5 text-sm font-bold text-[#07110d] transition-colors hover:bg-emerald-400"
                >
                  Explore research cohorts
                </a>
                <a
                  href="mailto:financeforalledu@gmail.com?subject=FinanceMeta%20Research%20or%20Partnership"
                  className="inline-flex min-h-11 items-center justify-center rounded-md border border-slate-300 px-5 text-sm font-semibold transition-colors hover:bg-slate-200/60 dark:border-white/15 dark:hover:bg-white/5"
                >
                  Research or partner with us
                </a>
              </div>
            </motion.div>

            <aside className="border-t border-slate-200 pt-6 dark:border-white/10 lg:border-l lg:border-t-0 lg:pl-8 lg:pt-0" aria-label="FinanceMeta operating model">
              <div className="text-sm font-bold">A platform built around output.</div>
              <p className="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-400">
                Programs are expected to produce visible work, not just attendance. Research can end positive, negative, or inconclusive and still be useful when the method is sound.
              </p>
              <ol className="mt-6 divide-y divide-slate-200 border-y border-slate-200 dark:divide-white/10 dark:border-white/10">
                {[
                  ["01", "Learn", "Build strong mental models."],
                  ["02", "Specify", "Write the claim and test before the result."],
                  ["03", "Test", "Use realistic data, baselines, and constraints."],
                  ["04", "Falsify", "Search for where the claim breaks."],
                  ["05", "Publish", "Make the evidence reviewable."],
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

        <section id="labs" className="mx-auto max-w-7xl px-6 py-20 lg:px-8 lg:py-24">
          <div className="mb-10 max-w-3xl">
            <div className="text-xs font-bold uppercase tracking-[0.14em] text-emerald-600 dark:text-emerald-400">FinanceMeta Labs</div>
            <h2 className="mt-4 text-4xl font-black tracking-[-0.04em] sm:text-5xl">Four research divisions with one evidence standard.</h2>
            <p className="mt-5 text-lg leading-8 text-slate-600 dark:text-slate-300">
              Labs define the research surface. Cohorts are bounded teams inside those labs. Nothing is represented as an active research result until a question, owner, data source, evaluation plan, and artifact path exist.
            </p>
          </div>

          <div className="grid gap-px overflow-hidden border border-slate-200 bg-slate-200 dark:border-white/10 dark:bg-white/10 md:grid-cols-2">
            {LABS.map((lab) => (
              <article key={lab.code} className="bg-[#f6f7f4] p-6 dark:bg-[#0a0f0d] sm:p-8">
                <div className="font-mono text-xs font-bold text-emerald-600 dark:text-emerald-400">{lab.code}</div>
                <h3 className="mt-3 text-2xl font-black tracking-tight">{lab.title}</h3>
                <p className="mt-4 leading-7 text-slate-600 dark:text-slate-400">{lab.focus}</p>
                <div className="mt-6 border-t border-slate-200 pt-4 text-sm leading-6 text-slate-500 dark:border-white/10 dark:text-slate-400">
                  <span className="font-bold text-slate-800 dark:text-slate-200">Expected outputs: </span>
                  {lab.outputs}
                </div>
              </article>
            ))}
          </div>
        </section>

        <section id="cohorts" className="border-y border-slate-200 bg-white py-20 dark:border-white/10 dark:bg-white/[0.02] lg:py-24">
          <div className="mx-auto max-w-7xl px-6 lg:px-8">
            <div className="grid gap-10 lg:grid-cols-[0.65fr_1.35fr]">
              <div className="max-w-xl">
                <div className="text-xs font-bold uppercase tracking-[0.14em] text-emerald-600 dark:text-emerald-400">Research cohorts</div>
                <h2 className="mt-4 text-4xl font-black tracking-[-0.04em] sm:text-5xl">Small teams. Bounded questions. Real artifacts.</h2>
                <p className="mt-5 text-lg leading-8 text-slate-600 dark:text-slate-300">
                  Initial Fall 2026 cohorts are structured to avoid the usual student-research failure mode: too many broad ideas and no falsifiable endpoint.
                </p>
                <a
                  href="#join"
                  className="mt-7 inline-flex min-h-11 items-center justify-center rounded-md bg-emerald-500 px-5 text-sm font-bold text-[#07110d] transition-colors hover:bg-emerald-400"
                >
                  Apply or propose a project
                </a>
              </div>

              <div className="divide-y divide-slate-200 border-y border-slate-200 dark:divide-white/10 dark:border-white/10">
                {COHORTS.map((cohort) => (
                  <article key={cohort.title} className="py-6">
                    <div className="flex flex-wrap items-center justify-between gap-3">
                      <h3 className="text-xl font-black tracking-tight">{cohort.title}</h3>
                      <span className="rounded-full border border-emerald-500/40 px-3 py-1 font-mono text-[11px] font-bold tracking-[0.12em] text-emerald-700 dark:text-emerald-300">
                        {cohort.status}
                      </span>
                    </div>
                    <p className="mt-3 leading-7 text-slate-600 dark:text-slate-400">{cohort.description}</p>
                    <p className="mt-3 text-sm leading-6 text-slate-500 dark:text-slate-500">{cohort.artifact}</p>
                  </article>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section id="research-standard" className="mx-auto max-w-7xl px-6 py-20 lg:px-8 lg:py-24">
          <div className="grid gap-10 lg:grid-cols-[0.7fr_1.3fr]">
            <div className="max-w-xl">
              <div className="text-xs font-bold uppercase tracking-[0.14em] text-emerald-600 dark:text-emerald-400">Research standard</div>
              <h2 className="mt-4 text-4xl font-black tracking-[-0.04em] sm:text-5xl">A result is only as strong as the path that produced it.</h2>
              <p className="mt-5 text-lg leading-8 text-slate-600 dark:text-slate-300">
                Every serious FinanceMeta study should be able to answer these gates before it becomes a headline, recommendation, or claimed edge.
              </p>
            </div>

            <div className="divide-y divide-slate-200 border-y border-slate-200 dark:divide-white/10 dark:border-white/10">
              {RESEARCH_GATES.map(([number, title, description]) => (
                <div key={number} className="grid gap-3 py-5 sm:grid-cols-[52px_160px_1fr] sm:gap-5">
                  <div className="font-mono text-xs text-emerald-600 dark:text-emerald-400">{number}</div>
                  <div className="font-bold">{title}</div>
                  <div className="text-sm leading-6 text-slate-600 dark:text-slate-400">{description}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section id="channels" className="border-y border-slate-200 bg-[#102019] py-20 text-white dark:border-white/10 lg:py-24">
          <div className="mx-auto max-w-7xl px-6 lg:px-8">
            <div className="mb-10 max-w-3xl">
              <div className="text-xs font-bold uppercase tracking-[0.14em] text-emerald-400">Media & events</div>
              <h2 className="mt-4 text-4xl font-black tracking-[-0.04em] sm:text-5xl">Turn the research network into a public learning network.</h2>
              <p className="mt-5 text-lg leading-8 text-slate-300">
                The podcast, editorial desk, and live programming are designed to expose methods and reasoning, not just personalities or market takes.
              </p>
            </div>

            <div className="grid gap-4 md:grid-cols-3">
              {CHANNELS.map((channel) => (
                <article key={channel.title} className="border border-white/15 p-6">
                  <div className="font-mono text-[11px] font-bold tracking-[0.12em] text-emerald-300">{channel.status}</div>
                  <h3 className="mt-3 text-2xl font-black tracking-tight">{channel.title}</h3>
                  <p className="mt-4 text-sm leading-7 text-slate-300">{channel.description}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section id="programs" className="mx-auto max-w-7xl px-6 py-20 lg:px-8 lg:py-24">
          <div className="grid gap-8 lg:grid-cols-[0.7fr_1.3fr]">
            <div className="max-w-xl">
              <div className="text-xs font-bold uppercase tracking-[0.14em] text-emerald-600 dark:text-emerald-400">Platform programs</div>
              <h2 className="mt-4 text-4xl font-black tracking-[-0.04em] sm:text-5xl">Research is the core, not the whole network.</h2>
              <p className="mt-5 text-lg leading-8 text-slate-600 dark:text-slate-300">
                FinanceMeta connects research with education, publishing, building, competitions, and chapters so useful work has somewhere to travel.
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
                  Join a cohort, start a chapter, publish work, or build the next program.
                </h2>
                <p className="mt-5 max-w-2xl text-lg leading-8 text-slate-300">
                  Students, researchers, chapter leads, mentors, educators, universities, and ecosystem partners can enter through the same general application and be routed to the right operating track.
                </p>
              </div>

              <div className="flex min-w-[240px] flex-col gap-3">
                <a
                  href={memberHandoffUrl}
                  data-member-handoff={memberHandoffConfigured ? "configured" : "fallback"}
                  aria-label={memberHandoffConfigured ? "Open FinanceMeta member portal" : "Apply to FinanceMeta"}
                  className="inline-flex min-h-11 items-center justify-center rounded-md bg-emerald-400 px-5 text-center text-sm font-black text-[#07110d] transition-colors hover:bg-emerald-300"
                >
                  {memberHandoffConfigured ? "Open member portal" : "Apply to FinanceMeta"}
                </a>
                <a
                  href="mailto:financeforalledu@gmail.com?subject=FinanceMeta%20Research%20Cohort"
                  className="inline-flex min-h-11 items-center justify-center rounded-md border border-white/20 px-5 text-center text-sm font-bold transition-colors hover:border-emerald-400 hover:text-emerald-300"
                >
                  Propose research
                </a>
                <a
                  href="mailto:financeforalledu@gmail.com?subject=FinanceMeta%20Chapter%20or%20Partnership"
                  className="inline-flex min-h-11 items-center justify-center rounded-md border border-white/20 px-5 text-center text-sm font-bold transition-colors hover:border-emerald-400 hover:text-emerald-300"
                >
                  Chapter or partnership
                </a>
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t border-slate-200 px-6 py-8 text-sm text-slate-500 dark:border-white/10 dark:text-slate-400">
        <div className="mx-auto flex max-w-7xl flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>FinanceMeta · Research, markets, economics, building, and publishing.</div>
          <div>Evidence before claims.</div>
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

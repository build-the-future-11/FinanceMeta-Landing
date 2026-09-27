import type { CohortCurriculum, ResearchProtocol } from './models';

const stages = (focus: string): CohortCurriculum['stages'] => [
 {title:'Question & literature',work:`Map the strongest existing evidence for ${focus}. Define the unit of analysis and a falsifiable question.`,deliverable:'Source ledger, research question and assumptions.'},
 {title:'Data & protocol',work:'Document provenance, access rights, missingness and point-in-time availability. Specify splits, metrics and exclusions before evaluation.',deliverable:'Versioned protocol, data dictionary and leakage checks.'},
 {title:'Baseline & replication',work:'Reproduce a simple baseline before adding complexity. Keep preprocessing and tuning budgets comparable.',deliverable:'Runnable baseline with environment and data fingerprints.'},
 {title:'Evaluation & robustness',work:'Run the agreed holdout, sensitivity and failure analyses. Retain negative results and record deviations.',deliverable:'Experiment ledger, raw outputs and uncertainty estimates.'},
 {title:'Review & release',work:'Invite a second reader to reproduce the work, reconcile discrepancies, and review permissions and claims.',deliverable:'Research note, limitations, reproducibility package and presentation.'},
];
const record = (track:string,intakeCall:string,focus:string):CohortCurriculum => ({track,intakeCall,workload:'Planning estimate: 4–6 hours a week. Duration and meeting times must be agreed before acceptance.',selection:'Review preparation, the proposed question and available supervision using the same rubric. Request a work sample only when useful; explain decisions and agree accessibility needs before participation.',stages:stages(focus)});
export const curricula:Record<string,CohortCurriculum> = {
 'realitycheck':record('Quant Research','quant-research','systematic strategy evaluation'),
 'market-frictions':record('Quant Research','quant-research','execution costs and market microstructure'),
 'finml-benchmark':record('Financial ML','financial-ml','financial representation learning'),
 'macrocast':record('Macro & Economic Research','economic-research','real-time macro forecasting'),
 'causal-finance':record('Macro & Economic Research','economic-research','causal identification in finance'),
 'capitallab':record('Investment Research','investment-research','source-led company and sector analysis'),
};
export const engineeringCurriculum=record('Research Engineering','research-engineering','reproducible evaluation infrastructure');
export function draftProtocol(question:string,methods:string[]):ResearchProtocol {
 return {status:'Draft',hypothesis:`Working question: ${question} The directional hypothesis and rejection criterion require agreement before preregistration.`,baseline:'A simple, relevant comparator using the same information set, sample, execution assumptions and tuning budget.',evaluation:`Specify primary metric, independent evaluation units, chronological or otherwise justified holdouts, exclusions and uncertainty before analysis. Intended methods: ${methods.join(', ') || 'to be selected after design review'}.`,reproducibility:'Pin source revision, data identity and access rights, environment, configuration, seeds and commands. Retain raw outputs and all deviations from the frozen protocol.',references:[{label:'FinanceMeta research standards',url:'/research/standards'},{label:'Protocol worksheet',url:'/resources/research-protocol.md'}]};
}

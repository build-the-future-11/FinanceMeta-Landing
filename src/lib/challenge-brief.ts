export const BRIEF_VERSION = 1;
export const TITLE_LIMIT = 140;
export const SECTION_LIMIT = 4000;
export const BACKUP_LIMIT = 256 * 1024;

export const briefSections = [
  { id: 'question', title: 'Question and falsifiable claim', prompt: 'What exactly are you testing? Name the observation that would make you change your conclusion.' },
  { id: 'sources', title: 'Sources, rights and information dates', prompt: 'List the source links, coverage, units and reuse terms. When was each observation available to the person making the decision?' },
  { id: 'baseline', title: 'A fair baseline', prompt: 'Name a simple comparison and explain how it gets the same data, dates and evaluation budget.' },
  { id: 'method', title: 'Method and assumptions', prompt: 'Write the steps, choices and assumptions another person would need to follow. Separate observed facts from choices you make.' },
  { id: 'evaluation', title: 'Evaluation before results', prompt: 'Specify the metric, comparison period and what would count against the claim. Keep test information out of model selection.' },
  { id: 'robustness', title: 'Stress tests and alternative explanations', prompt: 'Which plausible changes could reverse the conclusion? Decide what you will vary and what you will keep fixed.' },
  { id: 'limitations', title: 'Limits and unresolved questions', prompt: 'What can this design not establish? Record missing data, uncertainty and any review or permission still needed.' },
  { id: 'reproduction', title: 'Reproduction and handover', prompt: 'List the files, source versions, environment and steps needed to reproduce the work. Include a spreadsheet or notebook where appropriate.' },
] as const;

export const briefTracks = [
  {
    id: 'investment-model-challenge',
    label: 'Investment model',
    focus: 'Explain one financial decision with an inspectable model. A spreadsheet is a valid starting point.',
    prompts: [
      'Define the decision and constraints before choosing a model.',
      'Compare a simple reference case using identical information and dates.',
      'Vary the key assumptions and show when the preferred decision changes.',
    ],
  },
  {
    id: 'backtest-falsification',
    label: 'Backtest falsification',
    focus: 'Take one market claim and find out whether it survives a fair test. A negative result is useful.',
    prompts: [
      'Identify the exact claim and the source version you are testing.',
      'Separate training, model selection and testing; check information availability and survivorship.',
      'Account for costs and compare the same periods before interpreting a performance difference.',
    ],
  },
  {
    id: 'global-research-challenge',
    label: 'Finance and economics research',
    focus: 'Turn a finance or economics question into a small study with a clear method and visible limits.',
    prompts: [
      'Choose a question narrow enough to answer with identifiable evidence.',
      'Distinguish description, prediction and causal inference in the claim.',
      'Explain the strongest alternative interpretation and how you would investigate it.',
    ],
  },
] as const;

export type BriefTrackId = typeof briefTracks[number]['id'];
export type BriefSectionId = typeof briefSections[number]['id'];
export type ChallengeBrief = {
  version: typeof BRIEF_VERSION;
  track: BriefTrackId;
  title: string;
  sections: Record<BriefSectionId, string>;
};

export function isBriefTrack(value: unknown): value is BriefTrackId {
  return briefTracks.some(track => track.id === value);
}

export function newBrief(track: BriefTrackId = briefTracks[0].id): ChallengeBrief {
  return { version: BRIEF_VERSION, track, title: '', sections: Object.fromEntries(briefSections.map(section => [section.id, ''])) as ChallengeBrief['sections'] };
}

function objectRecord(value: unknown): value is Record<string, unknown> {
  return value !== null && typeof value === 'object' && !Array.isArray(value);
}

export function readBriefBackup(text: string): ChallengeBrief {
  if (new TextEncoder().encode(text).byteLength > BACKUP_LIMIT) throw new Error('Choose a brief backup smaller than 256 KB.');
  let value: unknown;
  try { value = JSON.parse(text); } catch { throw new Error('This file is not valid JSON. Choose an editable backup downloaded from this workspace.'); }
  if (!objectRecord(value) || value.version !== BRIEF_VERSION || !isBriefTrack(value.track)) throw new Error('This is not a supported challenge brief backup.');
  if (Object.keys(value).some(key => !['version', 'track', 'title', 'sections'].includes(key))) throw new Error('This backup contains unexpected fields. Your current draft has not changed.');
  if (typeof value.title !== 'string' || value.title.length > TITLE_LIMIT || !objectRecord(value.sections)) throw new Error('The backup title or sections are invalid.');
  if (Object.keys(value.sections).length !== briefSections.length || Object.keys(value.sections).some(key => !briefSections.some(section => section.id === key))) throw new Error('The backup must contain the eight brief sections.');
  const draft = newBrief(value.track);
  draft.title = value.title;
  for (const { id } of briefSections) {
    const section = value.sections[id];
    if (typeof section !== 'string' || section.length > SECTION_LIMIT) throw new Error('Each brief section must be text with at most 4,000 characters.');
    draft.sections[id] = section;
  }
  return draft;
}

export function startedSections(draft: ChallengeBrief): BriefSectionId[] {
  return briefSections.filter(section => draft.sections[section.id].trim().length > 0).map(section => section.id);
}

export function hasBriefContent(draft: ChallengeBrief): boolean {
  return draft.title.trim().length > 0 || startedSections(draft).length > 0;
}

export function briefBackup(draft: ChallengeBrief): string {
  return JSON.stringify(draft, null, 2) + '\n';
}

export function briefMarkdown(draft: ChallengeBrief): string {
  const track = briefTracks.find(item => item.id === draft.track)!;
  const quote = (text: string) => text.split(/\r?\n/).map(line => '> ' + line).join('\n');
  const title = draft.title.trim() || 'Untitled research brief';
  return [
    '# Finance4All challenge preparation brief',
    quote(title),
    `Practice track: ${track.label}`,
    'Working draft for preparation. This file is not an entry, registration, official rulebook or judging result. Confirm current program rules and availability before participating.',
    `Sections started: ${startedSections(draft).length}/${briefSections.length}. This counts text only; it does not assess research quality or verify evidence.`,
    ...briefSections.flatMap(section => [
      `## ${section.title}`,
      draft.sections[section.id].trim() ? quote(draft.sections[section.id]) : '_Not yet written._',
    ]),
    '## Next review',
    'Check the sources and assumptions, ask a reviewer to challenge the design, and retain negative or inconclusive findings. Agree any collaborative scope, review support and contribution credit separately.',
  ].join('\n\n') + '\n';
}

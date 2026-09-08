import { readFileSync } from "node:fs";

const copyGuide = readFileSync("brand/COPY.md", "utf8");
const sourceFiles = ["src/main.tsx", "index.html"];
const bannedPhrases = [...copyGuide.matchAll(/^- `([^`]+)`$/gm)].map((match) => match[1]);
const genericHeadings = [
  "why choose us",
  "our solutions",
  "powerful features",
  "built for you",
  "endless possibilities",
];
const failures = [];

for (const file of sourceFiles) {
  const source = readFileSync(file, "utf8");
  const lowerSource = source.toLowerCase();

  if (source.includes("\u2014")) failures.push(`${file}: contains an em dash`);
  if (/lorem ipsum/i.test(source)) failures.push(`${file}: contains lorem ipsum placeholder copy`);
  if (/\b(?:john|jane) doe\b|happy customer|testimonial goes here/i.test(source)) {
    failures.push(`${file}: contains testimonial placeholder language`);
  }
  if (/\b(?:99(?:\.\d+)?%|10x|100\+|1m\+)\b/i.test(source)) {
    failures.push(`${file}: contains a suspicious placeholder metric`);
  }

  for (const phrase of bannedPhrases) {
    if (lowerSource.includes(phrase.toLowerCase())) {
      failures.push(`${file}: contains banned phrase "${phrase}"`);
    }
  }

  for (const heading of genericHeadings) {
    const pattern = new RegExp(`<h[1-3][^>]*>[^<]*${heading}[^<]*<\\/h[1-3]>`, "i");
    if (pattern.test(source)) failures.push(`${file}: contains generic heading "${heading}"`);
  }

  const headings = [...source.matchAll(/<h[1-3][^>]*>([\s\S]*?)<\/h[1-3]>/g)]
    .map((match) => match[1].replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim().toLowerCase())
    .filter((heading) => heading && !heading.includes("{"));
  const duplicates = headings.filter((heading, index) => headings.indexOf(heading) !== index);
  for (const heading of new Set(duplicates)) failures.push(`${file}: repeats heading "${heading}"`);
}

if (failures.length) {
  throw new Error(`copy lint failed:\n- ${failures.join("\n- ")}`);
}

console.log(`FinanceMeta copy lint passed across ${sourceFiles.length} user-facing source files.`);

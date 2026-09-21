import { readdirSync, readFileSync, statSync, existsSync } from "node:fs";
import path from "node:path";

const root = process.cwd();
const roots = [
  "src",
  "scripts",
  "Finance4allLanding/src",
  "Finance4allLanding/scripts",
  "Finance4allLanding/supabase/migrations",
  "FinanceMetaLanding/scripts",
  "FinanceMetaLanding/FI-JEPA/fijepa",
  "FinanceMetaLanding/FI-JEPA/tests",
];

const extensions = new Set([".css", ".js", ".jsx", ".mjs", ".py", ".sql", ".ts", ".tsx"]);
const blockedTerms = [
  [/\bTODO\b/i, "TODO marker"],
  [/\bFIXME\b/i, "FIXME marker"],
  [/\bpseudocode\b/i, "pseudocode marker"],
  [/\blorem ipsum\b/i, "lorem ipsum copy"],
  [/\bdummy\b/i, "dummy implementation"],
  [/\bfake\b/i, "fake implementation"],
  [/\bstub(?:bed)?\b/i, "stub marker"],
  [/\bscaffold(?:ing)?\b/i, "scaffolding marker"],
  [/\bTBD\b/, "TBD marker"],
];

function walk(dir, files = []) {
  for (const entry of readdirSync(dir)) {
    const fullPath = path.join(dir, entry);
    const relative = path.relative(root, fullPath);
    if (
      relative === "scripts/verify-source-completion.mjs" ||
      relative.includes("node_modules") ||
      relative.includes(`${path.sep}dist${path.sep}`) ||
      relative.includes(`${path.sep}coverage${path.sep}`) ||
      relative.includes(".pytest_cache")
    ) {
      continue;
    }
    const stat = statSync(fullPath);
    if (stat.isDirectory()) walk(fullPath, files);
    else if (extensions.has(path.extname(fullPath))) files.push(fullPath);
  }
  return files;
}

const findings = [];
for (const sourceRoot of roots) {
  const fullRoot = path.join(root, sourceRoot);
  // A standalone public-site checkout does not contain the independent projects.
  // Continue scanning them when present without making them release dependencies.
  if (!existsSync(fullRoot) && sourceRoot.includes("/")) continue;
  for (const file of walk(fullRoot)) {
    const text = readFileSync(file, "utf8");
    const lines = text.split(/\r?\n/);
    lines.forEach((line, index) => {
      for (const [pattern, label] of blockedTerms) {
        if (pattern.test(line)) {
          findings.push(`${path.relative(root, file)}:${index + 1} ${label}`);
        }
      }
    });
  }
}

if (findings.length > 0) {
  throw new Error(`source completion check failed:\n- ${findings.join("\n- ")}`);
}

console.log("FinanceMeta source completion check passed: no TODO/FIXME/pseudocode/stub/scaffold markers in executable source.");

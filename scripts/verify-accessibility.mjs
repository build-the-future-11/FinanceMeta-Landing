import { readFileSync } from "node:fs";

const source = readFileSync("src/legacy/landing.tsx", "utf8");
const styles = readFileSync("src/legacy/index.css", "utf8");

const sourceMarkers = [
  'className="skip-link"',
  'href="#main-content"',
  'id="main-content"',
  "tabIndex={-1}",
  'aria-label="Primary navigation"',
  'aria-label="Mobile navigation"',
  "aria-pressed={darkMode}",
  'window.localStorage.getItem("financemeta-theme")',
  'window.matchMedia?.("(prefers-color-scheme: dark)")',
  "useReducedMotion()",
  "prefersReducedMotion ? false",
];

for (const marker of sourceMarkers) {
  if (!source.includes(marker)) {
    throw new Error(`accessibility check failed: src/main.tsx missing ${marker}`);
  }
}

const styleMarkers = [
  ".skip-link:focus",
  ":where(a, button):focus-visible",
  "@media (prefers-reduced-motion: reduce)",
  "scroll-behavior: auto !important",
];

for (const marker of styleMarkers) {
  if (!styles.includes(marker)) {
    throw new Error(`accessibility check failed: src/index.css missing ${marker}`);
  }
}

console.log("FinanceMeta accessibility check passed: keyboard, mobile navigation, theme, and reduced-motion contracts are present.");

const newComponents=readFileSync('src/components.tsx','utf8');
const newSite=readFileSync('src/site.tsx','utf8');
const newStyles=readFileSync('src/index.css','utf8');
for(const marker of ['aria-expanded={menu===g.label}',"e.key==='Escape'",'aria-label="Mobile navigation"','aria-pressed={dark}','htmlFor=','aria-live="polite"'])if(!newComponents.includes(marker))throw new Error(`Research accessibility contract missing ${marker}`);
for(const marker of ['href="#main-content"','tabIndex={-1}'])if(!newSite.includes(marker))throw new Error(`Research landmark contract missing ${marker}`);
for(const marker of [':focus-visible','prefers-reduced-motion','scroll-behavior:auto!important'])if(!newStyles.includes(marker))throw new Error(`Research style contract missing ${marker}`);
console.log('Research navigation, forms, live result counts, focus, and reduced-motion source contracts passed.');

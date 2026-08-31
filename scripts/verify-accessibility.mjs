import { readFileSync } from "node:fs";

const source = readFileSync("src/main.tsx", "utf8");
const styles = readFileSync("src/index.css", "utf8");

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

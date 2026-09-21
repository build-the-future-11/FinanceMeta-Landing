import { readFileSync } from "node:fs";

const source = readFileSync("src/legacy/landing.tsx", "utf8");
const handoff = readFileSync("src/member-handoff.ts", "utf8");
const analytics = readFileSync("src/analytics.ts", "utf8");
const matrix = JSON.parse(readFileSync("evidence/cta-matrix.json", "utf8"));

const ids = [...source.matchAll(/data-cta-id=(?:`([^`]+)`|"([^"]+)")/g)]
  .map((match) => match[1] || match[2])
  .filter((id) => !id.includes("${"));
const sourceIds = new Set(ids);
const matrixIds = new Set(matrix.map((row) => row.id));

if (matrixIds.size !== matrix.length) throw new Error("funnel check failed: CTA matrix contains duplicate ids");
for (const id of sourceIds) if (!matrixIds.has(id)) throw new Error(`funnel check failed: ${id} missing from CTA matrix`);
for (const id of matrixIds) if (!sourceIds.has(id)) throw new Error(`funnel check failed: stale CTA matrix row ${id}`);

const requiredHandoffMarkers = ["VITE_MEMBER_APP_URL", "url.protocol !== \"https:\"", "utm_source", "utm_medium", "utm_campaign", "SAFE_ATTRIBUTION_VALUE", "fm_session", "getLandingSessionId"];
for (const marker of requiredHandoffMarkers) if (!handoff.includes(marker)) throw new Error(`funnel check failed: handoff missing ${marker}`);

const forbiddenAnalyticsMarkers = ["email", "display_name", "phone", "address", "ip_address"];
for (const marker of forbiddenAnalyticsMarkers) if (analytics.includes(`\"${marker}\"`)) throw new Error(`funnel check failed: analytics references forbidden field ${marker}`);
for (const marker of ["landing_impression", "member_handoff_started", "keepalive: true", "user_id: null"]) if (!analytics.includes(marker)) throw new Error(`funnel check failed: analytics missing ${marker}`);

console.log(`FinanceMeta funnel check passed: ${matrix.length} CTAs are inventoried; handoff and analytics contracts are bounded.`);

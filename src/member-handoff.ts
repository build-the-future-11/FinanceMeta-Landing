import { parsePublicMemberAppUrl } from "./member-handoff-policy.mjs";

const FALLBACK_JOIN_URL =
  "mailto:financeforalledu@gmail.com?subject=FinanceMeta%20-%20Get%20Involved";

export function getMemberHandoffUrl() {
  const configuredUrl = parsePublicMemberAppUrl(import.meta.env.VITE_MEMBER_APP_URL?.trim());
  if (!configuredUrl) return FALLBACK_JOIN_URL;

  configuredUrl.searchParams.set("utm_source", "financemeta_landing");
  configuredUrl.searchParams.set("utm_medium", "cta");
  configuredUrl.searchParams.set("utm_campaign", "member_handoff");
  return configuredUrl.toString();
}

export function hasConfiguredMemberHandoff() {
  return Boolean(parsePublicMemberAppUrl(import.meta.env.VITE_MEMBER_APP_URL?.trim()));
}

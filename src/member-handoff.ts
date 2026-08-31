const FALLBACK_JOIN_URL =
  "mailto:financeforalledu@gmail.com?subject=FinanceMeta%20-%20Get%20Involved";

function safeHttpsUrl(value: string | undefined) {
  if (!value) return null;

  try {
    const url = new URL(value);
    const isLocal = url.hostname === "localhost" || url.hostname === "127.0.0.1";
    if (url.protocol !== "https:" || isLocal) return null;
    return url;
  } catch {
    return null;
  }
}

export function getMemberHandoffUrl() {
  const configuredUrl = safeHttpsUrl(import.meta.env.VITE_MEMBER_APP_URL?.trim());
  if (!configuredUrl) return FALLBACK_JOIN_URL;

  configuredUrl.searchParams.set("utm_source", "financemeta_landing");
  configuredUrl.searchParams.set("utm_medium", "cta");
  configuredUrl.searchParams.set("utm_campaign", "member_handoff");
  return configuredUrl.toString();
}

export function hasConfiguredMemberHandoff() {
  return Boolean(safeHttpsUrl(import.meta.env.VITE_MEMBER_APP_URL?.trim()));
}

import { getLandingSessionId } from "./analytics";

const FALLBACK_JOIN_URL =
  "mailto:financeforalledu@gmail.com?subject=FinanceMeta%20-%20Get%20Involved";

const ATTRIBUTION_KEYS = [
  "utm_source",
  "utm_medium",
  "utm_campaign",
  "utm_content",
  "utm_term",
  "ref",
] as const;

const SAFE_ATTRIBUTION_VALUE = /^[a-zA-Z0-9._~+\- ]{1,100}$/;

function safeMemberAppUrl(value: string | undefined) {
  if (!value) return null;

  try {
    const url = new URL(value);
    const isLocal = url.hostname === "localhost" || url.hostname === "127.0.0.1";
    const allowedLocalDevelopmentUrl = import.meta.env.DEV && isLocal && url.protocol === "http:";
    if (url.protocol !== "https:" && !allowedLocalDevelopmentUrl) return null;
    return url;
  } catch {
    return null;
  }
}

export function getMemberAppBaseUrl() {
  const configuredUrl = safeMemberAppUrl(import.meta.env.VITE_MEMBER_APP_URL?.trim());
  if (configuredUrl) return configuredUrl.href.replace(/\/$/, "");
  // Supabase redirect allowlists distinguish localhost from 127.0.0.1. The
  // documented FinanceMeta callback uses localhost, so keep every local CTA on
  // that exact origin instead of falling back to the shared project's Site URL.
  return import.meta.env.DEV ? "http://localhost:8080" : null;
}

function withAttribution(url: URL) {
  const currentQuery =
    typeof window === "undefined" ? new URLSearchParams() : new URLSearchParams(window.location.search);

  for (const key of ATTRIBUTION_KEYS) {
    const value = currentQuery.get(key)?.trim();
    if (value && SAFE_ATTRIBUTION_VALUE.test(value)) url.searchParams.set(key, value);
  }
  url.searchParams.set("fm_session", getLandingSessionId());
  return url;
}

export function getMemberHandoffUrl(path = "/signup") {
  const baseUrl = getMemberAppBaseUrl();
  if (!baseUrl) return FALLBACK_JOIN_URL;

  const handoffUrl = new URL(path, `${baseUrl}/`);
  handoffUrl.searchParams.set("utm_source", "financemeta_landing");
  handoffUrl.searchParams.set("utm_medium", "cta");
  handoffUrl.searchParams.set("utm_campaign", "member_handoff");
  return withAttribution(handoffUrl).toString();
}

export function getMemberPublicUrl(path: string, fallbackHash: string) {
  const baseUrl = getMemberAppBaseUrl();
  return baseUrl ? withAttribution(new URL(path, `${baseUrl}/`)).toString() : fallbackHash;
}

export function hasConfiguredMemberHandoff() {
  return Boolean(safeMemberAppUrl(import.meta.env.VITE_MEMBER_APP_URL?.trim()));
}

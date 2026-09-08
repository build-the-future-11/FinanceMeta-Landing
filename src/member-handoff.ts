const FINANCEMETA_APPLICATION_URL = "https://tally.so/r/5B7blP";
const FINANCEMETA_MEMBER_ORIGIN = "https://finance4all-global-reach.vercel.app";
const FINANCEMETA_MEMBER_PATH = "/login";

function safeMemberUrl(value: string | undefined) {
  if (!value) return null;

  try {
    const url = new URL(value);
    if (
      url.origin !== FINANCEMETA_MEMBER_ORIGIN ||
      url.pathname !== FINANCEMETA_MEMBER_PATH ||
      url.username ||
      url.password ||
      url.hash
    ) {
      return null;
    }
    return url;
  } catch {
    return null;
  }
}

export function getMemberHandoffUrl() {
  const configuredUrl = safeMemberUrl(import.meta.env.VITE_MEMBER_APP_URL?.trim());
  if (!configuredUrl) return FINANCEMETA_APPLICATION_URL;

  configuredUrl.searchParams.set("utm_source", "financemeta_landing");
  configuredUrl.searchParams.set("utm_medium", "cta");
  configuredUrl.searchParams.set("utm_campaign", "member_handoff");
  return configuredUrl.toString();
}

export function hasConfiguredMemberHandoff() {
  return Boolean(safeMemberUrl(import.meta.env.VITE_MEMBER_APP_URL?.trim()));
}

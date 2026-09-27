export type LandingEventName = "landing_impression" | "landing_cta" | "member_handoff_started";

type LandingEventProperties = {
  action: string;
  surface: string;
  destination?: string;
};

const SAFE_VALUE = /^[a-zA-Z0-9_./:#?=&+\-]{1,100}$/;
const SESSION_KEY = "financemeta-landing-session";

function safeHttpsUrl(value: string | undefined) {
  if (!value) return null;
  try {
    const url = new URL(value);
    const isLocal = ["localhost", "127.0.0.1"].includes(url.hostname);
    if (url.protocol !== "https:" && !(import.meta.env.DEV && isLocal && url.protocol === "http:")) return null;
    return url.href.replace(/\/$/, "");
  } catch {
    return null;
  }
}

export function getLandingSessionId() {
  try {
    const existing = window.sessionStorage.getItem(SESSION_KEY);
    if (existing) return existing;
    const created = crypto.randomUUID();
    window.sessionStorage.setItem(SESSION_KEY, created);
    return created;
  } catch {
    return crypto.randomUUID();
  }
}

function safeAttribution() {
  const query = new URLSearchParams(window.location.search);
  const read = (key: string) => {
    const value = query.get(key)?.trim();
    return value && SAFE_VALUE.test(value) ? value : null;
  };
  return {
    source: read("utm_source"),
    medium: read("utm_medium"),
    campaign: read("utm_campaign"),
  };
}

export function trackLandingEvent(eventName: LandingEventName, properties: LandingEventProperties) {
  const safeProperties = Object.fromEntries(
    Object.entries(properties)
      .filter(([, value]) => typeof value === "string" && SAFE_VALUE.test(value))
      .map(([key, value]) => [key, value.slice(0, 100)]),
  );
  const detail = { eventName, properties: safeProperties };

  window.dispatchEvent(new CustomEvent("financemeta:analytics", { detail }));

  const supabaseUrl = safeHttpsUrl(import.meta.env.VITE_SUPABASE_URL?.trim());
  const publicKey = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY?.trim();
  if (!supabaseUrl || !publicKey) return;

  void fetch(`${supabaseUrl}/rest/v1/analytics_events`, {
    method: "POST",
    keepalive: true,
    headers: {
      apikey: publicKey,
      Authorization: `Bearer ${publicKey}`,
      "Content-Type": "application/json",
      Prefer: "return=minimal",
    },
    body: JSON.stringify({
      event_name: eventName,
      anonymous_session_id: getLandingSessionId(),
      user_id: null,
      ...safeAttribution(),
      properties: safeProperties,
    }),
  }).catch(() => {
    // Analytics must never block navigation or expose visitor data in logs.
  });
}

/** Navigation only. This is not an SSRF guard or a verification of the destination. */
export function publicHttpsUrl(value: string | undefined): URL | null {
  if (!value?.trim()) return null;
  try {
    const url = new URL(value.trim());
    const host = url.hostname.toLowerCase().replace(/\.$/, "");
    if (url.protocol !== "https:" || url.username || url.password || url.port) return null;
    // Public editorial links use DNS names, never IP literals or local hostnames.
    if (!host.includes(".") || host.includes(":") || /^[\d.]+$/.test(host)) return null;
    if (["localhost", "local", "internal", "test", "invalid", "example"].some(
      (suffix) => host === suffix || host.endsWith(`.${suffix}`),
    )) return null;
    return url;
  } catch {
    return null;
  }
}

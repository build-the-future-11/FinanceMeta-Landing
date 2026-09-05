const normalizeHostname = (hostname) =>
  hostname.toLowerCase().replace(/^\[(.*)\]$/, '$1').replace(/\.+$/, '');

const isIpv4Literal = (hostname) => {
  const parts = hostname.split('.');
  if (parts.length !== 4 || parts.some((part) => !/^\d{1,3}$/.test(part))) return false;
  return parts.every((part) => Number(part) >= 0 && Number(part) <= 255);
};

export const isNonPublicMemberHostname = (hostname) => {
  const normalized = normalizeHostname(String(hostname ?? '').trim());
  return (
    !normalized ||
    normalized.includes(':') ||
    isIpv4Literal(normalized) ||
    normalized === 'localhost' ||
    normalized.endsWith('.localhost') ||
    normalized.endsWith('.local') ||
    !normalized.includes('.')
  );
};

export const parsePublicMemberAppUrl = (rawValue) => {
  const value = String(rawValue ?? '').trim();
  if (!value) return null;

  try {
    const url = new URL(value);
    if (
      url.protocol !== 'https:' ||
      isNonPublicMemberHostname(url.hostname) ||
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
};

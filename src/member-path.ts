const MEMBER_PATH_BASE = 'https://member.invalid/';

 /**
 * Accept only same-origin member-app paths. Absolute URLs, protocol-relative
 * paths and backslash forms are rejected before they can reach URL().
 */
export function safeMemberRelativePath(path: string): string | null {
  if (!path.startsWith('/') || path.startsWith('//') || path.includes('\\')) return null;

  try {
    const candidate = new URL(path, MEMBER_PATH_BASE);
    if (candidate.origin !== new URL(MEMBER_PATH_BASE).origin) return null;
    return `${candidate.pathname}${candidate.search}${candidate.hash}`;
  } catch {
    return null;
  }
}

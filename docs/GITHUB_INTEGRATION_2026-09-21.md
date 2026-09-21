# GitHub integration — 2026-09-21

The public rebuild is based on FinanceMeta-Landing main at 9c407834fa7a023a6b867be4738e051fc57e168b. The independent member application is unchanged.

Preserved the remote immutable-action pins, release revision writer, production monitoring, and patched selector-parser override. Updated the runtime to 22.23.2, the live metadata contract for the new PNG card and content-security policy, and made route manifests deterministic. Security regression coverage now checks every nested selector-parser lockfile entry.

Validation: the combined release gate passes 36 tests; npm audit reports zero vulnerabilities. The prior UI verification limitation remains: final rendered browser checks were blocked by browser security policy. A GitHub push is not production certification.

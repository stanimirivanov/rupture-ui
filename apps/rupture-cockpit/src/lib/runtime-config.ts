/**
 * Base URL for the Rupture API. In development the mock server runs on
 * port 4301; the build falls back to a same-origin `/api` prefix, which is
 * the production posture stated in docs/architecture.md. Never place
 * credentials here; this is a public browser-visible value.
 */
export const API_BASE_URL =
  import.meta.env['VITE_API_BASE_URL'] ?? 'http://localhost:4301/api';

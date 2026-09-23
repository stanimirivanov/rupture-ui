/**
 * Reads a CSS custom property from the document root and returns the
 * trimmed value. Falls back to `fallback` in non-browser environments and
 * when the property is unset, so callers can render deterministically.
 *
 * The 3D scene uses this instead of a hard-coded palette so that the
 * severity and ink tokens stay defined in one place. The values are read
 * once at component mount; a live theme change requires a remount, which
 * the cockpit does not currently support.
 */
export function readCssColor(name: string, fallback: string): string {
  if (typeof document === 'undefined') return fallback;
  const value = getComputedStyle(document.documentElement)
    .getPropertyValue(name)
    .trim();
  return value || fallback;
}

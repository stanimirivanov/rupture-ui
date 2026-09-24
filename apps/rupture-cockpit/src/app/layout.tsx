import { Link, NavLink, Outlet } from 'react-router';

const NAV_LINK_BASE =
  'rounded-sm border-b-2 px-3 py-2 text-sm font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-canvas';

const navLinkClassName = ({ isActive }: { isActive: boolean }): string =>
  isActive
    ? `${NAV_LINK_BASE} border-accent text-ink`
    : `${NAV_LINK_BASE} border-transparent text-ink-muted hover:text-ink`;

export function CockpitLayout() {
  return (
    <div className="flex h-screen flex-col overflow-hidden">
      <a
        href="#main-content"
        className="sr-only z-50 rounded-md bg-ink px-4 py-2 text-black focus:not-sr-only focus:fixed focus:left-4 focus:top-4"
      >
        Skip to main content
      </a>

      <header className="shrink-0 border-b border-border/80 bg-surface/70 backdrop-blur-md">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-x-6 gap-y-2 px-6 py-4 lg:px-10">
          <Link
            className="flex items-center gap-3"
            to="/"
            aria-label="Rupture home"
          >
            <span
              aria-hidden="true"
              className="grid size-10 place-items-center rounded-xl bg-ink font-display text-xl font-bold text-black"
            >
              R
            </span>
            <span>
              <span className="block text-sm font-bold tracking-[0.16em] uppercase">
                Rupture
              </span>
              <span className="block text-xs text-ink-muted">
                Chaos cockpit
              </span>
            </span>
          </Link>

          <div className="flex flex-wrap items-center gap-x-6 gap-y-2">
            <nav aria-label="Primary" className="flex items-center gap-1">
              <NavLink to="/agent" className={navLinkClassName}>
                Agent
              </NavLink>
              <NavLink to="/topology" className={navLinkClassName}>
                Topology
              </NavLink>
            </nav>
            <span className="rounded-full border border-accent/30 bg-accent/10 px-3 py-1.5 text-xs font-bold tracking-wide text-accent-strong uppercase">
              Foundation
            </span>
          </div>
        </div>
      </header>

      {/* Scrollable content region. `min-h-0` lets this flex item shrink
          below its content size; `flex-1` makes it take the remaining
          height. Each route decides whether to scroll internally or to
          fill the region. */}
      <div className="min-h-0 flex-1">
        <Outlet />
      </div>

      <footer className="shrink-0 border-t border-border/80">
        <div className="mx-auto flex max-w-7xl flex-col gap-2 px-6 py-4 text-xs text-ink-muted sm:flex-row sm:items-center sm:justify-between lg:px-10">
          <p>Rupture resilience engineering.</p>
          <p>M02 · Topology canvas</p>
        </div>
      </footer>
    </div>
  );
}

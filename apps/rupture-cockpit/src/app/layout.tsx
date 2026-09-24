import { Link, NavLink, Outlet } from 'react-router';

export function CockpitLayout() {
  return (
    <div className="flex min-h-screen flex-col">
      <a
        href="#main-content"
        className="sr-only z-50 rounded-md bg-ink px-4 py-2 text-black focus:not-sr-only focus:fixed focus:left-4 focus:top-4"
      >
        Skip to main content
      </a>

      <header className="border-b border-border/80 bg-surface/70 backdrop-blur-md">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5 lg:px-10">
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

          <div className="flex items-center gap-6">
            <nav aria-label="Primary" className="flex items-center gap-6">
              <NavLink
                to="/agent"
                className={({ isActive }) =>
                  isActive
                    ? 'text-sm font-semibold text-ink'
                    : 'text-sm font-semibold text-ink-muted hover:text-ink'
                }
              >
                Agent
              </NavLink>
              <NavLink
                to="/topology"
                className={({ isActive }) =>
                  isActive
                    ? 'text-sm font-semibold text-ink'
                    : 'text-sm font-semibold text-ink-muted hover:text-ink'
                }
              >
                Topology
              </NavLink>
            </nav>
            <span className="rounded-full border border-accent/30 bg-accent/10 px-3 py-1.5 text-xs font-bold tracking-wide text-accent-strong uppercase">
              Foundation
            </span>
          </div>
        </div>
      </header>

      <div className="flex flex-1 flex-col">
        <Outlet />
      </div>

      <footer className="mx-auto flex w-full max-w-7xl flex-col gap-2 px-6 py-8 text-xs text-ink-muted sm:flex-row sm:items-center sm:justify-between lg:px-10">
        <p>Rupture resilience engineering.</p>
        <p>M02 · Topology canvas</p>
      </footer>
    </div>
  );
}

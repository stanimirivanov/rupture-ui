import { AutonomyDial } from './autonomy-dial';
import { HypothesisFeed } from './hypothesis-feed';

export function AgentRoute() {
  return (
    <main
      id="main-content"
      tabIndex={0}
      className="h-full overflow-y-auto [scrollbar-gutter:stable] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-accent"
    >
      <header className="border-b border-border/80 px-6 py-5 lg:px-10">
        <p className="text-xs font-bold tracking-[0.18em] text-accent-strong uppercase">
          M03 · Agentic proposals
        </p>
        <h1 className="mt-2 font-display text-3xl tracking-tight">
          Proposed experiments
        </h1>
        <p className="mt-1 text-sm text-ink-muted">
          Hypotheses the agent generated from telemetry. Review only; approval
          arrives in a later slice.
        </p>
      </header>
      <div className="mx-auto grid max-w-6xl gap-8 px-6 py-8 lg:grid-cols-[1fr_20rem] lg:px-10">
        <HypothesisFeed />
        <aside aria-label="Autonomy">
          <AutonomyDial />
        </aside>
      </div>
    </main>
  );
}

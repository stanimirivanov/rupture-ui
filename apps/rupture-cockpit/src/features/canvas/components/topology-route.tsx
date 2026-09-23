import { TopologyCanvas } from './topology-canvas';

export function TopologyRoute() {
  return (
    <main id="main-content" className="flex flex-1 flex-col overflow-hidden">
      <header className="border-b border-border/80 px-6 py-5 lg:px-10">
        <p className="text-xs font-bold tracking-[0.18em] text-accent-strong uppercase">
          M02 · Topology canvas
        </p>
        <h1 className="mt-2 font-display text-3xl tracking-tight">
          System topology
        </h1>
        <p className="mt-1 text-sm text-ink-muted">
          Read-only view. Nozzle placement and dials arrive in the next slice.
        </p>
      </header>
      <div className="min-h-0 flex-1">
        <TopologyCanvas />
      </div>
    </main>
  );
}

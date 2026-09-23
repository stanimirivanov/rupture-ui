import { useAtomValue } from '@effect-atom/atom-react';
import { lazy, Suspense } from 'react';

import { viewModeAtom } from '../../spatial/atoms/view-mode';
import { ViewModeToggle } from '../../spatial/components/view-mode-toggle';
import { TopologyCanvas } from './topology-canvas';

const SpatialView = lazy(() =>
  import('../../spatial/components/spatial-view').then((module) => ({
    default: module.SpatialView,
  })),
);

export function TopologyRoute() {
  const viewMode = useAtomValue(viewModeAtom);

  return (
    <main id="main-content" className="flex flex-1 flex-col overflow-hidden">
      <header className="flex flex-wrap items-start justify-between gap-4 border-b border-border/80 px-6 py-5 lg:px-10">
        <div>
          <p className="text-xs font-bold tracking-[0.18em] text-accent-strong uppercase">
            M02 · Topology canvas
          </p>
          <h1 className="mt-2 font-display text-3xl tracking-tight">
            System topology
          </h1>
          <p className="mt-1 text-sm text-ink-muted">
            Discovered services and their connections.
          </p>
        </div>
        <ViewModeToggle />
      </header>
      <div className="min-h-0 flex-1">
        {viewMode === '2d' ? (
          <TopologyCanvas />
        ) : (
          <Suspense
            fallback={
              <div
                role="status"
                className="grid h-full place-items-center text-sm text-ink-muted"
              >
                Loading 3D view…
              </div>
            }
          >
            <SpatialView />
          </Suspense>
        )}
      </div>
    </main>
  );
}

import { useAtomValue } from '@effect-atom/atom-react';
import { lazy, Suspense, useMemo } from 'react';

import {
  selectedHypothesisAtom,
  useClearHypothesisSelection,
} from '../../agent/atoms/selection';
import { viewModeAtom } from '../../spatial/atoms/view-mode';
import { ViewModeToggle } from '../../spatial/components/view-mode-toggle';
import { BlastRadiusBanner } from './blast-radius-banner';
import { TopologyCanvas, type BlastRadius } from './topology-canvas';

const SpatialView = lazy(() =>
  import('../../spatial/components/spatial-view').then((module) => ({
    default: module.SpatialView,
  })),
);

export function TopologyRoute() {
  const viewMode = useAtomValue(viewModeAtom);
  const selectedHypothesis = useAtomValue(selectedHypothesisAtom);
  const clearSelection = useClearHypothesisSelection();

  const blastRadius = useMemo<BlastRadius | null>(() => {
    if (!selectedHypothesis) return null;
    return {
      serviceIds: new Set(selectedHypothesis.blastRadius.serviceIds),
      connectionIds: new Set(selectedHypothesis.blastRadius.connectionIds),
    };
  }, [selectedHypothesis]);

  return (
    <main id="main-content" className="flex h-full flex-col overflow-hidden">
      <header className="flex shrink-0 flex-wrap items-start justify-between gap-4 border-b border-border/80 px-6 py-5 lg:px-10">
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

      {selectedHypothesis && blastRadius ? (
        <div className="border-b border-border/80 px-6 py-3 lg:px-10">
          <BlastRadiusBanner
            hypothesis={selectedHypothesis}
            onClear={clearSelection}
          />
        </div>
      ) : null}

      <div className="relative min-h-0 flex-1">
        {viewMode === '2d' ? (
          <TopologyCanvas blastRadius={blastRadius} />
        ) : (
          <Suspense
            fallback={
              <div className="grid h-full place-items-center text-sm text-ink-muted">
                Loading 3D view…
              </div>
            }
          >
            <div className="absolute inset-0">
              <SpatialView />
            </div>
          </Suspense>
        )}
      </div>
    </main>
  );
}

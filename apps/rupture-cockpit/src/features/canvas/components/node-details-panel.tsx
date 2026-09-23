import { useEffect, useRef } from 'react';

import type { ServiceFixture } from '../fixtures/topology';

export interface NodeDetailsPanelProps {
  readonly service: ServiceFixture;
  readonly onClose: () => void;
}

export function NodeDetailsPanel({ service, onClose }: NodeDetailsPanelProps) {
  const closeRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    closeRef.current?.focus();
  }, []);

  return (
    <aside
      data-node-panel
      aria-label={`${service.label} details`}
      className="absolute right-4 top-4 w-72 rounded-xl border border-border bg-surface-strong/95 p-5 shadow-lg backdrop-blur"
    >
      <h2 className="font-display text-lg tracking-tight">{service.label}</h2>
      <dl className="mt-3 space-y-2 text-sm">
        <div className="flex justify-between gap-4">
          <dt className="text-ink-muted">Kind</dt>
          <dd className="font-semibold">{service.kind}</dd>
        </div>
        <div className="flex justify-between gap-4">
          <dt className="text-ink-muted">Tier</dt>
          <dd className="font-semibold">{service.tier}</dd>
        </div>
      </dl>
      <button
        ref={closeRef}
        type="button"
        onClick={onClose}
        className="mt-5 w-full rounded-full border border-border bg-surface px-4 py-2 text-sm font-semibold text-ink hover:bg-surface-strong focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
      >
        Close
      </button>
    </aside>
  );
}

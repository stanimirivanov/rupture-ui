import { useAtom, useAtomValue } from '@effect-atom/atom-react';
import { useMemo } from 'react';

import { Slider } from '@rupture/ui-web';

import {
  CRITICAL_THRESHOLD,
  DIAL_DEFAULT,
  DIAL_MAX,
  DIAL_MIN,
  DIAL_STEP,
  WARNING_THRESHOLD,
  dialValuesAtom,
  edgeSeverityAtom,
  withDialValue,
  type Severity,
} from '../atoms/dials';
import {
  NOZZLE_KIND_LABELS,
  edgeDescriptorsAtom,
  nozzlesAtom,
  selectedNozzleIdAtom,
  type Nozzle,
} from '../atoms/nozzles';

const SEVERITY_LABELS: Readonly<Record<Severity, string>> = {
  ok: 'Normal',
  warning: 'Degraded',
  critical: 'Critical',
};

export function NozzleList() {
  const nozzles = useAtomValue(nozzlesAtom);
  const edgeDescriptors = useAtomValue(edgeDescriptorsAtom);
  const severities = useAtomValue(edgeSeverityAtom);
  const [dialValues, setDialValues] = useAtom(dialValuesAtom);
  const [selectedId, setSelectedId] = useAtom(selectedNozzleIdAtom);

  const edgeLabels = useMemo(() => {
    const map = new Map<string, string>();
    for (const edge of edgeDescriptors) map.set(edge.id, edge.label);
    return map;
  }, [edgeDescriptors]);

  if (nozzles.length === 0) {
    return (
      <section aria-label="Placed nozzles">
        <h2 className="font-display text-sm tracking-tight">Placed nozzles</h2>
        <p className="mt-2 text-xs text-ink-muted">
          None yet. Place one from the palette above.
        </p>
      </section>
    );
  }

  return (
    <section aria-label="Placed nozzles">
      <h2 className="font-display text-sm tracking-tight">Placed nozzles</h2>
      <ul className="mt-3 space-y-2">
        {nozzles.map((nozzle) => {
          const edgeLabel = edgeLabels.get(nozzle.edgeId) ?? nozzle.edgeId;
          const severity = severities.get(nozzle.edgeId) ?? 'ok';
          const value = dialValues.get(nozzle.id) ?? DIAL_DEFAULT;
          const isExpanded = selectedId === nozzle.id;

          return (
            <li key={nozzle.id}>
              <NozzleListItem
                nozzle={nozzle}
                edgeLabel={edgeLabel}
                severity={severity}
                value={value}
                isExpanded={isExpanded}
                onToggle={() => setSelectedId(isExpanded ? null : nozzle.id)}
                onValueChange={(next) =>
                  setDialValues((current) =>
                    withDialValue(current, nozzle.id, next),
                  )
                }
              />
            </li>
          );
        })}
      </ul>
    </section>
  );
}

interface NozzleListItemProps {
  readonly nozzle: Nozzle;
  readonly edgeLabel: string;
  readonly severity: Severity;
  readonly value: number;
  readonly isExpanded: boolean;
  readonly onToggle: () => void;
  readonly onValueChange: (value: number) => void;
}

function NozzleListItem({
  nozzle,
  edgeLabel,
  severity,
  value,
  isExpanded,
  onToggle,
  onValueChange,
}: NozzleListItemProps) {
  const toggleId = `nozzle-toggle-${nozzle.id}`;
  const panelId = `nozzle-dial-${nozzle.id}`;
  const sliderId = `${panelId}-slider`;

  return (
    <div className="rounded-md border border-border bg-surface">
      <button
        type="button"
        id={toggleId}
        aria-expanded={isExpanded}
        aria-controls={panelId}
        onClick={onToggle}
        className="w-full px-3 py-2 text-left text-xs text-ink hover:bg-surface-strong focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
      >
        <span className="block font-semibold">
          {NOZZLE_KIND_LABELS[nozzle.kind]}
        </span>
        <span className="mt-0.5 block text-ink-muted">{edgeLabel}</span>
        <span className="mt-1 block text-ink-muted">
          {SEVERITY_LABELS[severity]}
        </span>
      </button>

      {isExpanded ? (
        <div
          id={panelId}
          role="region"
          aria-labelledby={toggleId}
          className="border-t border-border px-3 py-3"
        >
          <label
            htmlFor={sliderId}
            className="flex items-center justify-between text-xs text-ink-muted"
          >
            <span>Strength</span>
            <span className="font-semibold text-ink">{value}%</span>
          </label>
          <Slider
            id={sliderId}
            className="mt-2"
            value={value}
            valueText={`${value} percent`}
            min={DIAL_MIN}
            max={DIAL_MAX}
            step={DIAL_STEP}
            onValueChange={onValueChange}
          />
          <p className="mt-2 text-[10px] leading-4 text-ink-muted">
            Warning at {WARNING_THRESHOLD}%, critical at {CRITICAL_THRESHOLD}%.
          </p>
        </div>
      ) : null}
    </div>
  );
}

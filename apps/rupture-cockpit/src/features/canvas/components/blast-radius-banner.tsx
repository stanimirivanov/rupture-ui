import type { Hypothesis, NozzleKind } from '../../agent/schema/hypothesis';

const KIND_LABELS: Readonly<Record<NozzleKind, string>> = {
  latency: 'Latency Injector',
  'packet-drop': 'Packet Dropper',
  cpu: 'CPU Thrasher',
};

export interface BlastRadiusBannerProps {
  readonly hypothesis: Hypothesis;
  readonly onClear: () => void;
}

export function BlastRadiusBanner({
  hypothesis,
  onClear,
}: BlastRadiusBannerProps) {
  return (
    <section
      aria-labelledby="blast-radius-banner-title"
      className="flex flex-wrap items-center justify-between gap-3 rounded-lg border border-accent/40 bg-accent/10 px-4 py-2"
    >
      <p id="blast-radius-banner-title" className="text-xs leading-5 text-ink">
        <span className="font-bold tracking-wide uppercase text-accent-strong">
          Blast radius preview ·{' '}
        </span>
        {KIND_LABELS[hypothesis.kind]} ·{' '}
        {hypothesis.blastRadius.serviceIds.length} services,{' '}
        {hypothesis.blastRadius.connectionIds.length} connections
      </p>
      <button
        type="button"
        onClick={onClear}
        className="rounded-full border border-border bg-surface px-3 py-1 text-xs font-semibold text-ink transition-colors hover:bg-surface-strong focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-surface"
      >
        Clear
      </button>
    </section>
  );
}

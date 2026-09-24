import type { Hypothesis, NozzleKind } from '../schema/hypothesis';

const KIND_LABELS: Readonly<Record<NozzleKind, string>> = {
  latency: 'Latency Injector',
  'packet-drop': 'Packet Dropper',
  cpu: 'CPU Thrasher',
};

export interface HypothesisCardProps {
  readonly hypothesis: Hypothesis;
  /**
   * Human label for the hypothesis' target edge, resolved against the
   * current topology. Falls back to the raw id when the edge is unknown.
   */
  readonly edgeLabel: string;
}

export function HypothesisCard({ hypothesis, edgeLabel }: HypothesisCardProps) {
  const kindLabel = KIND_LABELS[hypothesis.kind];
  const confidencePercent = Math.round(hypothesis.confidence * 100);

  return (
    <article
      aria-labelledby={`${hypothesis.id}-title`}
      className="rounded-xl border border-border bg-surface p-5"
    >
      <header className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-xs font-bold tracking-[0.16em] text-accent-strong uppercase">
            {kindLabel}
          </p>
          <h2
            id={`${hypothesis.id}-title`}
            className="mt-1 font-display text-lg tracking-tight"
          >
            {kindLabel} on {edgeLabel}
          </h2>
          <p className="mt-1 text-xs text-ink-muted">
            Proposed strength: {hypothesis.proposedStrength}%
          </p>
        </div>
        <div className="min-w-[8rem]">
          <p className="text-right text-xs text-ink-muted">
            Confidence {confidencePercent}%
          </p>
          <div
            role="meter"
            aria-valuenow={confidencePercent}
            aria-valuemin={0}
            aria-valuemax={100}
            aria-label={`Confidence ${confidencePercent} percent`}
            className="mt-1 h-2 w-full overflow-hidden rounded-full bg-surface-strong"
          >
            <div
              className="h-full rounded-full bg-accent"
              style={{ width: `${confidencePercent}%` }}
            />
          </div>
        </div>
      </header>

      <section className="mt-5">
        <h3
          id={`${hypothesis.id}-reasoning`}
          className="text-xs font-bold tracking-wide text-ink-muted uppercase"
        >
          Reasoning
        </h3>
        <ol
          aria-labelledby={`${hypothesis.id}-reasoning`}
          className="mt-2 space-y-2 pl-5 text-sm leading-6 text-ink"
        >
          {hypothesis.reasoning.map((step) => (
            <li key={step.id} className="list-decimal">
              {step.text}
              {step.evidence ? (
                <span className="ml-2 font-mono text-xs text-ink-muted">
                  {step.evidence}
                </span>
              ) : null}
            </li>
          ))}
        </ol>
      </section>

      <section className="mt-5">
        <h3
          id={`${hypothesis.id}-blast`}
          className="text-xs font-bold tracking-wide text-ink-muted uppercase"
        >
          Blast radius
        </h3>
        <ul
          aria-labelledby={`${hypothesis.id}-blast`}
          className="mt-2 flex flex-wrap gap-2"
        >
          {hypothesis.blastRadius.serviceIds.map((serviceId) => (
            <li
              key={`s-${serviceId}`}
              className="rounded-full border border-border bg-surface-strong px-3 py-1 text-xs text-ink"
            >
              service: {serviceId}
            </li>
          ))}
          {hypothesis.blastRadius.connectionIds.map((connectionId) => (
            <li
              key={`c-${connectionId}`}
              className="rounded-full border border-border bg-surface-strong px-3 py-1 text-xs text-ink"
            >
              connection: {connectionId}
            </li>
          ))}
        </ul>
      </section>
    </article>
  );
}

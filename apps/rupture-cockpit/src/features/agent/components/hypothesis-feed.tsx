import { useAtomValue } from '@effect-atom/atom-react';
import { useMemo } from 'react';

import { laidOutTopologyAtom } from '../../canvas/atoms/topology';
import { hypothesesAtom } from '../atoms/hypotheses';
import { HypothesisCard } from './hypothesis-card';

export function HypothesisFeed() {
  const result = useAtomValue(hypothesesAtom);
  const layout = useAtomValue(laidOutTopologyAtom);

  const edgeLabels = useMemo(() => {
    const byServiceId = new Map(
      layout.nodes.map((node) => [node.service.id, node.service.label]),
    );
    const map = new Map<string, string>();
    for (const { connection } of layout.edges) {
      const source = byServiceId.get(connection.source) ?? connection.source;
      const target = byServiceId.get(connection.target) ?? connection.target;
      map.set(connection.id, `${source} to ${target}`);
    }
    return map;
  }, [layout]);

  if (result.kind === 'invalid-message') {
    return (
      <div
        role="alert"
        className="rounded-xl border border-severity-critical/40 bg-surface-strong p-6"
      >
        <h2 className="font-display text-lg tracking-tight">
          Agent proposals could not be read.
        </h2>
        <p className="mt-2 text-sm leading-6 text-ink-muted">
          The response did not match the expected shape. This is a client-side
          decode failure, not an authorization or availability problem.
        </p>
        <p className="mt-3 font-mono text-xs text-ink-muted break-all">
          {result.message}
        </p>
      </div>
    );
  }

  if (result.hypotheses.length === 0) {
    return (
      <p className="rounded-xl border border-dashed border-border bg-surface p-8 text-center text-sm text-ink-muted">
        The agent has not proposed any experiments yet.
      </p>
    );
  }

  return (
    <ul className="space-y-4">
      {result.hypotheses.map((hypothesis) => (
        <li key={hypothesis.id}>
          <HypothesisCard
            hypothesis={hypothesis}
            edgeLabel={edgeLabels.get(hypothesis.edgeId) ?? hypothesis.edgeId}
          />
        </li>
      ))}
    </ul>
  );
}

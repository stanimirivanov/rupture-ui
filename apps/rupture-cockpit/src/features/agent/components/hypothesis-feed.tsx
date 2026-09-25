import { useAtomSet, useAtomValue } from '@effect-atom/atom-react';
import * as Effect from 'effect/Effect';
import { useEffect, useMemo, useState } from 'react';

import { laidOutTopologyAtom } from '../../canvas/atoms/topology';
import { autonomyModeAtom } from '../atoms/autonomy';
import {
  useHypothesisAction,
  useHypothesisActionRunner,
} from '../atoms/hypothesis-actions';
import {
  hypothesesAtom,
  hypothesesFetchTriggerAtom,
} from '../atoms/hypotheses';
import { selectedHypothesisIdAtom } from '../atoms/selection';
import { fetchHypotheses } from '../effects/fetch-hypotheses';
import type { Hypothesis } from '../schema/hypothesis';
import { EditStrengthDialog } from './edit-strength-dialog';
import { HypothesisCard } from './hypothesis-card';

export function HypothesisFeed() {
  // Atom reads. All hooks run before any conditional return so the hook
  // order is stable across renders.
  const result = useAtomValue(hypothesesAtom);
  const layout = useAtomValue(laidOutTopologyAtom);
  const mode = useAtomValue(autonomyModeAtom);
  const trigger = useAtomValue(hypothesesFetchTriggerAtom);

  const setSelectedId = useAtomSet(selectedHypothesisIdAtom);
  const setHypotheses = useAtomSet(hypothesesAtom);

  const act = useHypothesisAction();
  useHypothesisActionRunner();

  const [editTarget, setEditTarget] = useState<Hypothesis | null>(null);

  // Fetch on mount and whenever the trigger increments. The fetch is an
  // Effect program; the component runs it and writes the result to the
  // atom. This keeps the atom synchronous (it only stores state) while
  // the async boundary lives in Effect, per ADR 0002.
  useEffect(() => {
    let cancelled = false;
    void Effect.runPromise(fetchHypotheses).then((next) => {
      if (!cancelled) setHypotheses(next);
    });
    return () => {
      cancelled = true;
    };
  }, [trigger, setHypotheses]);

  // Edge label lookup. Pure derivation from the canvas layout.
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

  if (result.kind === 'loading') {
    return (
      <p role="status" className="text-sm text-ink-muted">
        Loading agent proposals…
      </p>
    );
  }

  if (result.kind === 'authorization') {
    return (
      <div
        role="alert"
        className="rounded-xl border border-severity-warning/40 bg-surface-strong p-6"
      >
        <h2 className="font-display text-lg tracking-tight">
          Agent proposals are not available.
        </h2>
        <p className="mt-2 text-sm leading-6 text-ink-muted">
          {result.message}
        </p>
      </div>
    );
  }

  if (result.kind === 'network') {
    return (
      <div
        role="alert"
        className="rounded-xl border border-severity-critical/40 bg-surface-strong p-6"
      >
        <h2 className="font-display text-lg tracking-tight">
          The agent service could not be reached.
        </h2>
        <p className="mt-2 text-sm leading-6 text-ink-muted">
          {result.message}
        </p>
      </div>
    );
  }

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
    <>
      <ul className="space-y-4">
        {result.hypotheses.map((hypothesis) => (
          <li key={hypothesis.id}>
            <HypothesisCard
              hypothesis={hypothesis}
              edgeLabel={edgeLabels.get(hypothesis.edgeId) ?? hypothesis.edgeId}
              mode={mode}
              onSelect={setSelectedId}
              onEdit={setEditTarget}
            />
          </li>
        ))}
      </ul>

      {editTarget ? (
        <EditStrengthDialog
          hypothesis={editTarget}
          onSubmit={(strength) => {
            act({
              hypothesisId: editTarget.id,
              kind: 'edit',
              proposedStrength: strength,
            });
            setEditTarget(null);
          }}
          onClose={() => setEditTarget(null)}
        />
      ) : null}
    </>
  );
}

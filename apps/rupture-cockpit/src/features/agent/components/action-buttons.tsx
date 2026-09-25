import { Link } from 'react-router';

import type { AutonomyMode } from '../atoms/autonomy';
import {
  useHypothesisAction,
  useHypothesisActionState,
} from '../atoms/hypothesis-actions';
import type { Hypothesis } from '../schema/hypothesis';
import { useAtomSet } from '@effect-atom/atom-react';
import { selectedHypothesisIdAtom } from '../atoms/selection';

export interface ActionButtonsProps {
  readonly hypothesis: Hypothesis;
  readonly mode: AutonomyMode;
  readonly onEdit: (hypothesis: Hypothesis) => void;
}

export function ActionButtons({
  hypothesis,
  mode,
  onEdit,
}: ActionButtonsProps) {
  const act = useHypothesisAction();
  const state = useHypothesisActionState(hypothesis.id);
  const setSelectedId = useAtomSet(selectedHypothesisIdAtom);

  if (mode === 'suggest') {
    return (
      <p className="text-xs text-ink-muted">
        Suggest mode: the agent proposes only. Switch to Approve or Auto to act.
      </p>
    );
  }

  if (state.kind === 'pending') {
    return (
      <p className="text-xs text-ink-muted" aria-hidden="true">
        Sending…
      </p>
    );
  }

  if (state.kind === 'succeeded') {
    return (
      <p role="status" className="text-xs text-ink-muted">
        Action recorded at {new Date(state.occurredAt).toLocaleTimeString()}.
      </p>
    );
  }

  return (
    <div className="flex flex-wrap items-center gap-2">
      {mode === 'approve' ? (
        <>
          <button
            type="button"
            onClick={() =>
              act({ hypothesisId: hypothesis.id, kind: 'approve' })
            }
            className="rounded-full bg-accent px-4 py-2 text-sm font-semibold text-canvas transition-colors hover:bg-accent-strong focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-surface"
          >
            Approve
          </button>
          <button
            type="button"
            onClick={() => onEdit(hypothesis)}
            className="rounded-full border border-border bg-surface px-4 py-2 text-sm font-semibold text-ink transition-colors hover:bg-surface-strong focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-surface"
          >
            Edit
          </button>
        </>
      ) : (
        <button
          type="button"
          onClick={() =>
            act({ hypothesisId: hypothesis.id, kind: 'intercept' })
          }
          className="rounded-full border border-severity-critical bg-surface px-4 py-2 text-sm font-semibold text-severity-critical transition-colors hover:bg-surface-strong focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-severity-critical focus-visible:ring-offset-2 focus-visible:ring-offset-surface"
        >
          Intercept
        </button>
      )}
      <Link
        to="/topology"
        onClick={() => setSelectedId(hypothesis.id)}
        className="text-xs font-semibold text-ink-muted hover:text-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-surface"
      >
        Show on topology
      </Link>
      {state.kind === 'failed' ? (
        <p role="alert" className="w-full text-xs text-severity-critical">
          {state.message}{' '}
          <button
            type="button"
            onClick={() =>
              act({
                hypothesisId: hypothesis.id,
                kind: mode === 'approve' ? 'approve' : 'intercept',
              })
            }
            className="underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
          >
            Retry
          </button>
        </p>
      ) : null}
    </div>
  );
}

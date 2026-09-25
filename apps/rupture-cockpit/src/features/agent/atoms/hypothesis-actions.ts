import { Atom, useAtomSet, useAtomValue } from '@effect-atom/atom-react';
import * as Effect from 'effect/Effect';
import { useCallback, useEffect } from 'react';

import {
  runHypothesisAction,
  type ActionRequest,
} from '../effects/run-hypothesis-action';
import type { ActionKind } from '../schema/action-result';
import { hypothesesFetchTriggerAtom } from './hypotheses';

export type { ActionRequest } from '../effects/run-hypothesis-action';

export type ActionState =
  | { readonly kind: 'idle' }
  | { readonly kind: 'pending' }
  | {
      readonly kind: 'succeeded';
      readonly occurredAt: string;
      readonly action: ActionKind;
    }
  | { readonly kind: 'failed'; readonly message: string };

export interface PendingAction {
  readonly requestId: string;
  readonly request: ActionRequest;
}

/**
 * Source atom: the most recent action request awaiting execution, or `null`
 * when nothing is queued. The runner observes it; dispatch writes to it.
 * This is the trigger that plays the same role as
 * `hypothesesFetchTriggerAtom` plays for the feed: it lets the component
 * run the Effect program at the async boundary instead of inside a
 * synchronous atom read.
 */
export const pendingActionAtom = Atom.make<PendingAction | null>(null);

/** Source atom: per-hypothesis action state. */
export const hypothesisActionStateAtom = Atom.make<
  ReadonlyMap<string, ActionState>
>(new Map());

function withState(
  map: ReadonlyMap<string, ActionState>,
  id: string,
  next: ActionState,
): ReadonlyMap<string, ActionState> {
  const copy = new Map(map);
  copy.set(id, next);
  return copy;
}

/**
 * Dispatch hook. Queues an action request and marks the hypothesis pending.
 * It does not run the Effect; `useHypothesisActionRunner` does. Split this
 * way so a single runner observes the queue once per route, rather than
 * every card racing to run the same request.
 */
export function useHypothesisAction(): (request: ActionRequest) => void {
  const setState = useAtomSet(hypothesisActionStateAtom);
  const setPending = useAtomSet(pendingActionAtom);

  return useCallback(
    (request) => {
      setState((current) =>
        withState(current, request.hypothesisId, { kind: 'pending' }),
      );
      setPending({
        requestId: globalThis.crypto.randomUUID(),
        request,
      });
    },
    [setState, setPending],
  );
}

/**
 * Runner hook. Mount once per route that supports action dispatch. It
 * observes `pendingActionAtom`, runs the effect program, writes the result
 * to `hypothesisActionStateAtom`, and clears the queue entry.
 *
 * The `requestId` guard ensures a newer request that arrives while an older
 * one is in flight is not cleared by the older one's completion.
 */
export function useHypothesisActionRunner(): void {
  const pending = useAtomValue(pendingActionAtom);
  const setPending = useAtomSet(pendingActionAtom);
  const setState = useAtomSet(hypothesisActionStateAtom);
  const bumpFetch = useAtomSet(hypothesesFetchTriggerAtom);

  useEffect(() => {
    if (!pending) return undefined;

    let cancelled = false;
    const { requestId, request } = pending;

    void Effect.runPromise(runHypothesisAction(request)).then((outcome) => {
      if (cancelled) return;

      if (outcome.kind === 'success') {
        setState((current) =>
          withState(current, request.hypothesisId, {
            kind: 'succeeded',
            occurredAt: outcome.result.occurredAt.toISOString(),
            action: outcome.result.kind,
          }),
        );
        bumpFetch((n) => n + 1);
      } else {
        setState((current) =>
          withState(current, request.hypothesisId, {
            kind: 'failed',
            message: outcome.message,
          }),
        );
      }

      setPending((current) =>
        current?.requestId === requestId ? null : current,
      );
    });

    return () => {
      cancelled = true;
    };
  }, [pending, setPending, setState, bumpFetch]);
}

export function useHypothesisActionState(id: string): ActionState {
  const map = useAtomValue(hypothesisActionStateAtom);
  return map.get(id) ?? { kind: 'idle' };
}

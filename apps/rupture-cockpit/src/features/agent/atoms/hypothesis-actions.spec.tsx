import { RegistryProvider, useAtomValue } from '@effect-atom/atom-react';
import { render, waitFor } from '@testing-library/react';
import { useEffect, type ReactNode } from 'react';
import { assert } from 'vitest';

import {
  pendingActionAtom,
  useHypothesisAction,
  useHypothesisActionState,
  type ActionRequest,
  type ActionState,
  type PendingAction,
} from './hypothesis-actions';

function renderHarness(node: ReactNode) {
  return render(<RegistryProvider>{node}</RegistryProvider>);
}

function DispatchHarness({
  onReady,
}: {
  onReady: (act: (request: ActionRequest) => void) => void;
}) {
  const act = useHypothesisAction();
  useEffect(() => {
    onReady(act);
  }, [act, onReady]);
  return null;
}

function StateHarness({
  id,
  onState,
}: {
  id: string;
  onState: (state: ActionState) => void;
}) {
  const state = useHypothesisActionState(id);
  useEffect(() => {
    onState(state);
  }, [state, onState]);
  return null;
}

function PendingHarness({
  onPending,
}: {
  onPending: (pending: PendingAction | null) => void;
}) {
  const pending = useAtomValue(pendingActionAtom);
  useEffect(() => {
    onPending(pending);
  }, [pending, onPending]);
  return null;
}

describe('useHypothesisAction', () => {
  it('queues a request and marks the hypothesis pending', async () => {
    const captured: Array<(request: ActionRequest) => void> = [];
    const pendings: Array<PendingAction | null> = [];
    const states: Array<ActionState> = [];

    renderHarness(
      <>
        <DispatchHarness onReady={(a) => captured.push(a)} />
        <PendingHarness onPending={(p) => pendings.push(p)} />
        <StateHarness id="h1" onState={(s) => states.push(s)} />
      </>,
    );

    await waitFor(() => expect(captured.length).toBeGreaterThan(0));
    const act = captured[0];
    assert(act, 'dispatcher should be ready');
    act({ hypothesisId: 'h1', kind: 'approve' });

    await waitFor(() => {
      const latest = pendings[pendings.length - 1];
      expect(latest).not.toBeNull();
    });
    const pending = pendings[pendings.length - 1];
    assert(pending, 'pending should be set after dispatch');
    expect(pending.request).toEqual({
      hypothesisId: 'h1',
      kind: 'approve',
    });

    await waitFor(() => {
      const latest = states[states.length - 1];
      expect(latest).toEqual({ kind: 'pending' });
    });
  });

  it('issues a distinct requestId per dispatch', async () => {
    const captured: Array<(request: ActionRequest) => void> = [];
    const pendings: Array<PendingAction | null> = [];

    renderHarness(
      <>
        <DispatchHarness onReady={(a) => captured.push(a)} />
        <PendingHarness onPending={(p) => pendings.push(p)} />
      </>,
    );

    await waitFor(() => expect(captured.length).toBeGreaterThan(0));
    const act = captured[0];
    assert(act, 'dispatcher should be ready');

    act({ hypothesisId: 'h1', kind: 'approve' });
    await waitFor(() => {
      const latest = pendings[pendings.length - 1];
      expect(latest).not.toBeNull();
    });
    const firstPending = pendings[pendings.length - 1];
    assert(firstPending, 'first pending should be set');
    const first = firstPending.requestId;

    act({ hypothesisId: 'h1', kind: 'intercept' });
    await waitFor(() => {
      const latest = pendings[pendings.length - 1];
      expect(latest?.request.kind).toBe('intercept');
    });
    const secondPending = pendings[pendings.length - 1];
    assert(secondPending, 'second pending should be set');
    const second = secondPending.requestId;

    expect(typeof first).toBe('string');
    expect(typeof second).toBe('string');
    expect(first).not.toBe(second);
  });
});

describe('useHypothesisActionState', () => {
  it('returns idle for an unknown hypothesis id', async () => {
    const states: Array<ActionState> = [];

    renderHarness(
      <StateHarness id="missing" onState={(s) => states.push(s)} />,
    );

    await waitFor(() => {
      const latest = states[states.length - 1];
      expect(latest).toEqual({ kind: 'idle' });
    });
  });

  it('reflects a pending state written by the dispatcher', async () => {
    const captured: Array<(request: ActionRequest) => void> = [];
    const states: Array<ActionState> = [];

    renderHarness(
      <>
        <DispatchHarness onReady={(a) => captured.push(a)} />
        <StateHarness id="h1" onState={(s) => states.push(s)} />
      </>,
    );

    await waitFor(() => expect(captured.length).toBeGreaterThan(0));
    const act = captured[0];
    assert(act, 'dispatcher should be ready');
    act({ hypothesisId: 'h1', kind: 'approve' });

    await waitFor(() => {
      const latest = states[states.length - 1];
      expect(latest).toEqual({ kind: 'pending' });
    });
  });
});

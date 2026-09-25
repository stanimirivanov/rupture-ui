import * as Effect from 'effect/Effect';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { runHypothesisAction } from './run-hypothesis-action';

const validResult = {
  kind: 'approve' as const,
  hypothesis: {
    id: 'hyp-1',
    kind: 'latency',
    edgeId: 'gw-checkout',
    proposedStrength: 55,
    confidence: 0.72,
    reasoning: [{ id: 'r1', text: 'reason' }],
    blastRadius: { serviceIds: [], connectionIds: [] },
    createdAt: '2026-09-24T08:00:00.000Z',
  },
  occurredAt: '2026-09-24T09:00:00.000Z',
};

function mockResponse(status: number, body?: unknown): Response {
  return {
    status,
    ok: status >= 200 && status < 300,
    json: async () => body,
  } as unknown as Response;
}

describe('runHypothesisAction', () => {
  let fetchMock: ReturnType<typeof vi.fn<typeof fetch>>;

  beforeEach(() => {
    fetchMock = vi.fn<typeof fetch>();
    vi.stubGlobal('fetch', fetchMock);
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('POSTs to /hypotheses/:id/approve without a body', async () => {
    fetchMock.mockResolvedValue(mockResponse(200, validResult));

    await Effect.runPromise(
      runHypothesisAction({ hypothesisId: 'h1', kind: 'approve' }),
    );

    expect(fetchMock).toHaveBeenCalledTimes(1);
    const [url, init] = fetchMock.mock.calls[0]!;
    expect(String(url)).toContain('/hypotheses/h1/approve');
    expect(init?.method).toBe('POST');
    expect(init?.body).toBeUndefined();
  });

  it('POSTs to /hypotheses/:id/intercept without a body', async () => {
    fetchMock.mockResolvedValue(
      mockResponse(200, { ...validResult, kind: 'intercept' }),
    );

    await Effect.runPromise(
      runHypothesisAction({ hypothesisId: 'h1', kind: 'intercept' }),
    );

    const [url, init] = fetchMock.mock.calls[0]!;
    expect(String(url)).toContain('/hypotheses/h1/intercept');
    expect(init?.body).toBeUndefined();
  });

  it('POSTs proposedStrength in the body for edit', async () => {
    fetchMock.mockResolvedValue(
      mockResponse(200, { ...validResult, kind: 'edit' }),
    );

    await Effect.runPromise(
      runHypothesisAction({
        hypothesisId: 'h1',
        kind: 'edit',
        proposedStrength: 42,
      }),
    );

    const [url, init] = fetchMock.mock.calls[0]!;
    expect(String(url)).toContain('/hypotheses/h1/edit');
    expect(init?.body).toBe(JSON.stringify({ proposedStrength: 42 }));
  });

  it('returns failure for a non-ok response', async () => {
    fetchMock.mockResolvedValue(mockResponse(500));

    const result = await Effect.runPromise(
      runHypothesisAction({ hypothesisId: 'h1', kind: 'approve' }),
    );

    expect(result.kind).toBe('failure');
    if (result.kind !== 'failure') return;
    expect(result.message).toContain('500');
  });

  it('returns failure when fetch throws', async () => {
    fetchMock.mockRejectedValue(new Error('offline'));

    const result = await Effect.runPromise(
      runHypothesisAction({ hypothesisId: 'h1', kind: 'approve' }),
    );

    expect(result.kind).toBe('failure');
  });

  it('returns failure when the response does not match the schema', async () => {
    fetchMock.mockResolvedValue(mockResponse(200, { not: 'an action result' }));

    const result = await Effect.runPromise(
      runHypothesisAction({ hypothesisId: 'h1', kind: 'approve' }),
    );

    expect(result.kind).toBe('failure');
    if (result.kind !== 'failure') return;
    expect(result.message).toContain('Unexpected response');
  });

  it('returns failure when occurredAt is not an ISO string', async () => {
    fetchMock.mockResolvedValue(
      mockResponse(200, { ...validResult, occurredAt: 'yesterday' }),
    );

    const result = await Effect.runPromise(
      runHypothesisAction({ hypothesisId: 'h1', kind: 'approve' }),
    );

    expect(result.kind).toBe('failure');
  });

  it('never rejects; the error channel is always a value', async () => {
    fetchMock.mockRejectedValue(new Error('offline'));

    await expect(
      Effect.runPromise(
        runHypothesisAction({ hypothesisId: 'h1', kind: 'approve' }),
      ),
    ).resolves.toMatchObject({ kind: 'failure' });
  });
});

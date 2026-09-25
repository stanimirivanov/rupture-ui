import * as Effect from 'effect/Effect';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { fetchHypotheses } from './fetch-hypotheses';

const validHypothesis = {
  id: 'hyp-1',
  kind: 'latency',
  edgeId: 'gw-checkout',
  proposedStrength: 55,
  confidence: 0.72,
  reasoning: [{ id: 'r1', text: 'reason' }],
  blastRadius: { serviceIds: ['checkout'], connectionIds: ['gw-checkout'] },
  createdAt: '2026-09-24T08:00:00.000Z',
} as const;

function mockResponse(status: number, body?: unknown): Response {
  return {
    status,
    ok: status >= 200 && status < 300,
    json: async () => body,
  } as unknown as Response;
}

describe('fetchHypotheses', () => {
  let fetchMock: ReturnType<typeof vi.fn<typeof fetch>>;

  beforeEach(() => {
    fetchMock = vi.fn<typeof fetch>();
    vi.stubGlobal('fetch', fetchMock);
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('returns success for a valid payload', async () => {
    fetchMock.mockResolvedValue(mockResponse(200, [validHypothesis]));

    const result = await Effect.runPromise(fetchHypotheses);

    expect(result.kind).toBe('success');
    if (result.kind !== 'success') return;
    expect(result.hypotheses).toHaveLength(1);
    expect(result.hypotheses[0]?.id).toBe('hyp-1');
  });

  it('returns success for an empty array', async () => {
    fetchMock.mockResolvedValue(mockResponse(200, []));

    const result = await Effect.runPromise(fetchHypotheses);

    expect(result.kind).toBe('success');
    if (result.kind !== 'success') return;
    expect(result.hypotheses).toHaveLength(0);
  });

  it('returns authorization for 401', async () => {
    fetchMock.mockResolvedValue(mockResponse(401));

    const result = await Effect.runPromise(fetchHypotheses);

    expect(result.kind).toBe('authorization');
  });

  it('returns authorization for 403', async () => {
    fetchMock.mockResolvedValue(mockResponse(403));

    const result = await Effect.runPromise(fetchHypotheses);

    expect(result.kind).toBe('authorization');
  });

  it('returns network for a 500 response', async () => {
    fetchMock.mockResolvedValue(mockResponse(500));

    const result = await Effect.runPromise(fetchHypotheses);

    expect(result.kind).toBe('network');
  });

  it('returns network when fetch throws', async () => {
    fetchMock.mockRejectedValue(new Error('offline'));

    const result = await Effect.runPromise(fetchHypotheses);

    expect(result.kind).toBe('network');
  });

  it('returns invalid-message when the payload is not an array', async () => {
    fetchMock.mockResolvedValue(mockResponse(200, { not: 'an array' }));

    const result = await Effect.runPromise(fetchHypotheses);

    expect(result.kind).toBe('invalid-message');
  });

  it('returns invalid-message when a hypothesis has an unknown kind', async () => {
    fetchMock.mockResolvedValue(
      mockResponse(200, [{ ...validHypothesis, kind: 'memory' }]),
    );

    const result = await Effect.runPromise(fetchHypotheses);

    expect(result.kind).toBe('invalid-message');
  });

  it('returns invalid-message when confidence is out of range', async () => {
    fetchMock.mockResolvedValue(
      mockResponse(200, [{ ...validHypothesis, confidence: 2 }]),
    );

    const result = await Effect.runPromise(fetchHypotheses);

    expect(result.kind).toBe('invalid-message');
  });
});

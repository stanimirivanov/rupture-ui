import { Registry } from '@effect-atom/atom-react';

import { rawHypothesesFixture } from '../fixtures/hypotheses';
import { hypothesesAtom, rawHypothesesAtom } from './hypotheses';

describe('hypothesesAtom', () => {
  it('decodes the shipped fixture without error', () => {
    const registry = Registry.make();
    const result = registry.get(hypothesesAtom);
    expect(result.kind).toBe('success');
  });

  it('returns one hypothesis per fixture entry', () => {
    const registry = Registry.make();
    const result = registry.get(hypothesesAtom);
    if (result.kind !== 'success') throw new Error('expected success');
    expect(result.hypotheses.length).toBe(
      (rawHypothesesFixture as readonly unknown[]).length,
    );
  });

  it('returns invalid-message for a malformed payload', () => {
    const registry = Registry.make();
    registry.set(rawHypothesesAtom, { not: 'an array' });
    const result = registry.get(hypothesesAtom);
    expect(result.kind).toBe('invalid-message');
  });

  it('returns invalid-message when a hypothesis has an unknown kind', () => {
    const registry = Registry.make();
    registry.set(rawHypothesesAtom, [
      {
        id: 'x',
        kind: 'memory',
        edgeId: 'e',
        proposedStrength: 10,
        confidence: 0.5,
        reasoning: [{ id: 'r', text: 't' }],
        blastRadius: { serviceIds: [], connectionIds: [] },
        createdAt: '2026-09-24T00:00:00.000Z',
      },
    ]);
    const result = registry.get(hypothesesAtom);
    expect(result.kind).toBe('invalid-message');
  });
});

import { Registry } from '@effect-atom/atom-react';

import { hypothesesAtom } from './hypotheses';
import { selectedHypothesisAtom, selectedHypothesisIdAtom } from './selection';
import type { Hypothesis } from '../schema/hypothesis';

const firstHypothesis: Hypothesis = {
  id: 'hyp-checkout-latency',
  kind: 'latency',
  edgeId: 'gw-checkout',
  proposedStrength: 55,
  confidence: 0.72,
  reasoning: [{ id: 'r1', text: 'reason' }],
  blastRadius: {
    serviceIds: ['checkout', 'payments'],
    connectionIds: ['gw-checkout', 'checkout-payments'],
  },
  createdAt: new Date('2026-09-24T08:00:00.000Z'),
};

const secondHypothesis: Hypothesis = {
  id: 'hyp-inventory-drops',
  kind: 'packet-drop',
  edgeId: 'gw-inventory',
  proposedStrength: 25,
  confidence: 0.48,
  reasoning: [{ id: 'r1', text: 'reason' }],
  blastRadius: {
    serviceIds: ['inventory'],
    connectionIds: ['gw-inventory'],
  },
  createdAt: new Date('2026-09-24T07:42:00.000Z'),
};

function seedSuccess(
  registry: Registry.Registry,
  hypotheses: readonly Hypothesis[] = [firstHypothesis, secondHypothesis],
): void {
  registry.set(hypothesesAtom, { kind: 'success', hypotheses });
}

describe('selectedHypothesisAtom', () => {
  it('returns null when nothing is selected', () => {
    const registry = Registry.make();
    seedSuccess(registry);
    expect(registry.get(selectedHypothesisAtom)).toBeNull();
  });

  it('returns the matching hypothesis for a valid id', () => {
    const registry = Registry.make();
    seedSuccess(registry);
    registry.set(selectedHypothesisIdAtom, 'hyp-checkout-latency');

    const result = registry.get(selectedHypothesisAtom);
    expect(result?.id).toBe('hyp-checkout-latency');
  });

  it('returns null for an id that does not match any hypothesis', () => {
    const registry = Registry.make();
    seedSuccess(registry);
    registry.set(selectedHypothesisIdAtom, 'does-not-exist');

    expect(registry.get(selectedHypothesisAtom)).toBeNull();
  });

  it('returns null when the feed is in decode failure', () => {
    const registry = Registry.make();
    registry.set(hypothesesAtom, {
      kind: 'invalid-message',
      message: 'bad payload',
    });
    registry.set(selectedHypothesisIdAtom, 'hyp-checkout-latency');

    expect(registry.get(selectedHypothesisAtom)).toBeNull();
  });

  it('returns null when the feed is loading', () => {
    const registry = Registry.make();
    registry.set(hypothesesAtom, { kind: 'loading' });
    registry.set(selectedHypothesisIdAtom, 'hyp-checkout-latency');

    expect(registry.get(selectedHypothesisAtom)).toBeNull();
  });

  it('returns null when the feed has a network failure', () => {
    const registry = Registry.make();
    registry.set(hypothesesAtom, {
      kind: 'network',
      message: 'offline',
    });
    registry.set(selectedHypothesisIdAtom, 'hyp-checkout-latency');

    expect(registry.get(selectedHypothesisAtom)).toBeNull();
  });

  it('exposes the blast radius of the selected hypothesis', () => {
    const registry = Registry.make();
    seedSuccess(registry);
    registry.set(selectedHypothesisIdAtom, 'hyp-checkout-latency');

    const result = registry.get(selectedHypothesisAtom);
    expect(result?.blastRadius.serviceIds).toContain('checkout');
    expect(result?.blastRadius.connectionIds).toContain('gw-checkout');
  });
});

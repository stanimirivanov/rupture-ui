import { Registry } from '@effect-atom/atom-react';

import { rawHypothesesFixture } from '../fixtures/hypotheses';
import { rawHypothesesAtom } from './hypotheses';
import { selectedHypothesisAtom, selectedHypothesisIdAtom } from './selection';

describe('selectedHypothesisAtom', () => {
  it('returns null when nothing is selected', () => {
    const registry = Registry.make();
    expect(registry.get(selectedHypothesisAtom)).toBeNull();
  });

  it('returns the matching hypothesis for a valid id', () => {
    const registry = Registry.make();
    registry.set(selectedHypothesisIdAtom, 'hyp-checkout-latency');
    const result = registry.get(selectedHypothesisAtom);
    expect(result?.id).toBe('hyp-checkout-latency');
  });

  it('returns null for an id that does not match any hypothesis', () => {
    const registry = Registry.make();
    registry.set(selectedHypothesisIdAtom, 'does-not-exist');
    expect(registry.get(selectedHypothesisAtom)).toBeNull();
  });

  it('returns null when the feed is in decode failure', () => {
    const registry = Registry.make();
    registry.set(rawHypothesesAtom, { malformed: true });
    registry.set(selectedHypothesisIdAtom, 'hyp-checkout-latency');
    expect(registry.get(selectedHypothesisAtom)).toBeNull();
  });

  it('returns the same object identity across repeated reads', () => {
    const registry = Registry.make();
    registry.set(selectedHypothesisIdAtom, 'hyp-checkout-latency');
    const first = registry.get(selectedHypothesisAtom);
    const second = registry.get(selectedHypothesisAtom);
    expect(first).toBe(second);
  });

  it('exposes the shipped fixture without mutation', () => {
    const registry = Registry.make();
    registry.set(selectedHypothesisIdAtom, 'hyp-checkout-latency');
    const result = registry.get(selectedHypothesisAtom);
    expect(result?.blastRadius.serviceIds).toContain('checkout');
    // The original fixture is untouched.
    expect((rawHypothesesFixture as Array<{ id: string }>)[0]?.id).toBe(
      'hyp-checkout-latency',
    );
  });
});

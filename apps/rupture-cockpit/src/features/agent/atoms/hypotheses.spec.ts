import { Registry } from '@effect-atom/atom-react';

import { hypothesesAtom, hypothesesFetchTriggerAtom } from './hypotheses';

describe('hypothesesAtom', () => {
  it('starts in the loading state', () => {
    const registry = Registry.make();
    expect(registry.get(hypothesesAtom)).toEqual({ kind: 'loading' });
  });

  it('reflects a value written by the fetch runner', () => {
    const registry = Registry.make();
    registry.set(hypothesesAtom, {
      kind: 'success',
      hypotheses: [],
    });
    expect(registry.get(hypothesesAtom)).toEqual({
      kind: 'success',
      hypotheses: [],
    });
  });

  it('reflects a decode failure written by the fetch runner', () => {
    const registry = Registry.make();
    registry.set(hypothesesAtom, {
      kind: 'invalid-message',
      message: 'bad payload',
    });
    expect(registry.get(hypothesesAtom)).toEqual({
      kind: 'invalid-message',
      message: 'bad payload',
    });
  });
});

describe('hypothesesFetchTriggerAtom', () => {
  it('starts at zero', () => {
    const registry = Registry.make();
    expect(registry.get(hypothesesFetchTriggerAtom)).toBe(0);
  });

  it('can be incremented to trigger a refetch', () => {
    const registry = Registry.make();
    const current = registry.get(hypothesesFetchTriggerAtom);
    registry.set(hypothesesFetchTriggerAtom, current + 1);
    expect(registry.get(hypothesesFetchTriggerAtom)).toBe(1);
  });
});

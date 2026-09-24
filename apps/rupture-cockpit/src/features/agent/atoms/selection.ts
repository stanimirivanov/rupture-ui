import { Atom, useAtomSet } from '@effect-atom/atom-react';
import { useCallback } from 'react';

import { hypothesesAtom } from './hypotheses';
import type { Hypothesis } from '../schema/hypothesis';

/** Source atom: id of the hypothesis selected for canvas preview. */
export const selectedHypothesisIdAtom = Atom.make<string | null>(null);

/**
 * Derived atom: the selected hypothesis, or `null` when nothing is
 * selected or the id no longer resolves against the current feed.
 */
export const selectedHypothesisAtom = Atom.make((get): Hypothesis | null => {
  const id = get(selectedHypothesisIdAtom);
  if (!id) return null;
  const result = get(hypothesesAtom);
  if (result.kind !== 'success') return null;
  return result.hypotheses.find((h) => h.id === id) ?? null;
});

/**
 * Agent-feature-owned write. Cross-feature consumers use this hook rather
 * than importing the source atom's setter, per ADR 0002.
 */
export function useClearHypothesisSelection(): () => void {
  const set = useAtomSet(selectedHypothesisIdAtom);
  return useCallback(() => set(null), [set]);
}

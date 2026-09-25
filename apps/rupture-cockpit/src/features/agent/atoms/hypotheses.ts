import { Atom } from '@effect-atom/atom-react';

import type { Hypothesis } from '../schema/hypothesis';

export type HypothesesResult =
  | { readonly kind: 'loading' }
  | { readonly kind: 'success'; readonly hypotheses: readonly Hypothesis[] }
  | { readonly kind: 'invalid-message'; readonly message: string }
  | { readonly kind: 'network'; readonly message: string }
  | { readonly kind: 'authorization'; readonly message: string };

/**
 * Source atom: the current feed state. Starts in `loading`; the component
 * that consumes it runs `fetchHypotheses` and writes the resolved result
 * back through this atom. There is no fetch inside the atom because a
 * derived atom is synchronous and `fetch` is not.
 */
export const hypothesesAtom = Atom.make<HypothesesResult>({ kind: 'loading' });

/**
 * Increment to request a refetch. The consuming component observes it in
 * a `useEffect` dependency array.
 */
export const hypothesesFetchTriggerAtom = Atom.make(0);

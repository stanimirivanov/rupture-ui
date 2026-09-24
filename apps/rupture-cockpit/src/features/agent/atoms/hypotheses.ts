import { Atom } from '@effect-atom/atom-react';
import * as Either from 'effect/Either';
import * as Schema from 'effect/Schema';

import { rawHypothesesFixture } from '../fixtures/hypotheses';
import { HypothesisListSchema, type Hypothesis } from '../schema/hypothesis';

/** Source atom: raw agent payload, before decoding. */
export const rawHypothesesAtom = Atom.make<unknown>(rawHypothesesFixture);

export interface HypothesesDecodeFailure {
  readonly kind: 'invalid-message';
  readonly message: string;
}

export type HypothesesResult =
  | { readonly kind: 'success'; readonly hypotheses: readonly Hypothesis[] }
  | HypothesesDecodeFailure;

/**
 * Derived atom: decode the raw payload through the schema. Returns a
 * discriminated result so the UI can branch exhaustively without try/catch.
 * Nothing downstream sees `unknown`.
 */
export const hypothesesAtom = Atom.make((get): HypothesesResult => {
  const raw = get(rawHypothesesAtom);
  const decoded = Schema.decodeUnknownEither(HypothesisListSchema)(raw);

  return Either.match(decoded, {
    onRight: (hypotheses) => ({ kind: 'success' as const, hypotheses }),
    onLeft: (error) => ({
      kind: 'invalid-message' as const,
      message: String(error),
    }),
  });
});

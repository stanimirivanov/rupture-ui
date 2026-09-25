import * as Effect from 'effect/Effect';
import * as Either from 'effect/Either';
import * as Schema from 'effect/Schema';

import { API_BASE_URL } from '../../../lib/runtime-config';
import type { HypothesesResult } from '../atoms/hypotheses';
import { HypothesisListSchema } from '../schema/hypothesis';

/**
 * Fetch and decode the hypothesis feed. Every failure becomes a value in
 * the success channel, so the effect's error channel is `never` and the
 * result can be written to an atom without an Either wrapper.
 */
export const fetchHypotheses: Effect.Effect<HypothesesResult> = Effect.gen(
  function* () {
    const responseResult = yield* Effect.either(
      Effect.tryPromise({
        try: (signal) => fetch(`${API_BASE_URL}/hypotheses`, { signal }),
        catch: (error) => String(error),
      }),
    );

    if (Either.isLeft(responseResult)) {
      return {
        kind: 'network' as const,
        message: `Could not reach the agent service. ${responseResult.left}`,
      };
    }

    const response = responseResult.right;

    if (response.status === 401 || response.status === 403) {
      return {
        kind: 'authorization' as const,
        message: 'Not authorized to read agent proposals.',
      };
    }

    if (!response.ok) {
      return {
        kind: 'network' as const,
        message: `Agent service returned HTTP ${response.status}.`,
      };
    }

    const payloadResult = yield* Effect.either(
      Effect.tryPromise({
        try: () => response.json() as Promise<unknown>,
        catch: (error) => String(error),
      }),
    );

    if (Either.isLeft(payloadResult)) {
      return {
        kind: 'invalid-message' as const,
        message: `Could not read response body. ${payloadResult.left}`,
      };
    }

    const decoded = Schema.decodeUnknownEither(HypothesisListSchema)(
      payloadResult.right,
    );

    return Either.match(decoded, {
      onRight: (hypotheses) => ({ kind: 'success' as const, hypotheses }),
      onLeft: (error) => ({
        kind: 'invalid-message' as const,
        message: String(error),
      }),
    });
  },
);

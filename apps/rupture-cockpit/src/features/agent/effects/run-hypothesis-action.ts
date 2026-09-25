import * as Effect from 'effect/Effect';
import * as Either from 'effect/Either';
import * as Schema from 'effect/Schema';

import { API_BASE_URL } from '../../../lib/runtime-config';
import {
  ActionResultSchema,
  type ActionResult,
  type ActionKind,
} from '../schema/action-result';

export interface ActionRequest {
  readonly hypothesisId: string;
  readonly kind: ActionKind;
  readonly proposedStrength?: number;
}

export type ActionOutcome =
  | { readonly kind: 'success'; readonly result: ActionResult }
  | { readonly kind: 'failure'; readonly message: string };

/**
 * One-shot mutation. The returned effect's error channel is `never`
 * because every fallible step is caught into a value. Callers run it with
 * `Effect.runPromise` and receive an `ActionOutcome`. It is never retried
 * automatically; a failure surfaces as a value the caller can render.
 */
export function runHypothesisAction(
  request: ActionRequest,
): Effect.Effect<ActionOutcome, never, never> {
  return Effect.gen(function* () {
    const responseResult = yield* Effect.either(
      Effect.tryPromise({
        try: async (signal) => {
          const isEdit = request.kind === 'edit';
          const init: RequestInit = {
            method: 'POST',
            signal,
            // Only declare a Content-Type when a body is actually being sent.
            // Fastify's JSON parser rejects a request with the header set and an
            // empty body, before the route handler runs.
            ...(isEdit
              ? {
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify({
                    proposedStrength: request.proposedStrength,
                  }),
                }
              : {}),
          };

          const response = await fetch(
            `${API_BASE_URL}/hypotheses/${request.hypothesisId}/${request.kind}`,
            init,
          );

          if (!response.ok) {
            throw new Error(`HTTP ${response.status}`);
          }
          return (await response.json()) as unknown;
        },
        catch: (error) => String(error),
      }),
    );

    if (Either.isLeft(responseResult)) {
      return {
        kind: 'failure' as const,
        message: `Request failed: ${responseResult.left}`,
      };
    }

    const decoded = Schema.decodeUnknownEither(ActionResultSchema)(
      responseResult.right,
    );

    return Either.match(decoded, {
      onRight: (result) => ({ kind: 'success' as const, result }),
      onLeft: (error) => ({
        kind: 'failure' as const,
        message: `Unexpected response: ${String(error)}`,
      }),
    });
  });
}

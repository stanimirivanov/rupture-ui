import * as Schema from 'effect/Schema';

import { HypothesisSchema } from './hypothesis';

export const ActionKindSchema = Schema.Literal('approve', 'edit', 'intercept');

export const ActionResultSchema = Schema.Struct({
  kind: ActionKindSchema,
  hypothesis: HypothesisSchema,
  occurredAt: Schema.DateFromString.pipe(
    Schema.filter((date) => !Number.isNaN(date.getTime()), {
      message: () => 'must be an ISO 8601 date string',
    }),
  ),
});

export type ActionKind = Schema.Schema.Type<typeof ActionKindSchema>;
export type ActionResult = Schema.Schema.Type<typeof ActionResultSchema>;

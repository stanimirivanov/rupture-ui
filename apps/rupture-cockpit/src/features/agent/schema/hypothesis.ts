import * as Schema from 'effect/Schema';

export const NOZZLE_KINDS = ['latency', 'packet-drop', 'cpu'] as const;

export const NozzleKindSchema = Schema.Literal(...NOZZLE_KINDS);

export const ReasoningStepSchema = Schema.Struct({
  id: Schema.NonEmptyString,
  text: Schema.NonEmptyString,
  evidence: Schema.optional(Schema.NonEmptyString),
});

export const BlastRadiusSchema = Schema.Struct({
  serviceIds: Schema.Array(Schema.NonEmptyString),
  connectionIds: Schema.Array(Schema.NonEmptyString),
});

const IsoDateSchema = Schema.DateFromString.pipe(
  Schema.filter((date) => !Number.isNaN(date.getTime()), {
    message: () => 'must be an ISO 8601 date string',
  }),
);

export const HypothesisSchema = Schema.Struct({
  id: Schema.NonEmptyString,
  kind: NozzleKindSchema,
  edgeId: Schema.NonEmptyString,
  proposedStrength: Schema.Number.pipe(Schema.between(0, 100)),
  confidence: Schema.Number.pipe(Schema.between(0, 1)),
  reasoning: Schema.NonEmptyArray(ReasoningStepSchema),
  blastRadius: BlastRadiusSchema,
  createdAt: IsoDateSchema,
});

export const HypothesisListSchema = Schema.Array(HypothesisSchema);

export type NozzleKind = Schema.Schema.Type<typeof NozzleKindSchema>;
export type ReasoningStep = Schema.Schema.Type<typeof ReasoningStepSchema>;
export type BlastRadius = Schema.Schema.Type<typeof BlastRadiusSchema>;
export type Hypothesis = Schema.Schema.Type<typeof HypothesisSchema>;

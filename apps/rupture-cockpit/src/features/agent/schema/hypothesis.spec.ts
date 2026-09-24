import * as Either from 'effect/Either';
import * as Schema from 'effect/Schema';

import { HypothesisListSchema, HypothesisSchema } from './hypothesis';

const valid = {
  id: 'hyp-1',
  kind: 'latency',
  edgeId: 'gw-checkout',
  proposedStrength: 55,
  confidence: 0.72,
  reasoning: [{ id: 'r1', text: 'Latency on checkout is elevated.' }],
  blastRadius: {
    serviceIds: ['checkout'],
    connectionIds: ['gw-checkout'],
  },
  createdAt: '2026-09-24T08:00:00.000Z',
};

function decode(input: unknown) {
  return Schema.decodeUnknownEither(HypothesisSchema)(input);
}

describe('HypothesisSchema', () => {
  it('accepts a minimal valid hypothesis', () => {
    expect(Either.isRight(decode(valid))).toBe(true);
  });

  it('accepts an optional evidence field on a reasoning step', () => {
    const withEvidence = {
      ...valid,
      reasoning: [
        { id: 'r1', text: 'Latency elevated.', evidence: 'trace-abc' },
      ],
    };
    expect(Either.isRight(decode(withEvidence))).toBe(true);
  });

  it('rejects an unknown kind', () => {
    expect(Either.isRight(decode({ ...valid, kind: 'memory' }))).toBe(false);
  });

  it('rejects confidence outside [0, 1]', () => {
    expect(Either.isRight(decode({ ...valid, confidence: 1.4 }))).toBe(false);
    expect(Either.isRight(decode({ ...valid, confidence: -0.1 }))).toBe(false);
  });

  it('rejects proposedStrength outside [0, 100]', () => {
    expect(Either.isRight(decode({ ...valid, proposedStrength: 120 }))).toBe(
      false,
    );
  });

  it('rejects an empty reasoning array', () => {
    expect(Either.isRight(decode({ ...valid, reasoning: [] }))).toBe(false);
  });

  it('rejects a non-ISO createdAt', () => {
    expect(Either.isRight(decode({ ...valid, createdAt: 'yesterday' }))).toBe(
      false,
    );
  });

  it('rejects missing required fields', () => {
    const { confidence, ...withoutConfidence } = valid;
    void confidence;
    expect(Either.isRight(decode(withoutConfidence))).toBe(false);
  });

  it('decodes a list of hypotheses', () => {
    const result = Schema.decodeUnknownEither(HypothesisListSchema)([
      valid,
      valid,
    ]);
    expect(Either.isRight(result)).toBe(true);
  });
});

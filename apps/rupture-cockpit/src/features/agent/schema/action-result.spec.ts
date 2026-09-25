import * as Either from 'effect/Either';
import * as Schema from 'effect/Schema';

import { ActionResultSchema } from './action-result';

const valid = {
  kind: 'approve',
  hypothesis: {
    id: 'h1',
    kind: 'latency',
    edgeId: 'gw-checkout',
    proposedStrength: 55,
    confidence: 0.72,
    reasoning: [{ id: 'r1', text: 'reason' }],
    blastRadius: { serviceIds: [], connectionIds: [] },
    createdAt: '2026-09-24T08:00:00.000Z',
  },
  occurredAt: '2026-09-24T09:00:00.000Z',
};

describe('ActionResultSchema', () => {
  it('decodes a valid result', () => {
    expect(
      Either.isRight(Schema.decodeUnknownEither(ActionResultSchema)(valid)),
    ).toBe(true);
  });

  it('rejects an unknown kind', () => {
    expect(
      Either.isRight(
        Schema.decodeUnknownEither(ActionResultSchema)({
          ...valid,
          kind: 'pause',
        }),
      ),
    ).toBe(false);
  });

  it('rejects a non-ISO occurredAt', () => {
    expect(
      Either.isRight(
        Schema.decodeUnknownEither(ActionResultSchema)({
          ...valid,
          occurredAt: 'yesterday',
        }),
      ),
    ).toBe(false);
  });
});

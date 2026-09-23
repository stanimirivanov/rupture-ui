import { topologyFixture } from '../fixtures/topology';
import {
  createNozzle,
  describeEdge,
  isNozzleKind,
  withNozzle,
  type Nozzle,
} from './nozzles';

describe('isNozzleKind', () => {
  it('accepts the three known kinds', () => {
    expect(isNozzleKind('latency')).toBe(true);
    expect(isNozzleKind('packet-drop')).toBe(true);
    expect(isNozzleKind('cpu')).toBe(true);
  });

  it('rejects anything else', () => {
    expect(isNozzleKind('')).toBe(false);
    expect(isNozzleKind('unknown')).toBe(false);
    expect(isNozzleKind('LATENCY')).toBe(false);
  });
});

describe('createNozzle', () => {
  it('produces a nozzle with the given kind and edge', () => {
    const nozzle = createNozzle('latency', 'gw-checkout');
    expect(nozzle.kind).toBe('latency');
    expect(nozzle.edgeId).toBe('gw-checkout');
    expect(nozzle.id.length).toBeGreaterThan(0);
  });

  it('produces unique ids', () => {
    const a = createNozzle('latency', 'gw-checkout');
    const b = createNozzle('latency', 'gw-checkout');
    expect(a.id).not.toBe(b.id);
  });
});

describe('describeEdge', () => {
  it('composes a label from service labels', () => {
    const connection = topologyFixture.connections[0];
    assert(connection, 'fixture must include at least one connection');
    expect(describeEdge(connection, topologyFixture.services)).toBe(
      'API Gateway to Checkout',
    );
  });

  it('falls back to raw ids when a service is missing', () => {
    expect(
      describeEdge(
        { id: 'x', source: 'missing-a', target: 'missing-b' },
        topologyFixture.services,
      ),
    ).toBe('missing-a to missing-b');
  });
});

describe('withNozzle', () => {
  const base: Nozzle = { id: 'a', kind: 'latency', edgeId: 'e1' };

  it('appends a nozzle on a fresh edge', () => {
    const next = createNozzle('cpu', 'e2');
    expect(withNozzle([base], next)).toEqual([base, next]);
  });

  it('replaces the nozzle on the same edge', () => {
    const next = createNozzle('cpu', 'e1');
    const result = withNozzle([base], next);
    expect(result).toHaveLength(1);
    expect(result[0]).toEqual(next);
  });
});

import { topologyFixture } from '../fixtures/topology';
import { layoutTopology } from './topology';

describe('layoutTopology', () => {
  it('produces one laid-out node per service', () => {
    const result = layoutTopology(topologyFixture);
    expect(result.nodes).toHaveLength(topologyFixture.services.length);
  });

  it('produces finite coordinates for every node', () => {
    const result = layoutTopology(topologyFixture);
    for (const node of result.nodes) {
      expect(Number.isFinite(node.x)).toBe(true);
      expect(Number.isFinite(node.y)).toBe(true);
    }
  });

  it('places tier 0 before tier 1 along the layout axis', () => {
    const result = layoutTopology(topologyFixture);
    const byId = new Map(result.nodes.map((n) => [n.service.id, n]));
    const gateway = byId.get('gateway');
    const checkout = byId.get('checkout');
    expect(gateway).toBeDefined();
    expect(checkout).toBeDefined();
    expect(gateway!.x).toBeLessThan(checkout!.x);
  });

  it('is deterministic across repeated calls', () => {
    expect(layoutTopology(topologyFixture)).toEqual(
      layoutTopology(topologyFixture),
    );
  });
});

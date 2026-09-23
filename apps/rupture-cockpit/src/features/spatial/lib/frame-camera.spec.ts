import { layoutTopology } from '../../canvas/atoms/topology';
import { topologyFixture } from '../../canvas/fixtures/topology';
import { SCALE, computeCameraFrame } from './frame-camera';

describe('computeCameraFrame', () => {
  it('returns a fallback frame for an empty layout', () => {
    const frame = computeCameraFrame({ nodes: [], edges: [] });
    expect(frame.position).toEqual([0, 6, 6]);
    expect(frame.target).toEqual([0, 0, 0]);
    expect(frame.groundSize).toBeGreaterThan(0);
  });

  it('centers the target on the scaled layout bounding box', () => {
    const layout = layoutTopology(topologyFixture);
    const frame = computeCameraFrame(layout);

    const xs = layout.nodes.map((node) => node.x * SCALE);
    const zs = layout.nodes.map((node) => node.y * SCALE);
    const expectedX = (Math.min(...xs) + Math.max(...xs)) / 2;
    const expectedZ = (Math.min(...zs) + Math.max(...zs)) / 2;

    expect(frame.target[0]).toBeCloseTo(expectedX, 5);
    expect(frame.target[1]).toBe(0);
    expect(frame.target[2]).toBeCloseTo(expectedZ, 5);
  });

  it('places the camera above and in front of the target', () => {
    const layout = layoutTopology(topologyFixture);
    const frame = computeCameraFrame(layout);
    expect(frame.position[1]).toBeGreaterThan(frame.target[1]);
    expect(frame.position[2]).toBeGreaterThan(frame.target[2]);
  });

  it('produces a positive ground size and distance', () => {
    const layout = layoutTopology(topologyFixture);
    const frame = computeCameraFrame(layout);
    expect(frame.groundSize).toBeGreaterThan(0);
    expect(frame.position[1]).toBeGreaterThan(0);
  });
});

import type { LaidOutTopology } from '../../canvas/atoms/topology';

export const SCALE = 0.01;
export const NODE_WIDTH_3D = 180 * SCALE;
export const NODE_HEIGHT_3D = 64 * SCALE;
export const NODE_DEPTH_3D = NODE_HEIGHT_3D * 0.6;

export interface CameraFrame {
  readonly position: readonly [number, number, number];
  readonly target: readonly [number, number, number];
  readonly groundSize: number;
}

/**
 * Pure: pick a camera frame that fits the laid-out topology. The camera sits
 * above and in front of the scene at a distance proportional to the largest
 * dimension, so the graph occupies most of the viewport without clipping.
 */
export function computeCameraFrame(layout: LaidOutTopology): CameraFrame {
  if (layout.nodes.length === 0) {
    return {
      position: [0, 6, 6],
      target: [0, 0, 0],
      groundSize: 12,
    };
  }

  const xs = layout.nodes.map((node) => node.x * SCALE);
  const zs = layout.nodes.map((node) => node.y * SCALE);
  const minX = Math.min(...xs);
  const maxX = Math.max(...xs);
  const minZ = Math.min(...zs);
  const maxZ = Math.max(...zs);

  const centerX = (minX + maxX) / 2;
  const centerZ = (minZ + maxZ) / 2;
  const spanX = Math.max(maxX - minX, NODE_WIDTH_3D * 2);
  const spanZ = Math.max(maxZ - minZ, NODE_HEIGHT_3D * 4);
  const span = Math.max(spanX, spanZ);

  // At fov 45, the visible span at distance `d` is `2 * d * tan(22.5deg)`.
  // We want `span` to fill roughly 70% of that, so `d = span / (2 * 0.7 * tan(22.5deg))`.
  const distance = span / (2 * 0.7 * Math.tan((22.5 * Math.PI) / 180));

  return {
    position: [centerX, distance * 0.7, centerZ + distance],
    target: [centerX, 0, centerZ],
    groundSize: span * 3,
  };
}

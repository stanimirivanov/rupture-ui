import { Billboard, Line, OrbitControls, Text } from '@react-three/drei';
import { useMemo } from 'react';

import type { Severity } from '../../canvas/atoms/dials';
import type { LaidOutTopology } from '../../canvas/atoms/topology';
import { readCssColor } from '../lib/theme-color';

const SCALE = 0.01;
const NODE_WIDTH_3D = 180 * SCALE;
const NODE_HEIGHT_3D = 64 * SCALE;
const NODE_DEPTH_3D = NODE_HEIGHT_3D * 0.6;

export interface SpatialSceneProps {
  readonly layout: LaidOutTopology;
  readonly focusedNodeId: string | null;
  readonly severities: ReadonlyMap<string, Severity>;
}

export function SpatialScene({
  layout,
  focusedNodeId,
  severities,
}: SpatialSceneProps) {
  const palette = useMemo(
    () => ({
      ink: readCssColor('--ink', '#edf1ec'),
      surface: readCssColor('--surface-strong', '#1d221e'),
      accent: readCssColor('--accent', '#e8b04b'),
      severity: {
        ok: readCssColor('--border', '#2e362f'),
        warning: readCssColor('--severity-warning', '#e8b04b'),
        critical: readCssColor('--severity-critical', '#e5484d'),
      } satisfies Record<Severity, string>,
    }),
    [],
  );

  const { center, distance } = useMemo(() => {
    if (layout.nodes.length === 0) {
      return { center: [0, 0, 0] as const, distance: 10 };
    }
    let minX = Infinity;
    let maxX = -Infinity;
    let minY = Infinity;
    let maxY = -Infinity;
    for (const node of layout.nodes) {
      minX = Math.min(minX, node.x);
      maxX = Math.max(maxX, node.x);
      minY = Math.min(minY, node.y);
      maxY = Math.max(maxY, node.y);
    }
    const width = (maxX - minX) * SCALE;
    const depth = (maxY - minY) * SCALE;
    const size = Math.max(width, depth, NODE_WIDTH_3D * 3);
    return {
      center: [
        ((minX + maxX) / 2) * SCALE,
        0,
        ((minY + maxY) / 2) * SCALE,
      ] as const,
      distance: size * 1.4,
    };
  }, [layout.nodes]);

  const nodesById = useMemo(
    () => new Map(layout.nodes.map((node) => [node.service.id, node])),
    [layout.nodes],
  );

  return (
    <group>
      <ambientLight intensity={0.7} />
      <directionalLight position={[5, 10, 5]} intensity={1.1} />
      <OrbitControls
        enablePan={false}
        makeDefault
        target={[center[0], center[1], center[2]]}
      />
      {layout.nodes.map(({ service, x, y }) => {
        const isFocused = service.id === focusedNodeId;
        return (
          <group
            key={service.id}
            position={[x * SCALE, NODE_HEIGHT_3D / 2, y * SCALE]}
          >
            <mesh>
              <boxGeometry
                args={[NODE_WIDTH_3D, NODE_HEIGHT_3D, NODE_DEPTH_3D]}
              />
              <meshStandardMaterial
                color={isFocused ? palette.accent : palette.surface}
              />
            </mesh>
            <Billboard position={[0, NODE_HEIGHT_3D * 1.4, 0]}>
              <Text
                fontSize={NODE_HEIGHT_3D * 0.55}
                color={palette.ink}
                anchorX="center"
                anchorY="middle"
              >
                {service.label}
              </Text>
            </Billboard>
          </group>
        );
      })}
      {layout.edges.map(({ connection }) => {
        const source = nodesById.get(connection.source);
        const target = nodesById.get(connection.target);
        if (!source || !target) return null;
        const severity = severities.get(connection.id) ?? 'ok';
        return (
          <Line
            key={connection.id}
            points={[
              [source.x * SCALE, NODE_HEIGHT_3D / 2, source.y * SCALE],
              [target.x * SCALE, NODE_HEIGHT_3D / 2, target.y * SCALE],
            ]}
            color={palette.severity[severity]}
            lineWidth={2}
            dashed
            dashSize={0.15}
            gapSize={0.1}
          />
        );
      })}
      <mesh position={[center[0], -0.4, center[2]]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[distance * 4, distance * 4]} />
        <meshStandardMaterial color={palette.surface} opacity={0.15} transparent />
      </mesh>
    </group>
  );
}
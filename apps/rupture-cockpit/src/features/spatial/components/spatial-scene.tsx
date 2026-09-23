import { Billboard, Line, OrbitControls, Text } from '@react-three/drei';
import { useMemo } from 'react';

import type { Severity } from '../../canvas/atoms/dials';
import type { LaidOutTopology } from '../../canvas/atoms/topology';
import {
  NODE_DEPTH_3D,
  NODE_HEIGHT_3D,
  NODE_WIDTH_3D,
  SCALE,
  type CameraFrame,
} from '../lib/frame-camera';
import { readCssColor } from '../lib/theme-color';

export interface SpatialSceneProps {
  readonly layout: LaidOutTopology;
  readonly focusedNodeId: string | null;
  readonly severities: ReadonlyMap<string, Severity>;
  readonly frame: CameraFrame;
}

export function SpatialScene({
  layout,
  focusedNodeId,
  severities,
  frame,
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
        target={[frame.target[0], frame.target[1], frame.target[2]]}
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

      <mesh
        position={[frame.target[0], -0.4, frame.target[2]]}
        rotation={[-Math.PI / 2, 0, 0]}
      >
        <planeGeometry args={[frame.groundSize, frame.groundSize]} />
        <meshStandardMaterial
          color={palette.surface}
          opacity={0.15}
          transparent
        />
      </mesh>
    </group>
  );
}

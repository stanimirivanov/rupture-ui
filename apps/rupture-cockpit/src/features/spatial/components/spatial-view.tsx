import { useAtomValue } from '@effect-atom/atom-react';
import { Canvas } from '@react-three/fiber';
import { useMemo } from 'react';

import { edgeSeverityAtom } from '../../canvas/atoms/dials';
import { focusedNodeIdAtom } from '../../canvas/atoms/focus';
import { laidOutTopologyAtom } from '../../canvas/atoms/topology';
import { computeCameraFrame } from '../lib/frame-camera';
import { SpatialScene } from './spatial-scene';

export function SpatialView() {
  const layout = useAtomValue(laidOutTopologyAtom);
  const severities = useAtomValue(edgeSeverityAtom);
  const focusedId = useAtomValue(focusedNodeIdAtom);

  const frame = useMemo(() => computeCameraFrame(layout), [layout]);

  return (
    <Canvas
      aria-label="3D topology view"
      camera={{
        position: [frame.position[0], frame.position[1], frame.position[2]],
        fov: 45,
      }}
      dpr={[1, 2]}
      className="h-full w-full"
    >
      <SpatialScene
        layout={layout}
        focusedNodeId={focusedId}
        severities={severities}
        frame={frame}
      />
    </Canvas>
  );
}

import { useAtomValue } from '@effect-atom/atom-react';
import { Canvas } from '@react-three/fiber';
import { useMemo } from 'react';

import { edgeSeverityAtom } from '../../canvas/atoms/dials';
import { focusedNodeIdAtom } from '../../canvas/atoms/focus';
import { laidOutTopologyAtom } from '../../canvas/atoms/topology';
import { SpatialScene } from './spatial-scene';

export function SpatialView() {
  const layout = useAtomValue(laidOutTopologyAtom);
  const severities = useAtomValue(edgeSeverityAtom);
  const focusedId = useAtomValue(focusedNodeIdAtom);

  const camera = useMemo(() => {
    // Recomputed only when node positions change. The scene runs once per
    // layout change, which matches the read-only intent: no frame-by-frame
    // camera work.
    return { position: [0, 12, 12] as [number, number, number], fov: 45 };
  }, []);

  return (
    <Canvas
      aria-label="3D topology view"
      camera={camera}
      dpr={[1, 2]}
      className="h-full w-full"
    >
      <SpatialScene
        layout={layout}
        focusedNodeId={focusedId}
        severities={severities}
      />
    </Canvas>
  );
}

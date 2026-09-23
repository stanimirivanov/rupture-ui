import { useAtomValue } from '@effect-atom/atom-react';
import {
  Background,
  Controls,
  ReactFlow,
  type Edge,
  type Node,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';

import { laidOutTopologyAtom } from '../atoms/topology';

export function TopologyCanvas() {
  const layout = useAtomValue(laidOutTopologyAtom);

  const nodes: Node[] = layout.nodes.map(({ service, x, y }) => ({
    id: service.id,
    position: { x, y },
    data: { label: service.label },
    draggable: false,
    connectable: false,
    selectable: false,
  }));

  const edges: Edge[] = layout.edges.map(({ connection }) => ({
    id: connection.id,
    source: connection.source,
    target: connection.target,
    selectable: false,
  }));

  return (
    <div role="group" aria-label="System topology" className="h-full w-full">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        nodesDraggable={false}
        nodesConnectable={false}
        elementsSelectable={false}
        fitView
        proOptions={{ hideAttribution: true }}
      >
        <Background />
        <Controls showInteractive={false} />
      </ReactFlow>
    </div>
  );
}

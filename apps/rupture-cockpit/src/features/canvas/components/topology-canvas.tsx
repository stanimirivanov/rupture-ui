import { useAtom, useAtomValue } from '@effect-atom/atom-react';
import {
  Background,
  Controls,
  ReactFlow,
  type Edge,
  type NodeTypes,
} from '@xyflow/react';
import { useCallback, useMemo, useRef, type KeyboardEvent } from 'react';
import '@xyflow/react/dist/style.css';

import {
  focusOrderAtom,
  focusedNodeIdAtom,
  isTraversalKey,
  nextFocusId,
  nodeDetailsOpenAtom,
  tabStopNodeIdAtom,
} from '../atoms/focus';
import { laidOutTopologyAtom } from '../atoms/topology';
import { NodeDetailsPanel } from './node-details-panel';
import { ServiceNodeComponent, type ServiceNode } from './service-node';

const nodeTypes: NodeTypes = { service: ServiceNodeComponent };

export function TopologyCanvas() {
  const layout = useAtomValue(laidOutTopologyAtom);
  const order = useAtomValue(focusOrderAtom);
  const tabStopId = useAtomValue(tabStopNodeIdAtom);
  const [focusedId, setFocusedId] = useAtom(focusedNodeIdAtom);
  const [detailsOpen, setDetailsOpen] = useAtom(nodeDetailsOpenAtom);
  const containerRef = useRef<HTMLDivElement>(null);

  const nodes: ServiceNode[] = useMemo(
    () =>
      layout.nodes.map(({ service, x, y }) => ({
        id: service.id,
        type: 'service',
        position: { x, y },
        data: { label: service.label, isTabStop: service.id === tabStopId },
        draggable: false,
        connectable: false,
        selectable: false,
      })),
    [layout.nodes, tabStopId],
  );

  const edges: Edge[] = useMemo(
    () =>
      layout.edges.map(({ connection }) => ({
        id: connection.id,
        source: connection.source,
        target: connection.target,
        selectable: false,
      })),
    [layout.edges],
  );

  const focusNode = useCallback((id: string) => {
    containerRef.current
      ?.querySelector<HTMLElement>(`[data-service-node="${id}"]`)
      ?.focus();
  }, []);

  const handleKeyDown = useCallback(
    (event: KeyboardEvent<HTMLDivElement>) => {
      const target = event.target as HTMLElement | null;
      const inPanel = target?.closest('[data-node-panel]') !== null;

      if (inPanel) {
        if (event.key === 'Escape') {
          event.preventDefault();
          setDetailsOpen(false);
          if (focusedId) focusNode(focusedId);
        }
        return;
      }

      const nodeEl = target?.closest<HTMLElement>('[data-service-node]');
      const currentId = nodeEl?.dataset['serviceNode'];
      if (!currentId) return;

      if (isTraversalKey(event.key)) {
        event.preventDefault();
        const nextId = nextFocusId(order, currentId, event.key);
        if (nextId && nextId !== currentId) {
          setFocusedId(nextId);
          focusNode(nextId);
        }
        return;
      }

      if (event.key === 'Enter') {
        event.preventDefault();
        setFocusedId(currentId);
        setDetailsOpen(true);
      }
    },
    [order, focusedId, focusNode, setFocusedId, setDetailsOpen],
  );

  const focusedService = focusedId
    ? layout.nodes.find((node) => node.service.id === focusedId)?.service
    : undefined;

  return (
    <div
      ref={containerRef}
      role="group"
      aria-label="System topology"
      onKeyDown={handleKeyDown}
      className="relative h-full w-full"
    >
      <ReactFlow
        nodes={nodes}
        edges={edges}
        nodeTypes={nodeTypes}
        nodesDraggable={false}
        nodesConnectable={false}
        elementsSelectable={false}
        fitView
        proOptions={{ hideAttribution: true }}
      >
        <Background />
        <Controls showInteractive={false} />
      </ReactFlow>
      {detailsOpen && focusedService ? (
        <NodeDetailsPanel
          service={focusedService}
          onClose={() => setDetailsOpen(false)}
        />
      ) : null}
    </div>
  );
}

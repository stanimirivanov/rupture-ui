import { useAtom, useAtomValue } from '@effect-atom/atom-react';
import {
  Background,
  Controls,
  ReactFlow,
  type EdgeTypes,
  type NodeTypes,
  type ReactFlowInstance,
} from '@xyflow/react';
import {
  useCallback,
  useMemo,
  useRef,
  type DragEvent,
  type KeyboardEvent,
} from 'react';
import '@xyflow/react/dist/style.css';

import {
  focusOrderAtom,
  focusedNodeIdAtom,
  isTraversalKey,
  nextFocusId,
  nodeDetailsOpenAtom,
  tabStopNodeIdAtom,
} from '../atoms/focus';
import {
  NOZZLE_DRAG_MIME,
  createNozzle,
  edgeDescriptorsAtom,
  isNozzleKind,
  nozzlesAtom,
  nozzlesByEdgeAtom,
  pendingPlacementKindAtom,
  withNozzle,
  type NozzleKind,
} from '../atoms/nozzles';
import { edgeSeverityAtom } from '../atoms/dials';
import {
  NODE_HEIGHT,
  NODE_WIDTH,
  laidOutTopologyAtom,
} from '../atoms/topology';
import { EdgePickerDialog } from './edge-picker-dialog';
import { NodeDetailsPanel } from './node-details-panel';
import { NozzleList } from './nozzle-list';
import { NozzleEdgeComponent, type NozzleEdge } from './nozzle-edge';
import { NozzlePalette } from './nozzle-palette';
import { ServiceNodeComponent, type ServiceNode } from './service-node';

const nodeTypes: NodeTypes = { service: ServiceNodeComponent };
const edgeTypes: EdgeTypes = { nozzle: NozzleEdgeComponent };

const EDGE_DROP_THRESHOLD = 80;

export function TopologyCanvas() {
  const layout = useAtomValue(laidOutTopologyAtom);
  const order = useAtomValue(focusOrderAtom);
  const tabStopId = useAtomValue(tabStopNodeIdAtom);
  const [focusedId, setFocusedId] = useAtom(focusedNodeIdAtom);
  const [detailsOpen, setDetailsOpen] = useAtom(nodeDetailsOpenAtom);
  const [, setNozzles] = useAtom(nozzlesAtom);
  const nozzlesByEdge = useAtomValue(nozzlesByEdgeAtom);
  const [pendingKind, setPendingKind] = useAtom(pendingPlacementKindAtom);
  const edgeDescriptors = useAtomValue(edgeDescriptorsAtom);
  const severities = useAtomValue(edgeSeverityAtom);

  const containerRef = useRef<HTMLDivElement>(null);
  const rfInstanceRef = useRef<ReactFlowInstance<
    ServiceNode,
    NozzleEdge
  > | null>(null);

  const handleInit = useCallback(
    (instance: ReactFlowInstance<ServiceNode, NozzleEdge>) => {
      rfInstanceRef.current = instance;

      // React Flow finishes its mount-time setup before onInit fires, so a
      // focus call here is not stolen by the library's own initialization.
      // `focusedNodeIdAtom` is keep-alive; the value survives the unmount
      // gap when the 3D view was selected.
      const id = focusedId;
      if (!id) return;
      containerRef.current
        ?.querySelector<HTMLElement>(`[data-service-node="${id}"]`)
        ?.focus();
    },
    [focusedId],
  );

  // Stable identity: React Flow memoizes nodes by data reference. A new
  // function here on every render would re-render every node on every
  // unrelated state change.
  const handleNodeFocus = useCallback(
    (id: string) => {
      setFocusedId(id);
    },
    [setFocusedId],
  );

  const nodes: ServiceNode[] = useMemo(
    () =>
      layout.nodes.map(({ service, x, y }) => ({
        id: service.id,
        type: 'service',
        position: { x, y },
        data: {
          label: service.label,
          isTabStop: service.id === tabStopId,
          onFocus: handleNodeFocus,
        },
        draggable: false,
        connectable: false,
        selectable: false,
      })),
    [layout.nodes, tabStopId, handleNodeFocus],
  );

  const edges: NozzleEdge[] = useMemo(
    () =>
      layout.edges.map(({ connection }) => ({
        id: connection.id,
        source: connection.source,
        target: connection.target,
        type: 'nozzle',
        data: {
          nozzle: nozzlesByEdge.get(connection.id) ?? null,
          severity: severities.get(connection.id) ?? 'ok',
        },
        selectable: false,
      })),
    [layout.edges, nozzlesByEdge, severities],
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

  const placeNozzle = useCallback(
    (kind: NozzleKind, edgeId: string) => {
      setNozzles((current) => withNozzle(current, createNozzle(kind, edgeId)));
      setPendingKind(null);
    },
    [setNozzles, setPendingKind],
  );

  const findNearestEdgeId = useCallback(
    (point: { x: number; y: number }): string | null => {
      const nodesById = new Map(
        layout.nodes.map((node) => [node.service.id, node]),
      );
      let bestId: string | null = null;
      let bestDistance = EDGE_DROP_THRESHOLD;

      for (const { connection } of layout.edges) {
        const source = nodesById.get(connection.source);
        const target = nodesById.get(connection.target);
        if (!source || !target) continue;

        const midX = (source.x + NODE_WIDTH + target.x) / 2;
        const midY =
          (source.y + NODE_HEIGHT / 2 + target.y + NODE_HEIGHT / 2) / 2;
        const distance = Math.hypot(point.x - midX, point.y - midY);

        if (distance < bestDistance) {
          bestDistance = distance;
          bestId = connection.id;
        }
      }

      return bestId;
    },
    [layout.edges, layout.nodes],
  );

  const handleDragOver = useCallback((event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'copy';
  }, []);

  const handleDrop = useCallback(
    (event: DragEvent<HTMLDivElement>) => {
      event.preventDefault();
      const kind = event.dataTransfer.getData(NOZZLE_DRAG_MIME);
      if (!kind || !isNozzleKind(kind)) return;
      const instance = rfInstanceRef.current;
      if (!instance) return;

      const flowPosition = instance.screenToFlowPosition({
        x: event.clientX,
        y: event.clientY,
      });
      const edgeId = findNearestEdgeId(flowPosition);
      if (!edgeId) return;

      placeNozzle(kind, edgeId);
    },
    [findNearestEdgeId, placeNozzle],
  );

  const focusedService = focusedId
    ? layout.nodes.find((node) => node.service.id === focusedId)?.service
    : undefined;

  return (
    <div className="relative flex h-full w-full">
      <div
        ref={containerRef}
        role="group"
        aria-label="System topology"
        onKeyDown={handleKeyDown}
        className="relative flex-1"
      >
        <ReactFlow
          nodes={nodes}
          edges={edges}
          nodeTypes={nodeTypes}
          edgeTypes={edgeTypes}
          nodesDraggable={false}
          nodesConnectable={false}
          elementsSelectable={false}
          fitView
          proOptions={{ hideAttribution: true }}
          onInit={handleInit}
          onDragOver={handleDragOver}
          onDrop={handleDrop}
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

      <aside
        aria-label="Nozzles"
        className="flex w-72 shrink-0 flex-col gap-6 overflow-y-auto border-l border-border bg-surface/80 p-4"
      >
        <NozzlePalette onRequestPlacement={(kind) => setPendingKind(kind)} />
        <NozzleList />
      </aside>

      {pendingKind ? (
        <EdgePickerDialog
          kind={pendingKind}
          edges={edgeDescriptors}
          onSelect={(edgeId) => placeNozzle(pendingKind, edgeId)}
          onClose={() => setPendingKind(null)}
        />
      ) : null}
    </div>
  );
}

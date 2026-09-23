import { Atom } from '@effect-atom/atom-react';
import * as dagre from '@dagrejs/dagre';

import {
  topologyFixture,
  type ConnectionFixture,
  type ServiceFixture,
  type TopologyFixture,
} from '../fixtures/topology';

export const NODE_WIDTH = 180;
export const NODE_HEIGHT = 64;

export interface LaidOutNode {
  readonly service: ServiceFixture;
  readonly x: number;
  readonly y: number;
}

export interface LaidOutEdge {
  readonly connection: ConnectionFixture;
}

export interface LaidOutTopology {
  readonly nodes: readonly LaidOutNode[];
  readonly edges: readonly LaidOutEdge[];
}

/**
 * Pure dagre layout. Deterministic for a given fixture, so it can be
 * snapshot-tested without a browser and shared with the future 3D mirror.
 */
export function layoutTopology(topology: TopologyFixture): LaidOutTopology {
  const graph = new dagre.graphlib.Graph();
  graph.setGraph({ rankdir: 'LR', nodesep: 60, ranksep: 120 });
  graph.setDefaultEdgeLabel(() => ({}));

  for (const service of topology.services) {
    graph.setNode(service.id, { width: NODE_WIDTH, height: NODE_HEIGHT });
  }
  for (const connection of topology.connections) {
    graph.setEdge(connection.source, connection.target);
  }

  dagre.layout(graph);

  const nodes = topology.services.map((service) => {
    const position = graph.node(service.id) as { x: number; y: number };
    return {
      service,
      x: position.x - NODE_WIDTH / 2,
      y: position.y - NODE_HEIGHT / 2,
    };
  });

  const edges = topology.connections.map((connection) => ({ connection }));

  return { nodes, edges };
}

/** Source atom: discovered services. Writable by this feature only. */
export const servicesAtom = Atom.make<readonly ServiceFixture[]>(
  topologyFixture.services,
);

/** Source atom: discovered connections. */
export const connectionsAtom = Atom.make<readonly ConnectionFixture[]>(
  topologyFixture.connections,
);

/** Derived atom: deterministic layout for the current graph. */
export const laidOutTopologyAtom = Atom.make((get): LaidOutTopology =>
  layoutTopology({
    services: get(servicesAtom),
    connections: get(connectionsAtom),
  }),
);

import { Atom } from '@effect-atom/atom-react';

import type { ConnectionFixture, ServiceFixture } from '../fixtures/topology';
import { laidOutTopologyAtom } from './topology';

export type NozzleKind = 'latency' | 'packet-drop' | 'cpu';

export interface Nozzle {
  readonly id: string;
  readonly kind: NozzleKind;
  readonly edgeId: string;
}

export interface NozzleKindDescriptor {
  readonly kind: NozzleKind;
  readonly label: string;
  readonly shortLabel: string;
  readonly description: string;
}

export const NOZZLE_KINDS: readonly NozzleKindDescriptor[] = [
  {
    kind: 'latency',
    label: 'Latency Injector',
    shortLabel: 'LAT',
    description: 'Adds delay to requests on this connection.',
  },
  {
    kind: 'packet-drop',
    label: 'Packet Dropper',
    shortLabel: 'DROP',
    description: 'Randomly drops packets on this connection.',
  },
  {
    kind: 'cpu',
    label: 'CPU Thrasher',
    shortLabel: 'CPU',
    description: 'Burns CPU on the target service.',
  },
];

export const NOZZLE_KIND_LABELS: Readonly<Record<NozzleKind, string>> = {
  latency: 'Latency Injector',
  'packet-drop': 'Packet Dropper',
  cpu: 'CPU Thrasher',
};

export const NOZZLE_KIND_SHORT_LABELS: Readonly<Record<NozzleKind, string>> = {
  latency: 'LAT',
  'packet-drop': 'DROP',
  cpu: 'CPU',
};

export const NOZZLE_DRAG_MIME = 'application/rupture-nozzle-kind';

export function isNozzleKind(value: string): value is NozzleKind {
  return value === 'latency' || value === 'packet-drop' || value === 'cpu';
}

/** Source atom: nozzles placed on edges. At most one per edge. */
export const nozzlesAtom = Atom.make<readonly Nozzle[]>([]);

/** Derived atom: nozzles indexed by the edge they attach to. */
export const nozzlesByEdgeAtom = Atom.make(
  (get): ReadonlyMap<string, Nozzle> => {
    const map = new Map<string, Nozzle>();
    for (const nozzle of get(nozzlesAtom)) {
      map.set(nozzle.edgeId, nozzle);
    }
    return map;
  },
);

/** Writable: nozzle kind selected for placement, or `null` when idle. */
export const pendingPlacementKindAtom = Atom.make<NozzleKind | null>(null);

export interface EdgeDescriptor {
  readonly id: string;
  readonly label: string;
}

/**
 * Pure: compose an edge's accessible name from the fixture's service labels.
 * Falls back to the raw connection endpoint ids when a service is missing,
 * so a stale fixture cannot produce an empty label.
 */
export function describeEdge(
  connection: ConnectionFixture,
  services: readonly ServiceFixture[],
): string {
  const byId = new Map(services.map((service) => [service.id, service]));
  const source = byId.get(connection.source)?.label ?? connection.source;
  const target = byId.get(connection.target)?.label ?? connection.target;
  return `${source} to ${target}`;
}

/** Derived atom: edge picker options for the current topology. */
export const edgeDescriptorsAtom = Atom.make(
  (get): readonly EdgeDescriptor[] => {
    const layout = get(laidOutTopologyAtom);
    const services = layout.nodes.map((node) => node.service);
    return layout.edges.map(({ connection }) => ({
      id: connection.id,
      label: describeEdge(connection, services),
    }));
  },
);

export function createNozzle(kind: NozzleKind, edgeId: string): Nozzle {
  return {
    id: globalThis.crypto.randomUUID(),
    kind,
    edgeId,
  };
}

/**
 * Pure: append a nozzle, replacing any existing nozzle on the same edge.
 * One nozzle per edge is the current contract; relax in a later slice.
 */
export function withNozzle(
  nozzles: readonly Nozzle[],
  next: Nozzle,
): readonly Nozzle[] {
  return [...nozzles.filter((nozzle) => nozzle.edgeId !== next.edgeId), next];
}

/**
 * Writable: nozzle whose dial is expanded in the sidebar, or `null` when no
 * dial is open. Stale ids (a replaced nozzle) simply match no list item and
 * result in nothing being expanded.
 */
export const selectedNozzleIdAtom = Atom.make<string | null>(null);

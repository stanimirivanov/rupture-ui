import { Atom } from '@effect-atom/atom-react';

import { laidOutTopologyAtom } from './topology';

/**
 * Writable: id of the topology node the user last focused. `null` means the
 * user has not interacted with the graph yet, and the tab stop falls back to
 * the first node in traversal order.
 */
export const focusedNodeIdAtom = Atom.make<string | null>(null);

/** Writable: whether the node details panel is visible. */
export const nodeDetailsOpenAtom = Atom.make(false);

/**
 * Derived: deterministic traversal order for the current layout.
 * Left-to-right across ranks, top-to-bottom within a rank — the reading order
 * dagre produces for `rankdir: 'LR'`. Stable for a given fixture, so it can
 * be asserted in tests.
 */
export const focusOrderAtom = Atom.make((get): readonly string[] =>
  [...get(laidOutTopologyAtom).nodes]
    .sort((a, b) => a.x - b.x || a.y - b.y)
    .map((node) => node.service.id),
);

/**
 * Derived: the node that currently holds the graph's single tab stop.
 * `focusedNodeIdAtom` when it names a real node; otherwise the first node in
 * traversal order.
 */
export const tabStopNodeIdAtom = Atom.make((get): string | null => {
  const order = get(focusOrderAtom);
  const explicit = get(focusedNodeIdAtom);
  if (explicit && order.includes(explicit)) return explicit;
  return order[0] ?? null;
});

export type TraversalKey =
  'ArrowLeft' | 'ArrowRight' | 'ArrowUp' | 'ArrowDown' | 'Home' | 'End';

const TRAVERSAL_KEYS: readonly TraversalKey[] = [
  'ArrowLeft',
  'ArrowRight',
  'ArrowUp',
  'ArrowDown',
  'Home',
  'End',
];

export function isTraversalKey(key: string): key is TraversalKey {
  return (TRAVERSAL_KEYS as readonly string[]).includes(key);
}

/**
 * Pure traversal step. Arrow keys walk the linear order; Home and End jump to
 * the ends. The ends do not wrap, following the ARIA listbox pattern:
 * pressing ArrowRight on the last node keeps focus on the last node.
 */
export function nextFocusId(
  order: readonly string[],
  currentId: string | null,
  key: TraversalKey,
): string | null {
  if (order.length === 0) return null;

  const currentIndex = currentId ? order.indexOf(currentId) : -1;

  switch (key) {
    case 'Home':
      return order[0] ?? null;
    case 'End':
      return order[order.length - 1] ?? null;
    case 'ArrowLeft':
    case 'ArrowUp':
      if (currentIndex <= 0) return order[0] ?? null;
      return order[currentIndex - 1] ?? null;
    case 'ArrowRight':
    case 'ArrowDown':
      if (currentIndex === -1) return order[0] ?? null;
      if (currentIndex >= order.length - 1) {
        return order[order.length - 1] ?? null;
      }
      return order[currentIndex + 1] ?? null;
  }
}

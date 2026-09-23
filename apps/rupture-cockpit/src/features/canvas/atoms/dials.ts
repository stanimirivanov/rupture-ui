import { Atom } from '@effect-atom/atom-react';

import { nozzlesByEdgeAtom } from './nozzles';

export type Severity = 'ok' | 'warning' | 'critical';

export const DIAL_MIN = 0;
export const DIAL_MAX = 100;
export const DIAL_STEP = 1;
export const DIAL_DEFAULT = 0;
export const WARNING_THRESHOLD = 34;
export const CRITICAL_THRESHOLD = 67;

/**
 * Pure: classify a 0-100 dial value into the project's severity scale.
 * Thresholds are inclusive at the lower bound: 34 is `warning`, 67 is
 * `critical`.
 */
export function severityForValue(value: number): Severity {
  if (value >= CRITICAL_THRESHOLD) return 'critical';
  if (value >= WARNING_THRESHOLD) return 'warning';
  return 'ok';
}

function clamp(value: number): number {
  if (value < DIAL_MIN) return DIAL_MIN;
  if (value > DIAL_MAX) return DIAL_MAX;
  return value;
}

/** Pure: immutably set a nozzle's dial value, clamped to [0, 100]. */
export function withDialValue(
  values: ReadonlyMap<string, number>,
  nozzleId: string,
  value: number,
): ReadonlyMap<string, number> {
  const next = new Map(values);
  next.set(nozzleId, clamp(value));
  return next;
}

/** Source atom: dial value per nozzle id. Missing entries read as `DIAL_DEFAULT`. */
export const dialValuesAtom = Atom.make<ReadonlyMap<string, number>>(new Map());

/** Derived atom: severity per edge, from the nozzle attached to it. */
export const edgeSeverityAtom = Atom.make(
  (get): ReadonlyMap<string, Severity> => {
    const nozzlesByEdge = get(nozzlesByEdgeAtom);
    const dialValues = get(dialValuesAtom);
    const result = new Map<string, Severity>();
    for (const [edgeId, nozzle] of nozzlesByEdge) {
      const value = dialValues.get(nozzle.id) ?? DIAL_DEFAULT;
      result.set(edgeId, severityForValue(value));
    }
    return result;
  },
);

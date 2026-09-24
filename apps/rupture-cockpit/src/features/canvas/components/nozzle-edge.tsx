import {
  BaseEdge,
  EdgeLabelRenderer,
  getBezierPath,
  type Edge,
  type EdgeProps,
} from '@xyflow/react';

import type { Severity } from '../atoms/dials';
import {
  NOZZLE_KIND_LABELS,
  NOZZLE_KIND_SHORT_LABELS,
  type Nozzle,
} from '../atoms/nozzles';

export interface NozzleEdgeData extends Record<string, unknown> {
  readonly nozzle: Nozzle | null;
  readonly severity: Severity;
  readonly isInBlastRadius: boolean;
}

export type NozzleEdge = Edge<NozzleEdgeData, 'nozzle'>;

const SEVERITY_STROKE: Readonly<Record<Severity, string>> = {
  ok: 'var(--border)',
  warning: 'var(--severity-warning)',
  critical: 'var(--severity-critical)',
};

/**
 * Non-color severity signal. Dash density rises with severity. `ok` is
 * dashed rather than solid so the flow animation (B5) has segments to move;
 * without a nozzle, no severity class is applied and the edge stays solid.
 */
const SEVERITY_DASH: Readonly<Record<Severity, string>> = {
  ok: '4 6',
  warning: '8 4',
  critical: '2 3',
};

const SEVERITY_FLOW_CLASS: Readonly<Record<Severity, string>> = {
  ok: 'edge-flow-ok',
  warning: 'edge-flow-warning',
  critical: 'edge-flow-critical',
};

export function NozzleEdgeComponent({
  id,
  sourceX,
  sourceY,
  targetX,
  targetY,
  sourcePosition,
  targetPosition,
  data,
}: EdgeProps<NozzleEdge>) {
  const [edgePath, labelX, labelY] = getBezierPath({
    sourceX,
    sourceY,
    sourcePosition,
    targetX,
    targetY,
    targetPosition,
  });

  const nozzle = data?.nozzle ?? null;
  const severity = data?.severity ?? 'ok';
  const isInBlastRadius = data?.isInBlastRadius ?? false;

  const stroke = isInBlastRadius ? 'var(--accent)' : SEVERITY_STROKE[severity];
  const strokeWidth = isInBlastRadius ? 3 : undefined;

  return (
    <>
      <BaseEdge
        id={id}
        path={edgePath}
        className={nozzle ? SEVERITY_FLOW_CLASS[severity] : undefined}
        style={{
          stroke,
          strokeWidth,
          strokeDasharray: SEVERITY_DASH[severity],
        }}
      />
      {nozzle ? (
        <EdgeLabelRenderer>
          <span
            role="img"
            aria-label={`${NOZZLE_KIND_LABELS[nozzle.kind]} nozzle, ${severity} severity`}
            style={{
              transform: `translate(-50%, -50%) translate(${labelX}px, ${labelY}px)`,
            }}
            className="pointer-events-none absolute rounded-full border border-canvas/30 bg-accent px-2 py-0.5 font-display text-[10px] font-bold tracking-wide text-canvas uppercase"
          >
            {NOZZLE_KIND_SHORT_LABELS[nozzle.kind]}
          </span>
        </EdgeLabelRenderer>
      ) : null}
    </>
  );
}

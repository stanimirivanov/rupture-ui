import { Handle, Position, type Node, type NodeProps } from '@xyflow/react';

export interface ServiceNodeData extends Record<string, unknown> {
  readonly label: string;
  readonly isTabStop: boolean;
  readonly onFocus: (id: string) => void;
  readonly isInBlastRadius: boolean;
}

export type ServiceNode = Node<ServiceNodeData, 'service'>;

export function ServiceNodeComponent({ id, data }: NodeProps<ServiceNode>) {
  const ariaLabel = data.isInBlastRadius
    ? `${data.label}, in blast radius`
    : data.label;

  return (
    <div
      data-service-node={id}
      data-in-blast-radius={data.isInBlastRadius ? 'true' : undefined}
      tabIndex={data.isTabStop ? 0 : -1}
      role="button"
      aria-label={ariaLabel}
      onFocus={() => data.onFocus(id)}
      className={
        data.isInBlastRadius
          ? 'relative rounded-lg border-2 border-accent bg-surface-strong px-4 py-3 text-sm font-semibold text-ink shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-canvas'
          : 'relative rounded-lg border-2 border-border bg-surface-strong px-4 py-3 text-sm font-semibold text-ink shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-canvas'
      }
    >
      {data.label}
      {data.isInBlastRadius ? (
        <span
          aria-hidden="true"
          className="pointer-events-none absolute -right-1.5 -top-1.5 size-3 rounded-full bg-accent ring-2 ring-canvas"
        />
      ) : null}
      <Handle type="target" position={Position.Left} className="!bg-border" />
      <Handle type="source" position={Position.Right} className="!bg-border" />
    </div>
  );
}

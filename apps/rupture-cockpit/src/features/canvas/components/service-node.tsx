import { Handle, Position, type Node, type NodeProps } from '@xyflow/react';

export interface ServiceNodeData extends Record<string, unknown> {
  readonly label: string;
  readonly isTabStop: boolean;
}

export type ServiceNode = Node<ServiceNodeData, 'service'>;

export function ServiceNodeComponent({ id, data }: NodeProps<ServiceNode>) {
  return (
    <div
      data-service-node={id}
      tabIndex={data.isTabStop ? 0 : -1}
      role="button"
      aria-label={data.label}
      className="rounded-lg border-2 border-border bg-surface-strong px-4 py-3 text-sm font-semibold text-ink shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-canvas"
    >
      {data.label}
      <Handle type="target" position={Position.Left} className="!bg-border" />
      <Handle type="source" position={Position.Right} className="!bg-border" />
    </div>
  );
}

import {
  NOZZLE_DRAG_MIME,
  NOZZLE_KINDS,
  type NozzleKind,
} from '../atoms/nozzles';

export interface NozzlePaletteProps {
  readonly onRequestPlacement: (kind: NozzleKind) => void;
}

export function NozzlePalette({ onRequestPlacement }: NozzlePaletteProps) {
  return (
    <aside
      aria-label="Nozzle palette"
      className="w-64 shrink-0 border-l border-border bg-surface/80 p-4"
    >
      <h2 className="font-display text-sm tracking-tight">Nozzles</h2>
      <p className="mt-1 text-xs leading-5 text-ink-muted">
        Drag onto a connection, or activate an item to pick one.
      </p>
      <ul className="mt-4 space-y-2">
        {NOZZLE_KINDS.map((item) => (
          <li key={item.kind}>
            <button
              type="button"
              draggable
              onDragStart={(event) => {
                event.dataTransfer.setData(NOZZLE_DRAG_MIME, item.kind);
                event.dataTransfer.effectAllowed = 'copy';
              }}
              onClick={() => onRequestPlacement(item.kind)}
              className="w-full rounded-lg border border-border bg-surface px-3 py-2 text-left transition-colors hover:bg-surface-strong focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
            >
              <span className="block text-sm font-semibold text-ink">
                {item.label}
              </span>
              <span className="mt-0.5 block text-xs text-ink-muted">
                {item.description}
              </span>
            </button>
          </li>
        ))}
      </ul>
    </aside>
  );
}

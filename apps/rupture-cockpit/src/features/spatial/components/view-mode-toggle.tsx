import { useAtom } from '@effect-atom/atom-react';

import { viewModeAtom, type ViewMode } from '../atoms/view-mode';

const MODES: readonly { readonly value: ViewMode; readonly label: string }[] = [
  { value: '2d', label: '2D' },
  { value: '3d', label: '3D' },
];

const MODE_STATUS_LABEL: Readonly<Record<ViewMode, string>> = {
  '2d': '2D view',
  '3d': '3D view',
};

export function ViewModeToggle() {
  const [mode, setMode] = useAtom(viewModeAtom);

  return (
    <div className="flex items-center gap-3">
      <div
        role="group"
        aria-label="View mode"
        className="flex overflow-hidden rounded-full border border-border bg-surface"
      >
        {MODES.map((item) => {
          const isActive = mode === item.value;
          return (
            <button
              key={item.value}
              type="button"
              aria-pressed={isActive}
              onClick={() => setMode(item.value)}
              className={
                isActive
                  ? 'px-4 py-1.5 text-sm font-semibold text-canvas bg-accent'
                  : 'px-4 py-1.5 text-sm font-semibold text-ink-muted hover:text-ink'
              }
            >
              {item.label}
            </button>
          );
        })}
      </div>
      <p role="status" className="sr-only">
        {MODE_STATUS_LABEL[mode]}
      </p>
    </div>
  );
}

import { useAtom } from '@effect-atom/atom-react';

import {
  AUTONOMY_MODE_LABELS,
  AUTONOMY_MODES,
  autonomyModeAtom,
} from '../atoms/autonomy';

export function AutonomyDial() {
  const [mode, setMode] = useAtom(autonomyModeAtom);

  return (
    <div className="rounded-xl border border-border bg-surface p-4">
      <fieldset>
        <legend className="font-display text-sm tracking-tight text-ink">
          Autonomy
        </legend>
        <p className="mt-1 text-xs leading-5 text-ink-muted">
          How much authority the agent has before it needs you.
        </p>
        <ul className="mt-3 space-y-2">
          {AUTONOMY_MODES.map((item) => {
            const isSelected = mode === item.value;
            const isAuto = item.value === 'auto';
            const inputId = `autonomy-${item.value}`;
            const baseClass =
              'flex cursor-pointer gap-3 rounded-lg border px-3 py-2 transition-colors focus-within:ring-2 focus-within:ring-accent focus-within:ring-offset-2 focus-within:ring-offset-surface';
            const selectedClass = isAuto
              ? 'border-severity-warning bg-severity-warning/10'
              : 'border-accent bg-accent/10';
            const idleClass =
              'border-border bg-surface hover:bg-surface-strong';

            return (
              <li key={item.value}>
                <label
                  htmlFor={inputId}
                  className={`${baseClass} ${isSelected ? selectedClass : idleClass}`}
                >
                  <input
                    id={inputId}
                    type="radio"
                    name="autonomy-mode"
                    value={item.value}
                    checked={isSelected}
                    onChange={() => setMode(item.value)}
                    className="mt-1 size-4 shrink-0 accent-accent"
                  />
                  <span>
                    <span className="block text-sm font-semibold text-ink">
                      {item.label}
                    </span>
                    <span className="mt-0.5 block text-xs leading-5 text-ink-muted">
                      {item.description}
                    </span>
                  </span>
                </label>
              </li>
            );
          })}
        </ul>
      </fieldset>

      <p role="status" className="sr-only">
        Autonomy mode: {AUTONOMY_MODE_LABELS[mode]}.
      </p>
    </div>
  );
}

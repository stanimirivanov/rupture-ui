import { useEffect, useRef, type SyntheticEvent } from 'react';

import {
  NOZZLE_KIND_LABELS,
  type EdgeDescriptor,
  type NozzleKind,
} from '../atoms/nozzles';

export interface EdgePickerDialogProps {
  readonly kind: NozzleKind;
  readonly edges: readonly EdgeDescriptor[];
  readonly onSelect: (edgeId: string) => void;
  readonly onClose: () => void;
}

export function EdgePickerDialog({
  kind,
  edges,
  onSelect,
  onClose,
}: EdgePickerDialogProps) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const firstButtonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    if (!dialog.open) dialog.showModal();
    firstButtonRef.current?.focus();
    return () => {
      if (dialog.open) dialog.close();
    };
  }, []);

  const handleCancel = (event: SyntheticEvent<HTMLDialogElement>) => {
    event.preventDefault();
    onClose();
  };

  const handleBackdropClick = (event: React.MouseEvent<HTMLDialogElement>) => {
    if (event.target === dialogRef.current) onClose();
  };

  const label = NOZZLE_KIND_LABELS[kind];

  return (
    <dialog
      ref={dialogRef}
      aria-labelledby="edge-picker-title"
      onCancel={handleCancel}
      onClick={handleBackdropClick}
      className="m-auto w-full max-w-md rounded-xl border border-border bg-surface-strong p-6 text-ink shadow-2xl backdrop:bg-black/60"
    >
      <h2
        id="edge-picker-title"
        className="font-display text-lg tracking-tight"
      >
        Place {label} nozzle
      </h2>
      <p className="mt-1 text-sm text-ink-muted">
        Choose the connection this nozzle attaches to.
      </p>
      <ul className="mt-4 max-h-72 space-y-2 overflow-y-auto">
        {edges.map((edge, index) => (
          <li key={edge.id}>
            <button
              ref={index === 0 ? firstButtonRef : undefined}
              type="button"
              onClick={() => onSelect(edge.id)}
              className="w-full rounded-lg border border-border bg-surface px-4 py-2 text-left text-sm text-ink hover:bg-surface-strong focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
            >
              {edge.label}
            </button>
          </li>
        ))}
      </ul>
      <button
        type="button"
        onClick={onClose}
        className="mt-6 w-full rounded-full border border-border bg-surface px-4 py-2 text-sm font-semibold text-ink hover:bg-surface-strong focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
      >
        Cancel
      </button>
    </dialog>
  );
}

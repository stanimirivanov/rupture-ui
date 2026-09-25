import { useEffect, useRef, useState, type SyntheticEvent } from 'react';

import { Slider } from '@rupture/ui-web';

import type { Hypothesis } from '../schema/hypothesis';

export interface EditStrengthDialogProps {
  readonly hypothesis: Hypothesis;
  readonly onSubmit: (proposedStrength: number) => void;
  readonly onClose: () => void;
}

export function EditStrengthDialog({
  hypothesis,
  onSubmit,
  onClose,
}: EditStrengthDialogProps) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const [strength, setStrength] = useState(hypothesis.proposedStrength);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    if (!dialog.open) dialog.showModal();
    return () => {
      if (dialog.open) dialog.close();
    };
  }, []);

  const handleCancel = (event: SyntheticEvent<HTMLDialogElement>) => {
    event.preventDefault();
    onClose();
  };

  const handleSubmit = (event: SyntheticEvent<HTMLFormElement>) => {
    event.preventDefault();
    onSubmit(strength);
  };

  return (
    <dialog
      ref={dialogRef}
      aria-labelledby="edit-strength-title"
      onCancel={handleCancel}
      className="m-auto w-full max-w-md rounded-xl border border-border bg-surface-strong p-6 text-ink shadow-2xl backdrop:bg-black/60"
    >
      <h2
        id="edit-strength-title"
        className="font-display text-lg tracking-tight"
      >
        Edit proposed strength
      </h2>
      <p className="mt-1 text-sm text-ink-muted">
        Adjust the strength before approving. The original proposal is unchanged
        if you cancel.
      </p>
      <form onSubmit={handleSubmit} className="mt-4">
        <label
          htmlFor="edit-strength-slider"
          className="flex items-center justify-between text-xs text-ink-muted"
        >
          <span>Strength</span>
          <span className="font-semibold text-ink">{strength}%</span>
        </label>
        <Slider
          id="edit-strength-slider"
          className="mt-2"
          value={strength}
          valueText={`${strength} percent`}
          min={0}
          max={100}
          step={1}
          onValueChange={setStrength}
        />
        <div className="mt-6 flex justify-end gap-2">
          <button
            type="button"
            onClick={onClose}
            className="rounded-full border border-border bg-surface px-4 py-2 text-sm font-semibold text-ink hover:bg-surface-strong focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="rounded-full bg-accent px-4 py-2 text-sm font-semibold text-canvas hover:bg-accent-strong focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
          >
            Save and approve
          </button>
        </div>
      </form>
    </dialog>
  );
}

import { Atom } from '@effect-atom/atom-react';

export type AutonomyMode = 'suggest' | 'approve' | 'auto';

export interface AutonomyModeDescriptor {
  readonly value: AutonomyMode;
  readonly label: string;
  readonly description: string;
}

export const AUTONOMY_MODES: readonly AutonomyModeDescriptor[] = [
  {
    value: 'suggest',
    label: 'Suggest',
    description: 'The agent proposes experiments only. You initiate every run.',
  },
  {
    value: 'approve',
    label: 'Approve',
    description:
      'The agent proposes a staged action. You approve before it launches.',
  },
  {
    value: 'auto',
    label: 'Auto',
    description:
      'The agent launches within the blast-radius preview. You can pause or intervene.',
  },
];

export const AUTONOMY_MODE_LABELS: Readonly<Record<AutonomyMode, string>> = {
  suggest: 'Suggest',
  approve: 'Approve',
  auto: 'Auto',
};

/**
 * Source atom: the operator's current autonomy delegation. Default is
 * `approve`; `auto` is never the initial value and is never persisted.
 * Session-scoped, per ADR 0004.
 */
export const autonomyModeAtom = Atom.make<AutonomyMode>('approve');

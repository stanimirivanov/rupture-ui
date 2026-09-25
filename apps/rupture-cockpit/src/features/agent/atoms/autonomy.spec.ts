import { Registry } from '@effect-atom/atom-react';

import {
  AUTONOMY_MODE_LABELS,
  AUTONOMY_MODES,
  autonomyModeAtom,
} from './autonomy';

describe('AUTONOMY_MODES', () => {
  it('lists the three modes in the order they should render', () => {
    expect(AUTONOMY_MODES.map((m) => m.value)).toEqual([
      'suggest',
      'approve',
      'auto',
    ]);
  });

  it('gives every mode a non-empty label and description', () => {
    for (const mode of AUTONOMY_MODES) {
      expect(mode.label.length).toBeGreaterThan(0);
      expect(mode.description.length).toBeGreaterThan(0);
    }
  });
});

describe('AUTONOMY_MODE_LABELS', () => {
  it('maps every mode to a label', () => {
    expect(AUTONOMY_MODE_LABELS).toEqual({
      suggest: 'Suggest',
      approve: 'Approve',
      auto: 'Auto',
    });
  });
});

describe('autonomyModeAtom', () => {
  it('defaults to approve', () => {
    const registry = Registry.make();
    expect(registry.get(autonomyModeAtom)).toBe('approve');
  });

  it('is writable', () => {
    const registry = Registry.make();
    registry.set(autonomyModeAtom, 'auto');
    expect(registry.get(autonomyModeAtom)).toBe('auto');
  });

  it('never starts at auto', () => {
    // Two independent registries, both default to approve. This is the
    // property ADR 0004 requires: auto is never the initial state.
    const a = Registry.make();
    const b = Registry.make();
    expect(a.get(autonomyModeAtom)).not.toBe('auto');
    expect(b.get(autonomyModeAtom)).not.toBe('auto');
  });
});

import { Atom } from '@effect-atom/atom-react';

export type ViewMode = '2d' | '3d';

/**
 * Writable: which topology surface the route renders. Persists across route
 * navigation, which is intended — the operator's last view is their view.
 */
export const viewModeAtom = Atom.make<ViewMode>('2d');

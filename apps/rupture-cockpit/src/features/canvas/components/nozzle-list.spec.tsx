import { describe, it } from 'vitest';

// The list reads atoms directly, which makes component isolation awkward
// without a store provider. B3's palette avoided this because its only
// input was a callback. For B4 the smallest correct coverage lives in the
// pure helpers (`dials.spec.ts`) and the e2e suite. A component test that
// mounts the full canvas is deferred until the atom provider pattern is
// settled; see the issue's "Limitations recorded" section.

describe('NozzleList', () => {
  it.todo('renders an empty state when no nozzles are placed');

  it.todo('expands a dial when a nozzle is selected');

  it.todo('moves the slider and reflects severity in the item label');
});

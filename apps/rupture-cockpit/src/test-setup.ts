import { vi } from 'vitest';

class ResizeObserverStub {
  observe = vi.fn();
  unobserve = vi.fn();
  disconnect = vi.fn();
}

if (!('ResizeObserver' in globalThis)) {
  globalThis.ResizeObserver =
    ResizeObserverStub as unknown as typeof ResizeObserver;
}

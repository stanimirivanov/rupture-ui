import { fireEvent, render, screen } from '@testing-library/react';

import { NozzlePalette } from './nozzle-palette';

describe('NozzlePalette', () => {
  it('lists the three nozzle types', () => {
    render(<NozzlePalette onRequestPlacement={vi.fn()} />);

    expect(
      screen.getByRole('button', { name: /Latency Injector/ }),
    ).toBeTruthy();
    expect(screen.getByRole('button', { name: /Packet Dropper/ })).toBeTruthy();
    expect(screen.getByRole('button', { name: /CPU Thrasher/ })).toBeTruthy();
  });

  it('calls onRequestPlacement with the nozzle kind when clicked', () => {
    const calls: string[] = [];
    render(<NozzlePalette onRequestPlacement={(kind) => calls.push(kind)} />);

    fireEvent.click(screen.getByRole('button', { name: /Latency Injector/ }));

    expect(calls).toEqual(['latency']);
  });

  it('marks palette items as draggable', () => {
    render(<NozzlePalette onRequestPlacement={vi.fn()} />);
    const button = screen.getByRole('button', { name: /Latency Injector/ });
    expect(button.getAttribute('draggable')).toBe('true');
  });
});

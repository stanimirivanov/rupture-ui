import { fireEvent, render, screen } from '@testing-library/react';
import { vi } from 'vitest';

import { Slider } from './slider';

describe('Slider', () => {
  it('renders a range input with the given value', () => {
    render(<Slider value={40} onValueChange={vi.fn()} />);
    const slider = screen.getByRole('slider') as HTMLInputElement;
    expect(slider.value).toBe('40');
  });

  it('calls onValueChange with the numeric value', () => {
    const onValueChange = vi.fn();
    render(<Slider value={40} onValueChange={onValueChange} />);

    fireEvent.change(screen.getByRole('slider'), { target: { value: '75' } });

    expect(onValueChange).toHaveBeenCalledWith(75);
  });

  it('forwards aria-valuetext', () => {
    render(
      <Slider value={40} valueText="40 percent" onValueChange={vi.fn()} />,
    );
    expect(screen.getByRole('slider').getAttribute('aria-valuetext')).toBe(
      '40 percent',
    );
  });

  it('forwards min, max, and step', () => {
    render(
      <Slider value={40} min={0} max={100} step={5} onValueChange={vi.fn()} />,
    );
    const slider = screen.getByRole('slider') as HTMLInputElement;
    expect(slider.min).toBe('0');
    expect(slider.max).toBe('100');
    expect(slider.step).toBe('5');
  });
});

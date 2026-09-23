import type { InputHTMLAttributes } from 'react';

import { cn } from '../lib/utils';

export interface SliderProps extends Omit<
  InputHTMLAttributes<HTMLInputElement>,
  'type' | 'value' | 'onChange'
> {
  readonly value: number;
  readonly onValueChange: (value: number) => void;
  /**
   * Localised value text announced instead of the raw number, for example
   * "40 percent". The raw number is used when this is omitted.
   */
  readonly valueText?: string;
}

/**
 * Native range input styled with the accent token. Keyboard behaviour and
 * `aria-valuenow` come from the platform; callers supply the accessible name
 * via a `<label htmlFor>` in their own markup.
 */
function Slider({
  className,
  value,
  valueText,
  onValueChange,
  ...props
}: SliderProps) {
  return (
    <input
      type="range"
      aria-valuetext={valueText}
      value={value}
      onChange={(event) => onValueChange(Number(event.target.value))}
      className={cn(
        'h-2 w-full cursor-pointer accent-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-surface-strong',
        className,
      )}
      {...props}
    />
  );
}

export { Slider };

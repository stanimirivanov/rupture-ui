import {
  CRITICAL_THRESHOLD,
  WARNING_THRESHOLD,
  severityForValue,
  withDialValue,
} from './dials';

describe('severityForValue', () => {
  it('returns ok below the warning threshold', () => {
    expect(severityForValue(0)).toBe('ok');
    expect(severityForValue(WARNING_THRESHOLD - 1)).toBe('ok');
  });

  it('returns warning from the warning threshold up to critical', () => {
    expect(severityForValue(WARNING_THRESHOLD)).toBe('warning');
    expect(severityForValue(CRITICAL_THRESHOLD - 1)).toBe('warning');
  });

  it('returns critical from the critical threshold upward', () => {
    expect(severityForValue(CRITICAL_THRESHOLD)).toBe('critical');
    expect(severityForValue(100)).toBe('critical');
  });
});

describe('withDialValue', () => {
  it('sets the value for a nozzle', () => {
    expect(withDialValue(new Map(), 'n1', 42).get('n1')).toBe(42);
  });

  it('does not mutate the input map', () => {
    const input = new Map<string, number>([['n1', 10]]);
    withDialValue(input, 'n2', 20);
    expect(input.has('n2')).toBe(false);
  });

  it('clamps above the maximum', () => {
    expect(withDialValue(new Map(), 'n1', 200).get('n1')).toBe(100);
  });

  it('clamps below the minimum', () => {
    expect(withDialValue(new Map(), 'n1', -10).get('n1')).toBe(0);
  });
});

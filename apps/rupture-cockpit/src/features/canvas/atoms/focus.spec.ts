import { nextFocusId, type TraversalKey } from './focus';

const order = ['a', 'b', 'c', 'd'];

describe('nextFocusId', () => {
  it('returns null for an empty order', () => {
    expect(nextFocusId([], null, 'ArrowRight')).toBeNull();
  });

  it('moves right by one', () => {
    expect(nextFocusId(order, 'a', 'ArrowRight')).toBe('b');
    expect(nextFocusId(order, 'b', 'ArrowRight')).toBe('c');
  });

  it('moves left by one', () => {
    expect(nextFocusId(order, 'c', 'ArrowLeft')).toBe('b');
  });

  it('treats up as left and down as right', () => {
    expect(nextFocusId(order, 'c', 'ArrowUp')).toBe('b');
    expect(nextFocusId(order, 'c', 'ArrowDown')).toBe('d');
  });

  it('does not wrap at either end', () => {
    expect(nextFocusId(order, 'd', 'ArrowRight')).toBe('d');
    expect(nextFocusId(order, 'a', 'ArrowLeft')).toBe('a');
    expect(nextFocusId(order, 'd', 'ArrowDown')).toBe('d');
    expect(nextFocusId(order, 'a', 'ArrowUp')).toBe('a');
  });

  it('jumps to the ends with Home and End', () => {
    expect(nextFocusId(order, 'c', 'Home')).toBe('a');
    expect(nextFocusId(order, 'b', 'End')).toBe('d');
  });

  it('lands on the first node when there is no current focus', () => {
    const keys: TraversalKey[] = [
      'ArrowRight',
      'ArrowLeft',
      'ArrowDown',
      'ArrowUp',
    ];
    for (const key of keys) {
      expect(nextFocusId(order, null, key)).toBe('a');
    }
  });

  it('falls back to the first node when currentId is unknown', () => {
    expect(nextFocusId(order, 'missing', 'ArrowRight')).toBe('a');
  });
});

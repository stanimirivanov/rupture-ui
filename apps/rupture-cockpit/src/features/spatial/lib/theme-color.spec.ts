import { readCssColor } from './theme-color';

describe('readCssColor', () => {
  afterEach(() => {
    document.documentElement.style.removeProperty('--test-color');
  });

  it('returns the fallback when the property is unset', () => {
    expect(readCssColor('--definitely-not-set', '#000')).toBe('#000');
  });

  it('returns the current value of a set custom property', () => {
    document.documentElement.style.setProperty('--test-color', '#abc');
    expect(readCssColor('--test-color', '#000')).toBe('#abc');
  });

  it('trims surrounding whitespace', () => {
    document.documentElement.style.setProperty('--test-color', '  #def  ');
    expect(readCssColor('--test-color', '#000')).toBe('#def');
  });

  it('falls back when the property is set to an empty value', () => {
    document.documentElement.style.setProperty('--test-color', '');
    expect(readCssColor('--test-color', '#000')).toBe('#000');
  });
});

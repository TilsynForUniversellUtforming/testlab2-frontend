import { normalizeString } from '@common/form/util';
import { describe, expect, it } from 'vitest';

describe('normalizeString', () => {
  it('should remove non-alphanumeric characters', () => {
    expect(normalizeString('example-name')).toBe('examplename');
  });

  it('should convert to lowercase', () => {
    expect(normalizeString('Example')).toBe('example');
  });

  it('should trim leading and trailing spaces', () => {
    expect(normalizeString('  example  ')).toBe('example');
  });

  it('should handle empty strings', () => {
    expect(normalizeString('')).toBe('');
  });

  it('should retain alphanumeric characters', () => {
    expect(normalizeString('abc123æøå')).toBe('abc123æøå');
  });

  it('should handle strings with only non-alphanumeric characters', () => {
    expect(normalizeString('!@#$%^-&*()')).toBe('');
  });
});

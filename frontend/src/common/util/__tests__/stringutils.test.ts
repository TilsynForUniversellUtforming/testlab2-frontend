import { describe, expect, it } from 'vitest';

import {
  extractDomain,
  formatDateString,
  joinStringsToList,
  parseNumberInput,
  removeSpaces,
  sanitizeEnumLabel,
} from '../stringutils';

describe('joinStringsToList', () => {
  it('should join a single item without separator', () => {
    const result = joinStringsToList(['test']);
    expect(result).toBe('test');
  });

  it('should join two items in readable format', () => {
    const result = joinStringsToList(['test1', 'test2']);
    expect(result).toBe('test1 og test2');
  });

  it('should join multiple items in readable format', () => {
    const result = joinStringsToList(['test1', 'test2', 'test3']);
    expect(result).toBe('test1, test2 og test3');
  });
});

describe('formatDateString', () => {
  it('should format a date string correctly', () => {
    const result = formatDateString('2023-01-01');
    expect(result).toBe('01.01.2023');
  });

  it('should return input string for invalid date strings', () => {
    const result = formatDateString('dato');
    expect(result).toBe('dato');
  });
});

describe('sanitizeLabel', () => {
  it('should replace underscore with space and capitalize', () => {
    const result = sanitizeEnumLabel('test_label');
    expect(result).toBe('Test label');
  });

  it('should handle strings without underscores', () => {
    const result = sanitizeEnumLabel('test');
    expect(result).toBe('Test');
  });
});

describe('extractDomain', () => {
  it('should extract the domain from a URL', () => {
    const result = extractDomain('https://www.example.com/page');
    expect(result).toBe('www.example.com');
  });

  it('should return input string for invalid URLs', () => {
    const result = extractDomain('feilUrl');
    expect(result).toBe('feilUrl');
  });
});

describe('parseNumberInput', () => {
  it('should parse a valid number from a string', () => {
    const result = parseNumberInput('123');
    expect(result).toBe(123);
  });

  it('should throw an error for invalid numbers', () => {
    expect(() => parseNumberInput('abc')).toThrow('Ugyldig type');
  });
});

describe('removeSpaces', () => {
  it('should remove all spaces from a string', () => {
    const result = removeSpaces('t e s t');
    expect(result).toBe('test');
  });

  it('should return the same string if no spaces are present', () => {
    const result = removeSpaces('test');
    expect(result).toBe('test');
  });
});

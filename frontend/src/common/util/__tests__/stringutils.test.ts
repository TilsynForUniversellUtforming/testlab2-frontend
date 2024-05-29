import { describe, expect, it } from 'vitest';

import {
  editDistance,
  extractDomain,
  formatDateString,
  joinStringsToList,
  parseNumberInput,
  removeSpaces,
  sanitizeEnumLabel,
  substrings,
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

describe('sanitizeEnumLabel', () => {
  it('should replace underscore with space and capitalize', () => {
    const result = sanitizeEnumLabel('test_label');
    expect(result).toBe('Test label');
  });

  it('should handle strings without underscores', () => {
    const result = sanitizeEnumLabel('test');
    expect(result).toBe('Test');
  });

  it('should split camel case into words', () => {
    expect(sanitizeEnumLabel('ikkjeForekomst')).toBe('Ikkje forekomst');
    expect(sanitizeEnumLabel('oneTwoThreeFour')).toBe('One two three four');
  });

  it('should not format an all caps word as camel case', () => {
    expect(sanitizeEnumLabel('RETEST')).toBe('Retest');
    expect(sanitizeEnumLabel('OPPRINNELIG_TEST')).toBe('Opprinnelig test');
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

describe('editDistance', () => {
  it('should give distance 0 for two empty strings', () =>
    expect(editDistance('', '')).toBe(0));
  it('should give distance 0 for two equal strings', () =>
    expect(editDistance('hello', 'hello')).toBe(0));
  it('should give distance 3 for "kitten" and "sitting"', () => {
    expect(editDistance('kitten', 'sitting')).toBe(3);
  });
  it('should give distance equal to length of first word if second word is empty', () => {
    expect(editDistance('kitten', '')).toBe(6);
  });
  it('should give distance equal to length of second word if first word is empty', () => {
    expect(editDistance('', 'kitten')).toBe(6);
  });
  it('should give distance 5 for "tri" and "tilsyn"', () => {
    expect(editDistance('tri', 'tilsyn')).toBe(5);
  });
});

describe('substrings', () => {
  it('should return an empty array for an empty string', () => {
    expect(substrings(10, '')).toStrictEqual([]);
  });
  it('should return one substring if length is equal to or greater than length of string', () => {
    expect(substrings(6, 'kitten')).toStrictEqual(['kitten']);
    expect(substrings(12, 'kitten')).toStrictEqual(['kitten']);
  });
  it('should return two substrings it length is one less than length of string', () => {
    expect(substrings(5, 'kitten')).toStrictEqual(['kitte', 'itten']);
  });
  it('should return every letter if length is 1', () => {
    expect(substrings(1, 'kitten')).toStrictEqual([
      'k',
      'i',
      't',
      't',
      'e',
      'n',
    ]);
  });
  it('should return substrings of the given length', () => {
    expect(substrings(3, 'kitten')).toStrictEqual(['kit', 'itt', 'tte', 'ten']);
  });
});

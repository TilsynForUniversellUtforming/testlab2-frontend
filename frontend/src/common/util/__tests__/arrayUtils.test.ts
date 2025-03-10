import { first, hasSameItems, last, search } from '@common/util/arrayUtils';
import { describe, expect, it, test } from 'vitest';

describe('arrayUtils', () => {
  describe('hasSameItems', () => {
    it('should return true if arrays are different', () => {
      expect(hasSameItems([1, 2, 3], [1, 2, 4], (a, b) => a === b)).toBe(false);
    });

    it('should return false if arrays are the same', () => {
      expect(hasSameItems([1, 2, 3], [1, 2, 3], (a, b) => a === b)).toBe(true);
    });

    it('should return true for arrays with equal objects', () => {
      const a = { a: 1 };
      const b = { a: 1 };
      expect(hasSameItems([a], [b], (a, b) => a.a === b.a)).toBe(true);
    });

    it('should return false if one element has been removed', () => {
      expect(hasSameItems([1, 2, 3], [1, 2], (a, b) => a === b)).toBe(false);
    });

    it('should return false if one element has been added', () => {
      expect(hasSameItems([1, 2], [1, 2, 3], (a, b) => a === b)).toBe(false);
    });

    it('should return false if one element has been changed', () => {
      const as = [
        { id: 1, value: 'a' },
        { id: 2, value: 'b' },
      ];
      const bs = [
        { id: 1, value: 'a' },
        { id: 2, value: 'c' },
      ];
      expect(
        hasSameItems(as, bs, (a, b) => a.id === b.id && a.value === b.value)
      ).toBe(false);
    });
  });
});

describe('search', () => {
  it('should rank a perfect match hightest', () => {
    const ts = ['Trine tester', 'Trine tester 2', 'Tilsyn Verdens Gang AS'];
    const result = search('trine tester 2', (t) => t, ts);
    expect(first(result)).toBe('Trine tester 2');
  });
});

describe('last', () => {
  test('should return the last element of an array', () => {
    const array = [1, 2, 3, 4, 5];
    const result = last(array);
    expect(result).toBe(5);
  });

  test('should return undefined if the array is empty', () => {
    const array: number[] = [];
    const result = last(array);
    expect(result).toBeUndefined();
  });

  test('should return the only element if the array has one element', () => {
    const array = ['singleElement'];
    const result = last(array);
    expect(result).toBe('singleElement');
  });
});

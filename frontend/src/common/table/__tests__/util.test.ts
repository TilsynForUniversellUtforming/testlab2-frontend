import headingWithSorting, { headingWithoutSorting } from '@common/table/util';
import { describe, expect, it } from 'vitest';

describe('table-util functions', () => {
  describe('headingWithSorting', () => {
    it('should prepend a sorting number to a heading', () => {
      expect(headingWithSorting(1, 'Name')).toBe('_1_Name');
      expect(headingWithSorting(2, 'Date')).toBe('_2_Date');
    });
  });

  describe('headingWithoutSorting', () => {
    it('should remove the sorting prefix from a heading', () => {
      expect(headingWithoutSorting('_1_Name')).toBe('Name');
      expect(headingWithoutSorting('_2_Date')).toBe('Date');
    });

    it('should return the original string if no sorting prefix is found', () => {
      expect(headingWithoutSorting('Name')).toBe('Name');
      expect(headingWithoutSorting('Date')).toBe('Date');
    });
  });
});

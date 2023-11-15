import { describe, expect, it } from 'vitest';

import {
  isDefined,
  isOrgnummer,
  isUrl,
  isValidObject,
} from '../validationUtils';

describe('isDefined', () => {
  it('should return true for non-empty strings', () => {
    expect(isDefined('test')).toBe(true);
  });

  it('should return false for non-empty strings', () => {
    expect(isDefined('')).toBe(false);
  });

  it('should return true for non-empty arrays', () => {
    expect(isDefined(['test'])).toBe(true);
  });

  it('should return false for empty arrays', () => {
    expect(isDefined([])).toBe(false);
  });

  it('should return true for valid numbers', () => {
    expect(isDefined(1)).toBe(true);
  });

  it('should return true for NaN numbers', () => {
    expect(isDefined(Number('a'))).toBe(false);
  });

  it('should return false for empty objects', () => {
    expect(isDefined({})).toBe(false);
  });

  it('should return false for null', () => {
    expect(isDefined(null)).toBe(false);
  });

  it('should return false for undefined', () => {
    expect(isDefined(undefined)).toBe(false);
  });
});

describe('isValidObject', () => {
  it('should return true for non-empty objects', () => {
    expect(isValidObject({ key: 'value' })).toBe(true);
  });

  it('should return false for empty objects', () => {
    expect(isValidObject({})).toBe(false);
  });

  it('should return false for objects with undefined values', () => {
    expect(isValidObject({ key: undefined })).toBe(false);
  });
});

describe('isUrl', () => {
  it('should return true for valid URLs', () => {
    expect(isUrl('https://www.example.com')).toBe(true);
  });

  it('should return false for invalid URLs', () => {
    expect(isUrl('invalidurl')).toBe(false);
  });
});

describe('isOrgnummer', () => {
  it('should return true for valid orgnummer', () => {
    expect(isOrgnummer('991 825 827')).toBe(true);
  });

  it('should return false for too short/long orgnummer', () => {
    expect(isOrgnummer('123')).toBe(false);
    expect(isOrgnummer('0123456789')).toBe(false);
  });

  it('should return true for invalid orgnummer', () => {
    expect(isOrgnummer('123456789')).toBe(false);
  });
});

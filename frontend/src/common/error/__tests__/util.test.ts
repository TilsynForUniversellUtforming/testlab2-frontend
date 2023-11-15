import { describe, expect, it } from 'vitest';

import toError from '../util';

describe('toError', () => {
  it('should return the input if it is already an Error instance', () => {
    const inputError = new Error('Error message');
    const result = toError(inputError, 'Backup message');
    expect(result).toBe(inputError);
    expect(result.message).toBe('Error message');
  });

  it('should handle non-error inputs', () => {
    expect(toError(null, 'Null error').message).toBe('Null error');
    expect(toError(undefined, 'Undefined error').message).toBe(
      'Undefined error'
    );
    expect(toError(123, 'Number error').message).toBe('Number error');
    expect(toError({ message: 'Object error' }, 'Object error').message).toBe(
      'Object error'
    );
  });
});

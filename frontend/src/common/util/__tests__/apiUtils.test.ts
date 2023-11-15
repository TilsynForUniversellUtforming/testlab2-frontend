import { describe, expect, it, vi } from 'vitest';

import { responseToJson, withErrorHandling } from '../apiUtils';

describe('responseToJson', () => {
  it('should return JSON from a response if ok', async () => {
    const mockResponse = new Response(JSON.stringify({ data: 'test' }), {
      status: 200,
    });
    const result = await responseToJson(mockResponse, 'Error');
    expect(result).toEqual({ data: 'test' });
  });

  it('should throw an error if response is not ok', async () => {
    const mockResponse = new Response(null, {
      status: 404,
    });

    await expect(
      (async () => {
        await responseToJson(mockResponse, 'Error');
      })()
    ).rejects.toThrowError('Error');
  });
});

describe('withErrorHandling', () => {
  it('should call setError with undefined and then with the error on failure', async () => {
    const mockAsyncFunc = vi.fn().mockRejectedValue(new Error('Test Error'));
    const mockSetError = vi.fn();
    const wrappedFunc = withErrorHandling(
      mockAsyncFunc,
      'Default Error',
      mockSetError
    );

    await wrappedFunc();

    expect(mockSetError).toHaveBeenCalledWith(undefined);
    expect(mockSetError).toHaveBeenCalledWith(new Error('Test Error'));
    expect(mockSetError).toHaveBeenCalledTimes(2);
  });

  it('should return result of asyncFunc on success', async () => {
    const mockAsyncFunc = vi.fn().mockResolvedValue('success');
    const mockSetError = vi.fn();
    const wrappedFunc = withErrorHandling(
      mockAsyncFunc,
      'Default Error',
      mockSetError
    );

    await expect(wrappedFunc()).resolves.toBe('success');
    expect(mockSetError).toHaveBeenCalledWith(undefined);
  });
});

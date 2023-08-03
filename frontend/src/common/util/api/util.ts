import toError from '@common/error/util';

export const responseToJson = async (
  response: Response,
  errorMessage: string
) => {
  if (!response.ok) {
    const contentType = response.headers.get('content-type');
    if (contentType && contentType.includes('application/json')) {
      const errorResponse = await response.json();
      throw new Error(errorResponse.message || errorMessage);
    } else {
      const errorResponse = await response.text();
      throw new Error(errorResponse || errorMessage);
    }
  }
  return response.json();
};

// eslint-disable-next-line
export type AsyncFunc<T = any> = (...args: any[]) => Promise<T>;

export const withErrorHandling =
  (
    asyncFunc: AsyncFunc,
    errorMessage: string,
    setError: (e: Error | undefined) => void
  ) =>
  // eslint-disable-next-line
  async (...args: any[]) => {
    setError(undefined);
    try {
      return await asyncFunc(...args);
    } catch (e) {
      setError(toError(e, errorMessage));
    }
  };

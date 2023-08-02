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

export type AsyncFunc<T = any> = (...args: any[]) => Promise<T>;

export const withErrorHandling =
  (
    asyncFunc: AsyncFunc,
    errorMessage: string,
    setError: (e: Error | undefined) => void
  ) =>
  async (...args: any[]) => {
    setError(undefined);
    try {
      return await asyncFunc(...args);
    } catch (e: any) {
      setError(toError(e, errorMessage));
    }
  };

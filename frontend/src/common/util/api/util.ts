import toError from '@common/error/util';

export const responseToJson = (response: Response, errorMessage: string) => {
  if (response.ok) {
    return response.json();
  } else {
    throw new Error(errorMessage);
  }
};

export const getHeader = (
  response: Response,
  header: string,
  errorMessage: string
): string | undefined => {
  if (response.ok) {
    return response.headers.get(header)?.toString();
  } else {
    throw new Error(errorMessage);
  }
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

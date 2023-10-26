import toError from '@common/error/util';

export const responseToJson = (response: Response, errorMessage: string) => {
  if (response.ok) {
    return response.json();
  } else {
    throw new Error(errorMessage);
  }
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

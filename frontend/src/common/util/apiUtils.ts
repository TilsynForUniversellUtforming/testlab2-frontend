import toError from '@common/error/util';

/**
 * Converts a fetch API response to JSON, throwing an error if the response is not ok.
 *
 * @param {Response} response - The fetch API response object.
 * @param {string} errorMessage - The error message to throw if the response is not ok.
 * @return {Promise<any>} A promise that resolves with the JSON content of the response.
 * @throws {Error} If the response is not ok.
 */
export const responseToJson = (
  response: Response,
  errorMessage: string
  // eslint-disable-next-line
): Promise<any> => {
  if (response.ok) {
    return response.json();
  } else {
    throw new Error(errorMessage);
  }
};

/**
 * Type definition for an asynchronous function.
 *
 * @template T The type of the value returned by the asynchronous function.
 */
// eslint-disable-next-line
export type AsyncFunc<T = any> = (...args: any[]) => Promise<T>;

/**
 * Wraps an asynchronous function with error handling logic.
 * Resets an error state before executing the function and updates it if an error occurs.
 *
 * @param {AsyncFunc} asyncFunc - The asynchronous function to wrap.
 * @param {string} errorMessage - The error message to use if an error occurs.
 * @param {(e: Error | undefined) => void} setError - Function to set the error state.
 * @return {Promise<any>} The result of the async function or undefined if an error occurs.
 */
export const withErrorHandling =
  (
    asyncFunc: AsyncFunc,
    errorMessage: string,
    setError: (e: Error | undefined) => void
    // eslint-disable-next-line
  ): ((...args: any[]) => Promise<any>) =>
  // eslint-disable-next-line
  async (...args: any[]) => {
    setError(undefined);
    try {
      return await asyncFunc(...args);
    } catch (e) {
      setError(toError(e, errorMessage));
    }
  };

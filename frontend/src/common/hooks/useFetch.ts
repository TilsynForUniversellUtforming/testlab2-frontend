import { useCallback } from 'react';

import toError from '../error/util';

export interface Props<T extends object> {
  fetchData: () => Promise<T>;
  setData: (data: T) => void;
  setError: (error: Error | undefined) => void;
  setLoading: (loading: boolean) => void;
}

/**
 * A hook for fetching data asynchronously and handling loading and error states.
 * @template T - The type of the data object.
 * @param {() => Promise<T>} fetchData - The function to fetch data.
 * @param {(data: T) => void} setData - The function to update the state with the fetched data.
 * @param {(error: Error) => void} setError - The function to update the state with an error if one occurs during fetching.
 * @param {(loading: boolean) => void} setLoading - The function to update the state with the loading state of the fetch.
 * @returns {() => void} - A callback function to initiate the data fetching.
 */

const useFetch = <T extends object>({
  fetchData,
  setData,
  setError,
  setLoading,
}: Props<T>): (() => void) => {
  return useCallback(() => {
    setLoading(true);
    setError(undefined);

    const doFetch = async () => {
      try {
        const data = await fetchData();
        setData(data);
        setLoading(false);
      } catch (e) {
        setError(toError(e, String(e)));
      }
    };

    doFetch().finally(() => setLoading(false));
  }, []);
};

export default useFetch;

import { useCallback } from 'react';

export interface Props<T extends object> {
  fetchData: (fetchProps?: any) => Promise<T>;
  fetchProps?: any;
  setData: (data: T) => void;
  setError: (error: Error | undefined) => void;
  setLoading: (loading: boolean) => void;
}

/**
 * A hook for fetching data asynchronously and handling loading and error states.
 * @template T - The type of the data object.
 * @param {(fetchProps?: any) => Promise<T>} fetchData - The function to fetch data.
 * @param {any} fetchProps - Optional parameters to pass to the fetchData function.
 * @param {(data: T) => void} setData - The function to update the state with the fetched data.
 * @param {(error: Error) => void} setError - The function to update the state with an error if one occurs during fetching.
 * @param {(loading: boolean) => void} setLoading - The function to update the state with the loading state of the fetch.
 * @returns {() => Promise<void>} - A callback function to initiate the data fetching.
 */

const useFetch = <T extends object>({
  fetchData,
  fetchProps,
  setData,
  setError,
  setLoading,
}: Props<T>) => {
  return useCallback(() => {
    setLoading(true);
    setError(undefined);

    const doFetch = async () => {
      try {
        const data = await fetchData(fetchProps);
        setData(data);
        setLoading(false);
      } catch (e) {
        if (e instanceof Error) {
          setError(e);
        } else {
          setError(new Error(String(e)));
        }
      }
    };

    doFetch().finally(() => setLoading(false));
  }, []);
};

export default useFetch;

import { useCallback } from 'react';

export interface Props<T extends object> {
  fetchData: (fetchProps?: any) => Promise<T>;
  fetchProps?: any;
  setData: (data: T) => void;
  setError: (error: any) => void;
  setLoading: (loading: boolean) => void;
}

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
      const data = await fetchData(fetchProps);
      setData(data);
      setLoading(false);
    };

    doFetch()
      .catch((e) => setError(e))
      .finally(() => setLoading(false));
  }, []);
};

export default useFetch;

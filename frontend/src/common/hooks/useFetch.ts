import { useCallback } from 'react';

export interface Props<T extends object> {
  fetchData: (fetchProps?: any) => Promise<T>;
  setData: (data: T) => void;
  setError: (error: any) => void;
  setLoading: (loading: boolean) => void;
}

const useFetch = <T extends object>({
  fetchData,
  setData,
  setError,
  setLoading,
}: Props<T>) => {
  return useCallback(() => {
    setLoading(true);
    setError(undefined);

    const doFetch = async () => {
      const data = await fetchData();
      setData(data);
      setLoading(false);
    };

    doFetch()
      .catch((e) => setError(e))
      .finally(() => setLoading(false));
  }, []);
};

export default useFetch;

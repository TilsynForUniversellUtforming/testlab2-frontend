import { defer, useLoaderData } from 'react-router-dom';

export type RouterLoadType<T extends object> = {
  data: Promise<T>;
};

export const deferedType = <T extends object>(promise: Promise<T>) => {
  return defer({
    data: promise,
  });
};

const useLoaderFetch = <T extends object>() =>
  useLoaderData() as unknown as RouterLoadType<T>;

export default useLoaderFetch;

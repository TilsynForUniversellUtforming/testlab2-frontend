import { DependencyList, useEffect } from 'react';

const useDebouncedEffect = (
  effect: () => void,
  delay: number,
  deps: DependencyList[]
) => {
  useEffect(() => {
    const handler = setTimeout(() => effect(), delay);

    return () => clearTimeout(handler);
  }, [...deps, delay]);
};

export default useDebouncedEffect;

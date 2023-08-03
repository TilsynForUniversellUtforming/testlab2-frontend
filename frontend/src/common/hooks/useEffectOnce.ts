import { useEffect, useRef } from 'react';

/**
 * A custom React hook that runs an effect only once, when the component mounts, and cleans up the effect only when the component unmounts.
 * @param {() => void | (() => void)} effect - A function that runs when the component mounts, and optionally returns a cleanup function.
 * @returns {void}
 * @see https://stackoverflow.com/questions/75704144/react-18-how-to-make-functions-pure
 */
export const useEffectOnce = (effect: () => void | (() => void)) => {
  const destroyFunc = useRef<void | (() => void)>();
  const effectCalled = useRef(false);
  const renderAfterCalled = useRef(false);

  if (effectCalled.current) {
    renderAfterCalled.current = true;
  }

  useEffect(() => {
    if (!effectCalled.current) {
      destroyFunc.current = effect();
      effectCalled.current = true;
    }

    return () => {
      if (!renderAfterCalled.current) {
        return;
      }
      if (destroyFunc.current) {
        destroyFunc.current();
      }
    };
  }, []);
};

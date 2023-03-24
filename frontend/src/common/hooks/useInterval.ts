import { useEffect, useRef } from 'react';

import useIsomorphicLayoutEffect from './useIsomorphicLayoutEffect';

/**
 * A hook that schedules the given function to be called repeatedly every delay milliseconds.
 * @param callback - A function to be called every delay milliseconds.
 * @param delay - The number of milliseconds to wait before each execution of callback. Set to null to disable the interval.
 * @see https://usehooks-ts.com/useInterval/
 */

function useInterval(callback: () => void, delay: number | null) {
  const savedCallback = useRef(callback);

  /**
   * Update the reference to the callback function to ensure that it always has the latest value.
   * @param callback - The latest value of the callback function.
   */
  useIsomorphicLayoutEffect(() => {
    savedCallback.current = callback;
  }, [callback]);

  /**
   * Schedule an interval to execute the callback function.
   * @param delay - The number of milliseconds to wait before each execution of callback.
   */
  useEffect(() => {
    if (!delay && delay !== 0) {
      return;
    }

    const id = setInterval(() => savedCallback.current(), delay);

    return () => clearInterval(id);
  }, [delay]);
}

export default useInterval;

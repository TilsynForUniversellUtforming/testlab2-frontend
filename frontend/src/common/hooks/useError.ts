import { Dispatch, SetStateAction, useEffect, useState } from 'react';

const useError = (
  contextError: Error | undefined
): [Error | undefined, Dispatch<SetStateAction<Error | undefined>>] => {
  const [error, setError] = useState(contextError);

  useEffect(() => {
    setError(contextError);
  }, [contextError]);

  return [error, setError];
};

export default useError;

import { useEffect, useState } from 'react';

const useLoading = (
  contextLoading: boolean
): [boolean, React.Dispatch<React.SetStateAction<boolean>>] => {
  const [loading, setLoading] = useState(contextLoading);

  useEffect(() => {
    setLoading(contextLoading);
  }, [contextLoading]);

  return [loading, setLoading];
};

export default useLoading;

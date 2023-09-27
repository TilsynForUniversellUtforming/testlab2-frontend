import { useMatches } from 'react-router';

import { Handle, PathName } from '../types';

const usePathName = (): PathName[] =>
  useMatches()
    .filter((match) => match.handle)
    .map((match) => ({
      path: match.pathname,
      name: (match.handle as Handle).name,
    }));

export default usePathName;

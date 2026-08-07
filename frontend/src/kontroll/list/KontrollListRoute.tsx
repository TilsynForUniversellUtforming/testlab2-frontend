import { RouteObject } from 'react-router';

import { fetchAlleKontroller } from '../kontroll-api';
import KontrollList from './KontrollList';

export const KontrollListRoute: RouteObject = {
  element: <KontrollList />,
  handle: { name: 'Alle kontroller' },
  path: 'liste',
  loader: fetchAlleKontroller,
};

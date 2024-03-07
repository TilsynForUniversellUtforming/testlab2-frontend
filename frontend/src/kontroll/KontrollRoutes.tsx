import { AppRoute } from '@common/util/routeUtils';
import { RouteObject } from 'react-router-dom';

import Kontroll from './Kontroll';

export const KONTROLL_ROUTE: AppRoute = {
  navn: 'Kontroll',
  path: 'kontroll',
};

export const KontrollRoutes: RouteObject = {
  path: 'kontroll',
  element: <Kontroll />,
  handle: { name: 'Kontroll' },
  children: [],
};

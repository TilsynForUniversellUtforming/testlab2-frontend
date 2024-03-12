import { AppRoute } from '@common/util/routeUtils';
import { Heading } from '@digdir/design-system-react';
import { Outlet } from 'react-router';
import { RouteObject } from 'react-router-dom';

import Kontroll, { action } from './Kontroll';

export const KONTROLL_ROUTE: AppRoute = {
  navn: 'Kontroll',
  path: 'kontroll',
};

export const KontrollRoutes: RouteObject = {
  path: 'kontroll',
  element: <Outlet />,
  children: [
    {
      path: 'opprett-kontroll',
      element: <Kontroll />,
      handle: { name: 'Kontroll' },
      action: action,
    },
    {
      path: ':kontroll-id/velg-losninger',
      element: <Heading level={1}>Velg løsninger</Heading>,
      handle: { name: 'Velg løsninger' },
    },
  ],
};

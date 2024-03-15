import ErrorCard from '@common/error/ErrorCard';
import { Outlet } from 'react-router';
import { RouteObject, useRouteError } from 'react-router-dom';

import Kontroll, { action } from './Kontroll';
import { fetchKontroll } from './kontroll-api';
import VelgLoesninger from './VelgLoesninger';

export const KontrollRoutes: RouteObject = {
  path: 'kontroll',
  element: <Outlet />,
  errorElement: <ErrorElement />,
  children: [
    {
      path: 'opprett-kontroll',
      element: <Kontroll />,
      handle: { name: 'Kontroll' },
      action: action,
    },
    {
      path: ':kontrollId/velg-losninger',
      element: <VelgLoesninger />,
      handle: { name: 'Velg løsninger' },
      loader: async ({ params }) => {
        const kontrollId = parseInt(params.kontrollId ?? '', 10);
        if (isNaN(kontrollId)) {
          throw new Error('Id-en i URL-en er ikke et tall');
        }
        return fetchKontroll(kontrollId);
      },
    },
  ],
};

function ErrorElement() {
  const error = useRouteError() as Error;
  console.error(error);
  return <ErrorCard error={error} />;
}

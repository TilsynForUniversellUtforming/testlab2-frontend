import ErrorCard from '@common/error/ErrorCard';
import { Heading } from '@digdir/designsystemet-react';
import { Utval } from '@loeysingar/api/types';
import { fetchUtvalList } from '@loeysingar/api/utval-api';
import { Outlet } from 'react-router';
import { redirect, RouteObject, useRouteError } from 'react-router-dom';

import { fetchKontroll, updateKontroll } from './kontroll-api';
import OpprettKontroll, { action } from './OpprettKontroll';
import { Kontroll } from './types';
import VelgLoesninger from './VelgLoesninger';

export const KontrollRoutes: RouteObject = {
  path: 'kontroll',
  element: <Outlet />,
  errorElement: <ErrorElement />,
  children: [
    {
      path: 'opprett-kontroll',
      element: <OpprettKontroll />,
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
        const response = await fetchKontroll(kontrollId);
        if (!response.ok) {
          if (response.status === 404) {
            throw new Error('Det finnes ikke en kontroll med id ' + kontrollId);
          } else {
            throw new Error('Klarte ikke å hente kontrollen.');
          }
        }

        const utval = await fetchUtvalList();
        return { kontroll: await response.json(), utval };
      },
      action: async ({ request }) => {
        const { kontroll, utval, neste } = (await request.json()) as {
          kontroll: Kontroll;
          utval: Utval;
          neste: boolean;
        };
        const response = await updateKontroll(kontroll, utval);
        if (!response.ok) {
          throw new Error('Klarte ikke å lagre kontrollen.');
        }
        return neste ? redirect(`/kontroll/${kontroll.id}/sideutvalg`) : null;
      },
    },
    {
      path: ':kontrollId/sideutvalg',
      element: <Heading level={1}>Sideutvalg</Heading>,
    },
  ],
};

function ErrorElement() {
  const error = useRouteError() as Error;
  console.error(error);
  return <ErrorCard error={error} />;
}

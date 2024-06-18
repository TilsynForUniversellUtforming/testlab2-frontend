import { Utval } from '@loeysingar/api/types';
import { fetchUtvalList } from '@loeysingar/api/utval-api';
import { redirect, RouteObject } from 'react-router-dom';

import {
  fetchKontroll,
  fetchTestStatus,
  updateKontrollUtval,
} from '../kontroll-api';
import { getKontrollIdFromParams } from '../kontroll-utils';
import { Kontroll, steps } from '../types';
import VelgLoesninger from './VelgLoesninger';

export const VelgLoesningerRoute: RouteObject = {
  path: ':kontrollId/velg-losninger',
  element: <VelgLoesninger />,
  handle: { name: steps.loesying.name },
  loader: async ({ params }) => {
    const kontrollId = getKontrollIdFromParams(params.kontrollId);
    if (isNaN(kontrollId)) {
      throw new Error('Id-en i URL-en er ikke et tall');
    }
    const kontrollResponse = await fetchKontroll(kontrollId);
    const testStatusResponse = await fetchTestStatus(kontrollId);

    if (!kontrollResponse.ok) {
      if (kontrollResponse.status === 404) {
        throw new Error('Det finnes ikke en kontroll med id ' + kontrollId);
      } else {
        throw new Error('Klarte ikke å hente kontrollen.');
      }
    }

    if (!testStatusResponse.ok) {
      throw new Error('Klarte ikke å hente teststatus for kontrollen.');
    }

    const utval = await fetchUtvalList();
    return {
      kontroll: await kontrollResponse.json(),
      utval,
      testStatus: await testStatusResponse.json(),
    };
  },
  action: async ({ request }) => {
    const { kontroll, utval, neste } = (await request.json()) as {
      kontroll: Kontroll;
      utval: Utval;
      neste: boolean;
    };
    const response = await updateKontrollUtval(kontroll, utval);
    if (!response.ok) {
      throw new Error('Klarte ikke å lagre kontrollen.');
    }
    return neste
      ? redirect(`/kontroll/${kontroll.id}/${steps.testregel.relativePath}`)
      : { sistLagret: new Date() };
  },
};

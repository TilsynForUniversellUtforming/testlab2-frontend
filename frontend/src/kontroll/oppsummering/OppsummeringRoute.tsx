import { RouteObject } from 'react-router-dom';

import { fetchKontroll } from '../kontroll-api';
import { getKontrollIdFromParams } from '../kontroll-utils';
import { steps } from '../types';
import { Oppsummering } from './Oppsummering';

export const OppsummeringRoute: RouteObject = {
  path: ':kontrollId/oppsummering',
  handle: { name: steps.oppsummering.name },
  element: <Oppsummering />,
  loader: async ({ params }) => {
    const kontrollId = getKontrollIdFromParams(params.kontrollId);
    const response = await fetchKontroll(kontrollId);
    if (!response.ok) {
      if (response.status === 404) {
        throw new Error('Det finnes ikke en kontroll med id ' + kontrollId);
      } else {
        throw new Error('Klarte ikke å hente kontrollen.');
      }
    }
    return await response.json();
  },
};

import { isNotDefined } from '@common/util/validationUtils';
import { redirect, RouteObject } from 'react-router-dom';

import { fetchKontroll } from '../kontroll-api';
import { getKontrollIdFromParams } from '../kontroll-utils';
import { KontrollInit } from './kontrollInitValidationSchema';
import OpprettKontroll from './OpprettKontroll';

export type Errors = {
  server?: string;
};

export const OpprettKontrollRoute: RouteObject[] = [
  {
    index: true,
    element: <OpprettKontroll />,
    handle: { name: 'Opprett Kontroll' },
    action: async ({ request }) => {
      const errors: Errors = {};

      const kontroll = (await request.json()) as KontrollInit;

      const response = await fetch('/api/v1/kontroller', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(kontroll),
      });
      if (response.ok) {
        const { kontrollId } = await response.json();
        return redirect(`/kontroll/${kontrollId}/velg-losninger`);
      } else {
        errors.server =
          'Klarte ikke å opprette en ny kontroll. Dette er en systemfeil som må undersøkes og rettes opp i før vi kommer videre.';
        return errors;
      }
    },
  },
  {
    path: ':kontrollId',
    element: <OpprettKontroll />,
    handle: { name: 'Opprett Kontroll' },
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
    action: async ({ request }) => {
      const errors: Errors = {};

      const kontroll = (await request.json()) as KontrollInit;
      const kontrollId = kontroll.id;

      if (isNotDefined(kontrollId)) {
        errors.server =
          'Kan ikkje oppdatere kontroll, kunne ikkje hente kontroll';
        return errors;
      }

      const response = await fetch(`/api/v1/kontroller/${kontrollId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(kontroll),
      });
      if (response.ok) {
        const { kontrollId } = await response.json();
        return redirect(`/kontroll/${kontrollId}/velg-losninger`);
      } else {
        errors.server =
          'Klarte ikke å opprette en ny kontroll. Dette er en systemfeil som må undersøkes og rettes opp i før vi kommer videre.';
        return errors;
      }
    },
  },
];

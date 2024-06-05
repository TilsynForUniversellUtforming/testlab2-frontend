import { redirect, RouteObject } from 'react-router-dom';

import { editKontroll, fetchKontroll } from '../kontroll-api';
import { getKontrollIdFromParams } from '../kontroll-utils';
import { Kontroll } from '../types';
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
          'Klarte ikkje å oppretta ein ny kontroll. Dette er ein systemfeil som må undersøkjast og rettast opp i før me kjem vidare.';
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

      const kontrollEdit = (await request.json()) as Kontroll;
      const response = await editKontroll(kontrollEdit);
      if (response.ok) {
        return redirect(`/kontroll/${kontrollEdit.id}/velg-losninger`);
      } else {
        errors.server =
          'Klarte ikkje å endre kontrollen. Dette er ein systemfeil som må undersøkjast og rettast opp i før me kjem vidare.';
        return errors;
      }
    },
  },
];

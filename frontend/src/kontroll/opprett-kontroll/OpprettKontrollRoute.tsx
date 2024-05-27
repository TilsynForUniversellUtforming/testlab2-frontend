import { redirect, RouteObject } from 'react-router-dom';

import OpprettKontroll from './OpprettKontroll';
import { CreateKontrollType } from './opprettKontrollValidationSchema';

export type Errors = {
  server?: string;
};

export const OpprettKontrollRoute: RouteObject = {
  index: true,
  element: <OpprettKontroll />,
  handle: { name: 'Opprett Kontroll' },
  action: async ({ request }) => {
    const errors: Errors = {};

    const kontroll = (await request.json()) as CreateKontrollType;

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
};

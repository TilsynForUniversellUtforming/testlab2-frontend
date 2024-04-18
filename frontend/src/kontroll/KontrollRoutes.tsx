import ErrorCard from '@common/error/ErrorCard';
import { Heading } from '@digdir/designsystemet-react';
import { Utval } from '@loeysingar/api/types';
import { fetchUtvalList } from '@loeysingar/api/utval-api';
import { fetchRegelsettList } from '@testreglar/api/regelsett-api';
import { listTestreglar } from '@testreglar/api/testreglar-api';
import { Outlet } from 'react-router';
import { redirect, RouteObject, useRouteError } from 'react-router-dom';

import classes from './kontroll.module.css';
import {
  fetchKontroll,
  updateKontroll,
  updateKontrollTestreglar,
} from './kontroll-api';
import OpprettKontroll, { action } from './OpprettKontroll';
import { Oppsummering } from './oppsummering/Oppsummering';
import KontrollStepper from './stepper/KontrollStepper';
import { Kontroll, UpdateKontrollTestregel } from './types';
import { VelgTestreglarLoader } from './velg-testreglar/types';
import VelgTestreglar from './velg-testreglar/VelgTestreglar';
import VelgLoesninger from './VelgLoesninger';

const getKontrollIdFromParams = (
  kontrollIdString: string | undefined
): number => {
  const kontrollId = parseInt(kontrollIdString ?? '', 10);
  if (isNaN(kontrollId)) {
    throw new Error('Id-en i URL-en er ikke et tall');
  }
  return kontrollId;
};

export const steps = {
  opprett: { name: 'Opprett Kontroll', relativePath: '..' },
  loesying: { name: 'Vel løysingar', relativePath: 'velg-losninger' },
  testregel: { name: 'Vel testreglar', relativePath: 'velg-testreglar' },
  oppsummering: { name: 'Oppsummering', relativePath: 'oppsummering' },
  sideutval: { name: 'Gjennomfør sideutval', relativePath: 'sideutvalg' },
};

export const KontrollRoutes: RouteObject = {
  path: 'kontroll',
  element: <Outlet />,
  errorElement: <ErrorElement />,
  children: [
    {
      index: true,
      element: <OpprettKontroll />,
      handle: { name: steps.opprett.name },
      action: action,
    },
    {
      path: ':kontrollId/velg-losninger',
      element: <VelgLoesninger />,
      handle: { name: steps.loesying.name },
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
        return neste
          ? redirect(`/kontroll/${kontroll.id}/${steps.testregel.relativePath}`)
          : { sistLagret: new Date() };
      },
    },
    {
      path: ':kontrollId/sideutvalg',
      element: (
        <section className={classes.kontrollSection}>
          <KontrollStepper />
          <Heading level={1}>Sideutval</Heading>
        </section>
      ),
      handle: { name: steps.sideutval.name },
    },
    {
      path: ':kontrollId/velg-testreglar',
      element: <VelgTestreglar />,
      handle: { name: steps.testregel.name },
      loader: async ({ params }): Promise<VelgTestreglarLoader> => {
        const kontrollId = getKontrollIdFromParams(params.kontrollId);
        const kontroll = await fetchKontroll(kontrollId);
        if (!kontroll.ok) {
          if (kontroll.status === 404) {
            throw new Error('Det finnes ikke en kontroll med id ' + kontrollId);
          } else {
            throw new Error('Klarte ikke å hente kontrollen.');
          }
        }

        const [testregelList, regelsett] = await Promise.allSettled([
          listTestreglar(),
          fetchRegelsettList(true),
        ]);
        if (testregelList.status !== 'fulfilled') {
          throw new Error('Kunne ikkje hente testreglar');
        }

        if (regelsett.status !== 'fulfilled') {
          throw new Error('Kunne ikkje hente regelsett');
        }

        return {
          kontroll: await kontroll.json(),
          testregelList: testregelList.value,
          regelsettList: regelsett.value,
        };
      },
      action: async ({ request }) => {
        const { kontroll, testreglar } =
          (await request.json()) as UpdateKontrollTestregel;
        const response = await updateKontrollTestreglar(kontroll, testreglar);
        if (!response.ok) {
          throw new Error('Klarte ikke å lagre kontrollen.');
        }
        return { sistLagret: new Date() };
      },
    },
    {
      path: ':kontrollId/oppsummering',
      handle: { name: steps.oppsummering.name },
      element: <Oppsummering />,
      loader: ({ params }) =>
        fetchKontroll(getKontrollIdFromParams(params.kontrollId)),
    },
  ],
};

function ErrorElement() {
  const error = useRouteError() as Error;
  console.error(error);
  return <ErrorCard error={error} />;
}

import { fetchRegelsettList } from '@testreglar/api/regelsett-api';
import { listTestreglar } from '@testreglar/api/testreglar-api';
import { redirect, RouteObject } from 'react-router-dom';

import {
  fetchKontroll,
  getTestStatus,
  updateKontrollTestreglar,
} from '../kontroll-api';
import { getKontrollIdFromParams } from '../kontroll-utils';
import { steps, UpdateKontrollTestregel } from '../types';
import { VelgTestreglarLoader } from './types';
import VelgTestreglar from './VelgTestreglar';

export const VelgTestreglarRoute: RouteObject = {
  path: ':kontrollId/velg-testreglar',
  element: <VelgTestreglar />,
  handle: { name: steps.testregel.name },
  loader: async ({ params }): Promise<VelgTestreglarLoader> => {
    const kontrollId = getKontrollIdFromParams(params.kontrollId);
    const kontrollResponse = await fetchKontroll(kontrollId);
    const testStatusResponse = await getTestStatus(kontrollId);

    if (!kontrollResponse.ok) {
      if (kontrollResponse.status === 404) {
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
      kontroll: await kontrollResponse.json(),
      testregelList: testregelList.value,
      regelsettList: regelsett.value,
      testStatus: await testStatusResponse.json(),
    };
  },
  action: async ({ request }) => {
    const { kontroll, testreglar, neste } =
      (await request.json()) as UpdateKontrollTestregel;
    const response = await updateKontrollTestreglar(kontroll, testreglar);
    if (!response.ok) {
      throw new Error('Klarte ikke å lagre kontrollen.');
    }
    return neste
      ? redirect(`/kontroll/${kontroll.id}/${steps.sideutval.relativePath}`)
      : { sistLagret: new Date() };
  },
};

import { isDefined } from '@common/util/validationUtils';
import { Loeysing, Utval } from '@loeysingar/api/types';
import { getUtvalById } from '@loeysingar/api/utval-api';
import { redirect, RouteObject } from 'react-router-dom';

import { fetchKontroll, listSideutvalType, updateKontrollSideutval, } from '../kontroll-api';
import { getKontrollIdFromParams } from '../kontroll-utils';
import { Kontroll, steps, UpdateKontrollSideutval } from '../types';
import { SideutvalLoader } from './types';
import VelgSideutval from './VelgSideutval';

export const SideutvalRoute: RouteObject = {
  path: ':kontrollId/sideutval',
  element: <VelgSideutval />,
  handle: { name: steps.sideutval.name },
  loader: async ({ params }): Promise<SideutvalLoader> => {
    const kontrollId = getKontrollIdFromParams(params.kontrollId);
    const kontrollResponse = await fetchKontroll(kontrollId);
    if (!kontrollResponse.ok) {
      if (kontrollResponse.status === 404) {
        throw new Error('Det finnes ikke en kontroll med id ' + kontrollId);
      } else {
        throw new Error('Klarte ikke å hente kontrollen.');
      }
    }
    const kontroll: Kontroll = await kontrollResponse.json();
    const utvalId = kontroll?.utval?.id;

    const [sideutvalTypeList, utvalResponse] = await Promise.allSettled([
      listSideutvalType(),
      utvalId
        ? getUtvalById(utvalId)
        : Promise.reject('Kontroll manglar utval'),
    ]);

    if (sideutvalTypeList.status === 'rejected') {
      throw new Error('Kunne ikkje hente liste med sideutval-typer');
    }

    const loeysingList: Loeysing[] = [];

    if (utvalResponse.status === 'rejected') {
      if (utvalId) {
        throw new Error('Kunne ikkje hente løysingar for kontrollens utval');
      }
    } else if (utvalResponse.value) {
      const utval: Utval = await utvalResponse.value.json();
      loeysingList.push(...utval.loeysingar);
    }

    return {
      kontroll: kontroll,
      sideutvalTypeList: sideutvalTypeList.value,
      loeysingList: loeysingList,
    };
  },
  action: async ({ request }) => {
    const { kontroll, sideutvalList, neste } =
      (await request.json()) as UpdateKontrollSideutval;
    const filtredSideutvalList = sideutvalList.filter(
      (su) => isDefined(su.url) && isDefined(su.begrunnelse)
    );

    const response = await updateKontrollSideutval(
      kontroll,
      filtredSideutvalList
    );
    if (!response.ok) {
      throw new Error('Klarte ikke å lagre kontrollen.');
    }

    return neste
      ? redirect(`/kontroll/${kontroll.id}/${steps.oppsummering.relativePath}`)
      : { sistLagret: new Date() };
  },
};

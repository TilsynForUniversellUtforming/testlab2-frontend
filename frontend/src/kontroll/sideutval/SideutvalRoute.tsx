import { isDefined } from '@common/util/validationUtils';
import { Loeysing, Utval } from '@loeysingar/api/types';
import { getUtvalById } from '@loeysingar/api/utval-api';
import {
  fetchCrawlParametersKontroll,
  updateCrawlParameters,
} from '@maaling/api/maaling-api';
import { redirect, RouteObject } from 'react-router-dom';

import {
  fetchKontroll,
  listSideutvalType,
  updateKontrollSideutval,
} from '../kontroll-api';
import { getKontrollIdFromParams } from '../kontroll-utils';
import { Kontroll, steps, UpdateKontrollSideutval } from '../types';
import { SideutvalLoader } from './types';
import VelgSideutval from './VelgSideutval';

async function fetchKontrollOrThrow(kontrollId: number): Promise<Kontroll> {
  const kontrollResponse = await fetchKontroll(kontrollId);
  if (!kontrollResponse.ok) {
    if (kontrollResponse.status === 404) throw new Error('Det finnes ikke en kontroll med id ' + kontrollId);
    throw new Error('Klarte ikke å hente kontrollen.');
  }
  return kontrollResponse.json();
}

const getLoeysingList = async (
  utvalResponse: PromiseSettledResult<Response>,
  utvalId: number | undefined
) => {
  let loeysingList: Loeysing[] = [];
  if (utvalResponse.status === 'fulfilled' && utvalResponse.value) {
    const utval: Utval = await utvalResponse.value.json();
    loeysingList = utval.loeysingar;
  } else if (utvalId) {
    throw new Error('Kunne ikkje hente løysingar for kontrollens utval');
  }
  return loeysingList;
};

export const SideutvalRoute: RouteObject = {
  path: ':kontrollId/sideutval',
  element: <VelgSideutval />,
  handle: { name: steps.sideutval.name },
  loader: async ({ params }): Promise<SideutvalLoader> => {
    const kontrollId = getKontrollIdFromParams(params.kontrollId);
    const kontroll = await fetchKontrollOrThrow(kontrollId);
    const utvalId = kontroll?.utval?.id;
    const [sideutvalTypeList, utvalResponse] = await Promise.allSettled([
      listSideutvalType(),
      getUtvalById(utvalId),
    ]);

    if (sideutvalTypeList.status === 'rejected') throw new Error('Kunne ikkje hente liste med sideutval-typer');
    let loeysingList = await getLoeysingList(utvalResponse, utvalId);

    if (kontroll.kontrolltype === 'forenkla-kontroll') {
      const crawlParameters = await fetchCrawlParametersKontroll(kontroll.id);
      return {
        kontroll,
        sideutvalTypeList: sideutvalTypeList.value,
        loeysingList,
        crawlParameters,
      };
    }
    return {
      kontroll,
      sideutvalTypeList: sideutvalTypeList.value,
      loeysingList,
      crawlParameters: undefined,
    };
  },
  action: async ({ request }) => {
    const { kontroll, sideutvalList, crawlParameters, neste } =
      (await request.json()) as UpdateKontrollSideutval;

    if (sideutvalList.length > 0) {
      const filtredSideutvalList = sideutvalList.filter(
        (su) => isDefined(su.url)
      );

      const response = await updateKontrollSideutval(
        kontroll,
        filtredSideutvalList
      );
      if (!response.ok) {
        let respText = await response.text()
        throw new Error(`Klarte ikke å lagre kontrollen.${respText}`);
      }
    }

    if (isDefined(crawlParameters)) {
      await updateCrawlParameters(kontroll.id, crawlParameters);
    }

    return neste
      ? redirect(`/kontroll/${kontroll.id}/${steps.oppsummering.relativePath}`)
      : { sistLagret: new Date() };
  },
};

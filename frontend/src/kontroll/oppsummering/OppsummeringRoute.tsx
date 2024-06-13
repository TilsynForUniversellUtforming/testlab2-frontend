import { isDefined } from '@common/util/validationUtils';
import { Loeysing } from '@loeysingar/api/types';
import { Verksemd } from '@verksemder/api/types';
import { fetchVerksemdMany } from '@verksemder/api/verksemd-api';
import { RouteObject } from 'react-router-dom';

import { fetchKontroll } from '../kontroll-api';
import { getKontrollIdFromParams } from '../kontroll-utils';
import { Kontroll, steps } from '../types';
import { Oppsummering } from './Oppsummering';
import { OppsummeringLoadingType, VerksemdLoeysing } from './types';

const summarizeLoeysingar = (
  loeysingar: Loeysing[],
  verksemdar: Verksemd[]
): VerksemdLoeysing[] => {
  const verksemdIdName = new Map<number, string>();
  verksemdar.forEach((verksemd) =>
    verksemdIdName.set(verksemd.id, verksemd.namn)
  );

  const countMap: Record<string, number> = {};

  loeysingar.forEach((loeysing) => {
    const namn = isDefined(loeysing.verksemdId)
      ? verksemdIdName.get(loeysing.verksemdId) ?? loeysing.orgnummer
      : loeysing.orgnummer;
    if (namn) {
      countMap[namn] = (countMap[namn] || 0) + 1;
    }
  });

  return Object.entries(countMap).map(([namn, loeysingCount]) => ({
    namn,
    loeysingCount,
  }));
};

export const OppsummeringRoute: RouteObject = {
  path: ':kontrollId/oppsummering',
  handle: { name: steps.oppsummering.name },
  element: <Oppsummering />,
  loader: async ({ params }): Promise<OppsummeringLoadingType> => {
    const kontrollId = getKontrollIdFromParams(params.kontrollId);
    const kontrollResponse = await fetchKontroll(kontrollId);
    if (!kontrollResponse.ok) {
      if (kontrollResponse.status === 404) {
        throw new Error('Det finnes ikke en kontroll med id ' + kontrollId);
      } else {
        throw new Error('Klarte ikke å hente kontrollen.');
      }
    }
    const kontroll = (await kontrollResponse.json()) as Kontroll;
    const loeysingList = kontroll?.utval?.loeysingar ?? [];
    const kontrollVerksemdIds = loeysingList
      .filter((l) => isDefined(l.verksemdId))
      .map((l) => l.verksemdId as number);
    const verksemdList =
      kontrollVerksemdIds.length > 0
        ? await fetchVerksemdMany(kontrollVerksemdIds)
        : [];
    const verksemdLoesyingList = summarizeLoeysingar(
      loeysingList,
      verksemdList
    );

    return {
      kontroll: kontroll,
      verksemdLoesyingList: verksemdLoesyingList,
    };
  },
};

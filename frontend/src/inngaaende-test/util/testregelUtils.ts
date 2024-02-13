import { isDefined, isNotDefined } from '@common/util/validationUtils';
import { Sak } from '@sak/api/types';
import { NettsideProperties } from '@sak/types';
import { ResultatManuellKontroll } from '@test/api/types';
import {
  ManuellTestStatus,
  PageType,
  TestregelOverviewElement,
} from '@test/types';
import { Testregel } from '@testreglar/api/types';

export const getTestResultsForLoeysing = (
  testResults: ResultatManuellKontroll[],
  loeysingId: number | undefined
): ResultatManuellKontroll[] =>
  testResults.filter((tr) => tr.loeysingId === loeysingId);

export const progressionForLoeysingNettside = (
  sak: Sak,
  testResults: ResultatManuellKontroll[],
  nettsideId: number,
  loeysingId: number | undefined
): number => {
  const numFinishedTestResults = testResults.filter(
    (tr) =>
      tr.loeysingId === loeysingId && tr.nettsideId === nettsideId && tr.ferdig
  ).length;

  // TODO - Filtrer på valgt contentType, f.eks. alle testreglar med "IFrame"
  const numContentTestregel = sak.testreglar.length;

  return Math.round((numFinishedTestResults / numContentTestregel) * 100);
};

export const getNettsideProperties = (
  sak: Sak,
  loeysingId: number | undefined
): NettsideProperties[] =>
  sak.loeysingList.find((l) => loeysingId === l.loeysing.id)?.properties || [];

export const toPageType = (
  nettsideProperties: NettsideProperties[],
  nettsideId: number
): PageType => {
  const property =
    nettsideProperties.find((np) => np.id === nettsideId) ||
    nettsideProperties[0];

  if (isDefined(property?.id) && isDefined(property?.type)) {
    return { nettsideId: property.id, pageType: property.type };
  } else {
    throw Error('Sidetype finnes ikkje');
  }
};

export const getInitialPageType = (
  nettsideProperties: NettsideProperties[]
): PageType => {
  const property =
    nettsideProperties.find((np) => np.type === 'forside') ||
    nettsideProperties[0];

  if (isDefined(property?.id) && isDefined(property?.type)) {
    return { nettsideId: property.id, pageType: property.type };
  } else {
    throw Error('Sidetype finnes ikkje');
  }
};

export const toTestregelStatusKey = (
  sakId: number,
  loeysingId: number,
  testregelId: number,
  nettsideId: number
) => [sakId, loeysingId, testregelId, nettsideId].join('_');

export const toTestregelStatus = (
  testregelList: TestregelOverviewElement[],
  testResults: ResultatManuellKontroll[],
  sakId: number,
  loeysingId: number,
  nettsideId: number
): Map<string, ManuellTestStatus> =>
  new Map(
    testregelList.map((testregel) => {
      const tr = findActiveTestResult(
        testResults,
        sakId,
        loeysingId,
        testregel.id,
        nettsideId
      );

      // TODO - Slett når ResultatManuellKontroll har statusfelt
      let status: ManuellTestStatus;
      if (isNotDefined(tr)) {
        status = 'ikkje-starta';
      } else {
        if (tr.ferdig) {
          status = 'ferdig';
        } else {
          status = 'under-arbeid';
        }
      }
      // TODO - Slett

      return [
        toTestregelStatusKey(sakId, loeysingId, testregel.id, nettsideId),
        status,
      ];
    })
  );

export const toTestregelOverviewElement = ({
  id,
  name,
  krav,
}: Testregel): TestregelOverviewElement => {
  // TODO - Bruk testregelId som name
  const regex = /^((Nett-)?\d+\.\d+\.\d+([a-z])?)\s+(.*)$/;
  const result = name.match(regex);

  if (result && result.length > 3) {
    const firstPart = result[1];
    const secondPart = result[4];
    return { id: id, name: secondPart, krav: firstPart };
  }

  return { id: id, name: name, krav: krav };
};

export const findActiveTestResult = (
  testResultsLoeysing: ResultatManuellKontroll[],
  sakId: number | undefined,
  loeysingId: number | undefined,
  testregelId: number | undefined,
  nettsideId: number | undefined
): ResultatManuellKontroll | undefined => {
  if (!sakId || !loeysingId || !testregelId || !nettsideId) {
    throw Error('Kan ikkje finne testresultat for sak');
  }

  return testResultsLoeysing.find(
    (tr) =>
      tr.sakId === sakId &&
      tr.loeysingId === loeysingId &&
      tr.testregelId === testregelId &&
      tr.nettsideId === nettsideId
  );
};

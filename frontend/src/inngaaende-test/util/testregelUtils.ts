import { isDefined, isNotDefined } from '@common/util/validationUtils';
import { Sak } from '@sak/api/types';
import { NettsideProperties } from '@sak/types';
import { ManualTestResultat } from '@test/api/types';
import { PageType, TestregelOverviewElement, TestStatus } from '@test/types';
import { Testregel } from '@testreglar/api/types';

export const testResultsForLoeysing = (
  testResults: ManualTestResultat[],
  loeysingId?: string
): ManualTestResultat[] =>
  testResults.filter((tr) => String(tr.loeysingId) === loeysingId);

export const isAllNonRelevant = (testResults: ManualTestResultat[]) =>
  testResults.length > 0 &&
  testResults.every(
    (tr) => tr.elementResultat && tr.elementResultat === 'ikkjeForekomst'
  );

export const progressionForLoeysingNettside = (
  sak: Sak,
  testResults: ManualTestResultat[],
  nettsideId: number,
  loeysingId?: string
): number => {
  const numFinishedTestResults = testResults.filter(
    (tr) =>
      String(tr.loeysingId) === loeysingId &&
      tr.nettsideId === nettsideId &&
      tr.elementResultat
  ).length;
  // TODO - Filtrer på valgt contentType, f.eks. alle testreglar med "IFrame"
  const numContentTestregel = sak.testreglar.length;

  return Math.round(numFinishedTestResults / numContentTestregel);
};

export const getNettsideProperties = (
  sak: Sak,
  loeysingId?: string
): NettsideProperties[] =>
  sak.loeysingList.find((l) => loeysingId === String(l.loeysing.id))
    ?.properties || [];

export const toPageType = (
  nettsideProperties: NettsideProperties[],
  type: string
): PageType => {
  const property =
    nettsideProperties.find((np) => np.type === type) || nettsideProperties[0];

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

export const toTestregelStatus = (
  testregelList: TestregelOverviewElement[],
  testResults: ManualTestResultat[]
): Map<number, TestStatus> =>
  new Map(
    testregelList.map((testregel) => {
      let status: TestStatus;
      const tr = testResults.find(
        (testResult) => testResult.testregelId === testregel.id
      );
      if (isNotDefined(tr)) {
        status = 'ikkje-starta';
      } else {
        if (tr.ikkjeRelevant) {
          status = 'deaktivert';
        } else if (tr.svar.length > 0) {
          status = 'under-arbeid';
        } else if (tr.elementResultat === undefined) {
          status = 'ikkje-starta';
        } else {
          status = 'ferdig';
        }
      }

      return [testregel.id, status];
    })
  );

export const toTestregelOverviewElement = ({
  id,
  name,
  krav,
}: Testregel): TestregelOverviewElement => {
  // TODO - Bruk testregelId som name
  const regex = /^(\d+\.\d+\.\d+[a-zA-Z]?)\s+(.*)/;
  const result = name.match(regex);
  if (result && result.length === 3) {
    return { id: id, name: result[2], krav: result[1] };
  }

  return { id: id, name: name, krav: krav };
};

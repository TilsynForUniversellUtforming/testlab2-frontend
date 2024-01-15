import { isDefined } from '@common/util/validationUtils';
import { Sak } from '@sak/api/types';
import { NettsideProperties } from '@sak/types';
import { ManualTestResult, PageType } from '@test/types';

export const testResultsForLoeysing = (
  testResults: ManualTestResult[],
  loeysingId?: string
): ManualTestResult[] =>
  testResults.filter((tr) => String(tr.loeysingId) === loeysingId);

export const isAllNonRelevant = (testResults: ManualTestResult[]) =>
  testResults.length > 0 &&
  testResults.every(
    (tr) => tr.elementResultat && tr.elementResultat === 'ikkjeForekomst'
  );

export const progressionForLoeysingNettside = (
  sak: Sak,
  testResults: ManualTestResult[],
  nettsideId: number,
  loeysingId?: string
): number => {
  const numFinishedTestResults = testResults.filter(
    (tr) =>
      String(tr.loeysingId) === loeysingId &&
      tr.nettsideId === nettsideId &&
      tr.elementResultat
  ).length;
  const numContentTestregel = sak.testreglar.length; // TODO - Filtrer på valgt contentType, f.eks. alle testreglar med "IFrame"

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
  testResults: ManualTestResult[]
): Map<number, string> =>
  new Map(
    testResults.map((tr) => [tr.id, tr.elementResultat || 'ikkjeStarta'])
  );

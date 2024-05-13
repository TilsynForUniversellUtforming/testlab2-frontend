import { isDefined } from '@common/util/validationUtils';
import { Sak } from '@sak/api/types';
import { NettsideProperties } from '@sak/types';
import { ResultatManuellKontroll } from '@test/api/types';
import { PageType } from '@test/types';
import { filterTestregelByInnhaldstype } from '@test/util/testregelUtils';
import { InnhaldstypeTesting } from '@testreglar/api/types';

export const progressionForLoeysingNettsideSak = (
  sak: Sak,
  testResults: ResultatManuellKontroll[],
  nettsideId: number,
  innhaldstype: InnhaldstypeTesting,
  loeysingId: number
): number => {
  const testregelIdList = filterTestregelByInnhaldstype(
    sak.testreglar,
    innhaldstype
  ).map((tr) => tr.id);

  const finishedTestIdentifierArray = testResults
    .filter(
      (tr) =>
        testregelIdList.includes(tr.testregelId) &&
        tr.loeysingId === loeysingId &&
        tr.nettsideId === nettsideId &&
        tr.status === 'Ferdig'
    )
    .map((tr) => `${tr.testregelId}-${tr.loeysingId}-${tr.nettsideId}`);

  const numFinishedTestResults = new Set(finishedTestIdentifierArray).size;

  const numContentTestregel = testregelIdList.length;

  if (numContentTestregel > 0) {
    return Math.round((numFinishedTestResults / numContentTestregel) * 100);
  }

  // No testregel with current innhaldstype
  return 0;
};

export const getNettsidePropertiesSak = (
  sak: Sak,
  loeysingId: number | undefined
): NettsideProperties[] =>
  sak.loeysingList.find((l) => loeysingId === l.loeysing.id)?.properties || [];

export const getInitialPageTypeSak = (
  nettsideProperties: NettsideProperties[]
): PageType => {
  const property =
    nettsideProperties.find((np) => np.type === 'forside') ||
    nettsideProperties[0];

  const { id, type, url } = property;

  if (isDefined(id) && isDefined(type) && isDefined(url)) {
    return { sideId: id, pageType: type, url: url };
  } else {
    throw Error('Sidetype finnes ikkje');
  }
};

export const toPageTypeSak = (
  nettsideProperties: NettsideProperties[],
  nettsideId: number
): PageType => {
  const property =
    nettsideProperties.find((np) => np.id === nettsideId) ||
    nettsideProperties[0];

  const { id, type, url } = property;

  if (isDefined(id) && isDefined(type) && isDefined(url)) {
    return { sideId: id, pageType: type, url: url };
  } else {
    throw Error('Sidetype finnes ikkje');
  }
};

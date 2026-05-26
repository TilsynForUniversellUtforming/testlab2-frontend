import { toUnique } from '@common/util/arrayUtils';
import { capitalize } from '@common/util/stringutils';
import { isNotDefined } from '@common/util/validationUtils';
import { ResultatManuellKontroll, ResultatStatus } from '@test/api/types';
import {
  ManuellTestStatus,
  PageType,
  Testgrunnlag,
  TestregelOverviewElement,
} from '@test/types';
import { InnhaldstypeTesting, Testregel } from '@testreglar/api/types';
import { filterFerdig, getSideutvalForLoeysing } from '@test/test-overview/util/testOverviewUtils';
import { Sideutval, SideutvalType } from '../../kontroll/sideutval/types';

const toPercent = (finished: number, total: number): number =>
  total > 0 ? Math.round((finished / total) * 100) : 0;

export const progressionForTestgrunnlagSideutval = (
  testgrunnlag: Testgrunnlag,
  testResults: ResultatManuellKontroll[],
  loeysingId: number
): number => {
  const testregelIds = testgrunnlag.testreglar.map((tr) => tr.id);
  const numSideutval = getSideutvalForLoeysing(testgrunnlag, loeysingId).length;
  const numFinished = new Set(
    filterFerdig(testResults)
      .filter((tr) => testregelIds.includes(tr.testregelId) && tr.loeysingId === loeysingId)
      .map((tr) => `${tr.testregelId}-${tr.loeysingId}-${tr.sideutvalId}`)
  ).size;
  return toPercent(numFinished, testregelIds.length * numSideutval);
};

export const progressionForTestgrunnlagInnhaldstype = (
  testgrunnlag: Testgrunnlag,
  testResults: ResultatManuellKontroll[],
  loeysingId: number
): number => {
  const sideutvalIds = getSideutvalForLoeysing(testgrunnlag, loeysingId).map((su) => su.id);
  const finishedKeys = new Set(
    filterFerdig(testResults.filter((tr) => tr.loeysingId === loeysingId))
      .map((tr) => `${tr.sideutvalId}_${tr.testregelId}`)
  );
  const byInnhaldstype = Map.groupBy(testgrunnlag.testreglar, (tr) => tr.innhaldstypeTesting?.id ?? 0);
  if (byInnhaldstype.size === 0) return 0;

  const completed = [...byInnhaldstype.values()].reduce((sum, testreglar) => {
    const total = testreglar.length * sideutvalIds.length;
    if (total === 0) return sum;
    const numFinished = testreglar.reduce(
      (count, tr) => count + sideutvalIds.filter((sid) => finishedKeys.has(`${sid}_${tr.id}`)).length,
      0
    );
    return sum + numFinished / total / byInnhaldstype.size;
  }, 0);

  return Math.round(completed * 100);
};

export const progressionForSelection = (
  testregelList: Testregel[],
  testResults: ResultatManuellKontroll[],
  sideutvalId: number,
  innhaldstype: InnhaldstypeTesting
): number => {
  const testregelIds = filterTestregelByInnhaldstype(testregelList, innhaldstype).map((tr) => tr.id);
  const numFinished = new Set(
    filterFerdig(
      testResults.filter((tr) => testregelIds.includes(tr.testregelId) && tr.sideutvalId === sideutvalId)
    ).map((tr) => `${tr.testregelId}-${tr.loeysingId}-${tr.sideutvalId}`)
  ).size;
  return toPercent(numFinished, testregelIds.length);
};

export const getPageTypeList = (
  sideutvalList: Sideutval[],
  sideutvalType: SideutvalType[]
): PageType[] =>
  sideutvalList.reduce((acc: PageType[], su) => {
    let label: string;
    if (su.egendefinertType && su.egendefinertType.length > 0) {
      label = `Egendefinert: ${su.egendefinertType}`;
    } else {
      const type = sideutvalType.find((sut) => sut.id === su.typeId)?.type ?? '';
      const typeCount = acc.filter((item) => item.pageType.startsWith(type)).length;
      label = typeCount > 0 ? `${type} ${typeCount + 1}` : type;
    }
    acc.push({ sideId: su.id, pageType: label, url: su.url });
    return acc;
  }, []);

export const getInitialPageType = (pageTypeList: PageType[]): PageType => {
  const first = pageTypeList[0];
  if (isNotDefined(first)) throw new Error('Det finns ikkje sideutval for test');
  return pageTypeList.find((su) => su.pageType.toLowerCase() === 'forside') ?? first;
};

export const innhaldstypeAlle: InnhaldstypeTesting = { id: 0, innhaldstype: 'Alle' };

export const isTestFinished = (
  testResults: ResultatManuellKontroll[],
  testKeys: string[]
): boolean => {
  const finishedKeys = new Set(
    filterFerdig(testResults).map((tr) => toTestKey(tr.testregelId, tr.sideutvalId))
  );
  return (
    testKeys.length === finishedKeys.size &&
    testKeys.every((k) => finishedKeys.has(k))
  );
};

export const toTestregelStatusKey = (
  testgrunnlagId: number,
  testregelId: number,
  sideutvalId: number
) => [testgrunnlagId, testregelId, sideutvalId].join('_');

const deriveTestregelStatus = (
  testresults: ResultatManuellKontroll[]
): ManuellTestStatus => {
  if (testresults.length === 0) return 'ikkje-starta';
  if (filterFerdig(testresults).length === testresults.length) return 'ferdig';
  return 'under-arbeid';
};

export const toTestregelStatus = (
  testregelList: TestregelOverviewElement[],
  testResults: ResultatManuellKontroll[],
  testgrunnlagId: number,
  sideutvalId: number
): Map<string, ManuellTestStatus> =>
  new Map(
    testregelList.map((testregel) => [
      toTestregelStatusKey(testgrunnlagId, testregel.id, sideutvalId),
      // TODO - Slett når ResultatManuellKontroll har statusfelt
      deriveTestregelStatus(findActiveTestResults(testResults, testgrunnlagId, testregel.id, sideutvalId)),
    ])
  );

const toTestregelOverviewElement = ({ id, namn, testregelId }: Testregel): TestregelOverviewElement => {
  const match = namn.match(/^((Nett-|App-)?\d+\.\d+\.\d+([a-z])?)\s+(.*)$/);
  return { id, name: match ? match[4] : namn, krav: capitalize(testregelId) };
};

export const filterTestregelByInnhaldstype = (
  testregelList: Testregel[],
  innhaldstype: InnhaldstypeTesting
) =>
  testregelList.filter(
    (tr) => innhaldstype.innhaldstype === 'Alle' || tr.innhaldstypeTesting?.id === innhaldstype.id
  );

export const mapTestregelOverviewElements = (
  testregelList: Testregel[],
  innhaldstype: InnhaldstypeTesting,
  sideutvalId: number,
  testKeys: string[]
) =>
  filterTestregelByInnhaldstype(testregelList, innhaldstype)
    .filter((tr) => testKeys.includes(toTestKey(tr.id, sideutvalId)))
    .map(toTestregelOverviewElement);

export function findActiveTestResults(
  testResults: ResultatManuellKontroll[],
  testgrunnlagId: number,
  testregelId: number,
  sideId: number
): ResultatManuellKontroll[] {
  return testResults.filter(
    (tr) =>
      tr.testgrunnlagId === testgrunnlagId &&
      tr.testregelId === testregelId &&
      tr.sideutvalId === sideId
  );
}

export const getInnhaldstypeInTest = (innhaldstypeList: InnhaldstypeTesting[]) =>
  [innhaldstypeAlle, ...innhaldstypeList.toSorted()];

export const mapStatus = (frontendState: ManuellTestStatus): ResultatStatus => {
  switch (frontendState) {
    case 'ferdig': return 'Ferdig';
    case 'deaktivert': return 'Deaktivert';
    case 'under-arbeid': return 'UnderArbeid';
    case 'ikkje-starta': return 'IkkjePaabegynt';
  }
};

export const getIdFromParams = (idString: string | undefined): number => {
  const id = Number.parseInt(idString ?? '', 10);
  if (Number.isNaN(id)) throw new Error('Id-en i URL-en er ikke et tall');
  return id;
};

// Lager nøkler for alle kombinasjonar av testregler og sideutval som skal testast
export const toTestKeys = (
  testgrunnlag: Testgrunnlag,
  testresultat: ResultatManuellKontroll[]
) =>
  testgrunnlag.type === 'RETEST'
    ? toUnique(testresultat.map((tr) => toTestKey(tr.testregelId, tr.sideutvalId)))
    : testgrunnlag.testreglar.flatMap((tr) =>
        testgrunnlag.sideutval.map((su) => toTestKey(tr.id, su.id))
      );

export const toTestKey = (testregelId: number, sideutvalId: number): string =>
  `${testregelId}_${sideutvalId}`;

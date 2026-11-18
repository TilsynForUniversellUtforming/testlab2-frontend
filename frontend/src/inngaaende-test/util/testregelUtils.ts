import { toUnique } from '@common/util/arrayUtils';
import { capitalize } from '@common/util/stringutils';
import { isNotDefined } from '@common/util/validationUtils';
import { elementOmtaleSide, ElementResultat, ResultatManuellKontroll, ResultatStatus, } from '@test/api/types';
import { ManuellTestStatus, PageType, Testgrunnlag, TestregelOverviewElement, } from '@test/types';
import { InnhaldstypeTesting, Testregel } from '@testreglar/api/types';
import { filterFerdig } from '@test/test-overview/util/testOverviewUtils';
import { Sideutval, SideutvalType } from '../../kontroll/sideutval/types';

const toPercent = (finished: number, total: number): number =>
  total > 0 ? Math.round((finished / total) * 100) : 0;
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
  testregelList: Testregel[],
  testResults: ResultatManuellKontroll[],
  testgrunnlagId: number,
  sideutvalId: number
): Map<string, ManuellTestStatus> =>
  new Map(
    testregelList.map((testregel) => [
      toTestregelStatusKey(testgrunnlagId, testregel.id, sideutvalId),
      deriveTestregelStatus(findActiveTestResults(testResults, testgrunnlagId, testregel.id, sideutvalId)),
    ])
  );

const toTestregelOverviewElement = (
  { id, namn, testregelId }: Testregel,
  sideutfall: ElementResultat | undefined,
  sideutvalId: number,
  status: ManuellTestStatus
): TestregelOverviewElement => {
  const match = new RegExp(/^((Nett-|App-)?\d+\.\d+\.\d+([a-z])?)\s+(.*)$/).exec(
    namn
  );
  return { sideutfall, sideutvalId, status, testregelId: id, name: match ? match[4] : namn, krav: capitalize(testregelId) };
};

export const filterTestregelByInnhaldstype = (
  testregelList: Testregel[],
  innhaldstype: InnhaldstypeTesting
) =>
  testregelList.filter(
    (tr) => innhaldstype.innhaldstype === 'Alle' || tr.innhaldstypeTesting?.id === innhaldstype.id
  );


export const filterTestregelByTestKeys = (
  testregelList: Testregel[],
  innhaldstype: InnhaldstypeTesting,
  testKeys: string[],
  sideutvalId: number
): Testregel[] => {
  return filterTestregelByInnhaldstype(testregelList, innhaldstype).filter(
    (tr) => testKeys.includes(toTestKey(tr.id, sideutvalId))
  );
};

export const mapTestregelOverviewElements = (
  testregelList: Testregel[],
  sideutvalId: number,
  testStatusMap: Map<string, ManuellTestStatus>,
  testgrunnlagId:number,
  testresults: ResultatManuellKontroll[]
) => {
  return testregelList.map((testregel) => {
    const status =
      testStatusMap.get(
        toTestregelStatusKey(testgrunnlagId, testregel.id, sideutvalId)
      ) ?? 'ikkje-starta';
    const sideUtfall = testresults.find(
      (tr) =>
        tr.testgrunnlagId === testgrunnlagId &&
        tr.testregelId === testregel.id &&
        tr.sideutvalId === sideutvalId &&
        tr.element?.elementOmtale === elementOmtaleSide
    );

    return toTestregelOverviewElement(
      testregel,
      sideUtfall?.element?.elementResultat,
      sideutvalId,
      status
    );
  });
}

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
    case 'under-arbeid': return 'UnderArbeid';
    case 'ikkje-starta': return 'IkkjePaabegynt';
    case 'samsvar': return 'Ferdig';
    case 'ikkje-forekomst': return 'Ferdig';
    default: {
      throw new Error(`Ukjent frontendState: ${frontendState}`);
    }
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
        testgrunnlag.sideutval.map((su) => toTestKey(tr, su.id))
      );

export const toTestKey = (testregelId: number, sideutvalId: number): string =>
  `${testregelId}_${sideutvalId}`;

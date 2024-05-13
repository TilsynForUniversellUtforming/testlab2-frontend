import { capitalize } from '@common/util/stringutils';
import { isDefined, isNotDefined } from '@common/util/validationUtils';
import { ResultatManuellKontroll } from '@test/api/types';
import { ManuellTestStatus, TestregelOverviewElement } from '@test/types';
import { InnhaldstypeTesting, Testregel } from '@testreglar/api/types';

export const innhaldstypeAlle: InnhaldstypeTesting = {
  id: 0,
  innhaldstype: 'Alle',
};

export const isTestFinished = (
  testResults: ResultatManuellKontroll[],
  testregelIdList: number[],
  loeysingId: number,
  nettsideLength: number
): boolean => {
  const finishedTestIdentifierArray = testResults
    .filter(
      (tr) =>
        testregelIdList.includes(tr.testregelId) &&
        tr.loeysingId === loeysingId &&
        tr.status === 'Ferdig'
    )
    .map(
      (tr) =>
        `${tr.testregelId}-${tr.loeysingId}-${tr.nettsideId ?? tr.sideutvalId}`
    );

  const totalTestregelToTest = testregelIdList.length * nettsideLength;

  return new Set(finishedTestIdentifierArray).size === totalTestregelToTest;
};

export const toTestregelStatusKey = (
  testgrunnlagId: number,
  loeysingId: number,
  testregelId: number,
  nettsideId: number
) => [testgrunnlagId, loeysingId, testregelId, nettsideId].join('_');

export const toTestregelStatus = (
  testregelList: TestregelOverviewElement[],
  testResults: ResultatManuellKontroll[],
  testgrunnlagId: number,
  loeysingId: number,
  nettsideId: number
): Map<string, ManuellTestStatus> =>
  new Map(
    testregelList.map((testregel) => {
      const testresults = findActiveTestResults(
        testResults,
        testgrunnlagId,
        loeysingId,
        testregel.id,
        nettsideId
      );

      // TODO - Slett når ResultatManuellKontroll har statusfelt
      let status: ManuellTestStatus;
      if (isNotDefined(testresults)) {
        status = 'ikkje-starta';
      } else {
        if (
          testresults.filter((tr) => tr.status === 'Ferdig').length ===
          testresults.length
        ) {
          status = 'ferdig';
        } else {
          status = 'under-arbeid';
        }
      }
      // TODO - Slett

      return [
        toTestregelStatusKey(
          testgrunnlagId,
          loeysingId,
          testregel.id,
          nettsideId
        ),
        status,
      ];
    })
  );

const toTestregelOverviewElement = ({
  id,
  namn,
  testregelId,
}: Testregel): TestregelOverviewElement => {
  const regex = /^((Nett-|App-)?\d+\.\d+\.\d+([a-z])?)\s+(.*)$/;
  const result = namn.match(regex);

  if (result && result.length > 3) {
    const secondPart = result[4];
    return { id: id, name: secondPart, krav: capitalize(testregelId) };
  }

  return { id: id, name: namn, krav: capitalize(testregelId) };
};

export const filterTestregelByInnhaldstype = (
  testregelList: Testregel[],
  innhaldstype: InnhaldstypeTesting
) =>
  testregelList.filter(
    (tr) =>
      innhaldstype.innhaldstype === 'Alle' ||
      tr.innhaldstypeTesting?.id === innhaldstype.id
  );

export const mapTestregelOverviewElements = (
  testregelList: Testregel[],
  innhaldstype: InnhaldstypeTesting
) =>
  filterTestregelByInnhaldstype(testregelList, innhaldstype).map((tr) =>
    toTestregelOverviewElement(tr)
  );

export function findActiveTestResults(
  testResults: ResultatManuellKontroll[],
  testgrunnlagId: number,
  loeysingId: number,
  testregelId: number,
  sideId: number
): ResultatManuellKontroll[] {
  return testResults.filter(
    (tr) =>
      tr.testgrunnlagId === testgrunnlagId &&
      tr.loeysingId === loeysingId &&
      tr.testregelId === testregelId &&
      (tr.nettsideId === sideId || tr.sideutvalId === sideId)
  );
}

export const getInnhaldstypeInTest = (
  testregelList: Testregel[],
  innhaldstypeList: InnhaldstypeTesting[]
) => {
  const innhaldstypeIdInTest = testregelList
    .map((tr) => tr.innhaldstypeTesting?.id)
    .filter((id) => isDefined(id));
  return [
    innhaldstypeAlle,
    ...innhaldstypeList
      .filter((it) => innhaldstypeIdInTest.includes(it.id))
      .sort(),
  ];
};

import { toUnique } from '@common/util/arrayUtils';
import { capitalize } from '@common/util/stringutils';
import { isDefined, isNotDefined } from '@common/util/validationUtils';
import { ResultatManuellKontroll, ResultatStatus } from '@test/api/types';
import {
  ManuellTestStatus,
  PageType,
  Testgrunnlag,
  TestregelOverviewElement,
} from '@test/types';
import { InnhaldstypeTesting, Testregel } from '@testreglar/api/types';

import { Sideutval, SideutvalType } from '../../kontroll/sideutval/types';

export const progressionForTestgrunnlagSideutval = (
  testgrunnlag: Testgrunnlag,
  testResults: ResultatManuellKontroll[],
  loeysingId: number
): number => {
  const testregelIdList = testgrunnlag.testreglar.map((tr) => tr.id) ?? [];
  const numSideutval = testgrunnlag.sideutval.filter(
    (su) => su.loeysingId === loeysingId
  ).length;

  const finishedTestIdentifierArray = testResults
    .filter(
      (tr) =>
        testregelIdList.includes(tr.testregelId) &&
        tr.loeysingId === loeysingId &&
        tr.status === 'Ferdig'
    )
    .map((tr) => `${tr.testregelId}-${tr.loeysingId}-${tr.sideutvalId}`);

  const numFinishedTestResults = new Set(finishedTestIdentifierArray).size;

  const numContentTestregel = testregelIdList.length * numSideutval;

  if (numContentTestregel > 0) {
    return Math.round((numFinishedTestResults / numContentTestregel) * 100);
  }

  // No testregel with current innhaldstype
  return 0;
};

export const progressionForTestgrunnlagInnhaldstype = (
  testgrunnlag: Testgrunnlag,
  testResults: ResultatManuellKontroll[],
  loeysingId: number
): number => {
  const sideutvalIds = testgrunnlag.sideutval
    .filter((su) => su.loeysingId === loeysingId)
    .map((su) => su.id);
  const innhaldstypeIds = new Set(
    testgrunnlag.testreglar.map((tr) => (tr.innhaldstypeTesting ?? 0) as number)
  );
  const finishedTestIdentifierArray = testResults
    .filter((tr) => tr.loeysingId === loeysingId && tr.status === 'Ferdig')
    .map((tr) => `${tr.sideutvalId}_${tr.testregelId}`);

  let completed = 0;
  innhaldstypeIds.forEach((innhaldstypeId) => {
    // Tester som skal gjøres for denne innhaldstypen
    const testsForInnhaldstype = testgrunnlag.testreglar
      .filter(
        (tr) => ((tr.innhaldstypeTesting ?? 0) as number) === innhaldstypeId
      )
      .flatMap((tr) =>
        sideutvalIds.map((sideutvalId) => `${sideutvalId}_${tr.id}`)
      );

    if (testsForInnhaldstype.length !== 0) {
      // Ferdige tester for denne innhaldstypen
      const numFinished = testsForInnhaldstype.filter((testIdentifier) =>
        finishedTestIdentifierArray.includes(testIdentifier)
      ).length;

      const percentFinished = numFinished / testsForInnhaldstype.length;

      completed += percentFinished / innhaldstypeIds.size;
    }
  });

  return Math.round(completed * 100);
};

export const progressionForSelection = (
  testregelList: Testregel[],
  testResults: ResultatManuellKontroll[],
  sideutvalId: number,
  innhaldstype: InnhaldstypeTesting
): number => {
  const testregelIdList = filterTestregelByInnhaldstype(
    testregelList,
    innhaldstype
  ).map((tr) => tr.id);

  const finishedTestIdentifierArray = testResults
    .filter(
      (tr) =>
        testregelIdList.includes(tr.testregelId) &&
        tr.sideutvalId === sideutvalId &&
        tr.status === 'Ferdig'
    )
    .map((tr) => `${tr.testregelId}-${tr.loeysingId}-${tr.sideutvalId}`);

  const numFinishedTestResults = new Set(finishedTestIdentifierArray).size;

  const numContentTestregel = testregelIdList.length;

  if (numContentTestregel > 0) {
    return Math.round((numFinishedTestResults / numContentTestregel) * 100);
  }

  // No testregel with current innhaldstype
  return 0;
};
export const getPageTypeList = (
  sideutvalList: Sideutval[],
  sideutvalType: SideutvalType[]
): PageType[] => {
  return sideutvalList.reduce((acc: PageType[], su) => {
    let label: string;
    if (su.egendefinertType && su.egendefinertType.length > 0) {
      label = `Egendefinert: ${su.egendefinertType}`;
    } else {
      const type =
        sideutvalType.find((sut) => sut.id === su.typeId)?.type ?? '';
      const existingType = acc.find((item) => item.pageType.startsWith(type));
      if (existingType) {
        const typeCount =
          acc.filter((item) => item.pageType.startsWith(type)).length + 1;
        label = `${type} ${typeCount}`;
      } else {
        label = type;
      }
    }

    acc.push({
      sideId: su.id,
      pageType: label,
      url: su.url,
    });
    return acc;
  }, []);
};

export const getInitialPageType = (pageTypeList: PageType[]): PageType => {
  const firstInSideutval = pageTypeList[0];
  if (isNotDefined(firstInSideutval)) {
    throw Error('Det finns ikkje sideutval for test');
  }

  const forside = pageTypeList.find(
    (su) => su.pageType.toLowerCase() === 'forside'
  );

  return forside ?? firstInSideutval;
};
export const innhaldstypeAlle: InnhaldstypeTesting = {
  id: 0,
  innhaldstype: 'Alle',
};

export const isTestFinished = (
  testResults: ResultatManuellKontroll[],
  testKeys: string[]
): boolean => {
  const finishedTestIdentifierArray = toFinishedTestresultKeys(testResults);
  const notFinished = testKeys.filter(
    (tk) => !finishedTestIdentifierArray.includes(tk)
  );
  return notFinished.length === 0;
};

export const toTestregelStatusKey = (
  testgrunnlagId: number,
  testregelId: number,
  sideutvalId: number
) => [testgrunnlagId, testregelId, sideutvalId].join('_');

export const toTestregelStatus = (
  testregelList: TestregelOverviewElement[],
  testResults: ResultatManuellKontroll[],
  testgrunnlagId: number,
  sideutvalId: number
): Map<string, ManuellTestStatus> =>
  new Map(
    testregelList.map((testregel) => {
      const testresults = findActiveTestResults(
        testResults,
        testgrunnlagId,
        testregel.id,
        sideutvalId
      );

      // TODO - Slett når ResultatManuellKontroll har statusfelt
      let status: ManuellTestStatus;
      if (isNotDefined(testresults)) {
        status = 'ikkje-starta';
      } else if (
        testresults.filter((tr) => tr.status === 'Ferdig').length ===
        testresults.length
      ) {
        status = 'ferdig';
      } else {
        status = 'under-arbeid';
      }
      // TODO - Slett

      return [
        toTestregelStatusKey(testgrunnlagId, testregel.id, sideutvalId),
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
  innhaldstype: InnhaldstypeTesting,
  sideutvalId: number,
  testKeys: string[]
) => {
  const testregelByInnhaldstype = filterTestregelByInnhaldstype(
    testregelList,
    innhaldstype
  );
  const testreglarInTest = testregelByInnhaldstype.filter((tr) =>
    testKeys.includes(toTestKey(tr.id, sideutvalId))
  );

  return testreglarInTest.map((tr) => toTestregelOverviewElement(tr));
};

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

export const mapStatus = (frontendState: ManuellTestStatus): ResultatStatus => {
  switch (frontendState) {
    case 'ferdig':
      return 'Ferdig';
    case 'deaktivert':
      return 'Deaktivert';
    case 'under-arbeid':
      return 'UnderArbeid';
    case 'ikkje-starta':
      return 'IkkjePaabegynt';
  }
};

export const getIdFromParams = (idString: string | undefined): number => {
  const id = parseInt(idString ?? '', 10);
  if (isNaN(id)) {
    throw new Error('Id-en i URL-en er ikke et tall');
  }
  return id;
};

const toFinishedTestresultKeys = (testresultater: ResultatManuellKontroll[]) =>
  toUnique(
    testresultater
      .filter((tr) => tr.status === 'Ferdig')
      .map((tr) => toTestKey(tr.testregelId, tr.sideutvalId))
  );

// Lager nøkler for alle kobinasjoner av testregler og sideutval som skal testes slik at alle tester har en unik nøkkel
export const toTestKeys = (
  testgrunnlag: Testgrunnlag,
  testresultat: ResultatManuellKontroll[]
) => {
  if (testgrunnlag.type === 'RETEST') {
    return toUnique(
      testresultat.map((tr) => toTestKey(tr.testregelId, tr.sideutvalId))
    );
  }

  return testgrunnlag.testreglar.flatMap((tr) =>
    testgrunnlag.sideutval.map((su) => toTestKey(tr.id, su.id))
  );
};

export const toTestKey = (testregelId: number, sideutvalId: number): string =>
  `${testregelId}_${sideutvalId}`;

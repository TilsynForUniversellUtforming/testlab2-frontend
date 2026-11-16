import { useMemo } from 'react';
import {
  filterTestregelByInnhaldstype,
  mapTestregelOverviewElements,
  toTestKey,
  toTestregelStatus,
} from '@test/util/testregelUtils';
import { InnhaldstypeTesting, Testregel } from '@testreglar/api/types';
import { ResultatManuellKontroll } from '@test/api/types';

export interface UseTestOverviewElementProps {
  testgrunnlagId: number;
  testResultatForLoeysing: ResultatManuellKontroll[];
  testreglarForLoeysing: Testregel[];
  testKeys: string[];
  sideId:number,
  innhaldstype:InnhaldstypeTesting,
  testResults:ResultatManuellKontroll[],
}

export const useTestOverviewElement = ({
  testgrunnlagId,
  testreglarForLoeysing,
  testKeys,
  sideId,
  innhaldstype,
  testResults,
}: UseTestOverviewElementProps) => {
  const filteredTestregel = useMemo(
    () =>
      filterTestregelByTestKeys(
        testreglarForLoeysing,
        innhaldstype,
        testKeys,
        sideId
      ),
    [testreglarForLoeysing, innhaldstype, testKeys, sideId]
  );

  const testStatusMap = useMemo(
    () =>
      toTestregelStatus(filteredTestregel, testResults, testgrunnlagId, sideId),
    [filteredTestregel, testResults, testgrunnlagId, sideId]
  );

  const testregelListElements = useMemo(
    () =>
      mapTestregelOverviewElements(
        testreglarForLoeysing,
        sideId,
        testStatusMap,
        testgrunnlagId,
        testResults
      ),
    [testreglarForLoeysing, sideId, testStatusMap, testgrunnlagId, testResults]
  );

  return { testregelListElements,testStatusMap };
};

function filterTestregelByTestKeys(
  testregelList: Testregel[],
  innhaldstype: InnhaldstypeTesting,
  testKeys: string[],
  sideutvalId: number
): Testregel[] {
  return filterTestregelByInnhaldstype(testregelList, innhaldstype).filter(
    (tr) => testKeys.includes(toTestKey(tr.id, sideutvalId))
  );
}
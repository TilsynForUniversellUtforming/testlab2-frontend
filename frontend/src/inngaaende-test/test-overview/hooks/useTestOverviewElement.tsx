import { useMemo } from 'react';
import {
  filterTestregelByInnhaldstype,
  mapTestregelOverviewElements,
  toTestKey,
  toTestregelStatus,
} from '@test/util/testregelUtils';
import { InnhaldstypeTesting, Testregel } from '@testreglar/api/types';
import { useTestSession } from '@test/test-overview/hooks/testSessionContext';

export interface UseTestOverviewElementProps {
  testreglarForLoeysing: Testregel[];
  testKeys: string[];
}

export const useTestOverviewElement = ({
  testreglarForLoeysing,
  testKeys,
}: UseTestOverviewElementProps) => {


  const {sideId,innhaldstype,testgrunnlagId,testResults} = useTestSession()
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
        filteredTestregel,
        sideId,
        testStatusMap,
        testgrunnlagId,
        testResults
      ),
    [filteredTestregel, sideId, testStatusMap, testgrunnlagId, testResults]
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
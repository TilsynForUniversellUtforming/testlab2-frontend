import { useState, useMemo, useCallback } from 'react';
import {
  isTestFinished,
  getPageTypeList,
  getInitialPageType,
  mapTestregelOverviewElements,
  progressionForSelection,
  toTestregelStatus,
} from '@test/util/testregelUtils';
import { InnhaldstypeTesting, Testregel } from '@testreglar/api/types';
import { PageType, ActiveTest } from '@test/types';
import { Sideutval, SideutvalType } from '../../kontroll/sideutval/types';
import { ResultatManuellKontroll } from '@test/api/types';

interface UseTestOverviewStateProps {
  testgrunnlagId: number;
  loeysingId: number;
  innhaldstypeList: InnhaldstypeTesting[];
  sideutvalTypeList: SideutvalType[];
  testResultatForLoeysing: ResultatManuellKontroll[];
  sideutvalForLoeysing: Sideutval[];
  testreglarForLoeysing: Testregel[];
  testKeys: any;
  setAlert: (severity: string, title: string, message: string) => void;
}

export const useTestOverviewState = ({
  testgrunnlagId,
  loeysingId,
  innhaldstypeList,
  sideutvalTypeList,
  testResultatForLoeysing,
  sideutvalForLoeysing,
  testreglarForLoeysing,
  testKeys,
  setAlert,
}: UseTestOverviewStateProps) => {
  const [innhaldstype, setInnhaldstype] = useState(innhaldstypeList[0]);
  const [testResults, setTestResults] = useState(testResultatForLoeysing);
  const [activeTest, setActiveTest] = useState<ActiveTest>();
  const [testFerdig, setTestFerdig] = useState(
    isTestFinished(testResultatForLoeysing, testKeys)
  );

  const pageTypeList = useMemo(
    () => getPageTypeList(sideutvalForLoeysing, sideutvalTypeList),
    [sideutvalForLoeysing, sideutvalTypeList]
  );

  const [pageType, setPageType] = useState<PageType>(
    getInitialPageType(pageTypeList)
  );

  const [progressionPercent, setProgressionPercent] = useState(
    progressionForSelection(
      testreglarForLoeysing,
      testResultatForLoeysing,
      pageType.sideId,
      innhaldstype
    )
  );

  const [testregelListElements, setTestregelListElements] = useState(
    mapTestregelOverviewElements(
      testreglarForLoeysing,
      innhaldstype,
      pageType.sideId,
      testKeys
    )
  );

  const [testStatusMap, setTestStatusMap] = useState(
    toTestregelStatus(
      testregelListElements,
      testResultatForLoeysing,
      testgrunnlagId,
      pageType.sideId
    )
  );

  const [showHelpText, setShowHelpText] = useState(true);

  const toggleShowHelpText = () => {
    setShowHelpText((prev) => !prev);
  };

  const processData = useCallback(
    (
      testResults: ResultatManuellKontroll[],
      pageType: PageType,
      innhaldstype: any,
      activeTestregel?: Testregel
    ) => {
      const testResultsLoeysing = testResults.filter(
        (tr) => tr.loeysingId === loeysingId
      );
      setTestResults(testResultsLoeysing);

      const testregelListElements = mapTestregelOverviewElements(
        testreglarForLoeysing,
        innhaldstype,
        pageType.sideId,
        testKeys
      );

      setTestregelListElements(testregelListElements);
      setProgressionPercent(
        progressionForSelection(
          testreglarForLoeysing,
          testResultsLoeysing,
          pageType.sideId,
          innhaldstype
        )
      );

      setTestStatusMap(
        toTestregelStatus(
          testregelListElements,
          testResultsLoeysing,
          testgrunnlagId,
          pageType.sideId
        )
      );

      const finished = isTestFinished(testResultsLoeysing, testKeys);
      setTestFerdig(finished);

      if (activeTestregel) {
        setActiveTest({
          testregel: activeTestregel,
          testResultList: testResultsLoeysing.filter(
            (tr) =>
              tr.testregelId === activeTestregel.id &&
              tr.sideutvalId === pageType.sideId
          ),
        });
      }
    },
    [loeysingId, testreglarForLoeysing, testKeys, testgrunnlagId]
  );

  const onChangeSideutval = useCallback(
    (sideutvalId: number) => {
      const nextSideutval = pageTypeList.find(
        (pt) => pt.sideId === sideutvalId
      );
      if (nextSideutval) {
        setPageType(nextSideutval);
        setActiveTest(undefined);
        processData(testResults, nextSideutval, innhaldstype);
      } else {
        setAlert('danger', 'Kan ikkje velje sideutval', 'Ugylig sideutval');
      }
    },
    [pageTypeList, testResults, innhaldstype, processData, setAlert]
  );

  const onChangeInnhaldstype = useCallback(
    (innhaldstypeId: number) => {
      const nextInnhaldstype = innhaldstypeList.find(
        (it) => it.id === innhaldstypeId
      );
      if (nextInnhaldstype) {
        setInnhaldstype(nextInnhaldstype);
        setActiveTest(undefined);
        processData(testResults, pageType, nextInnhaldstype);
      } else {
        setAlert(
          'danger',
          'Kan ikkje velje innhaldstype',
          'Ugylig innhaldstype'
        );
      }
    },
    [innhaldstypeList, testResults, pageType, processData, setAlert]
  );

  return {
    innhaldstype,
    setInnhaldstype,
    pageType,
    setPageType,
    testResults,
    activeTest,
    setActiveTest,
    testFerdig,
    progressionPercent,
    testregelListElements,
    testStatusMap,
    showHelpText,
    toggleShowHelpText,
    processData,
    onChangeSideutval,
    onChangeInnhaldstype,
  };
};

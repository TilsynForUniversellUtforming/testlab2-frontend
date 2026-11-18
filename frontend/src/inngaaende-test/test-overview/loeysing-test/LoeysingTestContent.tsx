import AlertModal from '@common/alert/AlertModal';
import { ElementResultat, ResultatManuellKontroll } from '@test/api/types';
import {
  ActiveTest,
  TestregelOverviewElement,
  TestResultUpdate,
} from '@test/types';
import React, { memo, useCallback, useEffect, useRef, useState } from 'react';
import { useParams } from 'react-router';
import { useTestSession } from '@test/test-overview/hooks/testSessionContext';
import { useTestResultatActions } from '@test/test-overview/hooks/useTestResultatActions';
import TestOverviewResultList from '@test/test-overview/loeysing-test/TestOverviewResultList';
import LoeysingTestForm from '@test/test-overview/loeysing-test/LoeysingTestForm';

interface Props {
  progressionPercent: number;
  testregelList: TestregelOverviewElement[];
}

const chunkArray = <T extends object>(array: T[], size: number) => {
  const chunkedArr = [];
  for (let i = 0; i < array.length; i += size) {
    chunkedArr.push(array.slice(i, i + size));
  }
  return chunkedArr;
};

const calculateItemsPerRow = () => {
  if (window.innerWidth > 1856) return 4;
  if (window.innerWidth > 1424) return 3;
  if (window.innerWidth > 992) return 2;
  return 1;
};

function alleHarUtfall(resultater: ResultatManuellKontroll[]) {
  return resultater.every((r) => r.element?.elementUtfall != null);
}

const LoeysingTestContent = memo(
  ({ progressionPercent, testregelList }: Props) => {
    const { testgrunnlagId, loeysingId } = useParams();
    const [itemsPerRow, setItemsPerRow] = useState(calculateItemsPerRow);
    const [showHelpText, setShowHelpText] = useState(true);
    const alertRef = useRef<HTMLDialogElement>(null);
    const [loading, setLoading] = useState(false);

    const testResultatActions = useTestResultatActions();
    const doUpdateTestResult = testResultatActions.doUpdateTestResult;
    const slettTestelement = testResultatActions.slettTestelement;
    const createNewTestResult = testResultatActions.createNewTestResult;
    const onSetPageOutCome = testResultatActions.doSetTestregelOutcome;

    useEffect(() => {
      const handleResize = () => setItemsPerRow(calculateItemsPerRow());
      window.addEventListener('resize', handleResize);
      return () => window.removeEventListener('resize', handleResize);
    }, []);

    const { pageType, activeTest, setActiveTest } =
      useTestSession();

    const handleSetInactiveTest = useCallback(() => {
      setActiveTest(undefined);
    }, [setActiveTest]);

    useEffect(() => {
      setLoading(false);
    }, [activeTest?.testResultList]);


    const onClickSave = useCallback(() => {
      handleSetInactiveTest();
    }, [handleSetInactiveTest]);



    const leggTilFlereTestelementer = useCallback(() => {
      if (
        activeTest?.testResultList &&
        alleHarUtfall(activeTest.testResultList)
      ) {
        createNewTestResult(
          activeTest.testregel,
          Number(testgrunnlagId),
          Number(loeysingId),
          pageType.sideId
        );
      } else {
        alertRef.current?.showModal();
      }
    }, [
      activeTest,
      createNewTestResult,
      testgrunnlagId,
      loeysingId,
      pageType.sideId,
    ]);

    const handleUpdateResult = useCallback(
      (testresultUpdate: TestResultUpdate) => {
        setLoading(true);
        doUpdateTestResult(testresultUpdate);
      },
      [doUpdateTestResult]
    );

    const handleSlettTestelement = useCallback(
      (resultatId: number) => {
        if (activeTest) slettTestelement(activeTest, resultatId);
      },
      [activeTest, slettTestelement]
    );

    const onChangeSideUtfall = useCallback(
      (resultat: ElementResultat, testregelId: number, sideutvalId: number) => {
        onSetPageOutCome?.(resultat, testregelId, sideutvalId);
      },
      [activeTest, onSetPageOutCome, pageType.sideId]
    );

    const isForenkla = activeTest?.testregel.modus === 'manuell-forenkla';
    const isManuell = activeTest?.testregel.modus === 'manuell';
    const isAutomatisk = activeTest?.testregel.modus === 'automatisk';

    return (
      <>
        <div>
          {activeTestregelOverviewElement(activeTest) && (
            <LoeysingTestForm
              activeTest={activeTest}
              isManuell={isManuell}
              isForenkla={isForenkla}
              isAutomatisk={isAutomatisk}
              showHelpText={showHelpText}
              loading={loading}
              onResultat={handleUpdateResult}
              onSlettTestelement={handleSlettTestelement}
              leggTilFlereTestelementer={leggTilFlereTestelementer}
              onClickSave={onClickSave}
              testregelListLength={testregelList.length}
            />
          )}
          <TestOverviewResultList />
        </div>
        <AlertModal
          ref={alertRef}
          severity="warning"
          title="Kan ikke legge til et nytt testelement"
          message="Alle testelementer må ha et utfall før du kan legge til et nytt."
          clearMessage={() => alertRef.current?.close()}
        />
      </>
    );
  }
);

function activeTestregelOverviewElement(activeTest: ActiveTest | undefined) {
  if (!activeTest) return false;
  return activeTest && activeTest.testResultList.length > 0;
}
export default LoeysingTestContent;

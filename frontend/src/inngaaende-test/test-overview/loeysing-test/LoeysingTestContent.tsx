import AlertModal from '@common/alert/AlertModal';
import { ResultatManuellKontroll } from '@test/api/types';
import LoeysingTestForm from '@test/test-overview/loeysing-test/LoeysingTestForm';
import {
  ActiveTest,
  ManuellTestStatus,
  PageType,
  TestregelOverviewElement,
  TestResultUpdate,
} from '@test/types';
import { InnhaldstypeTesting, Testregel } from '@testreglar/api/types';
import classNames from 'classnames';
import React, { memo, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useParams } from 'react-router';
import TestregelButtonList from '@test/testregel-form/TestregelButtonList';
import TestregelButton from '@test/test-overview/loeysing-test/button/TestregelButton';
import { toTestregelStatusKey } from '@test/util/testregelUtils';
import TestOverviewResultList from '@test/test-overview/loeysing-test/TestOverviewResultList';

interface Props {
  sideutval: PageType;
  innhaldstype: InnhaldstypeTesting;
  progressionPercent: number;
  testStatusMap: Map<string, ManuellTestStatus>;
  testregelList: TestregelOverviewElement[];
  activeTest: ActiveTest | undefined;
  clearActiveTestregel: () => void;
  onChangeTestregel: (testregelId: number) => void;
  createNewTestResult: (
    activeTestregel: Testregel,
    testgrunnlagId: number,
    loeysingId: number,
    sideId: number
  ) => void;
  doUpdateTestResult: (testResultUpdate: TestResultUpdate) => void;
  slettTestelement: (activeTest: ActiveTest, resultatId: number) => void;
  onChangeStatus: (status: ManuellTestStatus, testregelId: number) => void;
  showHelpText: boolean;
  toggleShowHelpText: () => void;
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
  console.log(resultater);
  return resultater.every((r) => r.elementUtfall != null);
}


const LoeysingTestContent = memo(({
  sideutval,
  testregelList,
  activeTest,
  clearActiveTestregel,
  onChangeTestregel,
  createNewTestResult,
  testStatusMap,
  doUpdateTestResult,
  slettTestelement,
  onChangeStatus,
  showHelpText,
}: Props) => {
  const { testgrunnlagId, loeysingId } = useParams();
  const [itemsPerRow, setItemsPerRow] = useState(calculateItemsPerRow);
  const alertRef = useRef<HTMLDialogElement>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const handleResize = () => setItemsPerRow(calculateItemsPerRow());
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    setLoading(false);
  }, [activeTest?.testResultList]);

  const chunkedTestregelList = useMemo(
    () => chunkArray(testregelList, itemsPerRow),
    [testregelList, itemsPerRow]
  );

  const onClickSave = useCallback(() => {
    clearActiveTestregel();
  }, [clearActiveTestregel]);

  const leggTilFlereTestelementer = useCallback(() => {
    console.log("Legger til nytt testresultat")
    if (activeTest?.testResultList && alleHarUtfall(activeTest.testResultList)) {
      createNewTestResult(
        activeTest.testregel,
        Number(testgrunnlagId),
        Number(loeysingId),
        sideutval.sideId
      );
    } else {
      alertRef.current?.showModal();
    }
  }, [activeTest, createNewTestResult, testgrunnlagId, loeysingId, sideutval.sideId]);

  const handleUpdateResult = useCallback((testresultUpdate: TestResultUpdate) => {
    setLoading(true);
    doUpdateTestResult(testresultUpdate);
  }, [doUpdateTestResult]);

  const handleSlettTestelement = useCallback((resultatId: number) => {
    if (activeTest) slettTestelement(activeTest, resultatId);
  }, [activeTest, slettTestelement]);

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
});


function activeTestregelOverviewElement(
  activeTest: ActiveTest|undefined
) {
  if (!activeTest) return false;
  return (
    activeTest &&
    activeTest.testResultList.length > 0
  );
}
export default LoeysingTestContent;

import AlertModal from '@common/alert/AlertModal';
import useAlertModal from '@common/alert/useAlertModal';
import LoeysingTestContent from '@test/test-overview/loeysing-test/LoeysingTestContent';
import LoeysingTestHeading from '@test/test-overview/loeysing-test/LoeysingTestHeading';
import TestFerdig from '@test/test-overview/loeysing-test/TestFerdig';
import { TestContextKontroll, TestOverviewLoaderResponse } from '@test/types';
import { useCallback, useEffect } from 'react';
import { useLoaderData, useOutletContext, useParams } from 'react-router';
import { useTestOverviewState } from '@test/test-overview/hooks/useTestOverviewState';
import { TestSessionProvider, useTestSession } from '@test/test-overview/hooks/testSessionContext';


const TestOverviewLoeysing = () => {

  const { testgrunnlagId: testgrunnlagIdParam, loeysingId: loeysingIdParam } =
    useParams();
  const loeysingId = Number(loeysingIdParam);
  const testgrunnlagId = Number(testgrunnlagIdParam);

  const { innhaldstypeList, sideutvalTypeList }: TestContextKontroll =
    useOutletContext();

  const {
    testResultatForLoeysing,
    sideutvalForLoeysing,
    testreglarForLoeysing,
    activeLoeysing,
    kontrollTitle,
    testKeys,
  } = useLoaderData() as TestOverviewLoaderResponse;
  const [alert, raiseAlert, modalRef] = useAlertModal();

  return (
    <TestSessionProvider
      testgrunnlagId={testgrunnlagId}
      loeysingId={loeysingId}
      innhaldstypeList={innhaldstypeList}
      sideutvalTypeList={sideutvalTypeList}
      testResultatForLoeysing={testResultatForLoeysing}
      sideutvalForLoeysing={sideutvalForLoeysing}
      testreglarForLoeysing={testreglarForLoeysing}
      testKeys={testKeys}
      raiseAlert={raiseAlert}
    >
      <TestOverviewLoeysingSContent
        activeLoeysing={activeLoeysing}
        kontrollTitle={kontrollTitle}
        testreglarForLoeysing={testreglarForLoeysing}
        testKeys={testKeys}
        innhaldstypeList={innhaldstypeList}
        alert={alert}
        modalRef={modalRef}
      />
    </TestSessionProvider>
  );
};

interface TestOverviewLoeysingSContentProps {
  activeLoeysing: any;
  kontrollTitle: string;
  testreglarForLoeysing: any[];
  testKeys: string[];
  innhaldstypeList: any[];
  alert: any;
  modalRef: React.RefObject<HTMLDialogElement>;
}

const TestOverviewLoeysingSContent = ({
  activeLoeysing,
  kontrollTitle,
  testreglarForLoeysing,
  testKeys,
  innhaldstypeList,
  alert,
  modalRef,
}: TestOverviewLoeysingSContentProps) => {
  // Get IDs from context
  const { testgrunnlagId, loeysingId } = useTestSession();

  const {
    innhaldstype,
    onChangeInnhaldstype,
    pageType,
    pageTypeList,
    onChangeSideutval,
    activeTest,
    setActiveTest,
    testFerdig,
    progressionPercent,
    testregelListElements,
    doUpdateTestResult,
    onChangeTestregel,
    onChangeTestregelStatus,
    slettTestelement,
    createNewTestResult,
    doSetTestregelOutcome,
  } = useTestOverviewState({
    testreglarForLoeysing,
    testKeys,
    innhaldstypeList,
  });

  const handleSetInactiveTest = useCallback(() => {
    setActiveTest(undefined);
  }, [setActiveTest]);

  useEffect(() => {
    if (alert) {
      modalRef.current?.showModal();
    }
  }, [alert, modalRef]);


  return (
    <div className="manual-test-container">
      <LoeysingTestHeading
        title={kontrollTitle}
        currentLoeysingName={activeLoeysing.namn}
        sideutvalList={pageTypeList}
        sideutval={pageType}
        onChangeSideutval={onChangeSideutval}
        innhaldstypeList={innhaldstypeList}
        innhaldstype={innhaldstype}
        onChangeInnhaldstype={onChangeInnhaldstype}
        testgrunnlagId={testgrunnlagId}
        currentLoeysingId={loeysingId}
      />
      {testFerdig && <TestFerdig loeysingNamn={activeLoeysing.namn} />}
      <div className="manual-test-wrapper">
        <div className="manual-test-buttons">
          <LoeysingTestContent
            sideutval={pageType}
            innhaldstype={innhaldstype}
            progressionPercent={progressionPercent}
            testregelList={testregelListElements}
            activeTest={activeTest}
            clearActiveTestregel={handleSetInactiveTest}
            onChangeTestregel={onChangeTestregel}
            createNewTestResult={createNewTestResult}
            doUpdateTestResult={doUpdateTestResult}
            slettTestelement={slettTestelement}
            onChangeStatus={onChangeTestregelStatus}
            onSetPageOutCome={doSetTestregelOutcome}
          />
        </div>
        {alert && (
          <AlertModal
            ref={modalRef}
            severity={alert.severity}
            title={alert.title}
            message={alert.message}
            clearMessage={alert.clearMessage}
          />
        )}
      </div>
    </div>
  );
};

export default TestOverviewLoeysing;

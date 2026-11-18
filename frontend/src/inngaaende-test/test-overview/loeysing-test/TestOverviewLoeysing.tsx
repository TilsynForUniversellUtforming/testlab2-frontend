import AlertModal from '@common/alert/AlertModal';
import useAlertModal from '@common/alert/useAlertModal';
import LoeysingTestContent from '@test/test-overview/loeysing-test/LoeysingTestContent';
import LoeysingTestHeading from '@test/test-overview/loeysing-test/LoeysingTestHeading';
import LoeysingTestLeftColumn from '@test/test-overview/loeysing-test/LoeysingTestLeftColumn';
import LoeysingTestRightColumn from '@test/test-overview/loeysing-test/LoeysingTestRightColumn';
import TestFerdig from '@test/test-overview/loeysing-test/TestFerdig';
import { TestContextKontroll, TestOverviewLoaderResponse } from '@test/types';
import { useEffect } from 'react';
import { useLoaderData, useOutletContext, useParams } from 'react-router';
import 'bootstrap/dist/css/bootstrap-grid.min.css';
import styles from './loeysing-test.module.css';
import { Col, Container, Row } from 'react-bootstrap';
import { useTestOverviewElement } from '@test/test-overview/hooks/useTestOverviewElement';
import { useTestregelSelection } from '@test/test-overview/hooks/useTestregelSelection';
import { TestSessionProvider, useTestSession } from '@test/test-overview/hooks/testSessionContext';
import { ElementResultat } from '@test/api/types';
import { useTestOverviewState } from '@test/test-overview/hooks/useTestOverviewState';




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
  modalRef: React.RefObject<HTMLDialogElement | null>;
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
  const {
    onChangeInnhaldstype,
    testFerdig,
    progressionPercent,
  } = useTestOverviewState({
    testreglarForLoeysing,
    testKeys,
    innhaldstypeList,
  });

  const {activeTest,onChangeSideutval} = useTestSession()

  // Get selection - simplified props
  const testregelSelection = useTestregelSelection({
    testreglarForLoeysing,
  });

  const { testregelListElements } = useTestOverviewElement({
    testreglarForLoeysing,
    testKeys,
  });

  useEffect(() => {
    if (alert) {
      modalRef.current?.showModal();
    }
  }, [alert, modalRef]);



  return (
    <Container className={styles.manualTestContainer} fluid={true}>
      <LoeysingTestHeading
        title={kontrollTitle}
        currentLoeysingName={activeLoeysing.namn}
      />
      {testFerdig && <TestFerdig loeysingNamn={activeLoeysing.namn} />}
      <Row className={styles.manualTestWrapper}>
        <LoeysingTestLeftColumn
          sideutval={{
            onChange: onChangeSideutval,
          }}
          innhaldstypeTesting={{
            list: innhaldstypeList,
            onChange: onChangeInnhaldstype,
          }}
          testregeButtonListProps={{
            testregelOverviewRow: testregelListElements,
            activeTest,
            onChangeTestregel: testregelSelection.onChangeTestregel,
            onChangeStatus: testregelSelection.onChangeTestregelStatus,
            onSetSideUtfall: (status: ElementResultat, testregelId: number,sideId:number) => {throw new Error('Not implemented')},
          }}
        />
        <Col as={'main'} xs={6} className={styles.manualTestButtons}>
          <LoeysingTestContent
            progressionPercent={progressionPercent}
            testregelList={testregelListElements}
            onChangeTestregel={testregelSelection.onChangeTestregel}
            onChangeStatus={testregelSelection.onChangeTestregelStatus}
          />
        </Col>
        <LoeysingTestRightColumn />
        {alert && (
          <AlertModal
            ref={modalRef}
            severity={alert.severity}
            title={alert.title}
            message={alert.message}
            clearMessage={alert.clearMessage}
          />
        )}
      </Row>
    </Container>
  );
};

export default TestOverviewLoeysing;

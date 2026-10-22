import AlertModal from '@common/alert/AlertModal';
import useAlertModal from '@common/alert/useAlertModal';
import LoeysingTestContent from '@test/test-overview/loeysing-test/LoeysingTestContent';
import LoeysingTestHeading from '@test/test-overview/loeysing-test/LoeysingTestHeading';
import LoeysingTestLeftColumn from '@test/test-overview/loeysing-test/LoeysingTestLeftColumn';
import LoeysingTestRightColumn from '@test/test-overview/loeysing-test/LoeysingTestRightColumn';
import TestFerdig from '@test/test-overview/loeysing-test/TestFerdig';
import { TestContextKontroll, TestOverviewLoaderResponse } from '@test/types';
import { useCallback, useEffect } from 'react';
import { useLoaderData, useOutletContext, useParams } from 'react-router';
import { useTestOverviewState } from '@test/util/useTestOverviewState';
import { useShowHelpText } from '@test/util/useShowHelpText';
import 'bootstrap/dist/css/bootstrap-grid.min.css';
import styles from './loeysing-test.module.css';
import { Col, Container, Row } from 'react-bootstrap';




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

  const { showHelpText, toggleShowHelpText } = useShowHelpText();


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
    testStatusMap,
    doUpdateTestResult,
    onChangeTestregel,
    onChangeTestregelStatus,
    slettTestelement,
    createNewTestResult,
  } = useTestOverviewState({
    testgrunnlagId,
    loeysingId,
    innhaldstypeList,
    sideutvalTypeList,
    testResultatForLoeysing,
    sideutvalForLoeysing,
    testreglarForLoeysing,
    testKeys,
    raiseAlert,
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
    <Container className={styles.manualTestContainer} fluid={true}>
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
      <Row className={styles.manualTestWrapper}>
        <LoeysingTestLeftColumn
          sideutval={{
            list: pageTypeList,
            selected: pageType,
            onChange: onChangeSideutval,
          }}
          innhaldstype={{
            list: innhaldstypeList,
            selected: innhaldstype,
            onChange: onChangeInnhaldstype,
          }}
          testregeButtonListProps={{
            row: testregelListElements,
            activeTest,
            onChangeTestregel,
            testStatusMap,
            testgrunnlagId: String(testgrunnlagId),
            sideId: pageType.sideId,
            onChangeStatus: onChangeTestregelStatus,
          }}
        />
        <Col as={'main'} xs={6} className={styles.manualTestButtons}>
          <LoeysingTestContent
            sideutval={pageType}
            innhaldstype={innhaldstype}
            progressionPercent={progressionPercent}
            testStatusMap={testStatusMap}
            testregelList={testregelListElements}
            activeTest={activeTest}
            clearActiveTestregel={handleSetInactiveTest}
            onChangeTestregel={onChangeTestregel}
            createNewTestResult={createNewTestResult}
            doUpdateTestResult={doUpdateTestResult}
            slettTestelement={slettTestelement}
            onChangeStatus={onChangeTestregelStatus}
            toggleShowHelpText={toggleShowHelpText}
            showHelpText={showHelpText}
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

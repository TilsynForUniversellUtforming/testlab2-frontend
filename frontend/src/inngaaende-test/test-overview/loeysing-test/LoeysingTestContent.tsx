import AlertModal from '@common/alert/AlertModal';
import TestlabDivider from '@common/divider/TestlabDivider';
import { ButtonVariant } from '@common/types';
import { Button } from '@digdir/designsystemet-react';
import { ResultatManuellKontroll } from '@test/api/types';
import TestregelButton from '@test/test-overview/loeysing-test/button/TestregelButton';
import TestRegelParamSelection from '@test/test-overview/loeysing-test/TestRegelParamSelection';
import TestForm from '@test/testregel-form/TestForm';
import {
  ActiveTest,
  ManuellTestStatus,
  PageType,
  TestregelOverviewElement,
  TestResultUpdate,
} from '@test/types';
import { toTestregelStatusKey } from '@test/util/testregelUtils';
import { InnhaldstypeTesting, Testregel } from '@testreglar/api/types';
import classNames from 'classnames';
import { memo, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useParams } from 'react-router-dom';

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
  return resultater.every((r) => r.elementUtfall != null);
}

const LoeysingTestContent = memo(({
  sideutval,
  innhaldstype,
  progressionPercent,
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
  toggleShowHelpText,
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

  return (
    <>
      <TestRegelParamSelection
        pageType={sideutval.pageType}
        innhaldstype={innhaldstype.innhaldstype}
        progressionPercent={progressionPercent}
        toggleShowHelpText={toggleShowHelpText}
        showHelpText={showHelpText}
        url={sideutval.url}
      />
      <div>
        {chunkedTestregelList.map((row) => {
          const rowKey = row.map((tr) => tr.id).join('-');
          return (
          <div
            className={classNames('testregel-row', {
              single: testregelList.length === 1,
            })}
            key={rowKey}
          >
            <div className="testregel-container">
              {row.map((tr) => (
                <TestregelButton
                  isActive={tr.id === Number(activeTest?.testregel.id)}
                  key={tr.id}
                  testregel={tr}
                  onClick={onChangeTestregel}
                  status={
                    testStatusMap.get(
                      toTestregelStatusKey(
                        Number(testgrunnlagId),
                        tr.id,
                        sideutval.sideId
                      )
                    ) ?? 'ikkje-starta'
                  }
                  onChangeStatus={onChangeStatus}
                />
              ))}
            </div>
            {row.some((tr) => tr.id === Number(activeTest?.testregel.id)) &&
              activeTest && (
                <div
                  className={classNames('testregel-form-wrapper', {
                    single: testregelList.length === 1,
                  })}
                >
                  <TestForm
                    testregel={activeTest.testregel}
                    resultater={activeTest.testResultList}
                    onResultat={handleUpdateResult}
                    showHelpText={showHelpText}
                    slettTestelement={handleSlettTestelement}
                    isLoading={loading}
                  />
                  <TestlabDivider />
                  <div className="testregel-form-button-wrapper">
                    <div className="testregel-form-buttons">
                      <Button
                        variant={ButtonVariant.Outline}
                        onClick={leggTilFlereTestelementer}
                      >
                        Legg til flere testelementer
                      </Button>
                      <Button onClick={onClickSave}>Lagre og lukk</Button>
                    </div>
                  </div>
                </div>
              )}
          </div>
          );
        })}
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

export default LoeysingTestContent;

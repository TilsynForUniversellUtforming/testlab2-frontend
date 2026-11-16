import AlertModal from '@common/alert/AlertModal';
import TestlabDivider from '@common/divider/TestlabDivider';
import { ButtonVariant } from '@common/types';
import { Button } from '@digdir/designsystemet-react';
import { ElementResultat, ResultatManuellKontroll } from '@test/api/types';
import TestRegelParamSelection from '@test/test-overview/loeysing-test/TestRegelParamSelection';
import TestForm from '@test/testregel-form/TestForm';
import {
  ActiveTest,
  ManuellTestStatus,
  TestregelOverviewElement,
  TestResultUpdate,
} from '@test/types';
import { Testregel } from '@testreglar/api/types';
import classNames from 'classnames';
import React, {
  memo,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { useParams } from 'react-router';
import TestregelButtonList from '@test/testregel-form/TestregelButtonList';
import TestFormForenklaList from '@test/testregel-form/testform-forenkla/TestFormForenklaList';
import { useTestSession } from '@test/test-overview/hooks/testSessionContext';

interface Props {
  progressionPercent: number;
  testregelList: TestregelOverviewElement[];
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
  onSetPageOutCome?: (outcome: ElementResultat, testregelId:number, sideId: number) => void;
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
  ({
    progressionPercent,
    testregelList,
     onChangeTestregel,
    createNewTestResult,
     doUpdateTestResult,
    slettTestelement,
    onChangeStatus,
    onSetPageOutCome,
  }: Props) => {
    const { testgrunnlagId, loeysingId } = useParams();
    const [itemsPerRow, setItemsPerRow] = useState(calculateItemsPerRow);
    const [showHelpText, setShowHelpText] = useState(true);
    const alertRef = useRef<HTMLDialogElement>(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
      const handleResize = () => setItemsPerRow(calculateItemsPerRow());
      window.addEventListener('resize', handleResize);
      return () => window.removeEventListener('resize', handleResize);
    }, []);

    const { pageType, innhaldstype, activeTest,setActiveTest } = useTestSession();

    const handleSetInactiveTest = useCallback(() => {
      setActiveTest(undefined);
    }, [setActiveTest]);


    useEffect(() => {
      setLoading(false);
    }, [activeTest?.testResultList]);



    const chunkedTestregelList = useMemo(
      () => chunkArray(testregelList, itemsPerRow),
      [testregelList, itemsPerRow]
    );

    const onClickSave = useCallback(() => {
      handleSetInactiveTest();
    }, [handleSetInactiveTest]);

    const toggleShowHelpText = useCallback(
      () => setShowHelpText((prev) => !prev),
      []
    );

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
      (resultat: ElementResultat, testregelId:number, sideutvalId:number) => {
        onSetPageOutCome?.(resultat, testregelId, sideutvalId);
      },
      [activeTest, onSetPageOutCome, pageType.sideId]
    );

    const isForenkla = activeTest?.testregel.modus === 'manuell-forenkla';
    const isManuell = activeTest?.testregel.modus === 'manuell';
    const isAutomatisk = activeTest?.testregel.modus === 'automatisk';

    return (
      <>
        <TestRegelParamSelection
          pageType={pageType.pageType}
          innhaldstype={innhaldstype.innhaldstype}
          progressionPercent={progressionPercent}
          toggleShowHelpText={toggleShowHelpText}
          showHelpText={showHelpText}
          url={pageType.url}
        />
        <div>
          {chunkedTestregelList.map((row) => {
            const rowKey = row.map((tr) => tr.testregelId).join('-');
            return (
              <div
                className={classNames('testregel-row', {
                  single: testregelList.length === 1,
                })}
                key={rowKey}
              >
                <TestregelButtonList
                  TestregelOverviewRow={row}
                  activeTest={activeTest}
                  onChangeTestregel={onChangeTestregel}
                  onChangeStatus={onChangeStatus}
                  onSetSideUtfall={onChangeSideUtfall}
                />

                {row.some((tr) => tr.testregelId === Number(activeTest?.testregel.id)) &&
                  activeTest &&
                  activeTest.testResultList.length > 0 && (
                    <div
                      className={classNames('testregel-form-wrapper', {
                        single: testregelList.length === 1,
                      })}
                    >
                      {isManuell && (
                        <TestForm
                          testregel={activeTest.testregel}
                          resultater={activeTest.testResultList}
                          onResultat={handleUpdateResult}
                          showHelpText={showHelpText}
                          slettTestelement={handleSlettTestelement}
                          isLoading={loading}
                        />
                      )}
                      {(isForenkla || isAutomatisk) && (
                        <TestFormForenklaList
                          testregel={activeTest.testregel}
                          resultater={activeTest.testResultList}
                          showHelpText={true}
                          onResultat={handleUpdateResult}
                          slettTestelement={handleSlettTestelement}
                          isLoading={false}
                          isDemoApp={false}
                        />
                      )}
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
  }
);

export default LoeysingTestContent;

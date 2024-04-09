import AlertModal from '@common/alert/AlertModal';
import useDebouncedEffect from '@common/hooks/useDebouncedEffect';
import { ButtonVariant } from '@common/types';
import { Button } from '@digdir/designsystemet-react';
import { ResultatManuellKontroll } from '@test/api/types';
import TestregelButton from '@test/test-overview/loeysing-test/button/TestregelButton';
import TestFerdig from '@test/test-overview/loeysing-test/TestFerdig';
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
import { InnhaldstypeTesting } from '@testreglar/api/types';
import { useRef, useState } from 'react';
import { useParams } from 'react-router-dom';

interface Props {
  testFerdig: boolean;
  pageType: PageType;
  innhaldstype: InnhaldstypeTesting;
  progressionPercent: number;
  testStatusMap: Map<string, ManuellTestStatus>;
  testregelList: TestregelOverviewElement[];
  activeTest: ActiveTest | undefined;
  clearActiveTestregel: () => void;
  onChangeTestregel: (testregelId: number) => void;
  createNewTestResult: (activeTest: ActiveTest) => void;
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
  if (window.innerWidth > 1856) {
    return 4;
  } else if (window.innerWidth > 1424) {
    return 3;
  } else if (window.innerWidth > 992) {
    return 2;
  } else {
    return 1;
  }
};

function alleHarUtfall(resultater: ResultatManuellKontroll[]) {
  return resultater.every((r) => r.elementUtfall != null);
}

const LoeysingTestContent = ({
  testFerdig,
  pageType,
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
  const { loeysingId, testgrunnlagId } = useParams();
  const [itemsPerRow, setItemsPerRow] = useState(calculateItemsPerRow());
  const alertRef = useRef<HTMLDialogElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  const scrollIntoView = (block: ScrollLogicalPosition) => {
    buttonRef?.current?.scrollIntoView({ block: block, inline: 'nearest' });
    buttonRef?.current?.focus();
  };

  const onClickSave = () => {
    scrollIntoView('center');
    clearActiveTestregel();
  };

  const handleChangeTestregel = (testregelId: number) => {
    scrollIntoView('center');
    onChangeTestregel(testregelId);
  };

  useDebouncedEffect(
    () => {
      const handleResize = () => {
        const nextItemsPerRow = calculateItemsPerRow();
        setItemsPerRow(nextItemsPerRow);
        if (itemsPerRow !== nextItemsPerRow) {
          scrollIntoView('start');
        }
      };

      window.addEventListener('resize', handleResize);

      return () => {
        window.removeEventListener('resize', handleResize);
      };
    },
    250,
    [buttonRef]
  );

  if (testFerdig) {
    return <TestFerdig />;
  }

  function leggTilFlereTestelementer() {
    if (
      activeTest?.testResultList &&
      alleHarUtfall(activeTest.testResultList)
    ) {
      createNewTestResult(activeTest);
    } else {
      alertRef?.current?.showModal();
    }
  }

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
      {chunkArray(testregelList, itemsPerRow).map((row, rowIndex) => (
        <div className="testregel-row" key={rowIndex}>
          <div className="testregel-container">
            {row.map((tr) => {
              const isActive = tr.id === Number(activeTest?.testregel.id);
              return (
                <TestregelButton
                  isActive={isActive}
                  key={tr.id}
                  testregel={tr}
                  onClick={handleChangeTestregel}
                  status={
                    testStatusMap.get(
                      toTestregelStatusKey(
                        Number(testgrunnlagId),
                        Number(loeysingId),
                        tr.id,
                        pageType.nettsideId
                      )
                    ) || 'ikkje-starta'
                  }
                  onChangeStatus={onChangeStatus}
                  ref={isActive ? buttonRef : null}
                />
              );
            })}
          </div>
          {row.some((tr) => tr.id === Number(activeTest?.testregel.id)) &&
            activeTest && (
              <div className="testregel-form-wrapper">
                <TestForm
                  testregel={activeTest.testregel}
                  resultater={activeTest.testResultList}
                  onResultat={doUpdateTestResult}
                  showHelpText={showHelpText}
                  slettTestelement={(resultatId) =>
                    slettTestelement(activeTest, resultatId)
                  }
                />
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
            )}
        </div>
      ))}
      <AlertModal
        ref={alertRef}
        severity="warning"
        title="Kan ikke legge til et nytt testelement"
        message="Alle testelementer må ha et utfall før du kan legge til et nytt."
        clearMessage={() => alertRef?.current?.close()}
      />
    </>
  );
};

export default LoeysingTestContent;

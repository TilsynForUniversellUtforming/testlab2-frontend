import { ButtonVariant } from '@common/types';
import { Button } from '@digdir/design-system-react';
import { Svar } from '@test/api/types';
import TestregelButton from '@test/test-overview/loeysing-test/button/TestregelButton';
import TestFerdig from '@test/test-overview/loeysing-test/TestFerdig';
import TestRegelParamSelection from '@test/test-overview/loeysing-test/TestRegelParamSelection';
import TestForm from '@test/testregel-form/TestForm';
import {
  ActiveTest,
  ManuellTestStatus,
  PageType,
  TestregelOverviewElement,
} from '@test/types';
import { TestregelResultat } from '@test/util/testregelParser';
import { toTestregelStatusKey } from '@test/util/testregelUtils';
import { InnhaldstypeTesting } from '@testreglar/api/types';
import { useEffect, useRef, useState } from 'react';
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
  doUpdateTestResult: (
    resultat: TestregelResultat,
    elementOmtale: string,
    alleSvar: Svar[]
  ) => void;
  onChangeStatus: (status: ManuellTestStatus, testregelId: number) => void;
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

const LoeysingTestContent = ({
  testFerdig,
  pageType,
  innhaldstype,
  progressionPercent,
  testregelList,
  activeTest,
  clearActiveTestregel,
  onChangeTestregel,
  testStatusMap,
  doUpdateTestResult,
  onChangeStatus,
}: Props) => {
  const { id: sakId, loeysingId } = useParams();
  const [itemsPerRow, setItemsPerRow] = useState(calculateItemsPerRow());
  const formRef = useRef<HTMLDivElement>(null);

  const onClickSave = () => {
    clearActiveTestregel();
  };

  const onClickBack = () => {
    clearActiveTestregel();
  };

  useEffect(() => {
    const handleResize = () => {
      setItemsPerRow(calculateItemsPerRow());
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  useEffect(() => {
    formRef?.current?.scrollIntoView({ behavior: 'smooth', block: 'end' });
  }, [activeTest]);

  if (testFerdig) {
    return <TestFerdig />;
  }

  return (
    <>
      <TestRegelParamSelection
        pageType={pageType.pageType}
        innhaldstype={innhaldstype.innhaldstype}
        progressionPercent={progressionPercent}
      />
      {chunkArray(testregelList, itemsPerRow).map((row, rowIndex) => (
        <div className="testregel-row" key={rowIndex}>
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
                      Number(sakId),
                      Number(loeysingId),
                      tr.id,
                      pageType.nettsideId
                    )
                  ) || 'ikkje-starta'
                }
                onChangeStatus={onChangeStatus}
              />
            ))}
          </div>
          {row.some((tr) => tr.id === Number(activeTest?.testregel.id)) &&
            activeTest && (
              <div className="testregel-form-wrapper" ref={formRef}>
                <TestForm
                  testregel={activeTest.testregel}
                  resultater={activeTest.testResultList}
                  onResultat={doUpdateTestResult}
                />
                <div className="testregel-form-buttons">
                  <Button variant={ButtonVariant.Outline} onClick={onClickBack}>
                    Legg til flere testelementer
                  </Button>
                  <Button onClick={onClickSave}>Lagre og lukk</Button>
                </div>
              </div>
            )}
        </div>
      ))}
    </>
  );
};

export default LoeysingTestContent;

import AlertTimed from '@common/alert/AlertTimed';
import useAlert from '@common/alert/useAlert';
import TestlabDivider from '@common/divider/TestlabDivider';
import { ButtonVariant } from '@common/types';
import { Button } from '@digdir/design-system-react';
import { Sak } from '@sak/api/types';
import TestHeading from '@test/test-overview/loeysing-test/TestHeading';
import TestregelButton from '@test/test-overview/loeysing-test/TestregelButton';
import TestForm from '@test/testregel-form/TestForm';
import {
  ManualTestResult,
  TestContext,
  TestingStep,
  TestregelOverviewElement,
} from '@test/types';
import { parseTestregel } from '@test/util/testregelParser';
import { Testregel } from '@testreglar/api/types';
import { useCallback, useState } from 'react';
import { useOutletContext } from 'react-router-dom';

export interface Props {
  sakId: string;
  sak: Sak;
  testResults: ManualTestResult[];
  onClickBack: () => void;
}

const TestOverviewLoeysing = () => {
  const { sak }: TestContext = useOutletContext();

  const [activeTestregel, setActiveTestregel] = useState<Testregel>();
  const [testingSteps, setTestingSteps] = useState<Map<string, TestingStep>>();
  const [alert, setAlert] = useAlert();

  const testregelList: TestregelOverviewElement[] = sak.testreglar.map(
    (tr) => ({ id: tr.id, name: tr.name, krav: tr.krav })
  );

  const onClickSave = () => {
    setActiveTestregel(undefined);
  };

  const onClickBack = () => {
    setActiveTestregel(undefined);
  };

  const onChangeTestregel = useCallback(
    (testregelId: number) => {
      setTestingSteps(undefined);
      setActiveTestregel(undefined);
      const nextTestregel = sak.testreglar.find((tr) => tr.id === testregelId);
      if (!nextTestregel) {
        setAlert('danger', 'Det oppstod ein feil ved ending av testregel');
      } else {
        try {
          const parsedTestregel = parseTestregel(nextTestregel.testregelSchema);
          setTestingSteps(parsedTestregel);
          setActiveTestregel(nextTestregel);
          // TODO - bruk sakId til å finne steg fra testResults
        } catch (e) {
          setAlert('danger', 'Ugyldig testregel');
        }
      }
    },
    [testregelList]
  );

  return (
    <div className="manual-test-container">
      <TestHeading
        sakName={sak.verksemd.namn}
        currentLoeysingName={sak.loeysingList[0].loeysing.namn}
      />
      <div className="manual-test-buttons">
        <div className="testregel-container">
          {testregelList.map((tr) => (
            <TestregelButton
              isActive={tr.id === Number(activeTestregel?.id)}
              key={tr.id}
              testregel={tr}
              onChangeTestregel={onChangeTestregel}
            />
          ))}
        </div>
      </div>
      {testingSteps && activeTestregel && (
        <div className="testregel-form-wrapper">
          <TestForm
            heading={activeTestregel.name}
            steps={testingSteps}
            firstStepKey={Array.from(testingSteps.keys())[0]}
          />
          <TestlabDivider />
          <div className="testregel-form-buttons">
            <Button variant={ButtonVariant.Outline} onClick={onClickBack}>
              Tilbake
            </Button>
            <Button onClick={onClickSave}>Lagre og lukk</Button>
          </div>
        </div>
      )}
      {alert && (
        <AlertTimed
          severity={alert.severity}
          message={alert.message}
          clearMessage={alert.clearMessage}
        />
      )}
    </div>
  );
};

export default TestOverviewLoeysing;

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
  TestingStep,
  TestregelOverviewElement,
} from '@test/types';
import { parseTestregel } from '@test/util/testregelParser';
import { useCallback, useState } from 'react';

export interface Props {
  sakId: string;
  sak: Sak;
  testResults: ManualTestResult[];
  onClickBack: () => void;
}

const TestOverviewLoeysing = ({ sakId, sak, onClickBack }: Props) => {
  const [testregelName, setTestregelName] = useState<string>();
  const [testingSteps, setTestingSteps] = useState<Map<string, TestingStep>>();
  const [alert, setAlert] = useAlert();

  const testregelList: TestregelOverviewElement[] = sak.testreglar.map(
    (tr) => ({ id: tr.id, name: tr.name })
  );

  const onChangeTestregel = useCallback(
    (testregelId: number) => {
      setTestingSteps(undefined);
      setTestregelName(undefined);
      const nextTestregel = sak.testreglar.find((tr) => tr.id === testregelId);
      if (!nextTestregel) {
        setAlert('danger', 'Det oppstod ein feil ved ending av testregel');
      } else {
        try {
          const parsedTestregel = parseTestregel(nextTestregel.testregelSchema);
          setTestingSteps(parsedTestregel);
          setTestregelName(nextTestregel.name);
          // TODO - bruk sakId til å finne steg fra testResults
        } catch (e) {
          setAlert('danger', 'Ugyldig testregel');
        }
      }
    },
    [testregelList, sakId]
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
              key={tr.id}
              testregel={tr}
              onChangeTestregel={onChangeTestregel}
            />
          ))}
        </div>
      </div>
      {testingSteps && testregelName && (
        <>
          <TestlabDivider />
          <TestForm
            heading={testregelName}
            steps={testingSteps}
            firstStepKey={Array.from(testingSteps.keys())[0]}
          />
        </>
      )}
      <Button variant={ButtonVariant.Outline} onClick={onClickBack}>
        Tilbake
      </Button>
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

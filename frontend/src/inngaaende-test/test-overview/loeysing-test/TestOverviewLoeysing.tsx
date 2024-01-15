import AlertTimed from '@common/alert/AlertTimed';
import useAlert from '@common/alert/useAlert';
import TestlabDivider from '@common/divider/TestlabDivider';
import { ButtonVariant } from '@common/types';
import { Button } from '@digdir/design-system-react';
import { NettsideProperties } from '@sak/types';
import TestHeading from '@test/test-overview/loeysing-test/TestHeading';
import TestregelButton from '@test/test-overview/loeysing-test/TestregelButton';
import TestForm from '@test/testregel-form/TestForm';
import {
  InnhaldsType,
  innhaldsType,
  TestContext,
  TestingStep,
  TestregelOverviewElement,
} from '@test/types';
import { parseTestregel } from '@test/util/testregelParser';
import { Testregel } from '@testreglar/api/types';
import { useCallback, useState } from 'react';
import { useOutletContext, useParams } from 'react-router-dom';

const TestOverviewLoeysing = () => {
  const { _, loeysingId } = useParams();
  const { sak }: TestContext = useOutletContext();
  const sakProperties: NettsideProperties[] =
    sak.loeysingList.find((l) => loeysingId === String(l.loeysing.id))
      ?.properties || [];
  const initialPageType =
    sakProperties.length > 0 && sakProperties[0].type
      ? sakProperties[0].type
      : 'forside';

  const [pageType, setPageType] = useState<string>(initialPageType);

  const [contentType, setContentType] =
    useState<InnhaldsType>('Bilde og grafikk');

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

  const onChangePageType = useCallback((pageType?: string) => {
    if (pageType) {
      setPageType(pageType);
    }
  }, []);

  const onChangeContentType = useCallback((contentType?: string) => {
    if (contentType && innhaldsType.includes(contentType)) {
      setContentType(contentType as InnhaldsType);
    }
  }, []);

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
        sakProperties={sakProperties}
        pageType={pageType}
        onChangePageType={onChangePageType}
        contentType={contentType}
        onChangeContentType={onChangeContentType}
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
              Legg til flere testelementer
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

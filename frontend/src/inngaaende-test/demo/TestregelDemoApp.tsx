import '../test.scss';

import { Spinner } from '@digdir/design-system-react';
import { getTestregel } from '@testreglar/api/testreglar-api';
import { Testregel } from '@testreglar/api/types';
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import TestForm from '../testregel-form/TestForm';
import { TestAnswers, TestStep } from '../types';
import {
  combineStepsAndAnswers,
  parseTestregel,
} from '../util/testregelParser';

const TestregelDemoApp = () => {
  const [testregel, setTestregel] = useState<Testregel>();
  const [testingSteps, setTestingSteps] = useState<Map<string, TestStep>>();
  const [error, setError] = useState<string | undefined>();
  const [loading, setLoading] = useState(false);
  const { id } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && !error && id) {
      setLoading(true);
      const doFetchTestregel = async () => {
        if (id) {
          return await getTestregel(Number(id));
        } else {
          throw new Error('Testregel-id manglar');
        }
      };

      doFetchTestregel()
        .then((testregel) => {
          if (testregel) {
            setTestregel(testregel);
            try {
              setTestingSteps(
                combineStepsAndAnswers(
                  parseTestregel(testregel.testregelSchema),
                  undefined
                )
              );
            } catch (e) {
              setError('Kunne ikkje hente teststeg');
            }
          } else {
            setError('Fann ikkje testregel');
          }
          setLoading(false);
        })
        .catch(() => {
          setError('Kunne ikkje hente data');
        });
    }
  }, [id]);

  if (!testingSteps || !testregel || loading) {
    return <Spinner title="Laster" />;
  }

  return (
    <TestForm
      heading={testregel.name}
      steps={testingSteps}
      initStepKey={Array.from(testingSteps.keys())[0]}
      onClickSave={() => navigate('..')}
      onClickBack={() => navigate('..')}
      updateResult={(testAnswers: TestAnswers) =>
        console.info(
          testAnswers.answers,
          testAnswers.elementOmtale,
          testAnswers.elementResultat,
          testAnswers.elementUtfall
        )
      }
    />
  );
};

export default TestregelDemoApp;

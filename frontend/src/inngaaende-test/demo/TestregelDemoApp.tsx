import '../test.scss';

import { Spinner } from '@digdir/design-system-react';
import { getTestregel } from '@testreglar/api/testreglar-api';
import { Testregel } from '@testreglar/api/types';
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import TestForm from '../testregel-form/TestForm';
import { TestingStep } from '../types';
import { parseTestregel } from '../util/testregelParser';

const TestregelDemoApp = () => {
  const [testregel, setTestregel] = useState<Testregel>();
  const [testingSteps, setTestingSteps] = useState<Map<string, TestingStep>>();
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
              setTestingSteps(parseTestregel(testregel.testregelSchema));
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
      firstStepKey={Array.from(testingSteps.keys())[0]}
      onClickSave={() => navigate('..')}
      onClickBack={() => navigate('..')}
    />
  );
};

export default TestregelDemoApp;

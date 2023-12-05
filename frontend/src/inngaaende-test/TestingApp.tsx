import { getTestregel } from '@testreglar/api/testreglar-api';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

import { TestingStep } from './types';
import { parseTestregel } from './util/testregelParser';

const TestingApp = () => {
  const [testingSteps, setTestingSteps] = useState<Map<string, TestingStep>>();
  const [error, setError] = useState<string | undefined>();
  const [loading, setLoading] = useState(false);
  const { id } = useParams();

  useEffect(() => {
    if (!loading && !error && id) {
      setLoading(true);
      const doFetchSteps = async () => {
        if (id) {
          const testregel = await getTestregel(Number(id));
          return parseTestregel(testregel.testregelSchema);
        } else {
          throw new Error('Steg ikkje funnet');
        }
      };

      doFetchSteps()
        .then((data) => {
          if (data) {
            setTestingSteps(data);
          } else {
            setError('Kunne ikkje hente test steg');
          }
          setLoading(false);
        })
        .catch(() => {
          setError('Kunne ikkje hente data');
        });
    }
  }, [id]);

  console.log(testingSteps);
};

export default TestingApp;

import React, { useCallback, useState } from 'react';
import { useOutletContext, useParams } from 'react-router-dom';

import AppTitle from '../../common/app-title/AppTitle';
import toError from '../../common/error/util';
import useInterval from '../../common/hooks/useInterval';
import { fetchMaaling } from '../../maaling/api/maaling-api';
import { TestResult } from '../../maaling/api/types';
import { TesterContext } from '../types';
import TestingList from './TestingList';

const TestingListApp = () => {
  const { maaling, contextError }: TesterContext = useOutletContext();
  const { id } = useParams();
  const [testResult, setTestResult] = useState<TestResult[]>(
    maaling?.testResult ?? []
  );
  const [error, setError] = useState<Error | undefined>(contextError);
  const [refreshing, setRefreshing] = useState(maaling?.status === 'testing');

  const doFetchData = useCallback(async () => {
    try {
      if (id) {
        const refreshedMaaling = await fetchMaaling(Number(id));
        if (!refreshedMaaling) {
          setError(new Error('Fann ikkje måling'));
        }

        if (refreshedMaaling.status !== 'testing') {
          setRefreshing(false);
        }

        setTestResult(refreshedMaaling.testResult);
      } else {
        setError(new Error('Måling finnes ikkje'));
      }
    } catch (e) {
      setError(toError(e, 'Kunne ikkje hente måling'));
    }
  }, []);

  useInterval(() => doFetchData(), refreshing ? 15000 : null);

  return (
    <>
      <AppTitle heading="Testing" subHeading={maaling?.navn} />
      <TestingList
        maalingId={Number(id)}
        testResultList={testResult}
        error={{ error: error, onClick: doFetchData, buttonText: 'Prøv igjen' }}
      />
    </>
  );
};

export default TestingListApp;

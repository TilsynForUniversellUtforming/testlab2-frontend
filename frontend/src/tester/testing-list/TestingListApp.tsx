import React, { useCallback, useState } from 'react';
import { useOutletContext, useParams } from 'react-router-dom';

import ErrorCard from '../../common/error/ErrorCard';
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
  const [error, setError] = useState<string | undefined>(contextError);

  const [refreshing, setRefreshing] = useState(true);

  const doFetchData = useCallback(() => {
    const fetchData = async () => {
      if (id) {
        const refreshedMaaling = await fetchMaaling(Number(id));
        if (!refreshedMaaling) {
          setError('Måling finnes ikkje');
        }

        if (refreshedMaaling.status !== 'testing') {
          setRefreshing(false);
        }

        setTestResult(refreshedMaaling.testResult);
      } else {
        setError('Måling finnes ikkje');
      }
    };

    fetchData().catch((e) => {
      setError(e);
    });
  }, []);

  useInterval(
    () => {
      doFetchData();
    },
    refreshing ? 15000 : null
  );

  if (typeof id === 'undefined') {
    return <ErrorCard errorText="Ingen testresultat funnet" />;
  }

  return (
    <TestingList
      maalingId={Number(id)}
      testResultList={testResult}
      error={error}
    />
  );
};

export default TestingListApp;

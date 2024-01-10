import ErrorCard from '@common/error/ErrorCard';
import toError from '@common/error/util';
import { Spinner } from '@digdir/design-system-react';
import { getSak } from '@sak/api/sak-api';
import { Sak } from '@sak/api/types';
import { useCallback, useEffect, useRef, useState } from 'react';
import { Outlet, useParams } from 'react-router-dom';

import { getManuellKontrollResults } from './api/testing-api';
import { ManualTestResult, TestContext } from './types';

const ManualTest = () => {
  const { id } = useParams();

  const [error, setError] = useState<Error | undefined>();
  const [loading, setLoading] = useState<boolean>(false);
  const [sak, setSak] = useState<Sak | undefined>();
  const [testResults, setTestResults] = useState<ManualTestResult[]>([]);
  const hasFetched = useRef(false);

  const doFetchData = useCallback(async () => {
    try {
      const [sakResponse, testResultsResponse] = await Promise.all([
        getSak(Number(id)),
        getManuellKontrollResults(Number(id)),
      ]);
      setSak(sakResponse);
      setTestResults(testResultsResponse);
      setLoading(false);
    } catch (err) {
      setError(toError(err, 'Fann ikkje sak'));
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (id && !sak && !hasFetched.current) {
      setLoading(true);
      setError(undefined);
      doFetchData();
    }

    return () => {
      hasFetched.current = true;
    };
  }, []);

  if (loading || !id || !sak) {
    return <Spinner title="Hentar test" />;
  }

  if (error) {
    return <ErrorCard error={error} />;
  }

  const testContext: TestContext = {
    sak: sak,
    testResults: testResults,
  };

  return <Outlet context={testContext} />;
};

export default ManualTest;

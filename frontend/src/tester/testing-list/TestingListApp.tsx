import React, { useCallback, useMemo, useState } from 'react';
import { useOutletContext, useParams } from 'react-router-dom';

import toError from '../../common/error/util';
import useInterval from '../../common/hooks/useInterval';
import UserActionTable from '../../common/table/UserActionTable';
import { fetchMaalingWithAggeration } from '../../maaling/api/maaling-api';
import { TestResult } from '../../maaling/api/types';
import { TesterContext } from '../types';
import { getTestingListColumns } from './TestingListColumns';

const TestingListApp = () => {
  const { maaling, contextError, contextLoading }: TesterContext =
    useOutletContext();
  const { id } = useParams();

  const [testResult, setTestResult] = useState<TestResult[]>(
    maaling?.testResult ?? []
  );
  const [error, setError] = useState<Error | undefined>(contextError);
  const [refreshing, setRefreshing] = useState(
    !contextLoading && maaling?.status === 'testing'
  );

  const maalingId = id;

  const testResultatColumns = useMemo(
    () => getTestingListColumns(maalingId),
    []
  );

  const fetchData = useCallback(async () => {
    try {
      if (
        maalingId &&
        contextLoading &&
        maaling &&
        maaling.status === 'testing'
      ) {
        const refreshedMaaling = await fetchMaalingWithAggeration(maaling.id);
        if (!refreshedMaaling) {
          setError(new Error('Fann ikkje måling'));
        }

        if (refreshedMaaling.status !== 'testing') {
          setRefreshing(false);
        }

        setTestResult(refreshedMaaling.testResult);
      } else if (!maalingId || (!maaling && !contextLoading)) {
        setError(new Error('Måling finnes ikkje'));
      }
    } catch (e) {
      setError(toError(e, 'Kunne ikkje hente måling'));
    }
  }, []);

  useInterval(() => fetchData(), refreshing ? 15000 : null);
  return (
    <UserActionTable<TestResult>
      heading="Testing"
      subHeading={maaling?.navn}
      tableProps={{
        data: testResult,
        defaultColumns: testResultatColumns,
        loading: contextLoading,
        onClickRetry: fetchData,
        displayError: { error },
      }}
    />
  );
};

export default TestingListApp;

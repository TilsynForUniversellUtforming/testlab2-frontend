import React, { useCallback, useMemo, useState } from 'react';
import { useOutletContext } from 'react-router-dom';

import AppRoutes, { getFullPath, idPath } from '../../common/appRoutes';
import toError from '../../common/error/util';
import useInterval from '../../common/hooks/useInterval';
import UserActionTable from '../../common/table/UserActionTable';
import { fetchMaaling } from '../../maaling/api/maaling-api';
import { TestResult } from '../../maaling/api/types';
import { TesterContext } from '../types';
import { getTestingListColumns } from './TestingListColumns';

const TestingListApp = () => {
  const { maaling, contextError, contextLoading }: TesterContext =
    useOutletContext();
  const [testResult, setTestResult] = useState<TestResult[]>(
    maaling?.testResult ?? []
  );
  const [error, setError] = useState<Error | undefined>(contextError);
  const [refreshing, setRefreshing] = useState(maaling?.status === 'testing');
  const id = maaling?.id ? String(maaling.id) : undefined;
  const testResultatColumns = useMemo(() => getTestingListColumns(id), []);

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
    <UserActionTable<TestResult>
      heading="Testgjennomføring"
      subHeading={`Måling: ${maaling?.navn}`}
      linkPath={
        maaling
          ? getFullPath(AppRoutes.MAALING, {
              id: String(maaling.id),
              pathParam: idPath,
            })
          : undefined
      }
      tableProps={{
        data: testResult,
        defaultColumns: testResultatColumns,
        loading: contextLoading,
        onClickRetry: doFetchData,
        displayError: { error },
        loadingStateStatus: refreshing ? 'Utfører testing...' : undefined,
      }}
    />
  );
};

export default TestingListApp;

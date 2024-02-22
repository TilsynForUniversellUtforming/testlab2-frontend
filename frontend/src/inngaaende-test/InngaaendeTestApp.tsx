import ErrorCard from '@common/error/ErrorCard';
import toError from '@common/error/util';
import { isNotDefined } from '@common/util/validationUtils';
import { Spinner } from '@digdir/design-system-react';
import { getSak } from '@sak/api/sak-api';
import { Sak } from '@sak/api/types';
import { ResultatManuellKontroll } from '@test/api/types';
import { innhaldstypeAlle } from '@test/util/testregelUtils';
import { listInnhaldstype } from '@testreglar/api/testreglar-api';
import { InnhaldstypeTesting } from '@testreglar/api/types';
import { useCallback, useEffect, useRef, useState } from 'react';
import { Outlet, useParams } from 'react-router-dom';

import { getTestResults } from './api/testing-api';
import { TestContext } from './types';

const InngaaendeTestApp = () => {
  const { id } = useParams();

  const [error, setError] = useState<Error | undefined>();
  const [loading, setLoading] = useState<boolean>(false);
  const [sak, setSak] = useState<Sak | undefined>();
  const [testResults, setTestResults] = useState<ResultatManuellKontroll[]>([]);
  const [innhaldstypeTestingList, setInnhaldstypeTestingList] = useState<
    InnhaldstypeTesting[]
  >([]);
  const hasFetched = useRef(false);

  const doFetchData = useCallback(async () => {
    const numericId = Number(id);
    if (isNotDefined(numericId)) {
      setError(new Error('Sak med id finnes ikkje'));
      return;
    }

    try {
      const [sakResponse, testResultsResponse, innhaldstypeTestingList] =
        await Promise.all([
          getSak(Number(id)),
          getTestResults(Number(id)),
          listInnhaldstype(),
        ]);
      setSak({ ...sakResponse, id: numericId });
      setTestResults(testResultsResponse);
      setInnhaldstypeTestingList([
        ...innhaldstypeTestingList,
        innhaldstypeAlle,
      ]);
      setLoading(false);
    } catch (err) {
      setError(toError(err, 'Fann ikkje sak'));
      setLoading(false);
    }
  }, []);

  const handleSetTestResults = useCallback(
    (testResults: ResultatManuellKontroll[]) => {
      setTestResults(testResults);
    },
    []
  );

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

  if (loading || (!sak && !error)) {
    return <Spinner title="Hentar test" />;
  }

  if (error || !sak) {
    return <ErrorCard error={error} />;
  }

  const testContext: TestContext = {
    contextSak: sak,
    contextTestResults: testResults,
    contextSetTestResults: handleSetTestResults,
    innhaldstypeList: innhaldstypeTestingList,
  };

  return <Outlet context={testContext} />;
};

export default InngaaendeTestApp;

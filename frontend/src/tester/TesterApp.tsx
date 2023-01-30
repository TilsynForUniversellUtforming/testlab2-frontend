import { useCallback, useState } from 'react';

import AppTitle from '../common/app-title/AppTitle';
import fetchTestResultat, { createMaaling } from './api/tester-api';
import { TestResult } from './api/types';
import TestParameters from './test-init/TestParameters';
import TestResultList from './test-result-list/TestResultList';
import { TestInputParameters } from './types';

const TesterApp = () => {
  const [testInputParameters, setTestInputParameters] =
    useState<TestInputParameters>({ url: '' });
  const [testResultat, setTestResultat] = useState<TestResult[]>([]);
  const [error, setError] = useState<string>();
  const [loading, setLoading] = useState(false);

  const onChangeInput = useCallback(
    (value: string) => {
      setTestInputParameters({ url: value });
      setError(undefined);
    },
    [testInputParameters]
  );

  const doFetchTestResultat = useCallback(() => {
    const url = testInputParameters.url;

    try {
      // TODO - Ordentlig validering
      new URL(url);

      const fetchTestreglar = async () => {
        const maalingUrl = await createMaaling(testInputParameters);
        if (maalingUrl != null) {
          const data = await fetchTestResultat({ url: maalingUrl });

          setTestResultat(data);
        } else {
          setError('Kunne ikke snakke med server');
        }
      };

      setLoading(true);
      setError(undefined);

      fetchTestreglar()
        .catch((e) => setError(e))
        .finally(() => setLoading(false));
    } catch (err: any) {
      setError(
        'Ugyldig nettaddresse. Adressen må være på formen http://www.url.no'
      );
    }
  }, [testInputParameters]);

  return (
    <>
      <AppTitle title="Start ny test" />
      <TestParameters
        value={testInputParameters?.url}
        loading={loading}
        error={error}
        onChange={onChangeInput}
        onSubmit={doFetchTestResultat}
      />
      <TestResultList
        testResult={testResultat}
        onClickRetry={doFetchTestResultat}
        loading={loading}
        error={error}
      />
    </>
  );
};

export default TesterApp;

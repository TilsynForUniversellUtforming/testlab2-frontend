import React, { useCallback, useMemo, useState } from 'react';
import { useOutletContext, useParams } from 'react-router-dom';

import ErrorCard from '../../common/error/ErrorCard';
import toError from '../../common/error/util';
import { useEffectOnce } from '../../common/hooks/useEffectOnce';
import UserActionTable from '../../common/table/UserActionTable';
import fetchTestResultatLoeysing from '../api/tester-api';
import { TestResultat } from '../api/types';
import { TesterContext } from '../types';
import { getTestresultatColumns } from './TestResultatColumns';

const TestResultListApp = () => {
  const { loeysingId } = useParams();

  const { contextError, contextLoading, maaling }: TesterContext =
    useOutletContext();

  const [testResult, setTestresult] = useState<TestResultat[]>([]);
  const [error, setError] = useState(contextError);
  const [loading, setLoading] = useState(contextLoading);

  const testResultatColumns = useMemo(() => getTestresultatColumns(), []);

  const selectedLoeysing = maaling?.testResult.find(
    (tr) => tr.loeysing.id === Number(loeysingId)
  );

  const fetchTestresultat = useCallback(() => {
    setLoading(true);
    setError(undefined);

    const doFetchTestresultat = async () => {
      try {
        if (maaling) {
          if (selectedLoeysing) {
            const resultat = await fetchTestResultatLoeysing(
              maaling.id,
              Number(loeysingId)
            );
            setTestresult(resultat);
          } else {
            setError(new Error('Testresultat finnes ikkje for løysing'));
          }
        } else {
          setError(new Error('Testresultat finnes ikkje'));
        }
      } catch (e) {
        setError(toError(e, 'Kunne ikkje finne testresultat'));
      }
    };

    doFetchTestresultat().finally(() => {
      setLoading(false);
    });
  }, []);

  useEffectOnce(() => {
    fetchTestresultat();
  });

  if (error) {
    return <ErrorCard error={error} />;
  } else if (!selectedLoeysing) {
    return (
      <ErrorCard error={new Error('Testresultat finnes ikkje for løysing')} />
    );
  }

  return (
    <UserActionTable<TestResultat>
      heading="Sideutval"
      subHeading={selectedLoeysing?.loeysing?.namn}
      tableProps={{
        data: testResult,
        defaultColumns: testResultatColumns,
        loading: loading,
        onClickRetry: fetchTestresultat,
      }}
    />
  );
};

export default TestResultListApp;

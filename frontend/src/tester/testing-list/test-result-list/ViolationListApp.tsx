import AlertTimed from '@common/alert/AlertTimed';
import toError from '@common/error/util';
import { useEffectOnce } from '@common/hooks/useEffectOnce';
import useError from '@common/hooks/useError';
import useLoading from '@common/hooks/useLoading';
import UserActionTable from '@common/table/UserActionTable';
import { extractDomain } from '@common/util/stringutils';
import { Maaling, TestResult } from '@maaling/api/types';
import { MaalingTestStatus } from '@maaling/types';
import React, { useCallback, useMemo, useState } from 'react';
import { useOutletContext, useParams } from 'react-router-dom';

import fetchTestResultatLoeysing from '../../api/tester-api';
import { TestResultat } from '../../api/types';
import { TestResultContext } from '../../types';
import { getTestresultatColumns } from './ViolationColumns';

const getSelectedLoeysing = (
  loeysingId?: string,
  maaling?: Maaling
): TestResult | undefined =>
  maaling?.testResult.find((tr) => tr.loeysing.id === Number(loeysingId));

const ViolationListApp = () => {
  const { id, loeysingId, testregelId } = useParams();

  const { contextError, maaling }: TestResultContext = useOutletContext();

  const [testResult, setTestresult] = useState<TestResultat[]>([]);
  const [error, setError] = useError(contextError);
  const [loading, setLoading] = useLoading(true);
  const [selectedLoeysing, setSelectedLoeysing] = useState(
    getSelectedLoeysing(loeysingId, maaling)
  );

  const [testStatus, setTestStatus] = useState<MaalingTestStatus>({
    loading: false,
    message: undefined,
  });

  const testResultatColumns = useMemo(() => getTestresultatColumns(), []);

  const fetchTestresultat = useCallback(() => {
    setLoading(true);
    setError(undefined);

    const doFetchTestresultat = async () => {
      try {
        if (id && loeysingId && testregelId) {
          const resultat = await fetchTestResultatLoeysing(
            Number(id),
            Number(loeysingId)
          );
          const filteredResult = resultat.filter(
            (r) => r.testregelId === testregelId
          );
          setTestresult(filteredResult);
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

  return (
    <>
      <UserActionTable<TestResultat>
        heading={`Brot ${extractDomain(
          selectedLoeysing?.loeysing?.url
        )} - ${testregelId}`}
        tableProps={{
          data: testResult,
          defaultColumns: testResultatColumns,
          loading: loading,
          onClickRetry: fetchTestresultat,
          displayError: {
            error: error,
          },
        }}
      />
      {testStatus.message && (
        <div className="status__alert">
          <AlertTimed
            severity={testStatus?.severity}
            message={testStatus.message}
            clearMessage={() =>
              setTestStatus({ loading: false, message: undefined })
            }
          />
        </div>
      )}
    </>
  );
};

export default ViolationListApp;

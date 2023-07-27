import AlertTimed from '@common/alert/AlertTimed';
import toError from '@common/error/util';
import { useEffectOnce } from '@common/hooks/useEffectOnce';
import UserActionTable from '@common/table/UserActionTable';
import { extractDomain } from '@common/util/stringutils';
import { Maaling, TestResult } from '@maaling/api/types';
import { MaalingContext, MaalingTestStatus } from '@maaling/types';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useOutletContext, useParams } from 'react-router-dom';

import fetchTestResultatLoeysing from '../../../api/tester-api';
import { TestResultat } from '../../../api/types';
import { getTestresultatColumns } from './ViolationColumns';

const getSelectedLoeysing = (
  loeysingId?: string,
  maaling?: Maaling
): TestResult | undefined =>
  maaling?.testResult.find((tr) => tr.loeysing.id === Number(loeysingId));

const ViolationListApp = () => {
  const { id, loeysingId } = useParams();

  const { contextError, contextLoading, maaling, setMaaling }: MaalingContext =
    useOutletContext();

  const [testResult, setTestresult] = useState<TestResultat[]>([]);
  const [error, setError] = useState(contextError);
  const [loading, setLoading] = useState(contextLoading);
  const [selectedLoeysing, setSelectedLoeysing] = useState(
    getSelectedLoeysing(loeysingId, maaling)
  );
  const [testStatus, setTestStatus] = useState<MaalingTestStatus>({
    loading: false,
    message: undefined,
  });

  const testResultatColumns = useMemo(() => getTestresultatColumns(), []);

  useEffect(() => {
    setLoading(contextLoading);
    if (!contextLoading) {
      setSelectedLoeysing(getSelectedLoeysing(loeysingId, maaling));
    }
  }, [contextLoading]);

  const fetchTestresultat = useCallback(() => {
    setLoading(true);
    setError(undefined);

    const doFetchTestresultat = async () => {
      try {
        if (id && loeysingId) {
          const resultat = await fetchTestResultatLoeysing(
            Number(id),
            Number(loeysingId)
          );
          setTestresult(resultat);
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
        heading={`Brot ${extractDomain(selectedLoeysing?.loeysing?.url)}`}
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

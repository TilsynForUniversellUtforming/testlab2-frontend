import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useOutletContext, useParams } from 'react-router-dom';

import AppRoutes, { getFullPath, idPath } from '../../common/appRoutes';
import toError from '../../common/error/util';
import { useEffectOnce } from '../../common/hooks/useEffectOnce';
import UserActionTable from '../../common/table/UserActionTable';
import { extractDomain } from '../../common/util/stringutils';
import { Maaling, TestResult } from '../../maaling/api/types';
import { MaalingContext } from '../../maaling/types';
import fetchTestResultatLoeysing from '../api/tester-api';
import { TestResultat } from '../api/types';
import { getTestresultatColumns } from './TestResultatColumns';

const getSelectedLoeysing = (
  loeysingId?: string,
  maaling?: Maaling
): TestResult | undefined =>
  maaling?.testResult.find((tr) => tr.loeysing.id === Number(loeysingId));

const TestResultListApp = () => {
  const { id, loeysingId } = useParams();

  const { contextError, contextLoading, maaling }: MaalingContext =
    useOutletContext();

  const [testResult, setTestresult] = useState<TestResultat[]>([]);
  const [error, setError] = useState(contextError);
  const [loading, setLoading] = useState(contextLoading);
  const [selectedLoeysing, setSelectedLoeysing] = useState(
    getSelectedLoeysing(loeysingId, maaling)
  );

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
    <UserActionTable<TestResultat>
      heading={`Resultat ${extractDomain(selectedLoeysing?.loeysing?.url)}`}
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
        loading: loading,
        onClickRetry: fetchTestresultat,
        displayError: {
          error: error,
        },
      }}
    />
  );
};

export default TestResultListApp;

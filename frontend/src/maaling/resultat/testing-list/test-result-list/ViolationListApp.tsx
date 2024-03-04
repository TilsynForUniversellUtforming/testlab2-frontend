import AlertTimed from '@common/alert/AlertTimed';
import toError from '@common/error/util';
import { useEffectOnce } from '@common/hooks/useEffectOnce';
import useError from '@common/hooks/useError';
import UserActionTable from '@common/table/UserActionTable';
import { extractDomain, joinStringsToList } from '@common/util/stringutils';
import { fetchTestResultatLoeysing } from '@maaling/api/maaling-api';
import { AutotesterResult, Maaling, TestResult } from '@maaling/api/types';
import { MaalingTestStatus } from '@maaling/types';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useOutletContext, useParams } from 'react-router-dom';

import { TestResultContext } from '../../types';
import { getTestresultatColumns } from './ViolationColumns';

const getSelectedLoeysing = (
  loeysingId?: string,
  maaling?: Maaling
): TestResult | undefined =>
  maaling?.testResult.find((tr) => tr.loeysing.id === Number(loeysingId));

const ViolationListApp = () => {
  const { id, loeysingId, testregelId } = useParams();

  const { contextError, contextLoading, maaling }: TestResultContext =
    useOutletContext();

  const [testResult, setTestresult] = useState<AutotesterResult[]>([]);
  const [error, setError] = useError(contextError);
  const [loading, setLoading] = useState(contextLoading);
  const [selectedLoeysing, setSelectedLoeysing] = useState(
    getSelectedLoeysing(loeysingId, maaling)
  );
  const [testResultatRowSelection, setTestResultatRowSelection] = useState<
    AutotesterResult[]
  >([]);

  const [testStatus, setTestStatus] = useState<MaalingTestStatus>({
    loading: false,
    message: undefined,
  });

  const onClickDelete = (testResultatRowSelection: AutotesterResult[]) => {
    console.info(testResultatRowSelection);
  };

  useEffect(() => {
    if (!contextLoading) {
      setSelectedLoeysing(getSelectedLoeysing(loeysingId, maaling));
    }
  }, [contextLoading, maaling]);

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
            (r) => r.testregelNoekkel === testregelId
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
      <UserActionTable<AutotesterResult>
        heading={`Brot ${extractDomain(selectedLoeysing?.loeysing?.url)}`}
        subHeading={`Testregel ${testregelId}`}
        tableProps={{
          data: testResult,
          defaultColumns: testResultatColumns,
          loading: loading,
          onClickRetry: fetchTestresultat,
          displayError: {
            error: error,
          },
          onSelectRows: setTestResultatRowSelection,
          rowActions: [
            {
              action: 'delete',
              modalProps: {
                title: 'Fjern nettsider',
                disabled: testResult.length === 0,
                message: `Vil du fjerne ${joinStringsToList(
                  testResultatRowSelection.map((r) => r.side)
                )} frå utval?`,
                onConfirm: () => onClickDelete(testResultatRowSelection),
              },
            },
          ],
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

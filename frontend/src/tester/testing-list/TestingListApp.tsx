import AlertTimed from '@common/alert/AlertTimed';
import useAlert from '@common/alert/useAlert';
import toError from '@common/error/util';
import useContentDocumentTitle from '@common/hooks/useContentDocumentTitle';
import useError from '@common/hooks/useError';
import useInterval from '@common/hooks/useInterval';
import { TableRowAction } from '@common/table/types';
import UserActionTable from '@common/table/UserActionTable';
import { getFullPath, idPath } from '@common/util/routeUtils';
import { joinStringsToList } from '@common/util/stringutils';
import { isNotDefined } from '@common/util/validationUtils';
import { fetchMaaling, restart } from '@maaling/api/maaling-api';
import { RestartRequest, TestResult } from '@maaling/api/types';
import {
  MAALING,
  TEST_RESULT_LIST,
  TEST_TESTING_LIST,
} from '@maaling/MaalingRoutes';
import { MaalingContext } from '@maaling/types';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import {
  Outlet,
  useNavigate,
  useOutletContext,
  useParams,
} from 'react-router-dom';

import StatusChart from '../chart/StatusChart';
import { getTestingListColumns } from './TestingListColumns';

const TestingListApp = () => {
  const navigate = useNavigate();
  const maalingContext: MaalingContext = useOutletContext();

  const { maaling, setMaaling, contextError, loadingMaaling } = maalingContext;
  const { id: maalingId, loeysingId } = useParams();
  const [testResult, setTestResult] = useState<TestResult[]>(
    maaling?.testResult ?? []
  );
  const [alert, setAlert] = useAlert();
  const [error, setError] = useError(contextError);
  const [loading, setLoading] = useState(loadingMaaling);
  const [pollMaaling, setPollMaaling] = useState(maaling?.status === 'testing');
  const [testRowSelection, setTestRowSelection] = useState<TestResult[]>([]);

  const testResultatColumns = useMemo(
    () => getTestingListColumns(maaling),
    [maaling]
  );

  const rowActions = useMemo<TableRowAction[]>(() => {
    const actions: TableRowAction[] = [];
    const failedTests = testResult.filter((tr) => tr.tilstand === 'feila');

    if (maaling?.status === 'testing_ferdig') {
      actions.push({
        action: 'restart',
        rowSelectionRequired: true,
        modalProps: {
          title: 'Test på nytt',
          disabled: testResult.length === 0,
          message: `Vil du teste ${joinStringsToList(
            testRowSelection.map((r) => r.loeysing.namn)
          )} på nytt?`,
          onConfirm: () => onClickRestart(testRowSelection),
        },
      });

      if (failedTests.length > 0) {
        actions.push({
          action: 'restart',
          modalProps: {
            title: 'Test feila på nytt',
            disabled: testResult.length === 0,
            message: `Vil du køyra alle feila tester på nytt?`,
            onConfirm: () => onClickRestart(failedTests),
          },
        });
      }
    }

    return actions;
  }, [maaling?.status, testResult, testRowSelection]);

  useEffect(() => {
    if (maaling) {
      setLoading(false);
      setPollMaaling(maaling?.status === 'testing');
      setTestResult(maaling?.testResult ?? []);
    }
  }, [maaling]);

  useContentDocumentTitle(TEST_TESTING_LIST.navn, maaling?.navn);

  const onClickRestart = useCallback(
    (testRowSelection: TestResult[]) => {
      setError(undefined);
      const loeysingIdList = testRowSelection.map((cr) => cr.loeysing.id);

      if (typeof maaling === 'undefined') {
        setError(new Error('Måling finnes ikkje'));
        return;
      } else if (isNotDefined(loeysingIdList)) {
        setError(new Error('Løysing finnes ikkje på måling'));
        return;
      } else if (testRowSelection.length === 0) {
        setError(
          new Error('Kunne ikkje starte testing på nytt, ingen løysing valgt')
        );
        return;
      }

      const doRestart = async () => {
        setLoading(true);
        try {
          const restartCrawlingRequest: RestartRequest = {
            maalingId: maaling.id,
            loeysingIdList: { idList: loeysingIdList },
            process: 'test',
          };

          const restartedMaaling = await restart(restartCrawlingRequest);
          setMaaling(restartedMaaling);
          setTestResult(restartedMaaling.testResult);
          setAlert('success', 'Testing er starta på nytt');
        } catch (e) {
          setError(toError(e, 'Noko gikk gale ved restart av sideutval'));
        }
      };

      doRestart().finally(() => {
        setLoading(false);
        setPollMaaling(true);
      });
    },
    [maaling]
  );

  const doFetchData = useCallback(async () => {
    try {
      setError(undefined);
      if (maalingId && !loading && maaling && maaling.status === 'testing') {
        const refreshedMaaling = await fetchMaaling(maaling.id);

        if (!refreshedMaaling) {
          setError(new Error('Fann ikkje måling'));
        }

        if (refreshedMaaling.status !== 'testing') {
          setPollMaaling(false);
        }

        setMaaling(refreshedMaaling);
        setTestResult(refreshedMaaling.testResult);
      } else if (!maalingId || (!maaling && !loading)) {
        setError(new Error('Måling finnes ikkje'));
      }
    } catch (e) {
      setError(toError(e, 'Kunne ikkje hente måling'));
    }
  }, [loading]);

  useInterval(() => doFetchData(), pollMaaling ? 15000 : null);

  if (loeysingId) {
    return <Outlet context={maalingContext} />;
  }

  return (
    <>
      {alert && (
        <AlertTimed
          severity={alert.severity}
          message={alert.message}
          clearMessage={alert.clearMessage}
        />
      )}
      <UserActionTable<TestResult>
        heading="Testgjennomføring"
        subHeading={`Måling: ${maaling?.navn ?? ''}`}
        linkPath={
          maaling
            ? getFullPath(MAALING, {
                id: String(maaling.id),
                pathParam: idPath,
              })
            : undefined
        }
        tableProps={{
          data: testResult,
          defaultColumns: testResultatColumns,
          loading: loading,
          onSelectRows: setTestRowSelection,
          onClickRetry: doFetchData,
          displayError: { error },
          rowActions: rowActions,
          onClickRow:
            maaling?.status === 'testing_ferdig'
              ? (row) =>
                  navigate(
                    getFullPath(
                      TEST_RESULT_LIST,
                      { pathParam: idPath, id: maalingId ?? '' },
                      {
                        pathParam: ':loeysingId',
                        id: String(row?.original.loeysing.id),
                      }
                    )
                  )
              : undefined,
        }}
      >
        <StatusChart
          pendingStatus={{
            statusText: 'Ikkje starta',
            statusCount: maaling?.testStatistics?.numPending ?? 0,
            severity: 'neutral',
          }}
          runningStatus={{
            statusText: 'Testar',
            statusCount: maaling?.testStatistics?.numRunning ?? 0,
            severity: 'info',
          }}
          finishedStatus={{
            statusText: 'Ferdig',
            statusCount: maaling?.testStatistics?.numFinished ?? 0,
            severity: 'success',
          }}
          errorStatus={{
            statusText: 'Feila',
            statusCount: maaling?.testStatistics?.numError ?? 0,
            severity: 'danger',
          }}
          show={!loading}
          loadingStateStatus={pollMaaling ? 'Utfører testing...' : undefined}
        />
      </UserActionTable>
    </>
  );
};

export default TestingListApp;

import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Outlet, useOutletContext, useParams } from 'react-router-dom';

import AppRoutes, { getFullPath, idPath } from '../../common/appRoutes';
import toError from '../../common/error/util';
import useInterval from '../../common/hooks/useInterval';
import { TableRowAction } from '../../common/table/types';
import UserActionTable from '../../common/table/UserActionTable';
import { joinStringsToList } from '../../common/util/stringutils';
import { isNotDefined } from '../../common/util/util';
import { fetchMaaling, restart } from '../../maaling/api/maaling-api';
import { RestartRequest, TestResult } from '../../maaling/api/types';
import { MaalingContext } from '../../maaling/types';
import StatusChart from '../chart/StatusChart';
import {
  getTestingListColumns,
  getTestingListColumnsLoading,
} from './TestingListColumns';

const TestingListApp = () => {
  const maalingContext: MaalingContext = useOutletContext();

  const { maaling, setMaaling, contextError, contextLoading } = maalingContext;
  const { id: maalingId, loeysingId } = useParams();
  const [testResult, setTestResult] = useState<TestResult[]>(
    maaling?.testResult ?? []
  );
  const [error, setError] = useState<Error | undefined>(contextError);
  const [refreshing, setRefreshing] = useState(maaling?.status === 'testing');
  const [testRowSelection, setTestRowSelection] = useState<TestResult[]>([]);

  const testResultatColumns = useMemo(() => {
    if (maaling?.status === 'testing_ferdig') {
      return getTestingListColumns(maalingId ?? '');
    } else {
      return getTestingListColumnsLoading(maalingId ?? '');
    }
  }, [maaling?.status]);

  const rowActions = useMemo<TableRowAction[]>(() => {
    if (maaling?.status === 'testing_ferdig') {
      return [
        {
          action: 'restart',
          modalProps: {
            title: 'Test på nytt',
            disabled: testResult.length === 0,
            message: `Vil du teste ${joinStringsToList(
              testRowSelection.map((r) => r.loeysing.namn)
            )} på nytt?`,
            onConfirm: () => onClickRestart(testRowSelection),
          },
        },
      ];
    } else {
      return [];
    }
  }, [maaling?.status, testResult, testRowSelection]);

  useEffect(() => {
    setRefreshing(maaling?.status === 'testing');
    setTestResult(maaling?.testResult ?? []);
  }, [maaling]);

  const onClickRestart = useCallback((testRowSelection: TestResult[]) => {
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
      try {
        const restartCrawlingRequest: RestartRequest = {
          maalingId: maaling.id,
          loeysingIdList: { idList: loeysingIdList },
          process: 'test',
        };

        const restartedMaaling = await restart(restartCrawlingRequest);
        setMaaling(restartedMaaling);
        setTestResult(restartedMaaling.testResult);
      } catch (e) {
        setError(toError(e, 'Noko gikk gale ved restart av sideutval'));
      }
    };

    doRestart().finally(() => {
      setRefreshing(true);
    });
  }, []);

  const doFetchData = useCallback(async () => {
    try {
      if (
        maalingId &&
        contextLoading &&
        maaling &&
        maaling.status === 'testing'
      ) {
        const refreshedMaaling = await fetchMaaling(maaling.id);
        if (!refreshedMaaling) {
          setError(new Error('Fann ikkje måling'));
        }

        if (refreshedMaaling.status !== 'testing') {
          setRefreshing(false);
        }

        setMaaling(refreshedMaaling);
        setTestResult(refreshedMaaling.testResult);
      } else if (!maalingId || (!maaling && !contextLoading)) {
        setError(new Error('Måling finnes ikkje'));
      }
    } catch (e) {
      setError(toError(e, 'Kunne ikkje hente måling'));
    }
  }, []);

  useInterval(() => doFetchData(), refreshing ? 15000 : null);

  if (loeysingId) {
    return <Outlet context={maalingContext} />;
  }

  const talSiderSamsvar = testResult
    .map((tr) => tr.aggregatedResultList.map((arl) => arl.talSiderSamsvar))
    .flat()
    .reduce((a, b) => a + b, 0);

  const talSiderBrot = testResult
    .map((tr) => tr.aggregatedResultList.map((arl) => arl.talSiderBrot))
    .flat()
    .reduce((a, b) => a + b, 0);

  const talSiderIkkjeForekomst = testResult
    .map((tr) =>
      tr.aggregatedResultList.map((arl) => arl.talSiderIkkjeForekomst)
    )
    .flat()
    .reduce((a, b) => a + b, 0);

  return (
    <>
      <StatusChart
        numFinished={maaling?.testStatistics?.numFinished ?? 0}
        numPerforming={maaling?.testStatistics?.numPerforming ?? 0}
        numError={maaling?.testStatistics?.numError ?? 0}
      />
      <UserActionTable<TestResult>
        heading="Testgjennomføring"
        subHeading={`Måling: ${maaling?.navn ?? ''}`}
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
          onSelectRows: setTestRowSelection,
          onClickRetry: doFetchData,
          displayError: { error },
          loadingStateStatus: refreshing ? 'Utfører testing...' : undefined,
          rowActions: rowActions,
        }}
      />
    </>
  );
};

export default TestingListApp;

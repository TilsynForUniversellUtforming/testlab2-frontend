import AppRoutes, { appRoutes, getFullPath, idPath } from '@common/appRoutes';
import toError from '@common/error/util';
import useError from '@common/hooks/useError';
import { TableRowAction } from '@common/table/types';
import UserActionTable from '@common/table/UserActionTable';
import { joinStringsToList } from '@common/util/stringutils';
import { isNotDefined } from '@common/util/util';
import { restart } from '@maaling/api/maaling-api';
import { RestartRequest, TestResult } from '@maaling/api/types';
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

  const {
    maaling,
    setMaaling,
    contextError,
    contextLoading,
    refreshMaaling,
    pollMaaling,
    setPollMaaling,
  } = maalingContext;
  const { id: maalingId, loeysingId } = useParams();
  const [testResult, setTestResult] = useState<TestResult[]>(
    maaling?.testResult ?? []
  );
  const [error, setError] = useError(contextError);
  const [testRowSelection, setTestRowSelection] = useState<TestResult[]>([]);

  const testResultatColumns = useMemo(() => getTestingListColumns(), []);

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
        setError(toError(e, 'Noko gikk gale ved restart av testing'));
      }
    };

    doRestart().finally(() => {
      setPollMaaling(true);
    });
  }, []);

  if (loeysingId) {
    return <Outlet context={maalingContext} />;
  }

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
          onClickRetry: refreshMaaling,
          displayError: { error },
          loadingStateStatus: pollMaaling ? 'Utfører testing...' : undefined,
          rowActions: rowActions,
          onClickCallback: (row) =>
            navigate(
              getFullPath(
                appRoutes.TEST_RESULT_LIST,
                { pathParam: idPath, id: maalingId ?? '' },
                {
                  pathParam: ':loeysingId',
                  id: String(row?.original.loeysing.id),
                }
              )
            ),
        }}
      />
    </>
  );
};

export default TestingListApp;

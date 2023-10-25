import toError from '@common/error/util';
import useContentDocumentTitle from '@common/hooks/useContentDocumentTitle';
import useError from '@common/hooks/useError';
import { getFullPath, idPath } from '@common/util/routeUtils';
import { isNotDefined } from '@common/util/validationUtils';
import { restart } from '@maaling/api/maaling-api';
import { Maaling, RestartRequest, TestResult } from '@maaling/api/types';
import { MAALING, TEST_RESULT_LIST } from '@maaling/MaalingRoutes';
import { MaalingContext } from '@maaling/types';
import React, { useCallback, useEffect, useState } from 'react';
import {
  Outlet,
  useNavigate,
  useOutletContext,
  useParams,
} from 'react-router-dom';

import { TestResultContext } from '../../types';

const getSelectedTestResult = (
  loeysingId?: string,
  maaling?: Maaling
): TestResult | undefined =>
  maaling?.testResult.find((tr) => tr.loeysing.id === Number(loeysingId));

const TestResultListApp = () => {
  const navigate = useNavigate();
  const { loeysingId } = useParams();

  const {
    contextError,
    loadingMaaling,
    maaling,
    setMaaling,
    refreshMaaling,
  }: MaalingContext = useOutletContext();

  const [loading, setLoading] = useState(loadingMaaling);
  const [error, setError] = useError(contextError);
  const [loeysingTestResult, setLoeysingTestResult] = useState(
    getSelectedTestResult(loeysingId, maaling)
  );

  useEffect(() => {
    if (maaling) {
      setLoading(false);
      const testResult = getSelectedTestResult(loeysingId, maaling);
      setLoeysingTestResult(testResult);
    }
  }, [maaling]);

  useContentDocumentTitle(TEST_RESULT_LIST.navn, maaling?.navn);

  const onClickRestart = useCallback(() => {
    setLoading(true);

    if (typeof maaling === 'undefined') {
      setError(new Error('Måling finnes ikkje'));
      return;
    } else if (
      isNotDefined(loeysingTestResult?.loeysing) ||
      !loeysingTestResult?.loeysing
    ) {
      setError(new Error('Løysing finnes ikkje på måling'));
      return;
    }

    const doRestart = async () => {
      try {
        const restartCrawlingRequest: RestartRequest = {
          maalingId: maaling.id,
          loeysingIdList: { idList: [loeysingTestResult.loeysing.id] },
          process: 'test',
        };

        const restartedMaaling = await restart(restartCrawlingRequest);
        setMaaling(restartedMaaling);
        navigate(
          getFullPath(MAALING, {
            id: String(maaling.id),
            pathParam: idPath,
          })
        );
      } catch (e) {
        setError(toError(e, 'Noko gikk gale ved restart av sideutval'));
      }
    };

    doRestart().finally(() => {
      setLoading(false);
    });
  }, []);

  const context: TestResultContext = {
    contextLoading: loading,
    contextError: error,
    setContextError: setError,
    setContextLoading: setLoading,
    maaling: maaling,
    refreshMaaling: refreshMaaling,
    onClickRestart: onClickRestart,
    loeysingTestResult: loeysingTestResult,
  };

  return <Outlet context={context} />;
};

export default TestResultListApp;

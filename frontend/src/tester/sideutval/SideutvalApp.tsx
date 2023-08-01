import { appRoutes, getFullPath, idPath } from '@common/appRoutes';
import ErrorCard from '@common/error/ErrorCard';
import toError from '@common/error/util';
import useError from '@common/hooks/useError';
import useInterval from '@common/hooks/useInterval';
import useLoading from '@common/hooks/useLoading';
import { isNotDefined } from '@common/util/util';
import { fetchMaaling, restart } from '@maaling/api/maaling-api';
import { CrawlResultat, Maaling, RestartRequest } from '@maaling/api/types';
import { MaalingContext } from '@maaling/types';
import React, { useCallback, useEffect, useState } from 'react';
import {
  Outlet,
  useNavigate,
  useOutletContext,
  useParams,
} from 'react-router-dom';

import StatusChart from '../chart/StatusChart';
import CrawlingList from './CrawlingList';

const maalingToCrawlResultat = (maaling?: Maaling): CrawlResultat[] => {
  if (maaling?.crawlResultat && maaling.crawlResultat.length > 0) {
    return maaling.crawlResultat;
  } else if (maaling?.status === 'planlegging' && maaling?.loeysingList) {
    return maaling.loeysingList.map((l) => ({
      type: 'ikkje_starta',
      loeysing: l,
    }));
  } else {
    return [];
  }
};

const SideutvalApp = () => {
  const navigate = useNavigate();

  const maalingContext: MaalingContext = useOutletContext();

  const { maaling, contextError, contextLoading, setMaaling } = maalingContext;
  const { id, loeysingId } = useParams();
  const [crawlResultat, setCrawlResult] = useState<CrawlResultat[]>(() =>
    maalingToCrawlResultat(maaling)
  );

  const [error, setError] = useError(contextError);
  const [loading, setLoading] = useLoading(contextLoading);
  const [pollingMaaling, setPollingMaaling] = useState(
    maaling?.status === 'crawling'
  );

  useEffect(() => {
    setCrawlResult(maalingToCrawlResultat(maaling));
  }, [contextLoading, maaling]);

  const doFetchData = useCallback(async () => {
    try {
      if (id && !contextLoading && maaling && maaling.status === 'crawling') {
        const refreshedMaaling = await fetchMaaling(Number(id));

        if (!refreshedMaaling) {
          setError(new Error('Fann ikkje måling'));
        }

        if (refreshedMaaling.status !== 'crawling') {
          setPollingMaaling(false);
        }
        setMaaling(refreshedMaaling);
        setCrawlResult(maalingToCrawlResultat(refreshedMaaling));
      } else if (!id || (!maaling && !contextLoading)) {
        setError(new Error('Måling finnes ikkje'));
      }
    } catch (e) {
      setError(toError(e, 'Kunne ikkje hente måling'));
    }
  }, []);

  useInterval(() => doFetchData(), pollingMaaling ? 15000 : null);

  const onClickRestart = useCallback((crawlRowSelection: CrawlResultat[]) => {
    setLoading(true);
    setError(undefined);
    const loeysingIdList = crawlRowSelection.map((cr) => cr.loeysing.id);

    if (typeof maaling === 'undefined') {
      setError(new Error('Måling finnes ikkje'));
      return;
    } else if (isNotDefined(loeysingIdList)) {
      setError(new Error('Løysing finnes ikkje på måling'));
      return;
    } else if (crawlRowSelection.length === 0) {
      setError(
        new Error('Kunne ikkje starte crawling på nytt, ingen løysing valgt')
      );
      return;
    }

    const doRestart = async () => {
      try {
        const restartCrawlingRequest: RestartRequest = {
          maalingId: maaling.id,
          loeysingIdList: { idList: loeysingIdList },
          process: 'crawling',
        };

        const restartedMaaling = await restart(restartCrawlingRequest);
        setMaaling(restartedMaaling);
        setCrawlResult(maalingToCrawlResultat(restartedMaaling));
      } catch (e) {
        setError(toError(e, 'Noko gikk gale ved restart av sideutval'));
      }
    };

    doRestart().finally(() => {
      setLoading(false);
      navigate(
        getFullPath(appRoutes.MAALING, {
          id: String(maaling.id),
          pathParam: idPath,
        })
      );
    });
  }, []);

  if (
    (typeof maaling === 'undefined' && !loading) ||
    typeof id === 'undefined'
  ) {
    return <ErrorCard error={new Error('Ingen måling funnet')} />;
  }

  if (loeysingId) {
    return <Outlet context={maalingContext} />;
  }

  return (
    <>
      <StatusChart
        numFinished={maaling?.crawlStatistics?.numFinished ?? 0}
        numPerforming={maaling?.crawlStatistics?.numPerforming ?? 0}
        numError={maaling?.crawlStatistics?.numError ?? 0}
      />
      <CrawlingList
        id={id}
        maaling={maaling}
        crawlList={crawlResultat}
        onClickRestart={onClickRestart}
        refresh={doFetchData}
        loading={loading}
        error={error}
        refreshing={pollingMaaling}
      />
    </>
  );
};

export default SideutvalApp;

import AlertTimed from '@common/alert/AlertTimed';
import useAlert from '@common/alert/useAlert';
import appRoutes from '@common/appRoutes';
import ErrorCard from '@common/error/ErrorCard';
import toError from '@common/error/util';
import useContentDocumentTitle from '@common/hooks/useContentDocumentTitle';
import useError from '@common/hooks/useError';
import useInterval from '@common/hooks/useInterval';
import { isNotDefined } from '@common/util/util';
import { fetchMaaling, restart } from '@maaling/api/maaling-api';
import { CrawlResultat, Maaling, RestartRequest } from '@maaling/api/types';
import { MaalingContext } from '@maaling/types';
import React, { useCallback, useEffect, useState } from 'react';
import { Outlet, useOutletContext, useParams } from 'react-router-dom';

import CrawlingList from './CrawlingList';

const maalingToCrawlResultat = (maaling?: Maaling): CrawlResultat[] => {
  if (maaling?.crawlResultat && maaling.crawlResultat.length > 0) {
    return maaling.crawlResultat;
  } else if (maaling?.status === 'planlegging' && maaling?.loeysingList) {
    return maaling.loeysingList.map((l) => ({
      type: 'ikkje_starta',
      loeysing: l,
      antallNettsider: 1,
    }));
  } else {
    return [];
  }
};

const SideutvalApp = () => {
  const maalingContext: MaalingContext = useOutletContext();

  const { maaling, contextError, setMaaling, loadingMaaling } = maalingContext;
  const { id, loeysingId } = useParams();
  const [crawlResultat, setCrawlResult] = useState<CrawlResultat[]>(() =>
    maalingToCrawlResultat(maaling)
  );
  const [alert, setAlert] = useAlert();
  const [error, setError] = useError(contextError);
  const [loading, setLoading] = useState(loadingMaaling);
  const [pollMaaling, setPollMaaling] = useState(
    maaling?.status === 'crawling'
  );

  useEffect(() => {
    if (maaling) {
      setLoading(false);
      setPollMaaling(maaling.status === 'crawling');
      setCrawlResult(maalingToCrawlResultat(maaling));
    }
  }, [maaling]);

  useContentDocumentTitle(appRoutes.TEST_SIDEUTVAL_LIST.navn, maaling?.navn);

  const doFetchData = useCallback(async () => {
    setError(undefined);
    try {
      if (id && !loading && maaling && maaling.status === 'crawling') {
        const refreshedMaaling = await fetchMaaling(Number(id));

        if (!refreshedMaaling) {
          setError(new Error('Fann ikkje måling'));
        }

        if (refreshedMaaling.status !== 'crawling') {
          setPollMaaling(false);
        }
        setMaaling(refreshedMaaling);
        setCrawlResult(maalingToCrawlResultat(refreshedMaaling));
      } else if (!id || (!maaling && !loading)) {
        setError(new Error('Måling finnes ikkje'));
      }
    } catch (e) {
      setError(toError(e, 'Kunne ikkje hente måling'));
    }
  }, [loading]);

  useInterval(() => doFetchData(), pollMaaling ? 15000 : null);

  const onClickRestart = useCallback(
    (crawlRowSelection: CrawlResultat[]) => {
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
          setAlert('success', 'Siteutval er starta på nytt');
        } catch (e) {
          setError(toError(e, 'Noko gikk gale ved restart av sideutval'));
        }
      };

      doRestart().finally(() => {
        setLoading(false);
      });
    },
    [maaling]
  );

  if (typeof id === 'undefined') {
    return <ErrorCard error={new Error('Ingen måling funnet')} />;
  }

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
      <CrawlingList
        id={id}
        maaling={maaling}
        crawlList={crawlResultat}
        onClickRestart={onClickRestart}
        refresh={doFetchData}
        loading={loading}
        error={error}
        refreshing={pollMaaling}
      />
    </>
  );
};

export default SideutvalApp;

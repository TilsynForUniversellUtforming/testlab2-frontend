import React, { useCallback, useState } from 'react';
import { useNavigate, useOutletContext, useParams } from 'react-router-dom';

import { appRoutes, getFullPath, idPath } from '../../common/appRoutes';
import ErrorCard from '../../common/error/ErrorCard';
import toError from '../../common/error/util';
import useInterval from '../../common/hooks/useInterval';
import { isNotDefined } from '../../common/util/util';
import { fetchMaaling, restartCrawling } from '../../maaling/api/maaling-api';
import {
  CrawlResultat,
  Maaling,
  RestartCrawlRequest,
} from '../../maaling/api/types';
import { TesterContext } from '../types';
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
  const { maaling, contextError, contextLoading }: TesterContext =
    useOutletContext();
  const { id } = useParams();
  const [crawlResultat, setCrawlResult] = useState<CrawlResultat[]>(() =>
    maalingToCrawlResultat(maaling)
  );

  const [error, setError] = useState(contextError);
  const [loading, setLoading] = useState(contextLoading);
  const [refreshing, setRefreshing] = useState(maaling?.status === 'crawling');
  const navigate = useNavigate();

  const doFetchData = useCallback(async () => {
    setLoading(false);
    setError(undefined);

    if (id) {
      try {
        const refreshedMaaling = await fetchMaaling(Number(id));

        if (!refreshedMaaling) {
          setError(new Error('Fann ikkje måling'));
        }

        if (refreshedMaaling.status !== 'crawling') {
          setRefreshing(false);
        }

        setCrawlResult(maalingToCrawlResultat(refreshedMaaling));
      } catch (e) {
        setError(toError(e, 'Noko gikk gale ved henting av måling'));
      }
    } else {
      setError(new Error('Måling finnes ikkje'));
    }
  }, []);

  useInterval(() => doFetchData(), refreshing ? 15000 : null);

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
        const restartCrawlingRequest: RestartCrawlRequest = {
          maalingId: maaling.id,
          loeysingIdList: { idList: loeysingIdList },
        };

        const restartedMaaling = await restartCrawling(restartCrawlingRequest);
        setCrawlResult(maalingToCrawlResultat(restartedMaaling));
      } catch (e) {
        setError(toError(e, 'Noko gikk gale ved restart av sideutval'));
      }
    };

    doRestart().finally(() => {
      setLoading(false);
      navigate(
        getFullPath(appRoutes.TEST_SIDEUTVAL_LIST, {
          id: String(maaling.id),
          pathParam: idPath,
        })
      );
    });
  }, []);

  if (typeof maaling === 'undefined' || typeof id === 'undefined') {
    return <ErrorCard error={new Error('Ingen måling funnet')} />;
  }

  return (
    <CrawlingList
      maaling={maaling}
      crawlList={crawlResultat}
      onClickRestart={onClickRestart}
      refresh={doFetchData}
      loading={loading}
      error={error}
      refreshing={refreshing}
    />
  );
};

export default SideutvalApp;

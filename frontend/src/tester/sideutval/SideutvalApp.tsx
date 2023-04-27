import { Row } from '@tanstack/react-table';
import React, { useCallback, useState } from 'react';
import { useNavigate, useOutletContext, useParams } from 'react-router-dom';

import AppTitle from '../../common/app-title/AppTitle';
import { appRoutes, getFullPath, idPath } from '../../common/appRoutes';
import ErrorCard from '../../common/error/ErrorCard';
import useInterval from '../../common/hooks/useInterval';
import { fetchMaaling, restartCrawling } from '../../maaling/api/maaling-api';
import { CrawlResultat } from '../../maaling/api/types';
import { TesterContext } from '../types';
import CrawlingList from './CrawlingList';

const SideutvalApp = () => {
  const { maaling, contextError, contextLoading }: TesterContext =
    useOutletContext();
  const { id } = useParams();
  const [crawlResultat, setCrawlResult] = useState<CrawlResultat[]>(
    maaling?.crawlResultat ?? []
  );
  const [error, setError] = useState(contextError);
  const [loading, setLoading] = useState(contextLoading);
  const [refreshing, setRefreshing] = useState(maaling?.status === 'crawling');
  const navigate = useNavigate();

  const doFetchData = useCallback(() => {
    const fetchData = async () => {
      if (id) {
        const refreshedMaaling = await fetchMaaling(Number(id));
        if (!refreshedMaaling) {
          setError('Måling finnes ikkje');
        }

        if (refreshedMaaling.status !== 'crawling') {
          setRefreshing(false);
        }

        setCrawlResult(refreshedMaaling.crawlResultat);
      } else {
        setError('Måling finnes ikkje');
      }
    };

    fetchData().catch(() => {
      setError('Klarte ikkje å hente måling');
    });
  }, []);

  useInterval(
    () => {
      doFetchData();
    },
    refreshing ? 15000 : null
  );

  const onClickRestart = useCallback((row: Row<CrawlResultat>) => {
    setLoading(true);
    setError(undefined);
    const loeysingId = row.original.loeysing.id;

    if (typeof maaling === 'undefined') {
      throw new Error('Måling finnes ikkje');
    } else if (isNaN(loeysingId)) {
      throw new Error('Løysing finnes ikkje på måling');
    }

    const fetchData = async () => {
      try {
        const restartedMaaling = await restartCrawling(maaling.id, loeysingId);
        setCrawlResult(restartedMaaling.crawlResultat);
      } catch (e) {
        setError('Noko gikk gale ved restart av sideutval');
      }
    };

    fetchData().finally(() => {
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
    return <ErrorCard errorText="Ingen måling funnet" />;
  }

  return (
    <div className="sideutval">
      <AppTitle heading="Sideutval" subHeading={maaling.navn} />
      <CrawlingList
        crawlList={crawlResultat}
        error={error}
        onClickRestart={onClickRestart}
        loading={loading}
      />
    </div>
  );
};

export default SideutvalApp;

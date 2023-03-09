import React, { useCallback, useState } from 'react';
import { useOutletContext, useParams } from 'react-router-dom';

import AppTitle from '../../common/app-title/AppTitle';
import ErrorCard from '../../common/error/ErrorCard';
import useInterval from '../../common/hooks/useInterval';
import { fetchMaaling } from '../../maaling/api/maaling-api';
import { CrawlResultat } from '../../maaling/api/types';
import { TesterContext } from '../types';
import CrawlingList from './CrawlingList';

const SideutvalApp = () => {
  const { maaling }: TesterContext = useOutletContext();
  const { id } = useParams();
  const [crawlResultat, setCrawlResult] = useState<CrawlResultat[]>(
    maaling?.crawlResultat ?? []
  );
  const [error, setError] = useState<string | undefined>(undefined);
  const [refreshing, setRefreshing] = useState(true);

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

    fetchData().catch((e) => {
      setError(e);
    });
  }, []);

  useInterval(
    () => {
      doFetchData();
    },
    refreshing ? 15000 : null
  );

  if (typeof id === 'undefined') {
    return <ErrorCard errorText="Ingen sideutval funnet" />;
  }

  return (
    <>
      <AppTitle title="Sideutval" subTitle={maaling?.navn} />
      <CrawlingList
        maalingId={Number(id)}
        crawlList={crawlResultat}
        error={error}
      />
    </>
  );
};

export default SideutvalApp;

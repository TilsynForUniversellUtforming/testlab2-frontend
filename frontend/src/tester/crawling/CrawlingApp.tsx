import React, { useEffect } from 'react';
import { useOutletContext, useParams } from 'react-router-dom';

import ErrorCard from '../../common/error/ErrorCard';
import { fetchMaaling } from '../../maaling/api/maaling-api';
import { TesterContext } from '../types';
import CrawlingList from './CrawlingList';

const CrawlingApp = () => {
  const {
    maaling,
    setContextError,
    setMaaling,
    error,
    loading,
    setLoading,
  }: TesterContext = useOutletContext();
  const { id } = useParams();

  const crawlList = maaling?.crawlResultat;

  useEffect(() => {
    if (!maaling) {
      if (typeof id === 'undefined') {
        setContextError('Kunne ikke finne måling');
      }

      const doFetchMaaling = async () => {
        const data = await fetchMaaling(Number(id));
        setMaaling(data);
      };

      setLoading(true);
      setContextError(undefined);

      doFetchMaaling()
        .catch((e) => setContextError(e))
        .finally(() => setLoading(false));
    }
  }, []);

  if (
    typeof crawlList === 'undefined' ||
    (crawlList && crawlList.length === 0)
  ) {
    return <ErrorCard show errorText="Ingen resultat i måling" />;
  }

  return <CrawlingList crawlList={crawlList} error={error} loading={loading} />;
};

export default CrawlingApp;

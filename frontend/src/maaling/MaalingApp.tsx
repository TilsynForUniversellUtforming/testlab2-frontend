import './maalingApp.scss';

import React, { useCallback, useState } from 'react';
import { Outlet } from 'react-router-dom';

import useFeatureToggles from '../common/features/hooks/useFeatureToggles';
import { useEffectOnce } from '../common/hooks/useEffectOnce';
import useFetch from '../common/hooks/useFetch';
import { fetchMaalingList } from './api/maaling-api';
import { Maaling } from './api/types';
import { MaalingContext } from './types';

const MaalingApp = () => {
  const [error, setError] = useState<string>();
  const [loading, setLoading] = useState(true);
  const [maalingList, setMaalingList] = useState<Maaling[]>([]);
  const [showMaalinger, setShowMaalinger] = useState(false);

  const handleError = useCallback((error: any) => {
    setError(error);
  }, []);

  const handleLoading = useCallback((loading: boolean) => {
    setLoading(loading);
  }, []);

  const doFetchMaalingList = useFetch<Maaling[]>({
    fetchData: fetchMaalingList,
    setData: setMaalingList,
    setError: setError,
    setLoading: setLoading,
  });

  const handleInitMaalinger = () => {
    doFetchMaalingList();
    setShowMaalinger(true);
  };

  useEffectOnce(() => {
    useFeatureToggles('maalinger', handleInitMaalinger, handleLoading);
  });

  /*
          try {
          const updated = await startCrawling(maaling.id);
          if (!updated.id) {
            setError('Noko gjekk gale ved oppretting av måling');
          } else {
            navigate(
              getFullPath(appRoutes.TEST_CRAWLING_LIST, String(updated.id))
            );
          }
        } catch (e) {
          setError('Kunne ikkje starte crawling');
        }
   */

  const maalingContext: MaalingContext = {
    error: error,
    loading: loading,
    showMaalinger: showMaalinger,
    refresh: doFetchMaalingList,
    setContextError: handleError,
    setLoading: handleLoading,
    maalingList: maalingList,
  };

  return <Outlet context={maalingContext} />;
};

export default MaalingApp;

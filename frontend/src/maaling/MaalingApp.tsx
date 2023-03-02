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

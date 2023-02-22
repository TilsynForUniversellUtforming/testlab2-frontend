import './maalingApp.scss';

import { useCallback, useState } from 'react';
import { Outlet } from 'react-router-dom';

import AppTitle from '../common/app-title/AppTitle';
import fetchFeatures from '../common/features/api/features-api';
import { Feature } from '../common/features/api/types';
import { useEffectOnce } from '../common/hooks/useEffectOnce';
import useFetch from '../common/hooks/useFetch';
import { fetchMaalinger } from './api/maaling-api';
import { Maaling } from './api/types';
import { MaalingContext } from './types';

const MaalingApp = () => {
  const [error, setError] = useState<string>();
  const [loading, setLoading] = useState(false);
  const [maalingList, setMaalingList] = useState<Maaling[]>([]);
  const [showMaalinger, setShowMaalinger] = useState(false);

  const handleError = useCallback((error: any) => {
    setError(error);
  }, []);

  const handleLoading = useCallback((loading: boolean) => {
    setLoading(loading);
  }, []);

  const doFetchMaalingList = useFetch<Maaling[]>({
    fetchData: fetchMaalinger,
    setData: setMaalingList,
    setError: setError,
    setLoading: setLoading,
  });

  useEffectOnce(() => {
    fetchFeatures().then(
      (features: Feature[]) => {
        const showMaalinger =
          features.find((feature) => feature.key === 'maalinger')?.active ??
          false;
        if (showMaalinger) {
          doFetchMaalingList();
        }
        setShowMaalinger(showMaalinger);
      },
      (error) => handleError(error)
    );
  });

  const maalingContext: MaalingContext = {
    error: error,
    loading: loading,
    refresh: doFetchMaalingList,
    setContextError: handleError,
    setLoading: handleLoading,
    maalingList: maalingList,
  };

  if (!showMaalinger) {
    return <AppTitle title="Måling" />;
  }

  return (
    <>
      <AppTitle title="Måling" />
      <Outlet context={maalingContext} />
    </>
  );
};

export default MaalingApp;

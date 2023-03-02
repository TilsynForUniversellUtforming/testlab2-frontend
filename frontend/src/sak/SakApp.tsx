import { useCallback, useState } from 'react';
import { Outlet, useParams } from 'react-router-dom';

import AppTitle from '../common/app-title/AppTitle';
import { useEffectOnce } from '../common/hooks/useEffectOnce';
import { fetchMaaling } from '../maaling/api/maaling-api';
import { Maaling } from '../maaling/api/types';
import { SakContext } from './types';

const SakApp = () => {
  const { id } = useParams();

  const [error, setError] = useState<string>();
  const [loading, setLoading] = useState<boolean>(true);
  const [maaling, setMaaling] = useState<Maaling | undefined>();

  const handleSetMaaling = (maaling: Maaling) => {
    setMaaling(maaling);
  };

  const handleError = useCallback((error: any) => {
    setMaaling(undefined);
    setError(error);
  }, []);

  const handleLoading = useCallback((loading: boolean) => {
    setLoading(loading);
  }, []);

  const doFetchData = useCallback(() => {
    setLoading(true);
    setError(undefined);

    const fetchData = async () => {
      if (id) {
        try {
          const maaling = await fetchMaaling(Number(id));
          setMaaling(maaling);
        } catch (e) {
          setError('Måling finnes ikkje');
        }
      }
      setLoading(false);
      setError(undefined);
    };

    fetchData()
      .catch((e) => setError(e))
      .finally(() => setLoading(false));
  }, []);

  useEffectOnce(() => {
    doFetchData();
  });

  const sakContext: SakContext = {
    error: error,
    loading: loading,
    maaling: maaling,
    setMaaling: handleSetMaaling,
    setContextError: handleError,
    setLoading: handleLoading,
    refresh: doFetchData,
  };

  return (
    <>
      <AppTitle title="Ny sak" subTitle="Opprett en ny sak" />
      <Outlet context={sakContext} />
    </>
  );
};

export default SakApp;

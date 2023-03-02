import { useCallback, useState } from 'react';
import { Outlet, useLocation, useParams } from 'react-router-dom';

import AppTitle from '../common/app-title/AppTitle';
import { useEffectOnce } from '../common/hooks/useEffectOnce';
import { fetchMaaling } from '../maaling/api/maaling-api';
import { Maaling } from '../maaling/api/types';
import { SakContext } from './types';

const SakApp = () => {
  const { id } = useParams();
  const { pathname } = useLocation();
  console.log(pathname);

  const [error, setError] = useState<string>();
  const [loading, setLoading] = useState<boolean>(true);
  const [maaling, setMaaling] = useState<Maaling | undefined>();

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
    setContextError: handleError,
    setLoading: handleLoading,
    refresh: doFetchData,
  };

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
  return (
    <>
      <AppTitle title="Ny sak" subTitle="Opprett en ny sak" />
      <Outlet context={sakContext} />
    </>
  );
};

export default SakApp;

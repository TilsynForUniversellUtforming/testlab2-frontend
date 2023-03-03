import { useCallback, useState } from 'react';
import { Outlet, useParams } from 'react-router-dom';

import { useEffectOnce } from '../common/hooks/useEffectOnce';
import { fetchLoysingar } from '../loeysingar/api/loeysingar-api';
import { Loeysing } from '../loeysingar/api/types';
import { fetchMaaling } from '../maaling/api/maaling-api';
import { Maaling } from '../maaling/api/types';
import { getRegelsett_dummy } from '../testreglar/api/testreglar-api_dummy';
import { TestRegelsett } from '../testreglar/api/types';
import { SakContext } from './types';

const SakApp = () => {
  const { id } = useParams();

  const [error, setError] = useState<string>();
  const [loading, setLoading] = useState<boolean>(true);
  const [maaling, setMaaling] = useState<Maaling | undefined>();
  const [loeysingList, setLoeysingList] = useState<Loeysing[]>([]);
  const [regelsettList, setRegelsettList] = useState<TestRegelsett[]>([]);

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

  const doFetchMaaling = useCallback(() => {
    setLoading(true);
    setError(undefined);

    const fetchData = async () => {
      if (id) {
        try {
          // TODO - Bytt ut med fetchSak
          const maaling = await fetchMaaling(Number(id));
          setMaaling(maaling);
        } catch (e) {
          setError('SakOverview finnes ikkje');
        }
      }
      setLoading(false);
      setError(undefined);
    };

    fetchData()
      .catch((e) => setError(e))
      .finally(() => setLoading(false));
  }, []);

  const doFetchMaalingParams = useCallback(() => {
    setLoading(true);
    setError(undefined);

    const doFetch = async () => {
      const loeysingList = await fetchLoysingar();
      setLoeysingList(loeysingList);

      // TODO Bytt ut med riktig kall
      const regelsett = await getRegelsett_dummy();
      setRegelsettList(regelsett);

      setLoading(false);
    };

    doFetch()
      .catch((e) => setError(e))
      .finally(() => setLoading(false));
  }, []);

  const refresh = () => {
    doFetchMaaling();
    doFetchMaalingParams();
  };

  useEffectOnce(() => {
    refresh();
  });

  const sakContext: SakContext = {
    error: error,
    setContextError: handleError,
    loading: loading,
    setLoading: handleLoading,
    maaling: maaling,
    setMaaling: handleSetMaaling,
    refresh: refresh,
    loeysingList: loeysingList,
    regelsettList: regelsettList,
  };

  return <Outlet context={sakContext} />;
};

export default SakApp;

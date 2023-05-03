import { useCallback, useState } from 'react';
import { Outlet, useParams } from 'react-router-dom';

import toError from '../common/error/util';
import { useEffectOnce } from '../common/hooks/useEffectOnce';
import { fetchLoeysingList } from '../loeysingar/api/loeysing-api';
import { Loeysing } from '../loeysingar/api/types';
import { fetchMaaling } from '../maaling/api/maaling-api';
import { Maaling } from '../maaling/api/types';
import { getRegelsett_dummy } from '../testreglar/api/testreglar-api_dummy';
import { TestRegelsett } from '../testreglar/api/types';
import { SakContext } from './types';

const SakApp = () => {
  const { id } = useParams();

  const [error, setError] = useState<Error | undefined>();
  const [loading, setLoading] = useState<boolean>(true);
  const [maaling, setMaaling] = useState<Maaling | undefined>();
  const [loeysingList, setLoeysingList] = useState<Loeysing[]>([]);
  const [regelsettList, setRegelsettList] = useState<TestRegelsett[]>([]);

  const handleSetMaaling = useCallback((maaling: Maaling) => {
    setMaaling(maaling);
  }, []);

  const handleError = useCallback((error: Error | undefined) => {
    setMaaling(undefined);
    setError(error);
  }, []);

  const handleLoading = useCallback((loading: boolean) => {
    setLoading(loading);
  }, []);

  const doFetchData = useCallback(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(undefined);

      if (id) {
        try {
          const maaling = await fetchMaaling(Number(id));
          setMaaling(maaling);
        } catch (e) {
          setError(toError(e, 'Kunne ikkje hente sak'));
        }
      }

      try {
        const loeysingList = await fetchLoeysingList();
        setLoeysingList(loeysingList);
      } catch (e) {
        setError(toError(e, 'Kunne ikkje hente løysingar'));
      }

      try {
        const regelsett = await getRegelsett_dummy();
        setRegelsettList(regelsett);
      } catch (e) {
        setError(toError(e, 'Kunne ikkje hente regelsett'));
      }
    };

    fetchData().finally(() => setLoading(false));
  }, []);

  useEffectOnce(() => {
    doFetchData();
  });

  const sakContext: SakContext = {
    contextError: error,
    setContextError: handleError,
    contextLoading: loading,
    setContextLoading: handleLoading,
    maaling: maaling,
    setMaaling: handleSetMaaling,
    refresh: doFetchData,
    loeysingList: loeysingList,
    regelsettList: regelsettList,
  };

  return <Outlet context={sakContext} />;
};

export default SakApp;

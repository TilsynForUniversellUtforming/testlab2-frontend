import toError from '@common/error/util';
import fetchFeatures from '@common/features/api/features-api';
import { useEffectOnce } from '@common/hooks/useEffectOnce';
import { fetchLoeysingList } from '@loeysingar/api/loeysing-api';
import { Loeysing, Utval } from '@loeysingar/api/types';
import { fetchUtvalList } from '@loeysingar/api/utval-api';
import { fetchMaaling } from '@maaling/api/maaling-api';
import { Maaling } from '@maaling/api/types';
import { Verksemd } from '@verksemder/api/types';
import getVerksemdList_dummy from '@verksemder/api/verksemd-api';
import { useCallback, useState } from 'react';
import { Outlet, useParams } from 'react-router-dom';

import { listRegelsett } from '../testreglar/api/testreglar-api';
import { TestRegelsett } from '../testreglar/api/types';
import { User } from '../user/api/types';
import { getAdvisors_dummy } from '../user/api/user-api';
import { SakContext } from './types';

const SakApp = () => {
  const { id } = useParams();

  const [error, setError] = useState<Error | undefined>();
  const [loading, setLoading] = useState<boolean>(true);
  const [maaling, setMaaling] = useState<Maaling | undefined>();
  const [loeysingList, setLoeysingList] = useState<Loeysing[]>([]);
  const [utvalList, setUtvalList] = useState<Utval[]>([]);
  const [verksemdList, setVerksemdList] = useState<Verksemd[]>([]);
  const [regelsettList, setRegelsettList] = useState<TestRegelsett[]>([]);
  const [advisorList, setAdvisorList] = useState<User[]>([]);
  const [featureUtval, setFeatureUtval] = useState<boolean>(false);

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

  const handleFetchLoeysingList = useCallback(async () => {
    try {
      const loeysingList = await fetchLoeysingList();
      setLoeysingList(loeysingList);
    } catch (e) {
      setError(toError(e, 'Kunne ikkje hente løysingar'));
    }
  }, []);

  const handleFetchUtvalList = useCallback(async () => {
    try {
      const utvalList = await fetchUtvalList();
      setUtvalList(utvalList);
    } catch (e) {
      setError(toError(e, 'Kunne ikkje hente lista med utval'));
    }
  }, []);

  const handleFetchRegelsettList = useCallback(async () => {
    try {
      const regelsett = await listRegelsett();
      setRegelsettList(regelsett);
    } catch (e) {
      setError(toError(e, 'Kunne ikkje hente regelsett'));
    }
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

      await handleFetchLoeysingList();

      await fetchFeatures().then((featureList) => {
        const utvalActive =
          featureList.find((f) => f.key === 'utval')?.active ?? false;

        if (utvalActive) {
          setFeatureUtval(true);
          handleFetchUtvalList();
        }
      });

      await handleFetchRegelsettList();

      try {
        const advisorList = await getAdvisors_dummy();
        setAdvisorList(advisorList);
      } catch (e) {
        setError(toError(e, 'Kunne ikkje hente brukere'));
      }

      try {
        const verksemdList = await getVerksemdList_dummy();
        setVerksemdList(verksemdList);
      } catch (e) {
        setError(toError(e, 'Kunne ikkje hente brukere'));
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
    utvalList: utvalList,
    verksemdList: verksemdList,
    refreshLoeysing: handleFetchLoeysingList,
    regelsettList: regelsettList,
    advisors: advisorList,
    featureUtval: featureUtval,
  };

  return <Outlet context={sakContext} />;
};

export default SakApp;

import toError from '@common/error/util';
import { useEffectOnce } from '@common/hooks/useEffectOnce';
import { withErrorHandling } from '@common/util/apiUtils';
import { fetchLoeysingList } from '@loeysingar/api/loeysing-api';
import { Loeysing, Utval } from '@loeysingar/api/types';
import { fetchUtvalList } from '@loeysingar/api/utval-api';
import { fetchMaaling } from '@maaling/api/maaling-api';
import { Maaling } from '@maaling/api/types';
import { fetchRegelsettList } from '@testreglar/api/regelsett-api';
import { fetchTestreglarList } from '@testreglar/api/testreglar-api';
import { Regelsett, Testregel } from '@testreglar/api/types';
import { Verksemd } from '@verksemder/api/types';
import getVerksemdList_dummy from '@verksemder/api/verksemd-api';
import { useCallback, useState } from 'react';
import { Outlet, useParams } from 'react-router-dom';

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
  const [testregelList, setTestregelList] = useState<Testregel[]>([]);
  const [regelsettList, setRegelsettList] = useState<Regelsett[]>([]);
  const [advisorList, setAdvisorList] = useState<User[]>([]);

  const handleFetchMaaling = async () => {
    if (id) {
      try {
        const maaling = await fetchMaaling(Number(id));
        setMaaling(maaling);
      } catch (e) {
        setError(toError(e, 'Kunne ikkje hente sak'));
      }
    }
  };

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

  const doFetchData = useCallback(
    withErrorHandling(
      async () => {
        const [
          loeysingList,
          utvalList,
          regelsett,
          testregelList,
          advisors,
          verksemdList,
        ] = await Promise.all([
          fetchLoeysingList(),
          fetchUtvalList(),
          fetchRegelsettList(true),
          fetchTestreglarList(),
          getAdvisors_dummy(),
          getVerksemdList_dummy(),
        ]);

        return {
          loeysingList,
          utvalList,
          regelsett,
          testregelList,
          advisors,
          verksemdList,
        };
      },
      'Kunne ikkje hente data',
      setError
    ),
    []
  );

  useEffectOnce(() => {
    setLoading(true);

    if (id) {
      handleFetchMaaling();
    }

    doFetchData()
      .then((data) => {
        if (data) {
          if (data?.loeysingList) {
            setLoeysingList(data.loeysingList);
          } else {
            setError(new Error('Kunne ikkje hente loeysingar'));
          }

          if (data?.regelsett) {
            setRegelsettList(data.regelsett);
          } else {
            setError(new Error('Kunne ikkje hente regelsett'));
          }

          if (data?.testregelList) {
            setTestregelList(data.testregelList);
          } else {
            setError(new Error('Kunne ikkje hente liste med testreglar'));
          }

          if (data?.advisors) {
            setAdvisorList(data.advisors);
          } else {
            setError(new Error('Kunne ikkje hente rådgivere'));
          }

          if (data?.verksemdList) {
            setVerksemdList(data.verksemdList);
          } else {
            setError(new Error('Kunne ikkje hente verksemder'));
          }

          if (data?.utvalList) {
            setUtvalList(data.utvalList);
          } else {
            setError(new Error('Kunne ikkje hente utval'));
          }

          setLoading(false);
        } else {
          setError(new Error('Kunne ikkje hente målingar'));
          setLoading(false);
        }
      })
      .catch((e) => {
        setError(toError(e, 'Kunne ikkje hente målingar'));
        setLoading(false);
      });
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
    testregelList: testregelList,
    advisors: advisorList,
  };

  return <Outlet context={sakContext} />;
};

export default SakApp;

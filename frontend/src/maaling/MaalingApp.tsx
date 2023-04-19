import React, { useCallback, useState } from 'react';
import { Outlet, useNavigate, useParams } from 'react-router-dom';

import { appRoutes, getFullPath, idPath } from '../common/appRoutes';
import ErrorCard from '../common/error/ErrorCard';
import useFeatureToggles from '../common/features/hooks/useFeatureToggles';
import { useEffectOnce } from '../common/hooks/useEffectOnce';
import { fetchLoeysingList } from '../loeysingar/api/loeysing-api';
import { Loeysing } from '../loeysingar/api/types';
import { getRegelsett_dummy } from '../testreglar/api/testreglar-api_dummy';
import { TestRegelsett } from '../testreglar/api/types';
import { fetchMaaling, updateMaalingStatus } from './api/maaling-api';
import { Maaling } from './api/types';
import { MaalingContext } from './types';

const MaalingApp = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [error, setError] = useState<string>();
  const [loading, setLoading] = useState<boolean>(true);
  const [maaling, setMaaling] = useState<Maaling | undefined>();
  const [loeysingList, setLoeysingList] = useState<Loeysing[]>([]);
  const [regelsettList, setRegelsettList] = useState<TestRegelsett[]>([]);
  const [showMaalinger, setShowMaalinger] = useState(false);

  const handleSetMaaling = useCallback((maaling: Maaling) => {
    setMaaling(maaling);
  }, []);

  const handleError = useCallback((error: any) => {
    setMaaling(undefined);
    setError(error);
  }, []);

  const handleLoading = useCallback((loading: boolean) => {
    setLoading(loading);
  }, []);

  const doStartCrawling = useCallback((maaling: Maaling) => {
    setLoading(true);
    setError(undefined);

    const startCrawling = async () => {
      try {
        const updated = await updateMaalingStatus(maaling.id, 'crawling');
        if (!updated.id) {
          setError('Noko gjekk gale ved oppretting av måling');
        } else {
          navigate(
            getFullPath(appRoutes.TEST_SIDEUTVAL_LIST, {
              pathParam: idPath,
              id: String(maaling.id),
            })
          );
        }
      } catch (e) {
        setError('Kunne ikkje starte crawling');
      }
    };

    startCrawling()
      .catch((e) => setError(e))
      .finally(() => setLoading(false));
  }, []);

  const doStartTest = useCallback((maaling: Maaling) => {
    setLoading(true);
    setError(undefined);

    const startTesting = async () => {
      try {
        const updated = await updateMaalingStatus(maaling.id, 'testing');
        if (!updated.id) {
          setError('Noko gjekk gale ved oppdatering av måling');
        } else {
          navigate(
            getFullPath(appRoutes.TEST_SIDEUTVAL_LIST, {
              pathParam: idPath,
              id: String(maaling.id),
            })
          );
        }
      } catch (e) {
        setError('Kunne ikkje starte test');
      }
    };

    startTesting()
      .catch((e) => setError(e))
      .finally(() => setLoading(false));
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

      const loeysingList = await fetchLoeysingList();
      setLoeysingList(loeysingList);

      const regelsett = await getRegelsett_dummy();
      setRegelsettList(regelsett);
      setLoading(false);
      setError(undefined);
    };

    fetchData()
      .catch((e) => setError(e))
      .finally(() => setLoading(false));
  }, []);

  const fetchMaalinger = useCallback(() => {
    doFetchData();
    setShowMaalinger(true);
  }, []);

  useEffectOnce(() => {
    useFeatureToggles('maalinger', fetchMaalinger, handleLoading);
  });

  const maalingContext: MaalingContext = {
    contextError: error,
    setContextError: handleError,
    contextLoading: loading,
    setContextLoading: handleLoading,
    maaling: maaling,
    setMaaling: handleSetMaaling,
    refresh: fetchMaalinger,
    loeysingList: loeysingList,
    regelsettList: regelsettList,
    showMaalinger: showMaalinger,
    handleStartCrawling: doStartCrawling,
    handleStartTest: doStartTest,
  };

  if (!loading && !showMaalinger) {
    return (
      <ErrorCard
        errorHeader="Måling"
        errorText="Målinger låst"
        buttonText="Tilbake"
        onClick={() => navigate('..')}
        centered
      />
    );
  }

  return <Outlet context={maalingContext} />;
};

export default MaalingApp;

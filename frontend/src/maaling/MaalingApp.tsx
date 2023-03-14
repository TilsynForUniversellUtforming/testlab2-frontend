import './maalingApp.scss';

import React, { useCallback, useState } from 'react';
import { Outlet, useNavigate, useParams } from 'react-router-dom';

import { appRoutes, getFullPath, idPath } from '../common/appRoutes';
import useFeatureToggles from '../common/features/hooks/useFeatureToggles';
import { useEffectOnce } from '../common/hooks/useEffectOnce';
import { fetchLoysingar } from '../loeysingar/api/loeysingar-api';
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
        const updated = await updateMaalingStatus(maaling.id);
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

      // TODO Hent løsninger i sak
      const loeysingList = await fetchLoysingar();
      setLoeysingList(loeysingList);

      // TODO Hent regelsett i sak
      const regelsett = await getRegelsett_dummy();
      setRegelsettList(regelsett);
      setLoading(false);
      setError(undefined);
    };

    fetchData()
      .catch((e) => setError(e))
      .finally(() => setLoading(false));
  }, []);

  const refresh = useCallback(() => {
    useFeatureToggles('maalinger', doFetchData, handleLoading);
    setShowMaalinger(true);
  }, []);

  useEffectOnce(() => {
    refresh();
  });

  const maalingContext: MaalingContext = {
    contextError: error,
    setContextError: handleError,
    contextLoading: loading,
    setContextLoading: handleLoading,
    maaling: maaling,
    setMaaling: handleSetMaaling,
    refresh: refresh,
    loeysingList: loeysingList,
    regelsettList: regelsettList,
    showMaalinger: showMaalinger,
    handleStartCrawling: doStartCrawling,
  };

  return <Outlet context={maalingContext} />;
};

export default MaalingApp;

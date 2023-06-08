import { Spinner } from '@digdir/design-system-react';
import React, { useCallback, useState } from 'react';
import { Outlet, useNavigate, useParams } from 'react-router-dom';

import { appRoutes, getFullPath, idPath } from '../common/appRoutes';
import ErrorCard from '../common/error/ErrorCard';
import toError from '../common/error/util';
import useFeatureToggles from '../common/features/hooks/useFeatureToggles';
import { useEffectOnce } from '../common/hooks/useEffectOnce';
import { fetchLoeysingList } from '../loeysingar/api/loeysing-api';
import { Loeysing } from '../loeysingar/api/types';
import { listRegelsett } from '../testreglar/api/testreglar-api';
import { TestRegelsett } from '../testreglar/api/types';
import { User } from '../user/api/types';
import { getAdvisors_dummy } from '../user/api/user-api';
import { fetchMaaling, updateMaalingStatus } from './api/maaling-api';
import { Maaling } from './api/types';
import { MaalingContext } from './types';

const MaalingApp = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [error, setError] = useState<Error | undefined>();
  const [loading, setLoading] = useState<boolean>(true);
  const [maaling, setMaaling] = useState<Maaling | undefined>();
  const [loeysingList, setLoeysingList] = useState<Loeysing[]>([]);
  const [regelsettList, setRegelsettList] = useState<TestRegelsett[]>([]);
  const [advisorList, setAdvisorList] = useState<User[]>([]);
  const [showMaalinger, setShowMaalinger] = useState(false);

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

  const doStartCrawling = useCallback((maaling: Maaling) => {
    setLoading(true);
    setError(undefined);

    const startCrawling = async () => {
      try {
        const updated = await updateMaalingStatus(maaling.id, 'crawling');
        if (!updated.id) {
          setError(new Error('Kunne ikkje starte crawling'));
        } else {
          navigate(
            getFullPath(appRoutes.TEST_SIDEUTVAL_LIST, {
              pathParam: idPath,
              id: String(maaling.id),
            })
          );
        }
      } catch (e) {
        setError(toError(e, 'Kunne ikkje starte crawling'));
      }
    };

    startCrawling().finally(() => setLoading(false));
  }, []);

  const doStartTest = useCallback((maaling: Maaling) => {
    setLoading(true);
    setError(undefined);

    if (maaling.crawlResultat.find((cr) => cr.type === 'feilet')) {
      setError(
        new Error('Kunne ikkje starte test, måling har feil i sideutval')
      );
    }

    const startTesting = async () => {
      try {
        const updated = await updateMaalingStatus(maaling.id, 'testing');
        if (!updated.id) {
          setError(new Error('Noko gjekk gale ved oppdatering av måling'));
        } else {
          navigate(
            getFullPath(appRoutes.TEST_TESTING_LIST, {
              pathParam: idPath,
              id: String(maaling.id),
            })
          );
        }
      } catch (e) {
        setError(toError(e, 'Kunne ikkje starte test'));
      }
    };

    startTesting().finally(() => setLoading(false));
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
          setError(toError(e, 'Måling finnes ikkje'));
        }
      }

      try {
        const loeysingList = await fetchLoeysingList();
        setLoeysingList(loeysingList);
      } catch (e) {
        setError(toError(e, 'Kunne ikkje hente løysingar'));
      }

      try {
        const regelsett = await listRegelsett();
        setRegelsettList(regelsett);
      } catch (e) {
        setError(toError(e, 'Kunne ikkje hente testreglar'));
      }

      const advisors = await getAdvisors_dummy();
      setAdvisorList(advisors);
      setLoading(false);
      setError(undefined);
    };

    fetchData().finally(() => setLoading(false));
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
    advisors: advisorList,
  };

  if (!loading && !showMaalinger) {
    return (
      <ErrorCard
        errorHeader="Måling"
        error={new Error('Målinger låst')}
        buttonText="Tilbake"
        onClick={() => navigate('..')}
      />
    );
  }

  if (loading) {
    return <Spinner title="Venter på målinger" />;
  }

  return <Outlet context={maalingContext} />;
};

export default MaalingApp;

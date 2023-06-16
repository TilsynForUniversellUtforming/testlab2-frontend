import React, { useCallback, useState } from 'react';
import { Outlet, useNavigate, useParams } from 'react-router-dom';

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
import { Verksemd } from '../verksemder/api/types';
import getVerksemdList_dummy from '../verksemder/api/verksemd-api';
import { fetchMaaling, updateMaalingStatus } from './api/maaling-api';
import { Maaling } from './api/types';
import { MaalingContext, MaalingTestStatus } from './types';

const MaalingApp = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [error, setError] = useState<Error | undefined>();
  const [loading, setLoading] = useState<boolean>(true);
  const [testStatus, setTestStatus] = useState<MaalingTestStatus>({
    loading: false,
  });
  const [maaling, setMaaling] = useState<Maaling | undefined>();
  const [loeysingList, setLoeysingList] = useState<Loeysing[]>([]);
  const [verksemdList, setVerksemdList] = useState<Verksemd[]>([]);
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

  const handleResetTestStatus = useCallback(() => {
    setTestStatus({ loading: false, message: undefined });
  }, []);

  const doStartCrawling = useCallback((maaling: Maaling) => {
    setTestStatus({ loading: true, message: undefined });
    setError(undefined);

    const startCrawling = async () => {
      const updated = await updateMaalingStatus(maaling.id, 'crawling');
      if (!updated.id) {
        setTestStatus({
          loading: false,
          message: 'Kunne ikkje starte crawling, prøv igjen',
          severity: 'danger',
        });
      } else {
        setMaaling(updated);
        setTestStatus({
          loading: false,
          message: 'Crawling startet',
          severity: 'success',
        });
      }
    };

    startCrawling().catch((e) =>
      setError(toError(e, 'Noko gjekk gale med start av crawling'))
    );
  }, []);

  const doStartTest = useCallback((maaling: Maaling) => {
    setTestStatus({ loading: true, message: undefined });
    setError(undefined);

    if (maaling.crawlResultat.find((cr) => cr.type === 'feilet')) {
      setTestStatus({
        loading: false,
        message: 'Kunne ikkje starte test, måling har feil i sideutval',
        severity: 'danger',
      });
    }

    const startTesting = async () => {
      const updated = await updateMaalingStatus(maaling.id, 'testing');
      if (!updated.id) {
        setTestStatus({
          loading: false,
          message: 'Kunne ikkje starte test, prøv igjen',
          severity: 'danger',
        });
      } else {
        setMaaling(updated);
        setTestStatus({
          loading: false,
          message: 'Testing startet',
          severity: 'success',
        });
      }
    };

    startTesting().catch((e) =>
      setError(toError(e, 'Noko gjekk gale med start av test'))
    );
  }, []);

  const doStartPublish = (maaling: Maaling) => {
    setTestStatus({
      loading: false,
      message: `Publisering er ikkje tilgjengelig ennå for måling ${maaling.navn}`,
      severity: 'info',
    });
  };

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
          return;
        }
      }

      try {
        const loeysingList = await fetchLoeysingList();
        setLoeysingList(loeysingList);
      } catch (e) {
        setError(toError(e, 'Kunne ikkje hente løysingar'));
        return;
      }

      try {
        const regelsett = await listRegelsett();
        setRegelsettList(regelsett);
      } catch (e) {
        setError(toError(e, 'Kunne ikkje hente regelsett'));
        return;
      }

      const advisors = await getAdvisors_dummy();
      setAdvisorList(advisors);

      const verksemdList = await getVerksemdList_dummy();
      setVerksemdList(verksemdList);
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
    verksemdList: verksemdList,
    regelsettList: regelsettList,
    showMaalinger: showMaalinger,
    handleStartCrawling: doStartCrawling,
    handleStartTest: doStartTest,
    handleStartPublish: doStartPublish,
    advisors: advisorList,
    testStatus: testStatus,
    resetTestStatus: handleResetTestStatus,
  };

  if (!loading && !showMaalinger) {
    return (
      <ErrorCard
        errorHeader="Måling"
        error={new Error('Målingar låst')}
        buttonText="Tilbake"
        onClick={() => navigate('..')}
      />
    );
  }

  return <Outlet context={maalingContext} />;
};

export default MaalingApp;

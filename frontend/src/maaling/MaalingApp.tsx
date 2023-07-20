import React, { useCallback, useEffect, useState } from 'react';
import { Outlet, useNavigate, useParams } from 'react-router-dom';

import ErrorCard from '../common/error/ErrorCard';
import toError from '../common/error/util';
import fetchFeatureToggles from '../common/features/hooks/fetchFeatureToggles';
import { useEffectOnce } from '../common/hooks/useEffectOnce';
import { fetchLoeysingList } from '../loeysingar/api/loeysing-api';
import { Loeysing } from '../loeysingar/api/types';
import { listRegelsett } from '../testreglar/api/testreglar-api';
import { TestRegelsett } from '../testreglar/api/types';
import { User } from '../user/api/types';
import { getAdvisors_dummy } from '../user/api/user-api';
import { Verksemd } from '../verksemder/api/types';
import getVerksemdList_dummy from '../verksemder/api/verksemd-api';
import {
  fetchMaaling,
  fetchMaalingList,
  updateMaalingStatus,
} from './api/maaling-api';
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
  const [showMaalinger, setShowMaalinger] = useState(true);
  const [maalingList, setMaalingList] = useState<Maaling[]>([]);

  const handleSetMaalingList = useCallback((maalingList: Maaling[]) => {
    setMaalingList(maalingList);
  }, []);

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

  const clearTestStatus = useCallback(() => {
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

  const doFetchMaaling = useCallback(async () => {
    setLoading(true);
    setError(undefined);

    if (id) {
      try {
        return await fetchMaaling(Number(id));
      } catch (e) {
        setError(toError(e, 'Kunne ikkje hente måling'));
        return;
      }
    } else {
      setError(new Error('Måling ikkje funnet'));
    }
  }, [id]);

  const doFetchData = useCallback(async () => {
    setLoading(true);
    setError(undefined);

    try {
      const maalingList = await fetchMaalingList();
      const loeysingList = await fetchLoeysingList();
      const regelsett = await listRegelsett();
      const advisors = await getAdvisors_dummy();
      const verksemdList = await getVerksemdList_dummy();
      return { maalingList, loeysingList, regelsett, advisors, verksemdList };
    } catch (e) {
      setError(toError(e, 'Kan ikkje hente data'));
      return;
    }
  }, []);

  useEffectOnce(() => {
    fetchFeatureToggles('maalinger', handleLoading).then(() => {
      doFetchData()
        .then((data) => {
          if (data) {
            if (data?.maalingList) {
              setMaalingList(data.maalingList);
            } else {
              setError(new Error('Kunne ikkje hente liste med målingar'));
            }

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

            setShowMaalinger(true);
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
  });

  useEffect(() => {
    if (!loading && !error && id && showMaalinger) {
      doFetchMaaling()
        .then((data) => {
          if (data) {
            setMaaling(data);
          } else {
            setError(new Error('Kunne ikkje hente måling'));
          }

          setLoading(false);
          setShowMaalinger(true);
        })
        .catch((e) => {
          setError(toError(e, 'Kunne ikkje hente data'));
          setLoading(false);
        });
    }
  }, [id, error, maalingList]);

  const maalingContext: MaalingContext = {
    contextError: error,
    setContextError: handleError,
    contextLoading: loading,
    setContextLoading: handleLoading,
    maaling: maaling,
    setMaaling: handleSetMaaling,
    refreshMaaling: doFetchMaaling,
    refresh: doFetchData,
    maalingList: maalingList,
    setMaalingList: handleSetMaalingList,
    loeysingList: loeysingList,
    verksemdList: verksemdList,
    regelsettList: regelsettList,
    showMaalinger: showMaalinger,
    handleStartCrawling: doStartCrawling,
    handleStartTest: doStartTest,
    handleStartPublish: doStartPublish,
    advisors: advisorList,
    testStatus: testStatus,
    clearTestStatus: clearTestStatus,
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

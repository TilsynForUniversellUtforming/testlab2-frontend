import './testreglar.scss';

import ErrorCard from '@common/error/ErrorCard';
import toError from '@common/error/util';
import { useEffectOnce } from '@common/hooks/useEffectOnce';
import { Tabs } from '@digdir/design-system-react';
import { fetchRegelsettList } from '@testreglar/api/regelsett-api';
import React, { useCallback, useEffect, useState } from 'react';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';

import { fetchTestreglarList } from './api/testreglar-api';
import { Regelsett, Testregel } from './api/types';
import { REGELSETT_ROOT } from './TestregelRoutes';
import { TestregelContext } from './types';

const TestreglarApp = () => {
  const [testreglar, setTestreglar] = useState<Testregel[]>([]);
  const [regelsett, setRegelsett] = useState<Regelsett[]>([]);
  const [error, setError] = useState<Error | undefined>();
  const [loading, setLoading] = useState<boolean>(true);
  const [showTestreglar, setShowTestreglar] = useState(false);
  const navigate = useNavigate();

  const location = useLocation();
  const [tab, setTab] = useState(
    location.pathname.includes(REGELSETT_ROOT.path) ? 'regelsett' : 'testreglar'
  );

  useEffect(() => {
    setTab(
      location.pathname.includes(REGELSETT_ROOT.path)
        ? 'regelsett'
        : 'testreglar'
    );
  }, [location.pathname]);

  const handleTestreglar = useCallback((testregelList: Testregel[]) => {
    setTestreglar(testregelList);
  }, []);

  const handleRegelsett = useCallback((regelsettList: Regelsett[]) => {
    setRegelsett(regelsettList);
  }, []);

  const handleLoading = useCallback((loading: boolean) => {
    setLoading(loading);
  }, []);

  const handleError = useCallback((error: Error | undefined) => {
    setError(error);
  }, []);

  const doFetchData = useCallback(() => {
    setError(undefined);
    setLoading(true);

    const fetchData = async () => {
      try {
        const testreglar = await fetchTestreglarList();
        const regelsett = await fetchRegelsettList(true);
        setTestreglar(testreglar);
        setRegelsett(regelsett);
        setLoading(false);
        setError(undefined);
      } catch (e) {
        setError(toError(e, 'Kunne ikkje hente testreglar'));
      }
    };

    fetchData().finally(() => setLoading(false));
  }, []);

  const fetchTestreglar = useCallback(() => {
    doFetchData();
    setShowTestreglar(true);
  }, []);

  useEffectOnce(() => {
    fetchTestreglar();
  });

  const testRegelContext: TestregelContext = {
    contextError: error,
    contextLoading: loading,
    testregelList: testreglar,
    regelsett: regelsett,
    setTestregelList: handleTestreglar,
    setRegelsettList: handleRegelsett,
    setContextError: handleError,
    setContextLoading: handleLoading,
    refresh: doFetchData,
  };

  const handleChange = (name: string) => {
    if (name === 'regelsett') {
      navigate(REGELSETT_ROOT.path);
    } else {
      navigate('.');
    }
  };

  if (!loading && !showTestreglar) {
    return (
      <ErrorCard
        errorHeader="Testreglar"
        error={new Error('Testreglar låst')}
        buttonText="Tilbake"
        onClick={() => navigate('..')}
      />
    );
  } else if (error) {
    return (
      <ErrorCard
        errorHeader="Testreglar"
        error={error}
        buttonText="Prøv igjen"
        onClick={doFetchData}
      />
    );
  }

  return (
    <>
      <Tabs defaultValue="testreglar" onChange={handleChange} value={tab}>
        <Tabs.List>
          <Tabs.Tab value="testreglar">Testreglar</Tabs.Tab>
          <Tabs.Tab value="regelsett">Regelsett</Tabs.Tab>
        </Tabs.List>
      </Tabs>
      <div className="testreglar__content">
        <Outlet context={testRegelContext} />
      </div>
    </>
  );
};

export default TestreglarApp;

import './testreglar.scss';

import React, { useCallback, useState } from 'react';
import { Outlet } from 'react-router-dom';

import AppTitle from '../common/app-title/AppTitle';
import { useEffectOnce } from '../common/hooks/useEffectOnce';
import routes from '../common/routes';
import { listRegelsett, listTestreglar } from './api/testreglar-api';
import { Testregel, TestRegelsett } from './api/types';
import Navbar from './Navbar';
import { TestregelContext } from './types';

const TestreglarApp = () => {
  const [testreglar, setTestreglar] = useState<Testregel[]>([]);
  const [regelsett, setRegelsett] = useState<TestRegelsett[]>([]);
  const [error, setError] = useState<any>();
  const [loading, setLoading] = useState<boolean>(true);

  const handleTestreglar = useCallback((testregelList: Testregel[]) => {
    setTestreglar(testregelList);
  }, []);

  const handleRegelsett = useCallback((regelsettList: TestRegelsett[]) => {
    setRegelsett(regelsettList);
  }, []);

  const handleLoading = useCallback((loading: boolean) => {
    setLoading(loading);
  }, []);

  const handleError = useCallback((error: any) => {
    setError(error);
  }, []);

  const doFetchData = useCallback(() => {
    const fetchData = async () => {
      const testreglar = await listTestreglar();
      const regelsett = await listRegelsett();
      setTestreglar(testreglar);
      setRegelsett(regelsett);
      setLoading(false);
      setError(undefined);
    };

    fetchData()
      .catch((e) => setError(e))
      .finally(() => setLoading(false));
  }, []);

  useEffectOnce(() => {
    doFetchData();
  });

  const testRegelContext: TestregelContext = {
    error: error,
    loading: loading,
    testreglar: testreglar,
    regelsett: regelsett,
    setTestreglar: handleTestreglar,
    setRegelsett: handleRegelsett,
    setError: handleError,
    setLoading: handleLoading,
    refresh: doFetchData,
  };

  return (
    <>
      <AppTitle title={routes.TESTREGLAR.navn} />
      <Navbar />
      <div className="testreglar__content">
        <Outlet context={testRegelContext} />
      </div>
    </>
  );
};

export default TestreglarApp;

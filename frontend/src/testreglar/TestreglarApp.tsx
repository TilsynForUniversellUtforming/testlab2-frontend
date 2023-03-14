import './testreglar.scss';

import React, { useCallback, useState } from 'react';
import { Outlet } from 'react-router-dom';

import AppTitle from '../common/app-title/AppTitle';
import appRoutes from '../common/appRoutes';
import { useEffectOnce } from '../common/hooks/useEffectOnce';
import { listKrav } from '../krav/api/krav-api';
import { Krav } from '../krav/types';
import { listRegelsett, listTestreglar } from './api/testreglar-api';
import { Testregel, TestRegelsett } from './api/types';
import Navbar from './Navbar';
import { TestregelContext } from './types';

const TestreglarApp = () => {
  const [testreglar, setTestreglar] = useState<Testregel[]>([]);
  const [regelsett, setRegelsett] = useState<TestRegelsett[]>([]);
  const [error, setError] = useState<any>();
  const [loading, setLoading] = useState<boolean>(true);
  const [krav, setKrav] = useState<Krav[]>([]);

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
      const krav = await listKrav();
      setTestreglar(testreglar);
      setRegelsett(regelsett);
      setKrav(krav);
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
    contextError: error,
    contextLoading: loading,
    testreglar: testreglar,
    regelsett: regelsett,
    krav: krav,
    setTestregelList: handleTestreglar,
    setRegelsettList: handleRegelsett,
    setContextError: handleError,
    setContextLoading: handleLoading,
    refresh: doFetchData,
  };

  return (
    <>
      <AppTitle title={appRoutes.TESTREGEL_LIST.navn} />
      <Navbar />
      <div className="testreglar__content">
        <Outlet context={testRegelContext} />
      </div>
    </>
  );
};

export default TestreglarApp;

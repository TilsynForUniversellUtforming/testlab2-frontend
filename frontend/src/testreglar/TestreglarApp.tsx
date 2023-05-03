import './testreglar.scss';

import React, { useCallback, useState } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';

import AppTitle from '../common/app-title/AppTitle';
import appRoutes from '../common/appRoutes';
import ErrorCard from '../common/error/ErrorCard';
import useFeatureToggles from '../common/features/hooks/useFeatureToggles';
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
  const [showTestreglar, setShowTestreglar] = useState(false);
  const navigate = useNavigate();

  const handleTestreglar = useCallback((testregelList: Testregel[]) => {
    setTestreglar(testregelList);
  }, []);

  const handleRegelsett = useCallback((regelsettList: TestRegelsett[]) => {
    setRegelsett(regelsettList);
  }, []);

  const handleLoading = useCallback((loading: boolean) => {
    setLoading(loading);
  }, []);

  const handleError = useCallback((error: Error | undefined) => {
    setError(error);
  }, []);

  const doFetchData = useCallback(() => {
    const fetchData = async () => {
      try {
        const testreglar = await listTestreglar();
        const regelsett = await listRegelsett();
        const krav = await listKrav();
        setTestreglar(testreglar);
        setRegelsett(regelsett);
        setKrav(krav);
        setLoading(false);
        setError(undefined);
      } catch (e) {
        setError(e);
      }
    };

    fetchData().finally(() => setLoading(false));
  }, []);

  const fetchTestreglar = useCallback(() => {
    doFetchData();
    setShowTestreglar(true);
  }, []);

  useEffectOnce(() => {
    useFeatureToggles('testreglar', fetchTestreglar, handleLoading);
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

  if (!loading && !showTestreglar) {
    return (
      <ErrorCard
        errorHeader="Testreglar"
        error={new Error('Testreglar låst')}
        buttonText="Tilbake"
        onClick={() => navigate('..')}
      />
    );
  }

  return (
    <>
      <AppTitle heading={appRoutes.TESTREGEL_LIST.navn} />
      <Navbar />
      <div className="testreglar__content">
        <Outlet context={testRegelContext} />
      </div>
    </>
  );
};

export default TestreglarApp;

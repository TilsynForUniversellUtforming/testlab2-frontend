import './testreglar.scss';

import { Tabs } from '@digdir/design-system-react';
import React, { useCallback, useState } from 'react';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';

import { appRoutes } from '../common/appRoutes';
import ErrorCard from '../common/error/ErrorCard';
import { useEffectOnce } from '../common/hooks/useEffectOnce';
import { listRegelsett, listTestreglar } from './api/testreglar-api';
import { Testregel, TestRegelsett } from './api/types';
import { TestregelContext } from './types';

const TestreglarApp = () => {
  const [testreglar, setTestreglar] = useState<Testregel[]>([]);
  const [regelsett, setRegelsett] = useState<TestRegelsett[]>([]);
  const [error, setError] = useState<any>();
  const [loading, setLoading] = useState<boolean>(true);
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
    setError(undefined);
    setLoading(true);

    const fetchData = async () => {
      try {
        const testreglar = await listTestreglar();
        const regelsett = await listRegelsett();
        setTestreglar(testreglar);
        setRegelsett(regelsett);
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
    fetchTestreglar();
  });

  const testRegelContext: TestregelContext = {
    contextError: error,
    contextLoading: loading,
    testreglar: testreglar,
    regelsett: regelsett,
    setTestregelList: handleTestreglar,
    setRegelsettList: handleRegelsett,
    setContextError: handleError,
    setContextLoading: handleLoading,
    refresh: doFetchData,
  };

  const location = useLocation();
  const lastSegment = location.pathname.split('/').pop();

  const handleChange = (name: string) => {
    if (name === 'Regelsett') {
      navigate(appRoutes.REGELSETT_ROOT.path);
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
  }

  return (
    <>
      <Tabs
        activeTab={
          lastSegment === appRoutes.REGELSETT_ROOT.path
            ? 'Regelsett'
            : 'Testreglar'
        }
        items={[
          {
            name: 'Testreglar',
            content: <></>,
          },
          {
            name: 'Regelsett',
            content: <></>,
          },
        ]}
        onChange={handleChange}
      />
      <div className="testreglar__content">
        <Outlet context={testRegelContext} />
      </div>
    </>
  );
};

export default TestreglarApp;

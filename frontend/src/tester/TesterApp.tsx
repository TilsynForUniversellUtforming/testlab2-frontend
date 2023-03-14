import './tester.scss';

import React, { useCallback, useState } from 'react';
import { Spinner } from 'react-bootstrap';
import { Outlet, useParams } from 'react-router-dom';

import ErrorCard from '../common/error/ErrorCard';
import { useEffectOnce } from '../common/hooks/useEffectOnce';
import { fetchMaaling } from '../maaling/api/maaling-api';
import { Maaling } from '../maaling/api/types';
import { TesterContext } from './types';

const TesterApp = () => {
  const [error, setError] = useState<string>();
  const [loading, setLoading] = useState<boolean>(true);
  const [maaling, setMaaling] = useState<Maaling | undefined>(undefined);
  const { id } = useParams();

  const handleError = useCallback((error: any) => {
    setMaaling(undefined);
    setError(error);
  }, []);

  const handleLoading = useCallback((loading: boolean) => {
    setLoading(loading);
  }, []);

  const handleSetMaaling = useCallback((maaling: Maaling) => {
    setMaaling(maaling);
  }, []);

  const doFetchData = useCallback(() => {
    setLoading(true);
    setError(undefined);

    const fetchData = async () => {
      if (id) {
        const maaling = await fetchMaaling(Number(id));
        setMaaling(maaling);
      } else {
        setError('Måling finnes ikkje');
      }
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

  const testRegelContext: TesterContext = {
    maaling: maaling,
    setMaaling: handleSetMaaling,
    contextError: error,
    contextLoading: loading,
    setContextError: handleError,
    setContextLoading: handleLoading,
  };

  if (loading) {
    return <Spinner />;
  }

  if (typeof maaling === 'undefined') {
    return <ErrorCard errorText="Ingen måling funnet" />;
  }

  return <Outlet context={testRegelContext} />;
};

export default TesterApp;

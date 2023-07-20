import './tester.scss';

import { Spinner } from '@digdir/design-system-react';
import React, { useCallback, useState } from 'react';
import { Outlet, useParams } from 'react-router-dom';

import ErrorCard from '../common/error/ErrorCard';
import toError from '../common/error/util';
import { useEffectOnce } from '../common/hooks/useEffectOnce';
import { fetchMaaling } from '../maaling/api/maaling-api';
import { Maaling } from '../maaling/api/types';
import { TesterContext } from './types';

const TesterApp = () => {
  const [error, setError] = useState<Error | undefined>();
  const [loading, setLoading] = useState<boolean>(true);
  const [maaling, setMaaling] = useState<Maaling | undefined>(undefined);
  const { id } = useParams();

  const handleError = useCallback((error: Error | undefined) => {
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
        try {
          const maaling = await fetchMaaling(Number(id));
          setMaaling(maaling);
        } catch (e) {
          setError(toError(e, 'Fann ikkje måling'));
        }
      } else {
        setError(new Error('Måling finnes ikkje'));
      }
      setLoading(false);
      setError(undefined);
    };

    fetchData().finally(() => setLoading(false));
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
    return <Spinner title="Hentar sak" variant={'default'} />;
  }

  if (typeof maaling === 'undefined') {
    return <ErrorCard error={new Error('Fann ikkje måling')} />;
  }

  return <Outlet context={testRegelContext} />;
};

export default TesterApp;

import ErrorCard from '@common/error/ErrorCard';
import { useEffectOnce } from '@common/hooks/useEffectOnce';
import useFetch from '@common/hooks/useFetch';
import React, { useCallback, useState } from 'react';
import { Outlet } from 'react-router-dom';

import { fetchLoeysingList } from './api/loeysing-api';
import { Loeysing } from './api/types';
import { LoeysingContext } from './types';

const LoeysingApp = () => {
  const [loeysingList, setLoeysingList] = useState<Loeysing[]>([]);
  const [error, setError] = useState<Error | undefined>(undefined);
  const [loading, setLoading] = useState(true);

  const doFetchLoeysingList = useFetch<Loeysing[]>({
    fetchData: fetchLoeysingList,
    setData: setLoeysingList,
    setError: setError,
    setLoading: setLoading,
  });

  useEffectOnce(() => {
    doFetchLoeysingList();
  });

  const handleLoading = useCallback((loading: boolean) => {
    setLoading(loading);
  }, []);

  const handleError = useCallback((error: Error | undefined) => {
    setError(error);
  }, []);

  const handleSetLoeysingList = useCallback((loeysingList: Loeysing[]) => {
    setLoeysingList(loeysingList);
  }, []);

  if (!loading && error) {
    return (
      <ErrorCard
        error={error}
        buttonText="Prøv på nytt"
        onClick={doFetchLoeysingList}
      />
    );
  }

  const loeysingContext: LoeysingContext = {
    contextError: error,
    setContextError: handleError,
    contextLoading: loading,
    setContextLoading: handleLoading,
    loeysingList: loeysingList,
    setLoeysingList: handleSetLoeysingList,
    refresh: doFetchLoeysingList,
  };

  return <Outlet context={loeysingContext} />;
};

export default LoeysingApp;

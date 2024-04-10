import ErrorCard from '@common/error/ErrorCard';
import { useEffectOnce } from '@common/hooks/useEffectOnce';
import useFetch from '@common/hooks/useFetch';
import { Verksemd, VerksemdContext } from '@verksemder/api/types';
import { fetchVerksemdList } from '@verksemder/api/verksemd-api';
import React, { useCallback, useState } from 'react';
import { Outlet } from 'react-router-dom';

const VerksemderApp = () => {
  const [verksemdList, setVerksemdList] = useState<Verksemd[]>([]);
  const [error, setError] = useState<Error | undefined>(undefined);
  const [loading, setLoading] = useState(true);

  const doFetchVerksemdList = useFetch<Verksemd[]>({
    fetchData: fetchVerksemdList,
    setData: setVerksemdList,
    setError: setError,
    setLoading: setLoading,
  });

  useEffectOnce(() => {
    doFetchVerksemdList();
  });

  const handleLoading = useCallback((loading: boolean) => {
    setLoading(loading);
  }, []);

  const handleError = useCallback((error: Error | undefined) => {
    setError(error);
  }, []);

  const handleSetVerksemdList = useCallback((verksemderList: Verksemd[]) => {
    setVerksemdList(verksemderList);
  }, []);

  if (!loading && error) {
    return (
      <ErrorCard
        error={error}
        buttonText="Prøv på nytt"
        onClick={doFetchVerksemdList}
      />
    );
  }

  const verksemdContext: VerksemdContext = {
    contextError: error,
    setContextError: handleError,
    contextLoading: loading,
    setContextLoading: handleLoading,
    verksemdList: verksemdList,
    setVerksemdList: handleSetVerksemdList,
    refresh: doFetchVerksemdList,
  };

  return <Outlet context={verksemdContext} />;
};

export default VerksemderApp;

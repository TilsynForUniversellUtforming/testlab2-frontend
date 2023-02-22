import './tester.scss';

import React, { useCallback, useState } from 'react';
import { Col, Container, Row } from 'react-bootstrap';
import { Outlet } from 'react-router-dom';

import { useEffectOnce } from '../common/hooks/useEffectOnce';
import useFetch from '../common/hooks/useFetch';
import { fetchLoysingar } from '../loeysingar/api/loeysingar-api';
import { Loeysing } from '../loeysingar/api/types';
import { createMaaling } from '../maaling/api/maaling-api';
import { CreatedMaaling, MaalingInit } from '../maaling/api/types';
import TestingStepper from './TestingStepper';
import { TesterContext } from './types';

const TesterApp = () => {
  const [error, setError] = useState<string>();
  const [loading, setLoading] = useState(false);
  const [loeysingList, setLoeysingList] = useState<Loeysing[]>([]);
  const [maaling, setMaaling] = useState<CreatedMaaling>();

  const handleSetLoeysingList = useCallback((loeysingList: Loeysing[]) => {
    setLoeysingList(loeysingList);
  }, []);

  const handleError = useCallback((error: any) => {
    setMaaling(undefined);
    setError(error);
  }, []);

  const handleLoading = useCallback((loading: boolean) => {
    setLoading(loading);
  }, []);

  const onSubmitMaalingInit = useCallback((maalingInit: MaalingInit) => {
    handleLoading(true);
    handleError(undefined);

    const doCreateMaaling = async () => {
      const data = await createMaaling(maalingInit);
      setMaaling(data);
      handleLoading(false);
    };

    doCreateMaaling()
      .catch((e) => handleError(e))
      .finally(() => handleLoading(false));
  }, []);

  const doFetchLoeysingList = useFetch<Loeysing[]>({
    fetchData: fetchLoysingar,
    setData: handleSetLoeysingList,
    setError: handleError,
    setLoading: handleLoading,
  });

  useEffectOnce(() => {
    doFetchLoeysingList();
  });

  const testRegelContext: TesterContext = {
    error: error,
    loading: loading,
    loeysingList: loeysingList,
    onSubmitMaalingInit: onSubmitMaalingInit,
    setLoeysingList: handleSetLoeysingList,
    setContextError: handleError,
    setLoading: handleLoading,
    refresh: doFetchLoeysingList,
  };

  console.log('maaling', maaling);

  return (
    <Container className="mt-3">
      <Row>
        <Col sm={3}>
          <TestingStepper />
        </Col>
        <Col sm={9}>
          <Outlet context={testRegelContext} />
        </Col>
      </Row>
    </Container>
  );
};

export default TesterApp;

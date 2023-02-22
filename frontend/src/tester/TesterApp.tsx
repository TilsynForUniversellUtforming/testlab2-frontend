import './tester.scss';

import React, { useCallback, useState } from 'react';
import { Col, Container, Row } from 'react-bootstrap';
import { Outlet } from 'react-router-dom';

import { useEffectOnce } from '../common/hooks/useEffectOnce';
import useFetch from '../common/hooks/useFetch';
import { fetchLoysingar } from './api/tester-api';
import { Loeysing } from './api/types';
import TestingStepper from './TestingStepper';
import { LoeysingList, TesterContext, TestingForm } from './types';

const TesterApp = () => {
  const [error, setError] = useState<string>();
  const [loading, setLoading] = useState(false);
  const [loeysingList, setLoeysingList] = useState<LoeysingList>({
    loeysingList: [],
  });

  const [testingForm, setTestingForm] = useState<TestingForm>();

  const handleSetLoeysingList = useCallback((loeysingList: Loeysing[]) => {
    setLoeysingList({ loeysingList: loeysingList });
  }, []);

  const handleError = useCallback((error: any) => {
    setError(error);
  }, []);

  const handleLoading = useCallback((loading: boolean) => {
    setLoading(loading);
  }, []);

  const onSubmitLoeysingar = useCallback((loeysingList: LoeysingList) => {
    setTestingForm({ loeysingList: loeysingList, status: 'crawling' });
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
    onSubmitLoeysingar: onSubmitLoeysingar,
    testingForm: testingForm,
    setLoeysingList: handleSetLoeysingList,
    setContextError: handleError,
    setLoading: handleLoading,
    refresh: doFetchLoeysingList,
  };

  return (
    <Container>
      <Row>
        <Col sm={4}>
          <TestingStepper />
        </Col>
        <Col sm={8}>
          <Outlet context={testRegelContext} />
        </Col>
      </Row>
    </Container>
  );
};

export default TesterApp;

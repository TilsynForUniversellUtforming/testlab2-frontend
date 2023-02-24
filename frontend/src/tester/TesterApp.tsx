import './tester.scss';

import React, { useCallback, useState } from 'react';
import { Col, Container, Row } from 'react-bootstrap';
import { Outlet, useNavigate, useParams } from 'react-router-dom';

import { useEffectOnce } from '../common/hooks/useEffectOnce';
import { fetchLoysingar } from '../loeysingar/api/loeysingar-api';
import { Loeysing } from '../loeysingar/api/types';
import {
  createMaaling,
  fetchMaaling,
  updateMaaling,
} from '../maaling/api/maaling-api';
import { Maaling, MaalingInit } from '../maaling/api/types';
import TestingStepper from './TestingStepper';
import { TesterContext } from './types';

const TesterApp = () => {
  const [error, setError] = useState<string>();
  const [loading, setLoading] = useState<boolean>(true);
  const [loeysingList, setLoeysingList] = useState<Loeysing[]>([]);
  const [maaling, setMaaling] = useState<Maaling | undefined>(undefined);
  const { id } = useParams();
  const navigate = useNavigate();

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

  const handleSetmaaling = useCallback((maaling: Maaling) => {
    setMaaling(maaling);
  }, []);

  const onSubmitMaalingInit = useCallback((maalingInit: MaalingInit) => {
    setLoading(true);
    setError(undefined);

    const doCreateMaaling = async () => {
      let maaling: Maaling;
      if (id) {
        maaling = await fetchMaaling(Number(id));
      } else {
        maaling = await createMaaling(maalingInit);
      }
      const updated = await updateMaaling(maaling.id);
      if (!updated.id) {
        setError('Kunne ikke starte crawling');
      } else {
        setMaaling(updated);
        navigate(`${updated.id}/crawling`);
      }
    };

    doCreateMaaling()
      .catch((e) => setError(e))
      .finally(() => {
        setLoading(false);
      });
  }, []);

  const doFetchData = useCallback(() => {
    setLoading(true);
    setError(undefined);

    const fetchData = async () => {
      const loeysingList = await fetchLoysingar();
      if (id) {
        const maaling = await fetchMaaling(Number(id));
        setMaaling(maaling);
      }
      setLoeysingList(loeysingList);
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
    error: error,
    loading: loading,
    loeysingList: loeysingList,
    maaling: maaling,
    setMaaling: handleSetmaaling,
    onSubmitMaalingLoeysingList: onSubmitMaalingInit,
    setLoeysingList: handleSetLoeysingList,
    setContextError: handleError,
    setLoading: handleLoading,
    refresh: doFetchData,
  };

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

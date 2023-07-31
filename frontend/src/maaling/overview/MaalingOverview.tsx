import './maaling-overview.scss';

import ErrorCard from '@common/error/ErrorCard';
import toError from '@common/error/util';
import useInterval from '@common/hooks/useInterval';
import { fetchMaaling } from '@maaling/api/maaling-api';
import React, { useCallback } from 'react';
import { useNavigate, useOutletContext, useParams } from 'react-router-dom';

import { MaalingContext } from '../types';
import MaalingParametersContainer from './parameters/MaalingParametersContainer';
import MaalingSkeleton from './skeleton/MaalingSkeleton';
import MaalingStatusContainer from './status/MaalingStatusContainer';

const MaalingOverview = () => {
  const {
    contextError,
    setContextError,
    contextLoading,
    maaling,
    handleStartCrawling,
    handleStartTest,
    handleStartPublish,
    testStatus,
    clearTestStatus,
    refreshMaaling,
    setMaaling,
    pollMaaling,
    setPollMaaling,
  }: MaalingContext = useOutletContext();
  const { id } = useParams();
  const navigate = useNavigate();

  const doPollMaaling = useCallback(async () => {
    setContextError(undefined);

    if (id) {
      try {
        const refreshedMaaling = await fetchMaaling(Number(id));

        if (!refreshedMaaling) {
          setContextError(new Error('Fann ikkje måling'));
        }

        if (!['crawling', 'testing'].includes(refreshedMaaling.status)) {
          setPollMaaling(false);
        }
        setMaaling(refreshedMaaling);
      } catch (e) {
        setContextError(toError(e, 'Noko gikk gale ved henting av måling'));
      }
    } else {
      setContextError(new Error('Måling finnes ikkje'));
    }
  }, []);

  useInterval(() => doPollMaaling(), pollMaaling ? 15000 : null);

  if (contextLoading || (!maaling && id)) {
    return <MaalingSkeleton />;
  }

  if (contextError) {
    return (
      <ErrorCard
        error={contextError}
        onClick={refreshMaaling}
        buttonText="Prøv igjen"
      />
    );
  } else if (!maaling || !id) {
    return (
      <ErrorCard
        error={new Error('Finner ikkje måling')}
        onClick={() => navigate('..')}
        buttonText="Tilbake"
      />
    );
  }

  return (
    <>
      <div className="maaling-overview">
        <div className="parameter">
          <MaalingParametersContainer id={id} maaling={maaling} />
        </div>
        <MaalingStatusContainer
          maaling={maaling}
          handleStartCrawling={handleStartCrawling}
          handleStartTest={handleStartTest}
          handleStartPublish={handleStartPublish}
          testStatus={testStatus}
          clearTestStatus={clearTestStatus}
        />
      </div>
    </>
  );
};

export default MaalingOverview;

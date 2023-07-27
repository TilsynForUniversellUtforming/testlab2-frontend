import './maaling-overview.scss';

import ErrorCard from '@common/error/ErrorCard';
import React from 'react';
import { useNavigate, useOutletContext, useParams } from 'react-router-dom';

import { MaalingContext } from '../types';
import MaalingParametersContainer from './parameters/MaalingParametersContainer';
import MaalingSkeleton from './skeleton/MaalingSkeleton';
import MaalingStatusContainer from './status/MaalingStatusContainer';

const MaalingOverview = () => {
  const {
    contextError,
    contextLoading,
    maaling,
    handleStartCrawling,
    handleStartTest,
    handleStartPublish,
    testStatus,
    clearTestStatus,
    refreshMaaling,
  }: MaalingContext = useOutletContext();
  const { id } = useParams();
  const navigate = useNavigate();

  if (contextLoading) {
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

import './maaling-overview.scss';

import React from 'react';
import { useOutletContext, useParams } from 'react-router-dom';

import ErrorCard from '../../common/error/ErrorCard';
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
  }: MaalingContext = useOutletContext();
  const { id } = useParams();

  if (contextLoading) {
    return <MaalingSkeleton />;
  }

  if (contextError) {
    return <ErrorCard error={contextError} />;
  } else if (!maaling || !id) {
    return <ErrorCard error={new Error('Finner ikkje måling')} />;
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
        />
      </div>
    </>
  );
};

export default MaalingOverview;

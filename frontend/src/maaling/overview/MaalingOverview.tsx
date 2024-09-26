import './maaling-overview.scss';

import ErrorCard from '@common/error/ErrorCard';
import toError from '@common/error/util';
import useLoading from '@common/hooks/useLoading';
import { fetchMaaling } from '@maaling/api/maaling-api';
import React, { useCallback, useEffect } from 'react';
import { useNavigate, useOutletContext, useParams } from 'react-router-dom';

import { MaalingContext } from '../types';
import MaalingParametersContainer from './parameters/MaalingParametersContainer';
import MaalingSkeleton from './skeleton/MaalingSkeleton';
import MaalingStatusContainer from './status/MaalingStatusContainer';

const MaalingOverview = () => {
  const {
    contextError,
    setContextError,
    maaling,
    refreshMaaling,
    setMaaling,
  }: MaalingContext = useOutletContext();

  const { id } = useParams();
  const navigate = useNavigate();
  const [loading] = useLoading(maaling?.id !== Number(id));

  const doPollMaaling = useCallback(async () => {
    try {
      const refreshedMaaling = await fetchMaaling(Number(id));
      if (!refreshedMaaling) {
        setContextError(new Error('Fann ikkje måling'));
      } else {
        setMaaling(refreshedMaaling);
      }
    } catch (e) {
      setContextError(toError(e, 'Noko gikk gale ved henting av måling'));
    }
  }, [id]);

  useEffect(() => {
    if (maaling?.status === 'crawling' || maaling?.status === 'testing') {
      const intervalId = setInterval(doPollMaaling, 60000);

      return () => clearInterval(intervalId);
    }
  }, [maaling?.status]);

  if (contextError) {
    return (
      <ErrorCard
        error={contextError}
        onClick={refreshMaaling}
        buttonText="Prøv igjen"
      />
    );
  }
  if (loading) {
    return <MaalingSkeleton />;
  }
  if (!maaling || !id) {
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
        <MaalingStatusContainer maaling={maaling} />
      </div>
    </>
  );
};

export default MaalingOverview;

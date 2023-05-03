import { Spinner } from '@digdir/design-system-react';
import React, { useCallback } from 'react';
import { useNavigate, useOutletContext } from 'react-router-dom';

import ErrorCard from '../../common/error/ErrorCard';
import toError from '../../common/error/util';
import { createTestregel } from '../api/testreglar-api';
import { Testregel, TestregelCreateRequest } from '../api/types';
import { TestregelContext } from '../types';
import TestreglarForm from './TestreglarForm';

const CreateTestregel = () => {
  const {
    contextError,
    contextLoading,
    krav,
    setTestregelList,
    setContextLoading,
    setContextError,
  }: TestregelContext = useOutletContext();
  const navigate = useNavigate();

  const onSubmit = useCallback((testregel: Testregel) => {
    const kravId = Number(testregel.kravId);

    const request: TestregelCreateRequest = {
      kravId: kravId === 0 ? undefined : testregel.kravId,
      referanseAct: testregel.referanseAct,
      kravTilSamsvar: testregel.kravTilSamsvar,
      type: testregel.type,
      status: testregel.status,
    };

    const create = async () => {
      try {
        const data = await createTestregel(request);
        setTestregelList(data);
      } catch (e) {
        setContextError(toError(e, 'Kunne ikkje lage testregel'));
      }
    };

    setContextLoading(true);
    setContextError(undefined);

    create().finally(() => {
      setContextLoading(false);
      navigate('..');
    });
  }, []);

  if (contextLoading) {
    return <Spinner title="Hentar testreglar" variant={'default'} />;
  }

  if (contextError) {
    return <ErrorCard error={contextError} />;
  }

  return (
    <TestreglarForm label="Lag ny testregel" onSubmit={onSubmit} krav={krav} />
  );
};

export default CreateTestregel;

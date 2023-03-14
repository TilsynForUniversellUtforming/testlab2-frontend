import React, { useCallback } from 'react';
import { Spinner } from 'react-bootstrap';
import { useNavigate, useOutletContext } from 'react-router-dom';

import ErrorCard from '../../common/error/ErrorCard';
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
      const data = await createTestregel(request);
      setTestregelList(data);
    };

    setContextLoading(true);
    setContextError(undefined);

    create()
      .catch((e) => {
        setContextError(e.message);
      })
      .finally(() => {
        setContextLoading(false);
        navigate('..');
      });
  }, []);

  if (contextLoading) {
    return (
      <Spinner
        as="span"
        animation="border"
        size="sm"
        role="status"
        aria-hidden="true"
      />
    );
  }

  if (contextError) {
    return <ErrorCard show={contextError} />;
  }

  return (
    <TestreglarForm label="Lag ny testregel" onSubmit={onSubmit} krav={krav} />
  );
};

export default CreateTestregel;

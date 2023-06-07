import { Spinner } from '@digdir/design-system-react';
import React, { useCallback } from 'react';
import { useNavigate, useOutletContext } from 'react-router-dom';

import ErrorCard from '../../common/error/ErrorCard';
import toError from '../../common/error/util';
import { createTestregel } from '../api/testreglar-api';
import { Testregel, TestregelCreateRequest } from '../api/types';
import { TestregelContext } from '../types';
import TestreglarForm from './TestreglarForm';

const TestregelCreate = () => {
  const {
    contextError,
    contextLoading,
    testreglar,
    setTestregelList,
    setContextLoading,
    setContextError,
  }: TestregelContext = useOutletContext();
  const navigate = useNavigate();

  const onSubmit = useCallback((testregel: Testregel) => {
    const request: TestregelCreateRequest = {
      krav: testregel.krav,
      testregelNoekkel: testregel.testregelNoekkel,
      kravTilSamsvar: testregel.kravTilSamsvar,
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

  const krav = testreglar
    .map((tr) => tr.krav)
    .sort()
    .filter(
      (value, index, current_value) => current_value.indexOf(value) === index
    );

  if (contextLoading) {
    return <Spinner title="Hentar testreglar" variant={'default'} />;
  }

  if (contextError) {
    return <ErrorCard error={contextError} buttonText="Tilbake" />;
  }

  return (
    <TestreglarForm
      label="Lag ny testregel"
      onSubmit={onSubmit}
      krav={krav}
      kravDisabled={false}
    />
  );
};

export default TestregelCreate;

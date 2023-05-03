import { Spinner } from '@digdir/design-system-react';
import React, { useCallback } from 'react';
import { useNavigate, useOutletContext, useParams } from 'react-router-dom';

import ErrorCard from '../../common/error/ErrorCard';
import toError from '../../common/error/util';
import { updateTestregel } from '../api/testreglar-api';
import { Testregel, TestregelEditRequest } from '../api/types';
import { TestregelContext } from '../types';
import TestreglarForm from './TestreglarForm';

const EditTestreglar = () => {
  const {
    contextError,
    contextLoading,
    testreglar,
    krav,
    setTestregelList,
    setContextLoading,
    setContextError,
  }: TestregelContext = useOutletContext();
  const navigate = useNavigate();
  const { id } = useParams();
  const numberId = Number(id);

  const testregel: Testregel | undefined = testreglar.find(
    (tr) => tr.id === numberId
  );

  const onSubmit = useCallback((testregel: Testregel) => {
    const kravId = Number(testregel.kravId);

    const request: TestregelEditRequest = {
      id: testregel.id,
      kravId: kravId === 0 ? undefined : testregel.kravId,
      referanseAct: testregel.referanseAct,
      kravTilSamsvar: testregel.kravTilSamsvar,
      type: testregel.type,
      status: testregel.status,
    };

    setContextLoading(true);
    setContextError(undefined);

    const update = async () => {
      try {
        const data = await updateTestregel(request);
        setTestregelList(data);
      } catch (e) {
        setContextError(toError(e, 'Kunne ikkje endre testregel'));
      }
    };

    update().finally(() => {
      setContextLoading(false);
      navigate('..');
    });
  }, []);

  if (contextLoading) {
    return <Spinner title="Hentar testreglar" variant={'default'} />;
  }

  if (contextError || typeof testregel === 'undefined') {
    return <ErrorCard error={contextError} />;
  }

  return (
    <TestreglarForm
      label="Endre testregel"
      onSubmit={onSubmit}
      testregel={testregel}
      krav={krav}
    />
  );
};

export default EditTestreglar;

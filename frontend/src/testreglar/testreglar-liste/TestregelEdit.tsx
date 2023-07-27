import ErrorCard from '@common/error/ErrorCard';
import toError from '@common/error/util';
import { Spinner } from '@digdir/design-system-react';
import React, { useCallback } from 'react';
import { useNavigate, useOutletContext, useParams } from 'react-router-dom';

import { updateTestregel } from '../api/testreglar-api';
import { Testregel } from '../api/types';
import { TestregelContext } from '../types';
import TestreglarForm from './TestreglarForm';

const TestregelEdit = () => {
  const {
    contextError,
    contextLoading,
    testreglar,
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

  const krav = testreglar
    .map((tr) => tr.krav)
    .sort()
    .filter((value, index, current) => current.indexOf(value) === index);

  const onSubmit = useCallback((testregel: Testregel) => {
    setContextLoading(true);
    setContextError(undefined);

    const update = async () => {
      try {
        const data = await updateTestregel(testregel);
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
      kravDisabled
    />
  );
};

export default TestregelEdit;

import React, { useCallback } from 'react';
import { Spinner } from 'react-bootstrap';
import { useNavigate, useOutletContext, useParams } from 'react-router-dom';

import ErrorCard from '../../common/error/ErrorCard';
import { updateTestregel } from '../api/testreglar-api';
import { Testregel, TestregelEditRequest } from '../api/types';
import { TestregelContext } from '../types';
import TestreglarForm from './TestreglarForm';

const EditTestreglar = () => {
  const {
    error,
    loading,
    testreglar,
    krav,
    setTestregelList,
    setLoading,
    setError,
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

    const update = async () => {
      const data = await updateTestregel(request);
      setTestregelList(data);
    };

    setLoading(true);
    setError(undefined);

    update()
      .catch((e) => {
        setError(e.message);
      })
      .finally(() => {
        setLoading(false);
        navigate('..');
      });
  }, []);

  if (loading) {
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

  if (error || typeof testregel === 'undefined') {
    return <ErrorCard show={error} />;
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

import React from 'react';
import { Spinner } from 'react-bootstrap';
import { useOutletContext, useParams } from 'react-router-dom';

import ErrorCard from '../../common/error/ErrorCard';
import { Testregel } from '../api/types';
import { TestregelContext } from '../types';
import EditTestreglarForm from './EditTestreglarForm';

const EditTestreglar = () => {
  const { error, loading, testreglar, krav }: TestregelContext =
    useOutletContext();

  const { id } = useParams();
  const numberId = Number(id);

  const testregel: Testregel | undefined = testreglar.find(
    (tr) => tr.id === numberId
  );

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

  return <EditTestreglarForm testregel={testregel} krav={krav} />;
};

export default EditTestreglar;

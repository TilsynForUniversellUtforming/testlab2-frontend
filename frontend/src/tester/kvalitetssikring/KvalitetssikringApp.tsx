import React from 'react';
import { Spinner } from 'react-bootstrap';
import { useOutletContext } from 'react-router-dom';

import ErrorCard from '../../common/error/ErrorCard';
import { TesterContext } from '../types';
import KvalitetssikringList from './KvalitetssikringList';

const KvalitetssikringApp = () => {
  const { error, loading, maaling }: TesterContext = useOutletContext();

  const loesyingList = maaling?.loeysingList;

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

  if (
    typeof maaling === 'undefined' ||
    typeof loesyingList === 'undefined' ||
    loesyingList?.length === 0
  ) {
    return <ErrorCard show />;
  }

  return (
    <KvalitetssikringList
      error={error}
      loading={loading}
      loeysingList={loesyingList}
    />
  );
};

export default KvalitetssikringApp;

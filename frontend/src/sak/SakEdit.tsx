import React from 'react';
import { useOutletContext } from 'react-router-dom';

import ErrorCard from '../common/error/ErrorCard';
import { SakContext } from './types';

const SakEdit = () => {
  const { maaling, error }: SakContext = useOutletContext();

  if (!maaling || error) {
    return <ErrorCard />;
  }

  return <>Endre sak {maaling.id}</>;
};

export default SakEdit;

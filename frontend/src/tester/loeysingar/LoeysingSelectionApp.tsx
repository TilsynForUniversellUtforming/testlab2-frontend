import React from 'react';
import { Spinner } from 'react-bootstrap';
import { useOutletContext } from 'react-router-dom';

import {
  useDefaultMiddleStep,
  useDefaultStartStep,
} from '../../common/form/hooks/useSteps';
import { TesterContext } from '../types';
import LoeysingSelctionForm from './LoeysingSelctionForm';

const LoeysingSelectionApp = () => {
  const { onSubmitMaalingLoeysingList, loading, maaling }: TesterContext =
    useOutletContext();

  const step = maaling ? useDefaultMiddleStep() : useDefaultStartStep();

  if (loading) {
    return <Spinner />;
  }

  return (
    <LoeysingSelctionForm
      label="Velg løysingar"
      onSubmit={onSubmitMaalingLoeysingList}
      maaling={maaling}
      step={step}
    />
  );
};

export default LoeysingSelectionApp;

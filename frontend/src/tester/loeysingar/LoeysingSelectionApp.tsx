import React from 'react';
import { useForm } from 'react-hook-form';
import { useOutletContext } from 'react-router-dom';

import { MaalingInit } from '../api/types';
import { TesterContext } from '../types';
import LoeysingSelctionForm from './LoeysingSelctionForm';

const LoeysingSelectionApp = () => {
  const { onSubmitMaalingInit }: TesterContext = useOutletContext();

  const formMethods = useForm<MaalingInit>({
    defaultValues: {
      navn: '',
      loeysingList: [],
    },
  });

  return (
    <LoeysingSelctionForm
      label="Velg løysingar"
      formMethods={formMethods}
      onSubmit={onSubmitMaalingInit}
    />
  );
};

export default LoeysingSelectionApp;

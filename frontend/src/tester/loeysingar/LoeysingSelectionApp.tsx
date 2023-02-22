import React from 'react';
import { useForm } from 'react-hook-form';
import { useOutletContext } from 'react-router-dom';

import { LoeysingList, TesterContext } from '../types';
import LoeysingSelctionForm from './LoeysingSelctionForm';

const LoeysingSelectionApp = () => {
  const { onSubmitLoeysingar }: TesterContext = useOutletContext();

  const formMethods = useForm<LoeysingList>({
    defaultValues: {
      loeysingList: [],
    },
  });

  return (
    <LoeysingSelctionForm
      label="Velg løysingar"
      formMethods={formMethods}
      onSubmit={onSubmitLoeysingar}
    />
  );
};

export default LoeysingSelectionApp;

import React, { useCallback } from 'react';
import { useForm } from 'react-hook-form';
import { useOutletContext } from 'react-router-dom';

import { Regelsett } from '../api/types';
import { TestregelContext } from '../types';
import RegelsettForm from './RegelsettForm';

const RegelsettCreate = () => {
  const { setContextError, setContextLoading }: TestregelContext =
    useOutletContext();

  const formMethods = useForm<Regelsett>({
    defaultValues: {
      namn: '',
      testregelList: [],
      type: 'forenklet',
    },
  });

  const onSubmit = useCallback(() => {
    setContextLoading(true);
    setContextError(undefined);
  }, []);

  return (
    <RegelsettForm
      label="Nytt regelsett"
      formMethods={formMethods}
      onSubmit={onSubmit}
    />
  );
};

export default RegelsettCreate;

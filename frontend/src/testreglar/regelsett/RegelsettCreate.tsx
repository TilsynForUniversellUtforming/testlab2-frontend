import useValidate, { testreglarMessage } from '@common/form/hooks/useValidate';
import React, { useCallback } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate, useOutletContext } from 'react-router-dom';

import { Testregel, TestRegelsett } from '../api/types';
import { TestregelContext } from '../types';
import RegelsettForm from './RegelsettForm';

const RegelsettCreate = () => {
  const { setContextError, setContextLoading }: TestregelContext =
    useOutletContext();

  const navigate = useNavigate();
  const formMethods = useForm<TestRegelsett>({
    defaultValues: {
      namn: '',
      testregelList: [],
    },
  });

  const { setError, clearErrors } = formMethods;

  const onSubmit = useCallback((regelsett: TestRegelsett) => {
    const validation = useValidate<Testregel, TestRegelsett>({
      selection: regelsett.testregelList,
      name: 'testregelList',
      setError: setError,
      clearErrors: clearErrors,
      message: testreglarMessage,
    });
    if (!validation) {
      return;
    }

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

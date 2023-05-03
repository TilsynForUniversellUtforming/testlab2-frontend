import React, { useCallback } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate, useOutletContext } from 'react-router-dom';

import useValidate, {
  testreglarMessage,
} from '../../common/form/hooks/useValidate';
import { createRegelsett } from '../api/testreglar-api';
import { RegelsettRequest, Testregel, TestRegelsett } from '../api/types';
import { TestregelContext } from '../types';
import RegelsettForm from './RegelsettForm';

const CreateRegelsett = () => {
  const {
    setRegelsettList,
    setContextError,
    setContextLoading,
  }: TestregelContext = useOutletContext();

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

    const request: RegelsettRequest = {
      namn: regelsett.namn,
      ids: regelsett.testregelList.map((tr) => tr.id),
    };

    const addRegelsett = async () => {
      const data = await createRegelsett(request);
      setRegelsettList(data);
    };

    setContextLoading(true);
    setContextError(undefined);

    addRegelsett().finally(() => {
      setContextLoading(false);
      navigate('..');
    });
  }, []);

  return (
    <RegelsettForm
      label="Nytt regelsett"
      formMethods={formMethods}
      onSubmit={onSubmit}
    />
  );
};

export default CreateRegelsett;

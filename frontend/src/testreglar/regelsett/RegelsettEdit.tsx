import React, { useCallback } from 'react';
import { useForm } from 'react-hook-form';
import { useOutletContext, useParams } from 'react-router-dom';

import useValidate, {
  testreglarMessage,
} from '../../common/form/hooks/useValidate';
import { Testregel, TestRegelsett } from '../api/types';
import { TestregelContext } from '../types';
import RegelsettForm from './RegelsettForm';

const RegelsettEdit = () => {
  const { regelsett, setContextError, setContextLoading }: TestregelContext =
    useOutletContext();
  const { id } = useParams();
  const numberId = Number(id);

  const selectedRegelsett: TestRegelsett | undefined = regelsett.find(
    (tr) => tr.id === numberId
  );

  const formMethods = useForm<TestRegelsett>({
    defaultValues: {
      id: selectedRegelsett?.id,
      namn: selectedRegelsett?.namn,
      testregelList: selectedRegelsett?.testregelList,
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
      label="Endre regelset"
      formMethods={formMethods}
      regelsett={selectedRegelsett}
      onSubmit={onSubmit}
    />
  );
};

export default RegelsettEdit;

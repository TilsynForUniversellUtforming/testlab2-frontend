import React, { useCallback } from 'react';
import { useForm } from 'react-hook-form';
import { useOutletContext, useParams } from 'react-router-dom';

import { TestRegelsett } from '../api/types';
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
      type: 'forenklet',
      testregelList: selectedRegelsett?.testregelList,
    },
  });

  const onSubmit = useCallback(() => {
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

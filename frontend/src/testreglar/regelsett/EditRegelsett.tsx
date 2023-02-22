import React, { useCallback } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate, useOutletContext, useParams } from 'react-router-dom';

import useValidate, {
  testreglarMessage,
} from '../../common/form/hooks/useValidate';
import { updateRegelsett } from '../api/testreglar-api';
import { Testregel, TestRegelsett } from '../api/types';
import { TestregelContext } from '../types';
import RegelsettForm from './RegelsettForm';

const EditRegelsett = () => {
  const {
    regelsett,
    setRegelsettList,
    setContextError,
    setLoading,
  }: TestregelContext = useOutletContext();
  const { id } = useParams();
  const numberId = Number(id);

  const selectedRegelsett: TestRegelsett | undefined = regelsett.find(
    (tr) => tr.id === numberId
  );

  const navigate = useNavigate();
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

    const addRegelsett = async () => {
      const data = await updateRegelsett(regelsett);
      setRegelsettList(data);
    };

    setLoading(true);
    setContextError(undefined);

    addRegelsett()
      .catch((e) => {
        setContextError(e.message);
      })
      .finally(() => {
        setLoading(false);
        navigate('..');
      });
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

export default EditRegelsett;

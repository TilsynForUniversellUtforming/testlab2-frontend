import useAlert from '@common/alert/useAlert';
import toError from '@common/error/util';
import { zodResolver } from '@hookform/resolvers/zod';
import { updateRegelsett } from '@testreglar/api/regelsett-api';
import { regelsettValidationSchema } from '@testreglar/regelsett/regelsettValidationSchema';
import React, { useCallback } from 'react';
import { useForm } from 'react-hook-form';
import { useOutletContext, useParams } from 'react-router-dom';

import { Regelsett } from '../api/types';
import { TestregelContext } from '../types';
import RegelsettForm from './RegelsettForm';

const RegelsettEdit = () => {
  const {
    regelsett,
    setContextError,
    setContextLoading,
    setRegelsettList,
  }: TestregelContext = useOutletContext();

  const [alert, setAlert] = useAlert();
  const { id } = useParams();
  const numberId = Number(id);

  const selectedRegelsett: Regelsett | undefined = regelsett.find(
    (tr) => tr.id === numberId
  );

  const formMethods = useForm<Regelsett>({
    defaultValues: {
      id: selectedRegelsett?.id,
      namn: selectedRegelsett?.namn,
      standard: selectedRegelsett?.standard,
      type: 'forenklet',
      testregelList: selectedRegelsett?.testregelList,
    },
    resolver: zodResolver(regelsettValidationSchema),
  });

  const onSubmit = useCallback(
    (regelsett: Regelsett) => {
      const numericId = Number(id);
      setContextLoading(true);
      setContextError(undefined);

      const update = async () => {
        try {
          const data = await updateRegelsett({ ...regelsett, id: numericId });
          setRegelsettList(data);
          setAlert('success', `Regelsett ${regelsett.namn} er endra`);
        } catch (e) {
          setContextError(toError(e, 'Kunne ikkje endre regelsett'));
        }
      };

      update().finally(() => {
        setContextLoading(false);
      });
    },
    [id]
  );

  return (
    <RegelsettForm
      heading="Endre regelsett"
      description="Her kan du endra eit eksisterande regelsett"
      formMethods={formMethods}
      regelsett={selectedRegelsett}
      onSubmit={onSubmit}
      alert={alert}
    />
  );
};

export default RegelsettEdit;

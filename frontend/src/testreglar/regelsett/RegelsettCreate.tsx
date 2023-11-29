import useAlert from '@common/alert/useAlert';
import toError from '@common/error/util';
import { zodResolver } from '@hookform/resolvers/zod';
import { createRegelsett } from '@testreglar/api/regelsett-api';
import { regelsettValidationSchema } from '@testreglar/regelsett/regelsettValidationSchema';
import React, { useCallback } from 'react';
import { useForm } from 'react-hook-form';
import { useOutletContext } from 'react-router-dom';

import { Regelsett, RegelsettCreate } from '../api/types';
import { TestregelContext } from '../types';
import RegelsettForm from './RegelsettForm';

const RegelsettCreate = () => {
  const [alert, setAlert] = useAlert();
  const {
    setContextError,
    setContextLoading,
    setRegelsettList,
  }: TestregelContext = useOutletContext();

  const formMethods = useForm<Regelsett>({
    defaultValues: {
      namn: '',
      testregelList: [],
      type: 'inngaaende',
      standard: false,
    },
    resolver: zodResolver(regelsettValidationSchema),
  });

  const onSubmit = useCallback((regelsettInit: Regelsett) => {
    const regelsett: RegelsettCreate = {
      namn: regelsettInit.namn,
      type: regelsettInit.type,
      standard: regelsettInit.standard,
      testregelIdList: regelsettInit.testregelList.map((tr) => tr.id),
    };

    const create = async () => {
      setContextLoading(true);
      setContextError(undefined);
      try {
        const data = await createRegelsett(regelsett);
        setRegelsettList(data);
        setAlert('success', `${regelsett.namn} er oppretta`);
      } catch (e) {
        setContextError(toError(e, 'Kunne ikkje lage regelsett'));
      }
    };

    create().finally(() => {
      setContextLoading(false);
    });
  }, []);

  return (
    <RegelsettForm
      heading="Nytt regelsett"
      description="Her kan du opprette eit regelsett. Fyll ut skjema og vel dei testreglane du ønskjer å ha i regelsettet frå tabellen under."
      formMethods={formMethods}
      onSubmit={onSubmit}
      alert={alert}
    />
  );
};

export default RegelsettCreate;

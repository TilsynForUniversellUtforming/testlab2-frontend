import useAlert from '@common/alert/useAlert';
import toError from '@common/error/util';
import { createRegelsett } from '@testreglar/api/regelsett-api';
import RegelsettFormSkeleton from '@testreglar/regelsett/skeleton/RegelsettFormSkeleton';
import React, { useCallback, useEffect, useState } from 'react';
import { useOutletContext } from 'react-router-dom';

import { Regelsett, RegelsettCreate } from '../api/types';
import { TestregelContext } from '../types';
import RegelsettForm from './RegelsettForm';

const RegelsettCreate = () => {
  const [alert, setAlert] = useAlert();
  const {
    contextLoading,
    setContextError,
    setRegelsettList,
  }: TestregelContext = useOutletContext();
  const [loading, setLoading] = useState(contextLoading);

  useEffect(() => {
    setLoading(contextLoading);
  }, [contextLoading]);

  const onSubmit = useCallback((regelsettInit: Regelsett) => {
    const regelsett: RegelsettCreate = {
      namn: regelsettInit.namn,
      type: regelsettInit.type,
      standard: regelsettInit.standard,
      testregelIdList: regelsettInit.testregelList.map((tr) => tr.id),
    };

    const create = async () => {
      setLoading(true);
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
      setLoading(false);
    });
  }, []);

  if (loading) {
    return (
      <RegelsettFormSkeleton
        heading="Endre regelsett"
        description="Laster..."
      />
    );
  }

  return (
    <RegelsettForm
      heading="Nytt regelsett"
      description="Her kan du opprette eit regelsett. Fyll ut skjema og vel dei testreglane du ønskjer å ha i regelsettet frå tabellen under."
      onSubmit={onSubmit}
      alert={alert}
    />
  );
};

export default RegelsettCreate;

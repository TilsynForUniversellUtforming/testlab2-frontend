import { AlertProps } from '@common/alert/AlertTimed';
import toError from '@common/error/util';
import React, { useCallback, useState } from 'react';
import { useOutletContext } from 'react-router-dom';

import { createTestregel } from '../api/testreglar-api';
import { Testregel, TestregelCreateRequest } from '../api/types';
import { TestregelContext } from '../types';
import TestregelFormSkeleton from './skeleton/TestregelFormSkeleton';
import TestregelForm from './TestregelForm';

const TestregelCreate = () => {
  const {
    contextLoading,
    testreglar,
    setTestregelList,
    setContextLoading,
    setContextError,
  }: TestregelContext = useOutletContext();
  const [alert, setAlert] = useState<AlertProps | undefined>(undefined);

  const onSubmit = useCallback((testregelInit: Testregel) => {
    const testregel: TestregelCreateRequest = {
      krav: testregelInit.krav,
      testregelNoekkel: testregelInit.testregelNoekkel,
      kravTilSamsvar: testregelInit.kravTilSamsvar,
    };

    const existingTestregel = testreglar.find(
      (tr) => tr.testregelNoekkel === testregel.testregelNoekkel
    );
    if (existingTestregel) {
      setAlert({
        severity: 'danger',
        message: `Testregel med testregel-id ${testregel.testregelNoekkel} finst allereie`,
        clearMessage: () => setAlert(undefined),
      });
      return;
    }

    const create = async () => {
      try {
        setContextLoading(true);
        const data = await createTestregel(testregel);
        setTestregelList(data);
        setAlert({
          severity: 'success',
          message: `${testregel.kravTilSamsvar} er oppretta`,
          clearMessage: () => setAlert(undefined),
        });
      } catch (e) {
        setContextError(toError(e, 'Kunne ikkje lage testregel'));
      }
    };

    create().finally(() => {
      setContextLoading(false);
    });
  }, []);

  const krav = testreglar
    .map((tr) => tr.krav)
    .sort()
    .filter(
      (value, index, current_value) => current_value.indexOf(value) === index
    );

  if (contextLoading) {
    return (
      <TestregelFormSkeleton
        heading="Lag ny testregel"
        subHeading="Her kan du opprette ein ny testregel"
      />
    );
  }

  return (
    <TestregelForm
      heading="Lag ny testregel"
      subHeading="Her kan du opprette ein ny testregel"
      onSubmit={onSubmit}
      krav={krav}
      kravDisabled={false}
      alert={alert}
    />
  );
};

export default TestregelCreate;

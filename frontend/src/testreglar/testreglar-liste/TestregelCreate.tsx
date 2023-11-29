import useAlert from '@common/alert/useAlert';
import toError from '@common/error/util';
import React, { useCallback } from 'react';
import { useOutletContext } from 'react-router-dom';

import { createTestregel } from '../api/testreglar-api';
import { Testregel, TestregelCreateRequest } from '../api/types';
import { TestregelContext } from '../types';
import TestregelFormSkeleton from './skeleton/TestregelFormSkeleton';
import TestregelForm from './TestregelForm';

const TestregelCreate = () => {
  const {
    contextLoading,
    testregelList,
    setTestregelList,
    setContextLoading,
    setContextError,
  }: TestregelContext = useOutletContext();
  const [alert, setAlert] = useAlert();

  const onSubmit = useCallback((testregelInit: Testregel) => {
    const testregel: TestregelCreateRequest = {
      krav: testregelInit.krav,
      testregelSchema: testregelInit.testregelSchema,
      name: testregelInit.name,
      type: testregelInit.type,
    };

    const existingTestregel = testregelList.find(
      (tr) => tr.testregelSchema === testregel.testregelSchema
    );
    if (existingTestregel) {
      setAlert(
        'danger',
        `Testregel med testregel-id ${testregel.testregelSchema} finst allereie`
      );
      return;
    }

    const create = async () => {
      try {
        setContextLoading(true);
        const data = await createTestregel(testregel);
        setTestregelList(data);
        setAlert('success', `${testregel.name} er oppretta`);
      } catch (e) {
        setContextError(toError(e, 'Kunne ikkje lage testregel'));
      }
    };

    create().finally(() => {
      setContextLoading(false);
    });
  }, []);

  const krav = testregelList
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
      description="Her kan du opprette ein ny testregel"
      onSubmit={onSubmit}
      krav={krav}
      kravDisabled={false}
      alert={alert}
    />
  );
};

export default TestregelCreate;

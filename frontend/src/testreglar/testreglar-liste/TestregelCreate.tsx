import useAlert from '@common/alert/useAlert';
import toError from '@common/error/util';
import React, { useCallback } from 'react';
import { useOutletContext } from 'react-router-dom';

import { createTestregel } from '../api/testreglar-api';
import { TestregelInit } from '../api/types';
import { TestregelContext } from '../types';
import TestregelFormSkeleton from './skeleton/TestregelFormSkeleton';
import TestregelForm from './TestregelForm';

const TestregelCreate = () => {
  const {
    contextLoading,
    setTestregelList,
    setContextLoading,
    innhaldstypeList,
    temaList,
    testobjektList,
    kravList,
  }: TestregelContext = useOutletContext();
  const [alert, setAlert] = useAlert();

  const onSubmit = useCallback((testregel: TestregelInit) => {
    const create = async () => {
      try {
        setContextLoading(true);
        const data = await createTestregel(testregel);
        setTestregelList(data);
        setAlert('success', `${testregel.namn} er oppretta`);
      } catch (e) {
        setAlert('danger', toError(e, 'Kunne ikkje lagre testregel').message);
      }
    };

    create().finally(() => {
      setContextLoading(false);
    });
  }, []);

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
      innhaldstypeList={innhaldstypeList}
      temaList={temaList}
      testobjektList={testobjektList}
      kravList={kravList}
      alert={alert}
    />
  );
};

export default TestregelCreate;

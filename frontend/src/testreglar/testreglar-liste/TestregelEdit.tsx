import { AlertProps } from '@common/alert/AlertTimed';
import toError from '@common/error/util';
import React, { useCallback, useEffect, useState } from 'react';
import { useOutletContext, useParams } from 'react-router-dom';

import { updateTestregel } from '../api/testreglar-api';
import { Testregel } from '../api/types';
import { TestregelContext } from '../types';
import TestregelFormSkeleton from './skeleton/TestregelFormSkeleton';
import TestregelForm from './TestregelForm';

const getTestregel = (testregelList: Testregel[], id: string | undefined) =>
  testregelList.find((tr) => tr.id === Number(id));

const TestregelEdit = () => {
  const {
    contextLoading,
    testreglar,
    setTestregelList,
    setContextLoading,
    setContextError,
  }: TestregelContext = useOutletContext();
  const { id } = useParams();
  const [testregel, setTestregel] = useState(getTestregel(testreglar, id));
  const [loading, setLoading] = useState(contextLoading);
  const [alert, setAlert] = useState<AlertProps | undefined>(undefined);

  useEffect(() => {
    const foundLoeysing = getTestregel(testreglar, id);
    if (foundLoeysing) {
      setTestregel(foundLoeysing);
      setLoading(false);
    }
  }, [testreglar]);

  const krav = testreglar
    .map((tr) => tr.krav)
    .sort()
    .filter((value, index, current) => current.indexOf(value) === index);

  const onSubmit = useCallback((testregel: Testregel) => {
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

    const update = async () => {
      try {
        setContextLoading(true);
        setContextError(undefined);
        const data = await updateTestregel(testregel);
        setTestregelList(data);
        setAlert({
          severity: 'success',
          message: `${testregel.kravTilSamsvar} er endra`,
          clearMessage: () => setAlert(undefined),
        });
      } catch (e) {
        setContextError(toError(e, 'Kunne ikkje endre testregel'));
      }
    };

    update().finally(() => {
      setContextLoading(false);
    });
  }, []);

  if (loading) {
    return (
      <TestregelFormSkeleton heading="Endre testregel" subHeading="Laster..." />
    );
  }

  return (
    <TestregelForm
      heading="Endre testregel"
      subHeading={testregel?.testregelNoekkel}
      onSubmit={onSubmit}
      testregel={testregel}
      krav={krav}
      kravDisabled
      alert={alert}
    />
  );
};

export default TestregelEdit;

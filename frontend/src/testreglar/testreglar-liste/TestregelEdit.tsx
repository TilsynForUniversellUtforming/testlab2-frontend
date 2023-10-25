import useAlert from '@common/alert/useAlert';
import toError from '@common/error/util';
import useContentDocumentTitle from '@common/hooks/useContentDocumentTitle';
import React, { useCallback, useEffect, useState } from 'react';
import { useOutletContext, useParams } from 'react-router-dom';

import { updateTestregel } from '../api/testreglar-api';
import { Testregel } from '../api/types';
import { TESTREGEL_EDIT } from '../TestregelRoutes';
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
  const [alert, setAlert] = useAlert();

  useEffect(() => {
    const foundLoeysing = getTestregel(testreglar, id);
    if (foundLoeysing) {
      setTestregel(foundLoeysing);
      setLoading(false);
    }
  }, [testreglar]);

  useContentDocumentTitle(TESTREGEL_EDIT.navn, testregel?.kravTilSamsvar);

  const krav = testreglar
    .map((tr) => tr.krav)
    .sort()
    .filter((value, index, current) => current.indexOf(value) === index);

  const onSubmit = useCallback(
    (testregel: Testregel) => {
      const numericId = Number(id);
      const existingTestregel = testreglar.find(
        (tr) =>
          tr.testregelNoekkel === testregel.testregelNoekkel &&
          tr.id !== numericId
      );
      if (existingTestregel) {
        setAlert(
          'danger',
          `Testregel med testregel-id ${testregel.testregelNoekkel} finst allereie`
        );
        return;
      }

      const update = async () => {
        try {
          setContextLoading(true);
          setContextError(undefined);
          const data = await updateTestregel({ ...testregel, id: numericId });
          setTestregelList(data);
          setAlert('success', `${testregel.kravTilSamsvar} er endra`);
        } catch (e) {
          setContextError(toError(e, 'Kunne ikkje endre testregel'));
        }
      };

      update().finally(() => {
        setContextLoading(false);
      });
    },
    [id]
  );

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

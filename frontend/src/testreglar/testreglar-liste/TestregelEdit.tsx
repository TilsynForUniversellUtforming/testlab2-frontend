import useAlert from '@common/alert/useAlert';
import ErrorCard from '@common/error/ErrorCard';
import toError from '@common/error/util';
import useLoaderFetch from '@common/hooks/useLoaderFetch';
import React, { Suspense, useCallback } from 'react';
import { Await, useOutletContext, useParams } from 'react-router-dom';

import { getTestregel, updateTestregel } from '../api/testreglar-api';
import { Testregel } from '../api/types';
import { TestregelContext } from '../types';
import TestregelFormSkeleton from './skeleton/TestregelFormSkeleton';
import TestregelForm from './TestregelForm';

const TestregelEdit = () => {
  const {
    testregelList,
    setTestregelList,
    setContextLoading,
    setContextError,
    innhaldstypeList,
    temaList,
    testobjektList,
  }: TestregelContext = useOutletContext();
  const { id } = useParams();
  const { data: testregel } = useLoaderFetch<Testregel>();
  const [alert, setAlert] = useAlert();

  const krav = testregelList
    .map((tr) => tr.krav)
    .sort()
    .filter((value, index, current) => current.indexOf(value) === index);

  const onSubmit = useCallback((testregel: Testregel) => {
    const update = async () => {
      try {
        setContextLoading(true);
        setContextError(undefined);
        const data = await updateTestregel(testregel);
        setTestregelList(data);
        setAlert('success', `${testregel.namn} er endra`);
      } catch (e) {
        setAlert(
          'danger',
          toError(e, 'Kunne ikkje oppdatere testregel').message
        );
      }
    };

    update().finally(() => {
      setContextLoading(false);
    });
  }, []);

  return (
    <Suspense
      fallback={
        <TestregelFormSkeleton
          heading="Endre testregel"
          subHeading="Laster..."
        />
      }
    >
      <Await
        resolve={testregel}
        errorElement={
          <ErrorCard
            errorHeader="Feil"
            buttonText="Hent på nytt"
            onClick={() => getTestregel(Number(id))}
          />
        }
      >
        {(testregel) => (
          <TestregelForm
            heading="Endre testregel"
            description={`Her kan du endra ${testregel.namn || 'testregel'}`}
            onSubmit={onSubmit}
            testregel={testregel}
            innhaldstypeList={innhaldstypeList}
            temaList={temaList}
            testobjektList={testobjektList}
            krav={krav}
            kravDisabled
            alert={alert}
          />
        )}
      </Await>
    </Suspense>
  );
};

export default TestregelEdit;

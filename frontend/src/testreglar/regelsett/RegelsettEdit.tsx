import useAlert from '@common/alert/useAlert';
import toError from '@common/error/util';
import { updateRegelsett } from '@testreglar/api/regelsett-api';
import RegelsettFormSkeleton from '@testreglar/regelsett/skeleton/RegelsettFormSkeleton';
import React, { useCallback, useEffect, useState } from 'react';
import { useOutletContext, useParams } from 'react-router-dom';

import { Regelsett, RegelsettEdit } from '../api/types';
import { TestregelContext } from '../types';
import RegelsettForm from './RegelsettForm';

const getRegelsett = (regelsettList: Regelsett[], id: string | undefined) =>
  regelsettList.find((rs) => rs.id === Number(id));

const RegelsettEdit = () => {
  const {
    regelsettList,
    setContextError,
    contextLoading,
    setRegelsettList,
  }: TestregelContext = useOutletContext();
  const { id } = useParams();
  const [alert, setAlert] = useAlert();
  const [regelsett, setRegelsett] = useState(getRegelsett(regelsettList, id));
  const [loading, setLoading] = useState(contextLoading);

  useEffect(() => {
    const foundRegelsett = getRegelsett(regelsettList, id);
    if (foundRegelsett) {
      setRegelsett(foundRegelsett);
      setLoading(false);
    }
  }, [regelsettList]);

  const onSubmit = useCallback(
    (regelsett: Regelsett) => {
      const numericId = Number(id);
      setLoading(true);
      setContextError(undefined);

      const update = async () => {
        const regelsettEdit: RegelsettEdit = {
          id: numericId,
          namn: regelsett.namn,
          type: regelsett.type,
          standard: regelsett.standard,
          testregelIdList: regelsett.testregelList.map((tr) => tr.id),
        };

        try {
          const data = await updateRegelsett(regelsettEdit);
          setRegelsettList(data);
          setRegelsett(data.find((rs) => rs.id === numericId));
          setAlert('success', `Regelsett ${regelsett.namn} er endra`);
        } catch (e) {
          setContextError(toError(e, 'Kunne ikkje endre regelsett'));
        }
      };

      update().finally(() => {
        setLoading(false);
      });
    },
    [id]
  );

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
      heading="Endre regelsett"
      description={`Her kan du endra ${regelsett?.namn || 'regelsett'}`}
      regelsett={regelsett}
      onSubmit={onSubmit}
      alert={alert}
    />
  );
};

export default RegelsettEdit;

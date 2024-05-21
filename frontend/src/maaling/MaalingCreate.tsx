import '@maaling/sak.scss';

import toError from '@common/error/util';
import useError from '@common/hooks/useError';
import useLoading from '@common/hooks/useLoading';
import { getFullPath, idPath } from '@common/util/routeUtils';
import { createMaaling } from '@maaling/api/maaling-api';
import { MaalingInit } from '@maaling/api/types';
import MaalingForm from '@maaling/form/form/MaalingForm';
import useMaalingForm from '@maaling/hooks/hooks/useMaalingForm';
import { MAALING } from '@maaling/MaalingRoutes';
import { MaalingContext, MaalingFormState } from '@maaling/types';
import React, { useCallback, useState } from 'react';
import { useNavigate, useOutletContext } from 'react-router-dom';

const MaalingCreate = () => {
  const navigate = useNavigate();

  const { contextLoading, contextError }: MaalingContext = useOutletContext();

  const [error, setError] = useError(contextError);
  const [loading, setLoading] = useLoading(contextLoading);

  const [formState, setFormState] = useState<MaalingFormState>({
    navn: '',
    loeysingList: [],
    loeysingSource: 'manuell',
    testregelList: [],
    maxLenker: 100,
    talLenker: 30,
    sakType: 'Forenklet kontroll',
    advisorId: undefined,
    sakNumber: undefined,
  });

  const doCreateMaaling = async (maalingFormState: MaalingFormState) => {
    setLoading(true);
    setError(undefined);

    if (
      maalingFormState.navn &&
      maalingFormState.maxLenker &&
      maalingFormState.talLenker
    ) {
      const base = {
        navn: maalingFormState.navn,
        testregelIdList: maalingFormState.testregelList.map((tr) => tr.id),
        crawlParameters: {
          maxLenker: maalingFormState.maxLenker,
          talLenker: maalingFormState.talLenker,
        },
      };
      const maalingInit: MaalingInit = maalingFormState.utval
        ? { ...base, utvalId: maalingFormState.utval.id }
        : {
            ...base,
            loeysingIdList: maalingFormState.loeysingList.map(
              (l) => l.loeysing.id
            ),
          };

      try {
        const maaling = await createMaaling(maalingInit);
        navigate(
          getFullPath(MAALING, {
            pathParam: idPath,
            id: String(maaling.id),
          })
        );
      } catch (e) {
        setError(toError(e, 'Kunne ikkje oppdatere måling'));
      }
    } else {
      setError(new Error('Måling manglar parametre'));
    }
  };

  const formStepState = useMaalingForm('planlegging');
  const { isLastStep, setNextStep, currentStepIdx } = formStepState;

  const handleSubmit = useCallback(
    (maalingFormState: MaalingFormState) => {
      setFormState((prevState) => ({
        ...prevState,
        ...maalingFormState,
      }));

      if (maalingFormState?.sakType === 'Forenklet kontroll') {
        if (!isLastStep(currentStepIdx)) {
          return setNextStep();
        } else {
          doCreateMaaling(maalingFormState).finally(() => {
            setLoading(false);
          });
        }
      }
    },
    [isLastStep, setNextStep, currentStepIdx]
  );

  return (
    <MaalingForm
      formStepState={formStepState}
      maalingFormState={formState}
      onSubmit={handleSubmit}
      loading={loading}
      error={error}
    />
  );
};

export default MaalingCreate;

import React, { useCallback, useState } from 'react';
import { useNavigate, useOutletContext } from 'react-router-dom';

import AppTitle from '../common/app-title/AppTitle';
import { appRoutes, getFullPath, idPath } from '../common/appRoutes';
import { updateMaaling } from '../maaling/api/maaling-api';
import { MaalingEdit } from '../maaling/api/types';
import SakStepFormContainer from './form/SakStepFormContainer';
import useSakForm from './hooks/useSakForm';
import {
  defaultSakSteps,
  SakContext,
  SakFormState,
  startedSakSteps,
} from './types';

const SakEdit = () => {
  const navigate = useNavigate();

  const {
    maaling,
    regelsettList,
    loeysingList,
    setMaaling,
    contextLoading,
    contextError,
  }: SakContext = useOutletContext();

  const [error, setError] = useState(contextError);
  const [loading, setLoading] = useState(contextLoading);

  const defaultState: SakFormState = {
    navn: maaling?.navn ?? '',
    loeysingList: maaling?.loeysingList ?? [],
    regelsettId: '1',
    maxLinksPerPage: 100,
    numLinksToSelect: 30,
  };

  const [maalingFormState, setMaalingFormState] =
    useState<SakFormState>(defaultState);

  const doSubmitMaaling = useCallback((maalingFormState: SakFormState) => {
    const doEditMaaling = async () => {
      setLoading(true);
      setError(undefined);

      if (maaling) {
        const maalingEdit: MaalingEdit = {
          id: maaling.id,
          navn: maalingFormState.navn!,
          loeysingIdList: maalingFormState.loeysingList.map((l) => l.id),
          crawlParameters: {
            maxLinksPerPage: maalingFormState.maxLinksPerPage,
            numLinksToSelect: maalingFormState.numLinksToSelect,
          },
          // TODO - Legg til regelsett: regelsettList.find(rs => rs.id === Number(maalingFormState.regelsett))
        };

        try {
          // TODO - Bytt ut med updateSak
          const maaling = await updateMaaling(maalingEdit);
          setMaaling(maaling);
          navigate(
            getFullPath(appRoutes.MAALING, {
              pathParam: idPath,
              id: String(maaling.id),
            })
          );
        } catch (e) {
          setError('Kunne ikkje lage sak');
        }
      } else {
        setError('Kunne ikkje oppdatere sak');
      }
    };

    doEditMaaling()
      .catch((e) => setError(e))
      .finally(() => {
        setLoading(false);
      });
  }, []);

  const sakSteps =
    maaling?.status === 'planlegging' ? defaultSakSteps : startedSakSteps;

  const {
    steps,
    currentStep,
    isLastStep,
    setPreviousStep,
    setNextStep,
    goToStep,
  } = useSakForm(sakSteps);

  const handleSubmit = (maalingFormState: SakFormState) => {
    setMaalingFormState(maalingFormState);
    if (!isLastStep) {
      return setNextStep();
    } else {
      doSubmitMaaling(maalingFormState);
    }
  };

  return (
    <>
      <AppTitle heading="Endre sak" subHeading="Opprett en ny sak" />
      <SakStepFormContainer
        currentStep={currentStep}
        steps={steps}
        goToStep={goToStep}
        setPreviousStep={setPreviousStep}
        maalingFormState={maalingFormState}
        loading={loading}
        error={error}
        onSubmit={handleSubmit}
        regelsettList={regelsettList}
        loeysingList={loeysingList}
      />
    </>
  );
};

export default SakEdit;

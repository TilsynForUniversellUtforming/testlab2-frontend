import AlertTimed from '@common/alert/AlertTimed';
import useAlert from '@common/alert/useAlert';
import toError from '@common/error/util';
import useError from '@common/hooks/useError';
import useLoading from '@common/hooks/useLoading';
import { updateMaaling } from '@maaling/api/maaling-api';
import { MaalingEditParams } from '@maaling/api/types';
import { MaalingContext } from '@maaling/types';
import React, { useCallback } from 'react';
import { useOutletContext } from 'react-router-dom';

import SakStepForm from './form/SakStepForm';
import useMaalingFormState from './hooks/useMaalingFormState';
import useSakForm from './hooks/useSakForm';
import { SakFormState } from './types';

interface Props {
  onChangeTabs: (tab: string) => void;
}

const MaalingEdit = ({ onChangeTabs }: Props) => {
  const {
    maaling,
    loeysingList,
    utvalList,
    verksemdList,
    regelsettList,
    advisors,
    setMaaling,
    loadingMaaling,
    contextError,
  }: MaalingContext = useOutletContext();

  const [error, setError] = useError(contextError);
  const [alert, setAlert] = useAlert();
  const [loading, setLoading] = useLoading(loadingMaaling);
  const [maalingFormState, setMaalingFormState] = useMaalingFormState(
    maaling,
    verksemdList,
    advisors
  );

  const doSubmitMaaling = useCallback(
    (maalingFormState: SakFormState) => {
      setLoading(true);
      setError(undefined);

      const doEditMaaling = async () => {
        if (maaling) {
          const maalingEdit: MaalingEditParams = {
            id: maaling.id,
            navn: maalingFormState.navn!,
            loeysingIdList: maalingFormState.loeysingList.map(
              (l) => l.loeysing.id
            ),
            testregelIdList: maalingFormState.testregelList.map((tr) => tr.id),
            crawlParameters: {
              maxLinksPerPage: maalingFormState.maxLinksPerPage,
              numLinksToSelect: maalingFormState.numLinksToSelect,
            },
          };

          try {
            const maaling = await updateMaaling(maalingEdit);
            setMaaling(maaling);
            setAlert('success', `${maalingEdit.navn} er oppdatert`);
          } catch (e) {
            setError(toError(e, 'Kunne ikkje lage sak'));
          }
        } else {
          setError(new Error('Kunne ikkje oppdatere sak'));
        }
      };

      doEditMaaling().finally(() => {
        setLoading(false);
        onChangeTabs('oversikt');
      });
    },
    [maaling]
  );

  const formStepState = useSakForm(maaling?.status, true);
  const { isLastStep, setNextStep } = formStepState;

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
      <SakStepForm
        formStepState={formStepState}
        maalingFormState={maalingFormState}
        loeysingList={loeysingList}
        utvalList={utvalList}
        verksemdList={verksemdList}
        regelsettList={regelsettList}
        advisors={advisors}
        onSubmit={handleSubmit}
        loading={loading}
        error={error}
      />
      {alert && (
        <AlertTimed
          severity={alert.severity}
          message={alert.message}
          clearMessage={alert.clearMessage}
        />
      )}
    </>
  );
};

export default MaalingEdit;

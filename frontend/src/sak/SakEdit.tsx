import React, { useCallback, useState } from 'react';
import { useOutletContext, useParams } from 'react-router-dom';

import Alert, { AlertProps } from '../common/alert/Alert';
import toError from '../common/error/util';
import { useEffectOnce } from '../common/hooks/useEffectOnce';
import {
  fetchMaalingTestreglar,
  updateMaaling,
} from '../maaling/api/maaling-api';
import { MaalingEdit } from '../maaling/api/types';
import SakStepForm from './form/SakStepForm';
import useSakForm from './hooks/useSakForm';
import {
  defaultSakSteps,
  SakContext,
  SakFormState,
  startedSakSteps,
} from './types';

const SakEdit = () => {
  const {
    maaling,
    regelsettList,
    loeysingList,
    verksemdList,
    setMaaling,
    contextLoading,
    contextError,
    advisors,
  }: SakContext = useOutletContext();

  const { id } = useParams();

  const [error, setError] = useState(contextError);
  const [alert, setAlert] = useState<AlertProps | undefined>(undefined);
  const [loading, setLoading] = useState(contextLoading);
  const [maalingFormState, setMaalingFormState] = useState<SakFormState>({
    navn: maaling?.navn ?? '',
    loeysingList: maaling?.loeysingList
      ? maaling.loeysingList.map((l) => ({
          loeysing: l,
          verksemd: verksemdList[0],
        }))
      : [],
    testregelList: maaling?.testregelList
      ? maaling.testregelList
      : regelsettList[0].testregelList,
    maxLinksPerPage: maaling?.crawlParameters?.maxLinksPerPage
      ? maaling.crawlParameters.maxLinksPerPage
      : 100,
    numLinksToSelect: maaling?.crawlParameters?.numLinksToSelect
      ? maaling.crawlParameters.numLinksToSelect
      : 30,
    sakType: 'Tilsyn',
    advisorId: String(advisors[0].id),
    sakNumber: undefined,
  });

  const doFetchData = useCallback(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(undefined);

      if (id && maaling?.testregelList?.length === 0) {
        try {
          const testregelList = await fetchMaalingTestreglar(Number(id));
          setMaalingFormState((sakFormState) => ({
            ...sakFormState,
            testregelList,
          }));
        } catch (e) {
          setError(toError(e, 'Kunne ikkje hente testreglar'));
        }
      }
    };

    fetchData().finally(() => setLoading(false));
  }, [maaling]);

  useEffectOnce(() => {
    doFetchData();
  });

  const doSubmitMaaling = useCallback((maalingFormState: SakFormState) => {
    const doEditMaaling = async () => {
      setLoading(true);
      setError(undefined);

      if (maaling) {
        const maalingEdit: MaalingEdit = {
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
          setAlert({
            type: 'success',
            message: 'Flott! vi har lagret dine endringer',
          });
        } catch (e) {
          setError(toError(e, 'Kunne ikkje lage sak'));
        }
      } else {
        setError(new Error('Kunne ikkje oppdatere sak'));
      }
    };

    doEditMaaling().finally(() => {
      setLoading(false);
    });
  }, []);

  const sakSteps =
    maaling?.status === 'planlegging' ? defaultSakSteps : startedSakSteps;

  const formStepState = useSakForm({ steps: sakSteps, isEdit: true });
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
        onSubmit={handleSubmit}
        loading={loading}
        error={error}
        regelsettList={regelsettList}
        loeysingList={loeysingList}
        verksemdList={verksemdList}
        advisors={advisors}
      />
      {alert && <Alert type={alert.type} message={alert.message} />}
    </>
  );
};

export default SakEdit;

import './sak.scss';

import toError from '@common/error/util';
import useError from '@common/hooks/useError';
import useLoading from '@common/hooks/useLoading';
import { getFullPath, idPath } from '@common/util/routeUtils';
import { createMaaling } from '@maaling/api/maaling-api';
import { MaalingInit } from '@maaling/api/types';
import { MAALING } from '@maaling/MaalingRoutes';
import { createSak, updateSak } from '@sak/api/sak-api';
import { TEST } from '@test/TestingRoutes';
import React, { useCallback, useState } from 'react';
import { useNavigate, useOutletContext } from 'react-router-dom';

import { EditSak, NySak } from './api/types';
import SakForm from './form/SakForm';
import useSakForm from './hooks/useSakForm';
import { defaultSakFormState, SakContext, SakFormState } from './types';

const SakCreate = () => {
  const navigate = useNavigate();

  const { contextLoading, contextError }: SakContext = useOutletContext();

  const [error, setError] = useError(contextError);
  const [loading, setLoading] = useLoading(contextLoading);

  const [sakFormState, setSakFormState] =
    useState<SakFormState>(defaultSakFormState);

  const doCreateMaaling = async (sakFormState: SakFormState) => {
    setLoading(true);
    setError(undefined);

    if (sakFormState.navn && sakFormState.maxLenker && sakFormState.talLenker) {
      const base = {
        navn: sakFormState.navn,
        testregelIdList: sakFormState.testregelList.map((tr) => tr.id),
        crawlParameters: {
          maxLenker: sakFormState.maxLenker,
          talLenker: sakFormState.talLenker,
        },
      };
      const maalingInit: MaalingInit = sakFormState.utval
        ? { ...base, utvalId: sakFormState.utval.id }
        : {
            ...base,
            loeysingIdList: sakFormState.loeysingList.map((l) => l.loeysing.id),
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

  const doCreateSak = async (
    sakFormState: SakFormState
  ): Promise<number | undefined> => {
    setLoading(true);
    setError(undefined);
    const sakType = sakFormState?.sakType;
    const verksemdOrgNr =
      sakFormState?.verksemdLoeysingRelation?.verksemd?.orgnummer ||
      sakFormState?.verksemdLoeysingRelation?.manualVerksemd?.orgnummer;
    const verksemdnamn =
      sakFormState?.verksemdLoeysingRelation?.verksemd?.namn ||
      sakFormState?.verksemdLoeysingRelation?.manualVerksemd?.namn;
    const frist = sakFormState.frist;

    if (!sakType || sakType === 'Forenklet kontroll') {
      setError(new Error('Kan ikkje opprette sak, feil saktype'));
      return;
    } else if (!verksemdOrgNr) {
      setError(
        new Error('Kan ikkje opprette sak, manglar organiseringsnummer')
      );
      return;
    } else if (!verksemdnamn) {
      setError(new Error('Kan ikkje opprette sak, manglar namn på virksomhet'));
      return;
    }
    if (!frist) {
      setError(new Error('Kan ikkje opprette ei ny sak utan frist.'));
      return;
    }

    const nySak: NySak = {
      namn: verksemdnamn,
      virksomhet: verksemdOrgNr,
      frist,
    };

    try {
      return await createSak(nySak);
    } catch (e) {
      setError(toError(e, 'Kunne ikkje oppdatere måling'));
    }
  };

  const doUpdateSak = async (sakFormState: SakFormState) => {
    setLoading(true);
    setError(undefined);

    const verksemdLoeysingRelation = sakFormState?.verksemdLoeysingRelation;
    const verksemdNamn = verksemdLoeysingRelation?.verksemd?.namn;
    const sakId = sakFormState?.sakId;
    const frist = sakFormState.frist;

    if (verksemdLoeysingRelation && sakId && verksemdNamn && frist) {
      const sak: EditSak = {
        id: sakId,
        namn: verksemdNamn,
        virksomhet:
          verksemdLoeysingRelation?.verksemd?.orgnummer || '000000000',
        frist,
        loeysingar: verksemdLoeysingRelation.loeysingList.map((l) => ({
          loeysingId: l.loeysing.id,
          nettsider: l.properties.map((p) => ({
            type: p.type || 'egendefinert',
            url: p.url || '',
            beskrivelse: p.description || '',
            begrunnelse: p.reason || '',
          })),
        })),
        testreglar: sakFormState?.testregelList,
      };
      try {
        await updateSak(sakId, sak);
      } catch (e) {
        setError(toError(e, 'Kunne ikkje oppdatere sak'));
      }
    } else {
      setError(new Error('Kunne ikkje oppdatere sak'));
    }
  };

  const formStepState = useSakForm('planlegging');
  const { isLastStep, setNextStep, currentStepIdx } = formStepState;

  const handleSubmit = useCallback(
    (sakFormState: SakFormState) => {
      setSakFormState((prevState) => ({
        ...prevState,
        ...sakFormState,
      }));

      if (sakFormState?.sakType === 'Forenklet kontroll') {
        if (!isLastStep(currentStepIdx)) {
          return setNextStep();
        } else {
          doCreateMaaling(sakFormState).finally(() => {
            setLoading(false);
          });
        }
      } else {
        if (currentStepIdx === 0) {
          doCreateSak(sakFormState)
            .then((sakId) =>
              setSakFormState((prevState) => ({
                ...prevState,
                sakId: sakId,
              }))
            )
            .finally(() => setLoading(false));
        } else if (isLastStep(currentStepIdx) && sakFormState.sakId) {
          navigate(
            getFullPath(TEST, {
              id: String(sakFormState.sakId),
              pathParam: idPath,
            })
          );
        } else {
          doUpdateSak(sakFormState).finally(() => setLoading(false));
        }
        return setNextStep();
      }
    },
    [isLastStep, setNextStep, currentStepIdx]
  );

  return (
    <SakForm
      formStepState={formStepState}
      sakFormState={sakFormState}
      onSubmit={handleSubmit}
      loading={loading}
      error={error}
    />
  );
};

export default SakCreate;

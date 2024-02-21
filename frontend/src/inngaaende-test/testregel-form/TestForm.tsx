import TestlabDivider from '@common/divider/TestlabDivider';
import { ButtonVariant } from '@common/types';
import { takeWhile } from '@common/util/arrayUtils';
import { Button, Heading } from '@digdir/design-system-react';
import { ResultatManuellKontroll, Svar } from '@test/api/types';
import TestFormResultat from '@test/testregel-form/TestFormResultat';
import { SkjemaMedSvar } from '@test/testregel-form/types';
import {
  evaluateTestregel,
  finnSvar,
  TestregelResultat,
} from '@test/util/testregelParser';
import { Testregel } from '@testreglar/api/types';
import { useEffect, useRef, useState } from 'react';

import TestFormStepWrapper from './TestFormStepWrapper';

interface Props {
  testregel: Testregel;
  resultater: ResultatManuellKontroll[];
  onClickBack: () => void;
  onClickSave: () => void;
  onResultat: (
    resultat: TestregelResultat,
    elementOmtale: string,
    svar: Svar[]
  ) => void;
}

const TestForm = ({
  testregel,
  resultater,
  onClickBack,
  onClickSave,
  onResultat,
}: Props) => {
  const ref = useRef<HTMLDivElement>(null);

  function initializeState() {
    return resultater.map((resultat) => {
      return {
        skjema: evaluateTestregel(testregel.testregelSchema, resultat.svar),
        svar: resultat.svar,
      };
    });
  }

  const [skjemaerMedSvar, setSkjemaerMedSvar] =
    useState<SkjemaMedSvar[]>(initializeState());

  function onAnswer(nyttSvar: Svar, index: number) {
    setSkjemaerMedSvar((prevState) => {
      const current = prevState[index];
      const oppdaterteSvar = takeWhile(
        current.svar,
        (svar) => svar.steg !== nyttSvar.steg
      ).concat([nyttSvar]);
      const oppdatertSkjemaModell = evaluateTestregel(
        testregel.testregelSchema,
        oppdaterteSvar
      );
      const newState = [...prevState];
      newState[index] = {
        ...current,
        skjema: oppdatertSkjemaModell,
        svar: oppdaterteSvar,
      };
      return newState;
    });
  }

  useEffect(() => {
    initializeState();
  }, [testregel, resultater]);

  useEffect(() => {
    ref?.current?.scrollIntoView({ behavior: 'smooth', block: 'end' });

    skjemaerMedSvar.forEach((skjemaMedSvar, index) => {
      const { skjema, svar } = skjemaMedSvar;
      const resultat = resultater[index];
      if (skjema.resultat && isNewResult(skjema.resultat, resultat)) {
        const element = JSON.parse(testregel.testregelSchema).element;
        const elementOmtale =
          finnSvar(element, svar) ?? 'Finn ikkje elementomtala';

        onResultat(skjema.resultat, elementOmtale, svar);
      }
    });
  }, [skjemaerMedSvar]);

  function isNewResult(
    nyttResultat: TestregelResultat,
    gammeltResultat?: ResultatManuellKontroll | undefined
  ): boolean {
    if (!gammeltResultat && !nyttResultat) {
      return false;
    } else if (!gammeltResultat && nyttResultat) {
      return true;
    } else {
      return gammeltResultat?.elementUtfall !== nyttResultat?.utfall;
    }
  }

  return skjemaerMedSvar.map((skjemaMedSvar, index) => (
    <div key={index} className="test-form" ref={ref}>
      <Heading size="medium" level={3}>
        {testregel.namn}
      </Heading>
      <div className="test-form-content">
        {skjemaMedSvar.skjema.steg.map((etSteg) => (
          <div key={etSteg.stegnr}>
            <TestFormStepWrapper
              steg={etSteg}
              alleSvar={skjemaMedSvar.svar}
              onAnswer={(svar) => onAnswer(svar, index)}
            />
          </div>
        ))}
        {skjemaMedSvar.skjema.resultat && (
          <TestFormResultat resultat={skjemaMedSvar.skjema.resultat} />
        )}
      </div>
      <TestlabDivider />
      <div className="testregel-form-buttons">
        <Button variant={ButtonVariant.Outline} onClick={onClickBack}>
          Legg til flere testelementer
        </Button>
        <Button onClick={onClickSave}>Lagre og lukk</Button>
      </div>
    </div>
  ));
};

export default TestForm;

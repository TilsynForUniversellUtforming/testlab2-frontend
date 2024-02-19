import TestlabDivider from '@common/divider/TestlabDivider';
import { ButtonVariant } from '@common/types';
import { takeWhile } from '@common/util/arrayUtils';
import { Button, Heading } from '@digdir/design-system-react';
import { ResultatManuellKontroll, Svar } from '@test/api/types';
import TestFormResultat from '@test/testregel-form/TestFormResultat';
import { SkjemaOgSvar } from '@test/testregel-form/types';
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
  resultat?: ResultatManuellKontroll;
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
  resultat,
  onClickBack,
  onClickSave,
  onResultat,
}: Props) => {
  const ref = useRef<HTMLDivElement>(null);
  const [skjemaOgSvar, setSkjemaOgSvar] = useState<SkjemaOgSvar>({
    skjemaModell: evaluateTestregel(
      testregel.testregelSchema,
      resultat?.svar ?? []
    ),
    alleSvar: resultat?.svar ?? [],
  });

  function onAnswer(nyttSvar: Svar) {
    setSkjemaOgSvar((prevState) => {
      const oppdaterteSvar = takeWhile(
        prevState.alleSvar,
        (svar) => svar.steg !== nyttSvar.steg
      ).concat([nyttSvar]);
      const oppdatertSkjemaModell = evaluateTestregel(
        testregel.testregelSchema,
        oppdaterteSvar
      );
      return {
        ...prevState,
        skjemaModell: oppdatertSkjemaModell,
        alleSvar: oppdaterteSvar,
      };
    });
  }

  useEffect(() => {
    const svar = resultat?.svar ?? [];
    setSkjemaOgSvar({
      skjemaModell: evaluateTestregel(testregel.testregelSchema, svar),
      alleSvar: svar,
    });
  }, [testregel, resultat]);

  useEffect(() => {
    ref?.current?.scrollIntoView({ behavior: 'smooth', block: 'end' });
  }, [skjemaOgSvar.alleSvar]);

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

  useEffect(() => {
    const { skjemaModell, alleSvar } = skjemaOgSvar;
    if (skjemaModell.resultat && isNewResult(skjemaModell.resultat, resultat)) {
      const element = JSON.parse(testregel.testregelSchema).element;
      const elementOmtale =
        finnSvar(element, alleSvar) ?? 'Finn ikkje elementomtala';

      onResultat(skjemaModell.resultat, elementOmtale, alleSvar);
    }
  }, [skjemaOgSvar]);

  return (
    <div className="test-form" ref={ref}>
      <Heading size="medium" level={3}>
        {testregel.name}
      </Heading>
      <div className="test-form-content">
        {skjemaOgSvar.skjemaModell.steg.map((etSteg) => (
          <div key={etSteg.stegnr}>
            <TestFormStepWrapper
              steg={etSteg}
              alleSvar={skjemaOgSvar.alleSvar}
              onAnswer={onAnswer}
            />
          </div>
        ))}
        {skjemaOgSvar.skjemaModell.resultat && (
          <TestFormResultat resultat={skjemaOgSvar.skjemaModell.resultat} />
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
  );
};

export default TestForm;

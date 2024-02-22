import { takeWhile } from '@common/util/arrayUtils';
import { Heading } from '@digdir/design-system-react';
import {
  findElementOmtale,
  ResultatManuellKontroll,
  Svar,
} from '@test/api/types';
import { TestFormAccordion } from '@test/testregel-form/TestFormAccordion';
import { initSkjemaMedSvar, SkjemaMedSvar } from '@test/testregel-form/types';
import {
  evaluateTestregel,
  TestregelResultat,
} from '@test/util/testregelParser';
import { Testregel } from '@testreglar/api/types';
import { useEffect, useRef, useState } from 'react';

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

const TestForm = ({ testregel, resultater, onResultat }: Props) => {
  const ref = useRef<HTMLDivElement>(null);

  const [skjemaerMedSvar, setSkjemaerMedSvar] = useState<SkjemaMedSvar[]>(
    initSkjemaMedSvar(resultater, testregel)
  );

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
    setSkjemaerMedSvar(initSkjemaMedSvar(resultater, testregel));
  }, [testregel, resultater]);

  useEffect(() => {
    ref?.current?.scrollIntoView({ behavior: 'smooth', block: 'end' });

    skjemaerMedSvar.forEach((skjemaMedSvar, index) => {
      const { skjema, svar } = skjemaMedSvar;
      const resultat = resultater[index];
      if (skjema.resultat && isNewResult(skjema.resultat, resultat)) {
        const elementOmtale =
          findElementOmtale(testregel, svar) ?? 'Finn ikkje elementomtala';

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

  return (
    <div className="test-form" ref={ref}>
      <Heading size="medium" level={3}>
        {testregel.namn}
      </Heading>
      <TestFormAccordion
        testregel={testregel}
        skjemaerMedSvar={skjemaerMedSvar}
        onAnswer={onAnswer}
      />
    </div>
  );
};

export default TestForm;

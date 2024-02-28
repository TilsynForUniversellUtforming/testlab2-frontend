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
import DOMPurify from 'dompurify';
import { useEffect, useState } from 'react';

interface Props {
  testregel: Testregel;
  resultater: ResultatManuellKontroll[];
  showHelpText: boolean;
  onResultat: (
    resultatId: number,
    resultat: TestregelResultat,
    elementOmtale: string,
    svar: Svar[]
  ) => void;
}

const TestForm = ({
  testregel,
  resultater,
  showHelpText,
  onResultat,
}: Props) => {
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
    skjemaerMedSvar.forEach((skjemaMedSvar) => {
      const { skjema, svar, resultatId } = skjemaMedSvar;
      const resultat = resultater.find(
        (resultat) => resultat.id === resultatId
      );
      if (skjema.resultat && isNewResult(skjema.resultat, resultat)) {
        const elementOmtale =
          findElementOmtale(testregel, svar) ?? 'Finn ikkje elementomtala';

        onResultat(resultatId, skjema.resultat, elementOmtale, svar);
      }
    });
  }, [skjemaerMedSvar]);

  function isNewResult(
    nyttResultat: TestregelResultat,
    gammeltResultat?: ResultatManuellKontroll | undefined
  ): boolean {
    return gammeltResultat?.elementUtfall !== nyttResultat?.utfall;
  }

  const cleanHTML = DOMPurify.sanitize(testregel.kravTilSamsvar ?? '', {
    USE_PROFILES: { html: true },
  });
  const kravTilSamsvar = { __html: cleanHTML };

  return (
    <div className="test-form">
      <Heading size="medium" level={3}>
        {testregel.namn}
      </Heading>
      {testregel.kravTilSamsvar && showHelpText && (
        <div
          className="test-form-description"
          dangerouslySetInnerHTML={kravTilSamsvar}
        ></div>
      )}
      <TestFormAccordion
        testregel={testregel}
        skjemaerMedSvar={skjemaerMedSvar}
        onAnswer={onAnswer}
        showHelpText={showHelpText}
      />
    </div>
  );
};

export default TestForm;

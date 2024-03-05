import { hasSameItems, isEmpty, takeWhile } from '@common/util/arrayUtils';
import { Heading } from '@digdir/design-system-react';
import {
  findElementOmtale,
  ResultatManuellKontroll,
  Svar,
} from '@test/api/types';
import { TestFormAccordion } from '@test/testregel-form/TestFormAccordion';
import { initSkjemaMedSvar, SkjemaMedSvar } from '@test/testregel-form/types';
import { Steg } from '@test/util/testregel-interface/Steg';
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
    svar: Svar[],
    resultat?: TestregelResultat,
    elementOmtale?: string
  ) => void;
  slettTestelement: (resultatId: number) => void;
}

function isEqual(a: Svar, b: Svar) {
  return a.steg === b.steg && a.svar === b.svar;
}

const TestForm = ({
  testregel,
  resultater,
  showHelpText,
  onResultat,
  slettTestelement,
}: Props) => {
  const [skjemaerMedSvar, setSkjemaerMedSvar] = useState<SkjemaMedSvar[]>(
    initSkjemaMedSvar(resultater, testregel)
  );

  const testregelSchema = JSON.parse(testregel.testregelSchema);

  function onAnswer(nyeSvar: Svar[], index: number) {
    if (nyeSvar.length === 0) {
      return;
    }

    function getOppdaterteSvar(gamleSvar: Svar[], nyeSvar: Svar[]) {
      if (isEmpty(nyeSvar)) {
        return gamleSvar;
      } else {
        const [nyttSvar, ...resten] = nyeSvar;
        const steg = testregelSchema.steg.find(
          (s: Steg) => s.stegnr === nyttSvar.steg
        );
        const gammeltSvar = gamleSvar.find((s) => s.steg === nyttSvar.steg);
        if (
          gammeltSvar &&
          steg?.type === 'tekst' &&
          steg?.ruting?.alle?.type === 'gaaTil'
        ) {
          const oppdatert = gamleSvar.map((s) =>
            s.steg === nyttSvar.steg ? nyttSvar : s
          );
          return getOppdaterteSvar(oppdatert, resten);
        } else {
          const oppdatert = takeWhile(
            gamleSvar,
            (s) => s.steg !== nyttSvar.steg
          ).concat([nyttSvar]);
          return getOppdaterteSvar(oppdatert, resten);
        }
      }
    }

    setSkjemaerMedSvar((prevState) => {
      const current = prevState[index];
      const oppdaterteSvar = getOppdaterteSvar(current.svar, nyeSvar);
      const oppdatertSkjemaModell = evaluateTestregel(
        testregelSchema,
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
      const elementOmtale = findElementOmtale(testregel, svar);

      if (!hasSameItems(resultat?.svar ?? [], svar, isEqual)) {
        onResultat(resultatId, svar, skjema.resultat, elementOmtale);
      }
    });
  }, [skjemaerMedSvar]);

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
        slettTestelement={slettTestelement}
        showHelpText={showHelpText}
      />
    </div>
  );
};

export default TestForm;

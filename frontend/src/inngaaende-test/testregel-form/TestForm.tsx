import { hasSameItems, takeWhile } from '@common/util/arrayUtils';
import { Heading } from '@digdir/designsystemet-react';
import {
  findElementOmtale,
  ResultatManuellKontroll,
  Svar,
} from '@test/api/types';
import { TestFormAccordion } from '@test/testregel-form/TestFormAccordion';
import {
  initSkjemaMedSvar,
  SkjemaMedSvar,
  TestresultatDetaljer,
  toTestresultatDetaljerMap,
} from '@test/testregel-form/types';
import { TestResultUpdate } from '@test/types';
import { Steg } from '@test/util/testregel-interface/Steg';
import {
  evaluateTestregel,
  TestregelResultat,
} from '@test/util/testregelParser';
import { Testregel } from '@testreglar/api/types';
import DOMPurify from 'dompurify';
import { useCallback, useEffect, useMemo, useState } from 'react';
import TestFormForenkla from '@test/testregel-form/TestFormForenkla';

interface Props {
  testregel: Testregel;
  resultater: ResultatManuellKontroll[];
  showHelpText: boolean;
  onResultat: (testResultUpdate: TestResultUpdate) => void;
  slettTestelement: (resultatId: number) => void;
  isLoading: boolean;
  isDemoApp?: boolean;
}



const TestForm = ({
  testregel,
  resultater,
  showHelpText,
  onResultat,
  slettTestelement,
  isLoading,
  isDemoApp,
}: Props) => {




  const [skjemaerMedSvar, setSkjemaerMedSvar] = useState<SkjemaMedSvar[]>(
    initSkjemaMedSvar(resultater, testregel)
  );
  const [detaljerMap, setDetaljerMap] = useState<
    Map<number, TestresultatDetaljer>
  >(toTestresultatDetaljerMap(resultater));

  const testregelSchemaString = testregel.testregelSchema;
  if (testregelSchemaString === undefined) {
    throw new Error('testregelSchema er tomt');
  }

  const testregelSchema = useMemo(
    () => JSON.parse(testregelSchemaString),
    [testregelSchemaString]
  );

  const resultaterById = useMemo(
    () => new Map(resultater.map((resultat) => [resultat.id, resultat])),
    [resultater]
  );

  const onAnswer = useCallback((nyeSvar: Svar[], index: number) => {
    if (nyeSvar.length === 0) {
      return;
    }

    setSkjemaerMedSvar((prevState) => {
      const current = prevState[index];
      if (!current) {
        return prevState;
      }

      const oppdaterteSvar = getOppdaterteSvar(
        current.svar,
        nyeSvar,
        testregelSchema.steg
      );
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
  }, [testregelSchema]);

  useEffect(() => {
    setSkjemaerMedSvar(initSkjemaMedSvar(resultater, testregel));
    setDetaljerMap(toTestresultatDetaljerMap(resultater));
  }, [testregel, resultater]);

  const onResultatUpdate = useCallback((
    resultatId: number,
    svar: Svar[],
    resultat: TestregelResultat | undefined,
    kommentar?: string
  ) => {
    const elementOmtale = findElementOmtale(testregel, svar);
    onResultat({
      resultatId,
      alleSvar: svar,
      resultat,
      elementOmtale,
      kommentar,
    });
  }, [onResultat, testregel]);

  const onKommentar = useCallback(
    (resultatId: number, kommentar?: string) => {
      const skjemaMedSvar = skjemaerMedSvar.find(
        (sms) => sms.resultatId === resultatId
      );
      if (skjemaMedSvar) {
        const { skjema, svar } = skjemaMedSvar;
        onResultatUpdate(resultatId, svar, skjema.resultat, kommentar);
      }
    },
    [onResultatUpdate, skjemaerMedSvar]
  );

  useEffect(() => {
    skjemaerMedSvar.forEach((skjemaMedSvar) => {
      const { skjema, svar, resultatId } = skjemaMedSvar;
      const resultat = resultaterById.get(resultatId);

      if (!hasSameItems(resultat?.svar ?? [], svar, isEqual)) {
        onResultatUpdate(resultatId, svar, skjema.resultat);
      }
    });
  }, [onResultatUpdate, resultaterById, skjemaerMedSvar]);

  const cleanHTML = useMemo(
    () => DOMPurify.sanitize(testregel.kravTilSamsvar ?? '', {
      USE_PROFILES: { html: true },
    }),
    [testregel.kravTilSamsvar]
  );
  const kravTilSamsvar = { __html: cleanHTML };

  return (
    <div className="test-form">
      <Heading dat-size="md" level={3}>
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
        onChangeKommentar={onKommentar}
        detaljerMap={detaljerMap}
        isLoading={isLoading}
        isDemoApp={isDemoApp}
      />
    </div>
  );
};


function isEqual(a: Svar, b: Svar) {
  return a.steg === b.steg && a.svar === b.svar;
}

function getOppdaterteSvar(
  gamleSvar: Svar[],
  nyeSvar: Svar[],
  stegListe: Steg[]
) {
  return nyeSvar.reduce((akkSvar, nyttSvar) => {
    const steg = stegListe.find((s) => s.stegnr === nyttSvar.steg);
    const skalBerreOppdatereEksisterande =
      akkSvar.some((s) => s.steg === nyttSvar.steg) &&
      steg?.type === 'tekst' &&
      steg?.ruting?.alle?.type === 'gaaTil';

    if (skalBerreOppdatereEksisterande) {
      return akkSvar.map((s) => (s.steg === nyttSvar.steg ? nyttSvar : s));
    }

    return takeWhile(akkSvar, (s) => s.steg !== nyttSvar.steg).concat([
      nyttSvar,
    ]);
  }, gamleSvar);
}
export default TestForm;

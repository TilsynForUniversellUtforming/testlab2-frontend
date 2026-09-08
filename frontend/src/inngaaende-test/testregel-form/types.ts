import {
  ElementResultat,
  ResultatManuellKontroll,
  Svar,
  toElementResultat,
} from '@test/api/types';
import { evaluateTestregel, TestregelForm } from '@test/util/testregelParser';
import { Testregel } from '@testreglar/api/types';
import { TestregelSchema } from '@test/util/testregel-interface/TestregelSchema';

export type SkjemaMedSvar = {
  resultatId: number;
  skjema: TestregelForm;
  svar: Svar[];
};

export function initSkjemaMedSvar(
  resultater: ResultatManuellKontroll[],
  testregel: Testregel
) {
  return resultater.map((resultat) => {
    const schema = testregel.testregelSchema as unknown as TestregelSchema;

    return {
      resultatId: resultat.id,
      skjema: evaluateTestregel(schema, resultat.svar),
      svar: resultat.svar,
    };
  });
}

export type TestresultatDetaljer = {
  kommentar: string;
  sistLagra: string;
};

export function toTestresultatDetaljerMap(
  resultater: ResultatManuellKontroll[]
): Map<number, TestresultatDetaljer> {
  return resultater.reduce(
    (entryMap, { id, kommentar, sistLagra }) =>
      entryMap.set(id, entryMap.get(id) || { kommentar, sistLagra }),
    new Map()
  );
}

export function resultatFromSkjemaMedSvar(
  skjemaMedSvar: SkjemaMedSvar
): ElementResultat | undefined {
  const resultat = skjemaMedSvar.skjema?.resultat;
  return resultat ? toElementResultat(resultat) : undefined;
}

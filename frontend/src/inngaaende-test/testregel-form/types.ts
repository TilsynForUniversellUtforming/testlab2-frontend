import { ResultatManuellKontroll, Svar } from '@test/api/types';
import { evaluateTestregel, TestregelForm } from '@test/util/testregelParser';
import { Testregel } from '@testreglar/api/types';

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
    return {
      resultatId: resultat.id,
      skjema: evaluateTestregel(testregel.testregelSchema, resultat.svar),
      svar: resultat.svar,
    };
  });
}

export function initKommentarMap(
  resultater: ResultatManuellKontroll[]
): Map<number, string> {
  return resultater.reduce(
    (entryMap, { id, kommentar }) =>
      entryMap.set(id, entryMap.get(id) || kommentar),
    new Map()
  );
}

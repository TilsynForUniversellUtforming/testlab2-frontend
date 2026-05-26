import { getFullPath } from '@common/util/routeUtils';
import { sanitizeEnumLabel } from '@common/util/stringutils';
import { ResultatManuellKontroll } from '@test/api/types';
import { ManuellTestStatus, Testgrunnlag } from '@test/types';
import { Loeysing } from '@loeysingar/api/types';
import { StyringsdataListElement } from '../../../styringsdata/types';
import { STYRINGSDATA_LOEYSING } from '../../../styringsdata/StyringsdataRoutes';
import { Sideutval } from '../../../kontroll/sideutval/types';

export const filterResultaterForLoeysingTestgrunnlag = (
  resultatliste: ResultatManuellKontroll[],
  loeysingId: number,
  testgrunnlagId: number
) =>
  resultatliste.filter(
    (r) => r.loeysingId === loeysingId && r.testgrunnlagId === testgrunnlagId
  );

export const filterFerdig = (resultater: ResultatManuellKontroll[]) =>
  resultater.filter((r) => r.status === 'Ferdig');

export const toUniqueTestKeyCount = (resultater: ResultatManuellKontroll[]) =>
  new Set(resultater.map((r) => `${r.sideutvalId}_${r.testregelId}`)).size;

export type TestStatusCounts = {
  total: number;
  finished: number;
  testing: number;
  pending: number;
};

export const getTestStatusCounts = (
  testgrunnlag: Testgrunnlag,
  resultater: ResultatManuellKontroll[],
  loeysingId: number
): TestStatusCounts => {
  const loeysingSideutval = getSideutvalForLoeysing(testgrunnlag, loeysingId);
  const total =
    testgrunnlag.type === 'RETEST'
      ? toUniqueTestKeyCount(resultater)
      : loeysingSideutval.length * testgrunnlag.testreglar.length;

  const finished = toUniqueTestKeyCount(filterFerdig(resultater));
  const testing = toUniqueTestKeyCount(resultater.filter((r) => r.status === 'UnderArbeid'));
  const pending = total - finished - testing;

  return { total, finished, testing, pending };
};

export const getSideutvalForLoeysing = (
  testgrunnlag: Testgrunnlag,
  loeysingId: number
): Sideutval[] =>
  testgrunnlag.sideutval.filter((su) => su.loeysingId === loeysingId);

export const getKombinasjonerTestreglerSideutval = (
  testgrunnlag: Testgrunnlag,
  loeysingId: number
) =>
  testgrunnlag.testreglar.flatMap((tr) =>
    testgrunnlag.sideutval
      .filter((s) => s.loeysingId === loeysingId)
      .map((s) => [tr.id, s.id])
  );

export function groupSideutvalByLoeysing(
  testgrunnlag: Testgrunnlag
): Map<number, Sideutval[]> {
  return new Map(Map.groupBy(testgrunnlag.sideutval, (su) => su.loeysingId));
}

export function getStyringsdataStatus(
  styringsdata: { isBot?: boolean; isPaalegg?: boolean } | undefined
): string | undefined {
  if (styringsdata?.isBot) return 'bot';
  if (styringsdata?.isPaalegg) return 'paalegg';
  return undefined;
}

export function teststatus(
  resultatliste: ResultatManuellKontroll[],
  testgrunnlag: Testgrunnlag,
  loeysingId: number
): ManuellTestStatus {
  const kombinasjoner = getKombinasjonerTestreglerSideutval(testgrunnlag, loeysingId);

  if (resultatliste.every((r) => r.status === 'IkkjePaabegynt')) {
    return 'ikkje-starta';
  } else if (
    kombinasjoner.every(([testregelId, sideutvalId]) =>
      resultatliste.some(
        (r) =>
          r.testregelId === testregelId &&
          r.sideutvalId === sideutvalId &&
          r.status === 'Ferdig'
      )
    )
  ) {
    return 'ferdig';
  } else {
    return 'under-arbeid';
  }
}

export function visRetestKnapp(
  testgrunnlag: Testgrunnlag,
  loeysingId: number,
  alleTestgrunnlag: Testgrunnlag[],
  resultater: ResultatManuellKontroll[]
): boolean {
  const isNewest = alleTestgrunnlag
    .filter((t) => t.sideutval.some((s) => s.loeysingId === loeysingId))
    .every((t) => t.id <= testgrunnlag.id);

  if (!isNewest) return false;

  return (
    teststatus(resultater, testgrunnlag, loeysingId) === 'ferdig' &&
    resultater.some((r) => r.elementResultat === 'brot')
  );
}

export function visSlettKnapp(
  testgrunnlag: Testgrunnlag,
  status: ManuellTestStatus
): boolean {
  return testgrunnlag.type === 'RETEST' && status === 'ikkje-starta';
}

export const hasLoeysingBrot = (
  resultater: ResultatManuellKontroll[],
) =>
  resultater
    .filter((r) => r.elementResultat === 'brot');

export const findLoeysingNamn = (loeysingList: Loeysing[], loeysingId: number) =>
  loeysingList.find((l) => l.id === loeysingId)?.namn ?? '';

export const getStyringsdataPath = (
  kontrollId: number,
  loeysingId: number,
  loesysingStyringsdataId: number | undefined
) => {
  const base = getFullPath(
    STYRINGSDATA_LOEYSING,
    { pathParam: ':kontrollId', id: String(kontrollId) },
    { pathParam: ':loeysingId', id: String(loeysingId) }
  );
  return base + (loesysingStyringsdataId ? '?styringsdataId=' + loesysingStyringsdataId : '');
};

export const filterStyringdataForLoeysing = (
  styringsdata: StyringsdataListElement[],
  loeysingId: number
) => styringsdata.find((s) => s.loeysingId === loeysingId);

export function viewTestType(
  etTestgrunnlag: Testgrunnlag,
  etSideutvalIds: number[],
  alleTestgrunnlag: Testgrunnlag[]
) {
  const normalized = sanitizeEnumLabel(etTestgrunnlag.type);
  if (etTestgrunnlag.type === 'RETEST') {
    const countTidligereRetester = alleTestgrunnlag
      .filter((t) => t.type === 'RETEST')
      .filter((t) => t.sideutval.some((s) => etSideutvalIds.includes(s.id)))
      .filter(
        (t) => Date.parse(t.datoOppretta) < Date.parse(etTestgrunnlag.datoOppretta)
      ).length;
    return `${normalized} ${countTidligereRetester + 1}`;
  }
  return normalized;
}

export function getJobstatus(status: ManuellTestStatus): string {
  if (status === 'ikkje-starta') return 'Start testing';
  if (status === 'under-arbeid') return 'Fortsett testing';
  return 'Vis testen';
}


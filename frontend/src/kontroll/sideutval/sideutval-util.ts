import { sanitizeEnumLabel } from '@common/util/stringutils';
import { Loeysing } from '@loeysingar/api/types';
import { Testobjekt } from '@testreglar/api/types';

import { Sideutval, SideutvalIndexed, TestobjektKontroll } from './types';

export const toSelectableTestobjekt = (
  innhaldstypeList: TestobjektKontroll[],
  sideutval: Sideutval[],
  loeysingId: number
) => {
  const innhaldsTypeIdList = [
    ...new Set(
      sideutval
        .filter((su) => su.loeysingId === loeysingId)
        .map((su) => su.objektId)
    ),
  ];
  const egendefinert = innhaldstypeList.filter(
    (it) => it.testobjekt.toLowerCase() === 'egendefinert'
  );
  const rest = innhaldstypeList.filter(
    (it) =>
      it.testobjekt.toLowerCase() !== 'egendefinert' &&
      !innhaldsTypeIdList.includes(it.id)
  );

  return [...rest, ...egendefinert];
};

export const getTestobjektLabel = (
  testobjektList: Testobjekt[],
  objektId: number,
  egendefinertObjekt?: string
) => {
  let innhaldstypeKey: string;

  if (egendefinertObjekt) {
    innhaldstypeKey = egendefinertObjekt;
  } else {
    const match = testobjektList.find((it) => it.id === objektId);
    if (!match) {
      throw Error('Ugylig type');
    } else {
      innhaldstypeKey = match.testobjekt;
    }
  }

  return sanitizeEnumLabel(innhaldstypeKey);
};

export const groupByType = (
  sideutval: Sideutval[],
  testobjektList: Testobjekt[]
): Map<string, SideutvalIndexed[]> => {
  const grouped = new Map<string, SideutvalIndexed[]>();
  sideutval.forEach((su, index) => {
    const innhaldstypeKey = getTestobjektLabel(
      testobjektList,
      su.objektId,
      su.egendefinertObjekt
    );

    if (!grouped.has(innhaldstypeKey)) {
      grouped.set(innhaldstypeKey, []);
    }

    grouped.get(innhaldstypeKey)!.push({ sideutval: su, index: index });
  });

  return grouped;
};

export const getDefaultFormValues = (
  loeysingList: Loeysing[],
  testobjektList: Testobjekt[],
  sideutvalKontroll: Sideutval[]
): Sideutval[] => {
  const forsideType = testobjektList.find(
    (it) => it.testobjekt.toLowerCase() === 'forside'
  );

  if (!forsideType) {
    throw new Error('Forside finns ikkje');
  }

  return loeysingList.flatMap((loeysing) => {
    const hasForside = sideutvalKontroll.find(
      (su) => su.loeysingId === loeysing.id && su.objektId === forsideType.id
    );

    if (hasForside) {
      return sideutvalKontroll.filter((su) => su.loeysingId === loeysing.id);
    } else {
      return {
        loeysingId: loeysing.id,
        objektId: forsideType.id,
        begrunnelse: '',
        url: '',
        egendefinertObjekt: undefined,
      };
    }
  });
};

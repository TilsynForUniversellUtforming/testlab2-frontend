import { sanitizeEnumLabel } from '@common/util/stringutils';
import { Loeysing } from '@loeysingar/api/types';

import {
  Sideutval,
  SideutvalIndexed,
  SideutvalType,
  SideutvalTypeKontroll,
} from './types';

export const toSelectableSideutvalType = (
  innhaldstypeList: SideutvalTypeKontroll[],
  sideutval: Sideutval[],
  loeysingId: number
) => {
  const innhaldsTypeIdList = [
    ...new Set(
      sideutval
        .filter((su) => su.loeysingId === loeysingId)
        .map((su) => su.typeId)
    ),
  ];
  const egendefinert = innhaldstypeList.filter(
    (it) => it.type.toLowerCase() === 'egendefinert'
  );
  const rest = innhaldstypeList.filter(
    (it) =>
      it.type.toLowerCase() !== 'egendefinert' &&
      !innhaldsTypeIdList.includes(it.id)
  );

  return [...rest, ...egendefinert];
};

export const getSideutvalTypeLabel = (
  sideutvalTypeList: SideutvalType[],
  typeId: number,
  egendefinertType?: string
) => {
  let innhaldstypeKey: string;

  if (egendefinertType) {
    innhaldstypeKey = egendefinertType;
  } else {
    const match = sideutvalTypeList.find((it) => it.id === typeId);
    if (!match) {
      throw Error('Ugylig type');
    } else {
      innhaldstypeKey = match.type;
    }
  }

  return sanitizeEnumLabel(innhaldstypeKey);
};

export const groupByType = (
  sideutval: Sideutval[],
  sideutvalTypeList: SideutvalType[]
): Map<string, SideutvalIndexed[]> => {
  const grouped = new Map<string, SideutvalIndexed[]>();
  sideutval.forEach((su, index) => {
    const innhaldstypeKey = getSideutvalTypeLabel(
      sideutvalTypeList,
      su.typeId,
      su.egendefinertType
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
  sideutvalTypeList: SideutvalType[],
  sideutvalKontroll: Sideutval[]
): Sideutval[] => {
  const forsideType = sideutvalTypeList.find(
    (it) => it.type.toLowerCase() === 'forside'
  );

  if (!forsideType) {
    throw new Error('Forside finns ikkje');
  }

  return loeysingList.flatMap((loeysing) => {
    const hasForside = sideutvalKontroll.find(
      (su) => su.loeysingId === loeysing.id && su.typeId === forsideType.id
    );

    if (hasForside) {
      return sideutvalKontroll.filter((su) => su.loeysingId === loeysing.id);
    } else {
      return {
        loeysingId: loeysing.id,
        typeId: forsideType.id,
        begrunnelse: '',
        url: '',
        egendefinertType: undefined,
      };
    }
  });
};

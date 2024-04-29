import { Loeysing } from '@loeysingar/api/types';
import { InnhaldstypeTesting } from '@testreglar/api/types';

import { InnhaldstypeKontroll, Sideutval, SideutvalIndexed } from './types';

export const toSelectableInnhaldstype = (
  innhaldstypeList: InnhaldstypeKontroll[],
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
    (it) => it.innhaldstype.toLowerCase() === 'egendefinert'
  );
  const rest = innhaldstypeList.filter(
    (it) =>
      it.innhaldstype.toLowerCase() !== 'egendefinert' &&
      !innhaldsTypeIdList.includes(it.id)
  );

  return [...rest, ...egendefinert];
};

export const groupByType = (
  sideutval: Sideutval[],
  innhaldstypeList: InnhaldstypeTesting[]
): Map<string, SideutvalIndexed[]> => {
  const grouped = new Map<string, SideutvalIndexed[]>();
  sideutval.forEach((su, index) => {
    let innhaldstypeKey: string;

    if (su.egendefinertType) {
      innhaldstypeKey = su.egendefinertType;
    } else {
      const match = innhaldstypeList.find((it) => it.id === Number(su.typeId));
      if (!match) {
        throw Error('Ugylig type');
      } else {
        innhaldstypeKey = match.innhaldstype;
      }
    }

    if (!grouped.has(innhaldstypeKey)) {
      grouped.set(innhaldstypeKey, []);
    }

    grouped.get(innhaldstypeKey)!.push({ sideutval: su, index: index });
  });

  return grouped;
};

export const getDefaultFormValues = (
  loeysingList: Loeysing[],
  innhaldstypeList: InnhaldstypeTesting[]
): Sideutval[] => {
  const forsideType = innhaldstypeList.find(
    (it) => it.innhaldstype.toLowerCase() === 'forside'
  );

  if (!forsideType) {
    throw Error('Forside finns ikkje');
  }

  return loeysingList.map((l) => ({
    loeysingId: l.id,
    typeId: forsideType.id,
    begrunnelse: '',
    url: '',
    egendefinertType: undefined,
  }));
};

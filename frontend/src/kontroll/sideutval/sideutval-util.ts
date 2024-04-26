import { Loeysing } from '@loeysingar/api/types';
import { InnhaldstypeTesting } from '@testreglar/api/types';
import { FieldArrayWithId } from 'react-hook-form';

import { InnhaldstypeKontroll, SideItemKey, SideListItem, Sideutval, SideutvalForm, SideutvalIndexed, } from './types';

export const createDefaultSideutval = (
  loeysingId: number,
  forsideTypeId: number
): Sideutval[] => [
  {
    loeysingId: loeysingId,
    typeId: forsideTypeId,
    begrunnelse: '',
    url: '',
  },
];

export const toSideListItemKey = (
  innhaldstype: string,
  index: number
): SideItemKey => `${innhaldstype}_${index}`;

export const toSideListItem = (
  innhaldstypeLabel: string,
  sideutval: Sideutval[]
): SideListItem[] => {
  return sideutval.map((sl, index) => ({
    ...sl,
    key: toSideListItemKey(innhaldstypeLabel, index),
  }));
};

export const toSelectableInnhaldstype = (
  innhaldstypeList: InnhaldstypeKontroll[],
  sideutvalLoeysing: Sideutval[]
) => {
  const innhaldsTypeIdList = [...new Set(sideutvalLoeysing.map((su) => su.typeId))];
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
  sideutval: FieldArrayWithId<SideutvalForm, 'sideutval', 'id'>[],
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
    url: '',
    begrunnelse: '',
  }));
};

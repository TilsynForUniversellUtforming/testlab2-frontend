import { InnhaldstypeTesting } from '@testreglar/api/types';

import {
  InnhaldstypeKontroll,
  SideItemKey,
  SideListItem,
  Sideutval,
} from './types';

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
  sideutval: Sideutval[]
) => {
  const innhaldsTypeIdList = [...new Set(sideutval.map((su) => su.typeId))];
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
): Map<string, Sideutval[]> => {
  const grouped = new Map<string, Sideutval[]>();

  sideutval.forEach((su) => {
    let innhaldstypeKey: string;

    if (su.egendefinertType) {
      innhaldstypeKey = su.egendefinertType;
    } else {
      const match = innhaldstypeList.find((it) => it.id === su.typeId);
      if (!match) {
        throw Error('Ugylig type');
      } else {
        innhaldstypeKey = match.innhaldstype;
      }
    }

    if (!grouped.has(innhaldstypeKey)) {
      grouped.set(innhaldstypeKey, []);
    }

    grouped.get(innhaldstypeKey)!.push(su);
  });

  return grouped;
};

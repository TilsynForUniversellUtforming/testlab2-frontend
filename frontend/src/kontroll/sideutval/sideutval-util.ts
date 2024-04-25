import { InnhaldstypeKontroll, Side, SideItemKey, SideListItem, SideutvalLoeysing, } from './types';

export const createDefaultSideutval = (
  loeysingId: number,
  forsideType: InnhaldstypeKontroll
): SideutvalLoeysing => ({
  loeysingId: loeysingId,
  sideutval: [
    {
      type: forsideType,
      sideBegrunnelseList: [],
    },
  ],
});

export const toSideListItemKey = (innhaldstype: string, index: number): SideItemKey =>
  `${innhaldstype}_${index}`;

export const toSideListItem = (
  sideList: Side[],
  innhaldstype: string
): SideListItem[] => {
  return sideList.map((sl, index) => ({
    ...sl,
    key: toSideListItemKey(innhaldstype, index),
  }));
};

export const toSelectableInnhaldstype = (
  innhaldstypeList: InnhaldstypeKontroll[],
  sideutvalLoeysing: SideutvalLoeysing
) => {
  const loeysingInnhaldstypeList = sideutvalLoeysing.sideutval.map(
    (su) => su.type.innhaldstype
  );
  const egendefinert = innhaldstypeList.filter(
    (it) => it.innhaldstype.toLowerCase() === 'egendefinert'
  );
  const rest = innhaldstypeList.filter(
    (it) =>
      it.innhaldstype.toLowerCase() !== 'egendefinert' &&
      !loeysingInnhaldstypeList.includes(it.innhaldstype)
  );

  return [...rest, ...egendefinert];
};

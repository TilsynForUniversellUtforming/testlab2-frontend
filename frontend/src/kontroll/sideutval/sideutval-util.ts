import { InnhaldstypeKontroll, Side, SideListItem, SideutvalLoeysing } from './types';

export const createDefaultSideutval = (
  loeysingId: number,
  forsideType: InnhaldstypeKontroll
): SideutvalLoeysing => ({
  loeysingId: loeysingId,
  sideUtval: [
    {
      type: forsideType,
      sideBegrunnelseList: [],
    },
  ],
});

export const toSideListItemKey = (innhaldstype: string, index: number) => `${innhaldstype}_${index}`;

export const toSideListItem = (sideList: Side[], innhaldstype: string): SideListItem[] => {
  return sideList.map((sl, index) => ({
    ...sl,
    key: toSideListItemKey(innhaldstype, index),
  }))
}

export const toSelectableInnhaldstype = (innhaldstypeList: InnhaldstypeKontroll[], sideutvalLoeysing: SideutvalLoeysing) => {
  const loeysingInnhaldstypeList = sideutvalLoeysing.sideUtval.map(su => su.type.innhaldstype);
  const egendefinert = innhaldstypeList.filter(it => it.innhaldstype.toLowerCase() === 'egendefinert');
  const rest = innhaldstypeList.filter(it => it.innhaldstype.toLowerCase() !== 'egendefinert' && !loeysingInnhaldstypeList.includes(it.innhaldstype))

  return [...rest, ...egendefinert]
}
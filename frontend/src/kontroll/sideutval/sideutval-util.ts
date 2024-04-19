import { InnhaldstypeKontroll, SideutvalLoeysing } from './types';

export const createDefaultSideutval = (loeysingId: number, forsideType: InnhaldstypeKontroll): SideutvalLoeysing => ({
    loeysingId: loeysingId,
    sideUtval:
      [{
        type: forsideType,
        sideBegrunnelseList: []
    }]
})
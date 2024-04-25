import { Loeysing } from '@loeysingar/api/types';
import { InnhaldstypeTesting } from '@testreglar/api/types';

import { Kontroll } from '../types';

export type SideutvalLoader = {
  kontroll: Kontroll;
  innhaldstypeList: InnhaldstypeTesting[];
  loeysingList: Loeysing[];
};

export type InnhaldstypeKontroll = InnhaldstypeTesting & {
  egendefinertType?: string;
};

export type Side = {
  begrunnelse: string;
  url: string;
};

export type Sideutval = {
  type: InnhaldstypeKontroll;
  sideBegrunnelseList: Side[];
};

export type SideutvalLoeysing = {
  loeysingId: number;
  sideUtval: Sideutval[];
};

export type SideListItem = Side & {
  key: string;
};

export type InputError = SideListItem & {
  url: boolean;
  begrunnelse: boolean;
}

export const defaultSide: Side = { url: '', begrunnelse: '' };

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
  sideutval: Sideutval[];
};

export type SideutvalForm = {
  sideutval: SideutvalLoeysing[];
};

export type SideItemKey = `${string}_${number}` // innhaldstype_index

export type FormFieldKey = `${string}_${number}_${string}` // innhaldstype_index_felt

export type SideListItem = Side & {
  key: SideItemKey;
};

export type FormResult = {
  errorMap: Map<FormFieldKey, string>,
  sideutvalLoeysing: SideutvalLoeysing | undefined;
}

export const defaultSide: Side = { url: '', begrunnelse: '' };
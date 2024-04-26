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

export type Sideutval = {
  loeysingId: number;
  typeId: number;
  begrunnelse: string;
  url: string;
  egendefinertType?: string;
};

export type SideItemKey = `${string}_${number}`; // innhaldstype_index

export type SideListItem = Sideutval & {
  key: SideItemKey;
};

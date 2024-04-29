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

export type SideutvalIndexed = {
  sideutval: Sideutval;
  index: number;
};

export type SideutvalForm = {
  sideutval: Sideutval[];
};

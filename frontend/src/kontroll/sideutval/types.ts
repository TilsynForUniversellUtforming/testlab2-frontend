import { Loeysing } from '@loeysingar/api/types';

import { Kontroll } from '../types';

export type SideutvalType = {
  id: number;
  type: string;
};

export type SideutvalLoader = {
  kontroll: Kontroll;
  sideutvalTypeList: SideutvalType[];
  loeysingList: Loeysing[];
};

export type SideutvalTypeKontroll = SideutvalType & {
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

export type FormError = {
  loeysingId: number;
  sideutvalType: string;
};

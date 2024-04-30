import { Loeysing } from '@loeysingar/api/types';
import { Testobjekt } from '@testreglar/api/types';

import { Kontroll } from '../types';

export type SideutvalLoader = {
  kontroll: Kontroll;
  testobjektList: Testobjekt[];
  loeysingList: Loeysing[];
};

export type TestobjektKontroll = Testobjekt & {
  egendefinertObjekt?: string;
};

export type Sideutval = {
  loeysingId: number;
  objektId: number;
  begrunnelse: string;
  url: string;
  egendefinertObjekt?: string;
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
  testobjekt: string;
};

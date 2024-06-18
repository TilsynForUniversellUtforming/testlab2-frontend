import { Loeysing } from '@loeysingar/api/types';
import { CrawlParameters } from '@maaling/api/types';

import { Kontroll, TestStatus } from '../types';

export type SideutvalType = {
  id: number;
  type: string;
};

export type SideutvalLoader = {
  kontroll: Kontroll;
  sideutvalTypeList: SideutvalType[];
  loeysingList: Loeysing[];
  crawlParameters: CrawlParameters | undefined;
  testStatus: TestStatus;
};

export type SideutvalTypeKontroll = SideutvalType & {
  egendefinertType?: string;
};

export type SideutvalBase = {
  loeysingId: number;
  typeId: number;
  begrunnelse: string;
  url: string;
  egendefinertType?: string;
};

export type Sideutval = SideutvalBase & {
  id: number;
};

export type SideutvalIndexed = {
  sideutval: SideutvalBase;
  index: number;
};

export type SideutvalForm = {
  sideutval: SideutvalBase[];
};

export type FormError = {
  loeysingId: number;
  antallFeil: number;
  sideutvalType: string;
};

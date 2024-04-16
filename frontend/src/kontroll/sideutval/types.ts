import { Kontroll } from '../types';
import { InnhaldstypeTesting } from '@testreglar/api/types';
import { Loeysing } from '@loeysingar/api/types';

export type SideutvalLoader = {
  kontroll: Kontroll;
  innhaldsTypeList: InnhaldstypeTesting[];
  loeysingList: Loeysing[];
};

export type NettsideEgenskaper = {
  begrunnelse: string;
  type: string;
  url: string;
};

export type SideutvalLoeysing = {
  loesyingId: number,
  nettside: NettsideEgenskaper
};
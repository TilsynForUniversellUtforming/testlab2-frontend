import { Utval } from '@loeysingar/api/types';
import { CrawlParameters } from '@maaling/api/types';

import { Sideutval, SideutvalBase } from './sideutval/types';
import { KontrollTestreglar } from './velg-testreglar/types';

export type Orgnummer = string;

export type KontrollListItem = {
  id: number;
  tittel: string;
  saksbehandler: string;
  sakstype: Sakstype;
  arkivreferanse: string;
  kontrolltype: KontrollType;
  virksomheter: Orgnummer[];
  styringsdataId?: number;
};

export type Kontroll = {
  id: number;
  kontrolltype: KontrollType;
  tittel: string;
  saksbehandler: string;
  sakstype: Sakstype;
  arkivreferanse: string;
  utval: Utval | undefined;
  testreglar: KontrollTestreglar | undefined;
  sideutvalList: Sideutval[];
};

export type UpdateKontrollTestregel = {
  kontroll: Kontroll;
  testreglar: UpdateKontrollTestreglar;
  neste: boolean;
};

export type UpdateKontrollTestreglar = {
  regelsettId: number | undefined;
  testregelIdList: number[];
};

export type UpdateKontrollSideutval = {
  kontroll: Kontroll;
  sideutvalList: SideutvalBase[];
  crawlParameters: CrawlParameters | undefined;
  neste: boolean;
};

export enum KontrollType {
  InngaaendeKontroll = 'inngaaende-kontroll',
  ForenklaKontroll = 'forenkla-kontroll',
  Tilsyn = 'tilsyn',
  Statusmaaling = 'statusmaaling',
  UttaleSak = 'uttalesak',
  Anna = 'anna',
}

export type Sakstype = 'forvaltningssak' | 'arkivsak';

export const steps = {
  opprett: { name: 'Opprett Kontroll', relativePath: '..' },
  loesying: { name: 'Vel løysingar', relativePath: 'velg-losninger' },
  testregel: { name: 'Vel testreglar', relativePath: 'velg-testreglar' },
  sideutval: { name: 'Gjennomfør sideutval', relativePath: 'sideutval' },
  oppsummering: { name: 'Oppsummering', relativePath: 'oppsummering' },
};

export type TestStatus = 'Pending' | 'Started';

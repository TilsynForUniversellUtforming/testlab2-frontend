import { Sak } from '@sak/api/types';

import { ResultatManuellKontroll } from './api/types';

export type ManuellTestStatus =
  | 'ferdig'
  | 'deaktivert'
  | 'under-arbeid'
  | 'ikkje-starta';

export type ButtonStatus = ManuellTestStatus | 'aktiv';

export type TestregelOverviewElement = {
  id: number;
  name: string;
  krav: string;
};

export interface TestContext {
  contextSak: Sak;
  contextTestResults: ResultatManuellKontroll[];
  contextSetTestResults: (testResults: ResultatManuellKontroll[]) => void;
}

export const innhaldsType = [
  'Bilde og grafikk',
  'Captcha',
  'Heile nettsida',
  'Iframe',
  'Innhald med tidsavgrensing',
  'Innhald som blinkar og/eller oppdaterer automatisk',
  'Kjeldekode',
  'Lenke',
  'Liste',
  'Lyd og video',
  'Overskrift',
  'Sidetittel',
  'Skjemaelement',
  'Statusmelding',
  'Tabell',
  'Tastatur',
  'Tekst',
  'Alle',
];

export type InnhaldsType = (typeof innhaldsType)[number];

export type PageType = {
  nettsideId: number;
  pageType: string;
};

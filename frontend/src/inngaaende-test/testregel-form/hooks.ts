import { useEffect, useMemo, useState } from 'react';
import {
  SkjemaMedSvar,
  TestresultatDetaljer,
} from '@test/testregel-form/types';
import {
  InnhaldstypeTesting,
  ManuellForenklaDefinition,
  Tema,
  Testobjekt,
  TestregelBase,
  TestregelStatus,
} from '@testreglar/api/types';
import { TestlabLocale } from '@common/types';
import { findElementOmtale } from '@test/api/types';

export const useTestFormItems = (
  skjemaerMedSvar: SkjemaMedSvar[],
  testregel: TestregelBase & {
    testregelId: string;
    versjon: number;
    status: TestregelStatus;
    datoSistEndra: string;
    spraak: TestlabLocale;
    tema?: Tema;
    testobjekt?: Testobjekt;
    kravTilSamsvar?: string;
    testregelSchema?: string;
    innhaldstypeTesting?: InnhaldstypeTesting;
    definition?: ManuellForenklaDefinition;
  },
  detaljerMap: Map<number, TestresultatDetaljer>
) => {
  return useMemo(
    () =>
      skjemaerMedSvar.map((skjemaMedSvar) => ({
        skjemaMedSvar,
        resultatId: skjemaMedSvar.resultatId,
        elementOmtale: findElementOmtale(testregel, skjemaMedSvar.svar),
        detaljer: detaljerMap.get(skjemaMedSvar.resultatId),
      })),
    [skjemaerMedSvar, testregel, detaljerMap]
  );
};

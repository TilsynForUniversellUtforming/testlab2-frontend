import { ResultatManuellKontroll } from '@test/api/types';
import TestForm from '@test/testregel-form/TestForm';
import { TestregelSchema } from '@test/util/testregel-interface/TestregelSchema';
import { render, screen } from '@testing-library/react';
import { Testregel } from '@testreglar/api/types';
import * as fs from 'fs';
import * as path from 'path';
import { describe, expect, it, vi } from 'vitest';

describe('TestForm', () => {
  function getTestregel(navn: string): TestregelSchema {
    const filePath = path.resolve(__dirname, `../util/test-data/${navn}.json`);
    const buffer = fs.readFileSync(filePath);
    return JSON.parse(buffer.toString());
  }

  it.each([{ showHelpText: true }, { showHelpText: false }])(
    'should show help text when turned on',
    ({ showHelpText }) => {
      const testregelScehma = getTestregel('1.3.3a');
      const helpText = testregelScehma.steg[1].ht;

      const testregel: Testregel = {
        id: 1,
        testregelId: '1.3.1a Overskrifter er rett koda',
        versjon: 1,
        namn: '1.3.1a Overskrifter er rett koda',
        krav: {
          id: 1,
          tittel: '1.3.1 Informasjon og relasjoner',
          status: 'I bruk',
          gjeldApp: false,
          gjeldAutomat: false,
          gjeldNettsider: false,
          innhald: '',
          prinsipp: '',
          retningslinje: '',
          samsvarsnivaa: 'A',
          suksesskriterium: '',
        },
        status: 'publisert',
        datoSistEndra: '2024-02-22T15:09:00Z',
        type: 'nett',
        modus: 'manuell',
        spraak: 'nb',
        kravTilSamsvar: '',
        testregelSchema: JSON.stringify(testregelScehma),
        innhaldstypeTesting: {
          id: 1,
          innhaldstype: 'Forside',
        },
      };

      const results: ResultatManuellKontroll[] = [
        {
          id: 1,
          testgrunnlagId: 1,
          loeysingId: 1,
          testregelId: 1,
          nettsideId: 1,
          elementOmtale: undefined,
          elementResultat: undefined,
          elementUtfall: undefined,
          svar: [],
          testVartUtfoert: undefined,
          status: 'IkkjePaabegynt',
        },
      ];

      render(
        <TestForm
          testregel={testregel}
          resultater={results}
          showHelpText={showHelpText}
          onResultat={vi.fn()}
          slettTestelement={vi.fn()}
        />
      );

      if (showHelpText) {
        expect(screen.queryByText(helpText)).toBeInTheDocument();
      } else {
        expect(screen.queryByText(helpText)).not.toBeInTheDocument();
      }
    }
  );
});

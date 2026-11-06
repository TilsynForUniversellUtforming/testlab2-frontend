import '@testing-library/jest-dom';

import { render, screen, waitFor } from '@testing-library/react';
import { within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ResultatManuellKontroll } from '@test/api/types';
import TestFormForenkla from '@test/testregel-form/testform-forenkla/TestFormForenkla';
import { Testregel } from '@testreglar/api/types';
import React from 'react';
import { BrowserRouter } from 'react-router';
import { describe, expect, it, vi } from 'vitest';

vi.mock('@common/image-edit/ImageUpload', () => ({
  default: () => <div data-testid="image-upload" />,
}));

vi.mock('@test/test-overview/loeysing-test/StatusMessageBox', () => ({
  default: ({ statusmessage }: { statusmessage: string }) => <div>{statusmessage}</div>,
}));

vi.mock('@test/testregel-form/TestElementFooter', () => ({
  TestElementFooter: () => <div data-testid="test-element-footer" />,
}));

const testregel = {
  id: 1,
  namn: 'Testregel',
  krav: {},
  modus: 'manuell-forenkla',
  type: 'nett',
  testregelId: 'TR-1',
  versjon: 1,
  status: 'klar_for_testing',
  datoSistEndra: '2026-10-08T10:00:00.000Z',
  spraak: 'nn',
  definition: {
    description: '<p>Instruksjon</p>',
    helptext: '<p>Hjelpetekst</p>',
    utfall: [
      {
        beskrivelse: 'Samsvarer med kravet',
        testresultat: 'samsvar',
        default: true,
      },
      {
        beskrivelse: 'Bryt med kravet',
        testresultat: 'brot',
        default: false,
      },
    ],
  },
} as Testregel;

const activeResult: ResultatManuellKontroll = {
  id: 12,
  svar: [],
  status: 'UnderArbeid',
  sistLagra: '2026-10-08T10:00:00.000Z',
  testgrunnlagId: 22,
  loeysingId: 32,
  testregelId: 1,
  sideutvalId: 42,
};

describe('<TestFormForenkla />', () => {
  it('falls back to the predefined default when existing custom outcome values are null', () => {
    const activeResultMedNullVerdiar = {
      ...activeResult,
      elementResultat: null,
      elementUtfall: null,
    } as unknown as ResultatManuellKontroll;

    render(
      <TestFormForenkla
        testregel={testregel}
        showHelpText
        onResultat={vi.fn()}
        slettTestelement={vi.fn()}
        isLoading={false}
        isDemoApp={false}
        activeResult={activeResultMedNullVerdiar}
      />,
      {
        wrapper: BrowserRouter,
      }
    );

    expect(screen.getByLabelText('Vel utfall', { exact: false })).toHaveValue(
      'Samsvar: Samsvarer med kravet'
    );
    expect(
      screen.queryByLabelText('Vel resultat for eigendefinert utfall', {
        exact: false,
      })
    ).not.toBeInTheDocument();
  });

  it('uses the utfall marked as default even when it is not the first option', () => {
    const testregelMedAndreDefault = {
      ...testregel,
      definition: {
        ...testregel.definition,
        utfall: [
          {
            beskrivelse: 'Samsvarer med kravet',
            testresultat: 'samsvar',
            default: false,
          },
          {
            beskrivelse: 'Bryt med kravet',
            testresultat: 'brot',
            default: true,
          },
        ],
      },
    } as Testregel;

    render(
      <TestFormForenkla
        testregel={testregelMedAndreDefault}
        showHelpText
        onResultat={vi.fn()}
        slettTestelement={vi.fn()}
        isLoading={false}
        isDemoApp={false}
        activeResult={activeResult}
      />,
      {
        wrapper: BrowserRouter,
      }
    );

    expect(screen.getByLabelText('Vel utfall', { exact: false })).toHaveValue(
      'Samsvar: Samsvarer med kravet'
    );
  });

  it('allows submitting a custom utfall in addition to the predefined options', async () => {
    const onResultat = vi.fn();
    const onCreateForenklaResultat = vi.fn();

    render(
      <TestFormForenkla
        testregel={testregel}
        showHelpText
        onResultat={onResultat}
        slettTestelement={vi.fn()}
        isLoading={false}
        isDemoApp={false}
        onCreateForenklaResultat={onCreateForenklaResultat}
        activeResult={activeResult}
      />,
      {
        wrapper: BrowserRouter,
      }
    );

    const user = userEvent.setup();
    const utfallSelect = screen.getByLabelText('Vel utfall', { exact: false });

    expect(utfallSelect).toHaveValue('Samsvar: Samsvarer med kravet');

    const utfallOptions = within(utfallSelect).getAllByRole('option');
    expect(utfallOptions.at(-1)).toHaveValue('custom');
    expect(utfallOptions.at(-1)).toHaveTextContent('Eigendefinert utfall');

    expect(
      screen.queryByText(
        'Fyll ut resultat og skildring for det eigendefinerte utfallet.'
      )
    ).not.toBeInTheDocument();

    await user.type(
      screen.getByLabelText('Beskriv elementet', { exact: false }),
      'Knapp for innsending'
    );

    await user.selectOptions(
      utfallSelect,
      'custom'
    );

    expect(
      screen.getByLabelText('Vel resultat for eigendefinert utfall', {
        exact: false,
      })
    ).toBeInTheDocument();
    expect(
      screen.getByText(
        'Fyll ut resultat og skildring for det eigendefinerte utfallet.'
      )
    ).toBeInTheDocument();
    expect(
      screen.getByLabelText('Beskriv eigendefinert utfall', { exact: false })
    ).toBeInTheDocument();

    await user.selectOptions(
      screen.getByLabelText('Vel resultat for eigendefinert utfall', {
        exact: false,
      }),
      'brot'
    );

    await user.type(
      screen.getByLabelText('Beskriv eigendefinert utfall', { exact: false }),
      'Har berre delvis stotte'
    );

    await user.click(screen.getByText('Lagre'));

    await waitFor(() => {
      expect(onCreateForenklaResultat).toHaveBeenCalledWith(
        expect.objectContaining({
          id: activeResult.id,
          status: 'Ferdig',
          svar: [],
          element: expect.objectContaining({
            elementResultat: 'brot',
            elementUtfall: 'Har berre delvis stotte',
            elementOmtale: 'Knapp for innsending',
          }),
        })
      );
    });

    await waitFor(() => {
      expect(onResultat).toHaveBeenCalledWith({
        resultatId: activeResult.id,
        alleSvar: [],
        kommentar: '',
        elementOmtale: 'Knapp for innsending',
        elementOmtaleHtml: '',
        elementPlassering: '',
        ekstraSjekk: undefined,
        resultat: {
          type: 'avslutt',
          utfall: 'Har berre delvis stotte',
          fasit: 'Nei',
          utfallId: undefined,
        },
      });
    });
  });
});










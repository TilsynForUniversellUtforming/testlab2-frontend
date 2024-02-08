import { Testregel } from '@test/util/interface/Testregel';
import { describe, expect, test } from 'vitest';

import { lagSkjemaModell } from '../../util/testregelParser';

describe('makeViewModel spec', () => {
  const basis: Testregel = {
    namn: '1.3.3a Instruksjonar for betening av skjema, er ikkje utelukkande avhengige av sensoriske eigenskapar',
    id: '1.3.3a',
    testlabId: 237,
    versjon: '1.0',
    type: 'Nett',
    spraak: 'nn',
    kravTilSamsvar:
      '<p>Kravet kan oppfyllast på fleire måtar.</p>\r\n<ul>\r\n<li>Instruksjonar som inneheld informasjon om komponentars sensoriske eigenskapar (form, størrelse, visuell plassering på sida, orientering eller lyd), inneheld også annan informasjon som let brukaren finne og betene komponenten.</li>\r\n<li>Kravet kan og vere oppfylt viss noko av det følgande er ivareteke:<br>I instruksjonen er det brukt ord som i språket er naturleg for å referere ei leserekkefølge og denne rekkefølga er den same i koden.</li>\r\n</ul>',
    side: '2.1',
    element: '3.1',
    steg: [],
  };

  test('når ingen svar er gitt, så skal modellen bare inneholde første steg', () => {
    const testregel: Testregel = {
      ...basis,
      steg: [
        {
          stegnr: '2.1',
          spm: 'Kva side testar du på?',
          ht: 'Oppgi URL eller side-ID.',
          type: 'tekst',
          label: 'URL/Side:',
          datalist: 'Sideutvalg',
          ruting: {
            alle: {
              type: 'gaaTil',
              steg: '2.2',
            },
          },
        },
        {
          stegnr: '2.2',
          spm: 'Har nettsida digitale/interaktive skjema/skjemaelement?',
          ht: 'Gjennomgå nettsida og sjå etter digitale/interaktive skjema.',
          type: 'jaNei',
          kilde: [],
          ruting: {
            ja: {
              type: 'gaaTil',
              steg: '2.3',
            },
            nei: {
              type: 'ikkjeForekomst',
              utfall: 'Testside har ikkje skjema.',
            },
          },
        },
      ],
    };
    const model = lagSkjemaModell(testregel, []);
    expect(model.steg).toHaveLength(1);
    const first = model.steg[0];
    expect(first.stegnr).toBe('2.2');
    expect(first.spm).toBe(
      'Har nettsida digitale/interaktive skjema/skjemaelement?'
    );
    expect(first.ht).toBe(
      'Gjennomgå nettsida og sjå etter digitale/interaktive skjema.'
    );
    expect(first.type).toBe('jaNei');
  });

  test('når testregelen inneholder en instruksjon, så skal vi hoppe videre til neste steg som har en beslutning', () => {
    const testregel: Testregel = {
      ...basis,
      steg: [
        {
          stegnr: '2.1',
          spm: 'Kva side testar du?',
          ht: '<p>Oppgi URL eller side-ID.</p>',
          type: 'tekst',
          label: 'URL/Side:',
          datalist: 'Sideutvalg',
          ruting: {
            alle: {
              type: 'gaaTil',
              steg: '3.2',
            },
          },
        },
        {
          stegnr: '3.2',
          spm: 'Zoom teksten til 200 % med zoom-funksjonen i nettlesaren.',
          ht: '<p>Bruk zoomfunksjonen i nettlesaren og velg eller skriv inn verdien 200 %.</p>\n<p><strong>Merk</strong>: Du kan zoome i dei fleste nettlesarar ved å trykke Ctrl og + på tastaturet.</p>',
          type: 'instruksjon',
          kilde: ['G142'],
          ruting: {
            alle: {
              type: 'gaaTil',
              steg: '3.3',
            },
          },
        },
        {
          stegnr: '3.3',
          spm: 'Har testsida same tekstleg innhald og funksjonalitet i 200 % visning, som i 100 % visning?',
          ht: '<p><strong>Tips: </strong>Du kan opne nettsida i to faner for å gjere det lettare å samanlikne. </p>\n<ul>\n<li>det er ok om du får tilgang til innhald/funksjonalitet ved å scrolle</li>\n<li>plassering av element på nettstaden treng ikkje vera likt</li>\n<li>trunkering er ok, så lenge du får tilgang til alt innhald eller funksjonalitet når innhaldet får fokus eller ved aktivering, for eksempel via hamburger-meny.</li>\n</ul>\n<p>Eksempel på at innhald eller funksjonalitet går tapt: </p>\n<ul>\n<li>tekst blir kutta av eller skjult</li>\n<li>tekst legg seg over annan tekst</li>\n<li>tekst ligg utanfor presentasjonsramma, og det er ikkje mogleg å scrolle for å få tak i innhaldet</li>\n<li>du får ikkje tilgang til ledetekstar, verktøytips eller skjemaelement</li>\n<li>du får ikkje tilgang til tekst eller funksjonalitet som er trunkert, når innhaldet får fokus eller blir aktivert </li>\n</ul>',
          type: 'jaNei',
          kilde: ['G142', 'G146'],
          ruting: {
            ja: {
              type: 'avslutt',
              fasit: 'Ja',
              utfall:
                'Tekst kan forstørrast til minst 200 %, utan tap av innhald eller funksjonalitet.',
            },
            nei: {
              type: 'gaaTil',
              steg: '3.4',
            },
          },
        },
      ],
    };
    const modell = lagSkjemaModell(testregel, [{ steg: '3.3', svar: 'Ja' }]);
    expect(modell.steg.map((s) => s.stegnr)).toMatchObject(['3.2', '3.3']);
    expect(modell.resultat).toMatchObject({
      type: 'avslutt',
      fasit: 'Ja',
      utfall:
        'Tekst kan forstørrast til minst 200 %, utan tap av innhald eller funksjonalitet.',
    });
  });

  test('gitt at det er ja/nei-ruting, når et svar er gitt, så skal modellen inneholde to steg', () => {
    const testregel: Testregel = {
      ...basis,
      steg: [
        {
          stegnr: '2.1',
          spm: 'Kva side testar du på?',
          ht: 'Oppgi URL eller side-ID.',
          type: 'tekst',
          label: 'URL/Side:',
          datalist: 'Sideutvalg',
          ruting: {
            alle: {
              type: 'gaaTil',
              steg: '2.2',
            },
          },
        },
        {
          stegnr: '2.2',
          spm: 'Har nettsida digitale/interaktive skjema/skjemaelement?',
          ht: 'Gjennomgå nettsida og sjå etter digitale/interaktive skjema.',
          type: 'jaNei',
          kilde: [],
          ruting: {
            ja: {
              type: 'gaaTil',
              steg: '2.3',
            },
            nei: {
              type: 'ikkjeForekomst',
              utfall: 'Testside har ikkje skjema.',
            },
          },
        },
        {
          stegnr: '2.3',
          spm: 'Beskriv skjemaet/prosessen',
          ht: 'Legg inn overskrift, eller andre stikkord som er slik at skjemaet kan identifiserast.',
          type: 'tekst',
          label: 'Skjema/prosess:',
          multilinje: true,
          ruting: {
            alle: {
              type: 'ikkjeForekomst',
              utfall: 'Testside har ikkje skjema.',
            },
          },
        },
      ],
    };
    const model = lagSkjemaModell(testregel, [{ steg: '2.2', svar: 'Ja' }]);
    expect(model.steg.map((s) => s.stegnr)).toStrictEqual(['2.2', '2.3']);
  });

  test('når det er ruting med radioboks, så skal vi få det resultatet som hører til den valgte radioboksen', () => {
    const testregel: Testregel = {
      ...basis,
      steg: [
        {
          stegnr: '2.1',
          spm: 'Kva side testar du på?',
          ht: 'Oppgi URL eller side-ID.',
          type: 'tekst',
          label: 'URL/Side:',
          datalist: 'Sideutvalg',
          ruting: {
            alle: {
              type: 'gaaTil',
              steg: '2.2',
            },
          },
        },
        {
          stegnr: '2.2',
          spm: 'Har nettsida digitale/interaktive skjema/skjemaelement?',
          ht: 'Gjennomgå nettsida og sjå etter digitale/interaktive skjema.',
          type: 'radio',
          svarArray: ['ja', 'nEi', 'kanSkje'],
          kilde: [],
          ruting: {
            alt0: {
              type: 'avslutt',
              fasit: 'Ja',
              utfall: 'Testside har skjema.',
            },
            alt1: {
              type: 'ikkjeForekomst',
              utfall: 'Testside har ikkje skjema.',
            },
            alt2: {
              type: 'avslutt',
              fasit: 'Ja',
              utfall: 'Testside har kanskje et skjema',
            },
          },
        },
      ],
    };

    const modelJa = lagSkjemaModell(testregel, [{ steg: '2.2', svar: 'Ja' }]);
    const modelNei = lagSkjemaModell(testregel, [{ steg: '2.2', svar: 'Nei' }]);
    const modelKanskje = lagSkjemaModell(testregel, [
      { steg: '2.2', svar: 'Kanskje' },
    ]);

    expect(modelJa.resultat).toMatchObject({
      type: 'avslutt',
      fasit: 'Ja',
      utfall: 'Testside har skjema.',
    });
    expect(modelNei.resultat).toMatchObject({
      type: 'ikkjeForekomst',
      utfall: 'Testside har ikkje skjema.',
    });
    expect(modelKanskje.resultat).toMatchObject({
      type: 'avslutt',
      fasit: 'Ja',
      utfall: 'Testside har kanskje et skjema',
    });
  });

  test('når et svar er gitt, så skal vi ta med alle de neste stegene helt til vi kommer til en beslutning', () => {
    const testregel: Testregel = {
      ...basis,
      steg: [
        {
          stegnr: '2.1',
          spm: 'Kva side testar du på?',
          ht: 'Oppgi URL eller side-ID.',
          type: 'tekst',
          label: 'URL/Side:',
          datalist: 'Sideutvalg',
          ruting: {
            alle: {
              type: 'gaaTil',
              steg: '2.2',
            },
          },
        },
        {
          stegnr: '2.2',
          spm: 'Har nettsida digitale/interaktive skjema/skjemaelement?',
          ht: 'Gjennomgå nettsida og sjå etter digitale/interaktive skjema.',
          type: 'jaNei',
          kilde: [],
          ruting: {
            ja: {
              type: 'gaaTil',
              steg: '2.3',
            },
            nei: {
              type: 'ikkjeForekomst',
              utfall: 'Testside har ikkje skjema.',
            },
          },
        },
        {
          stegnr: '2.3',
          spm: 'Beskriv skjemaet/prosessen',
          ht: 'Legg inn overskrift, eller andre stikkord som er slik at skjemaet kan identifiserast.',
          type: 'tekst',
          label: 'Skjema/prosess:',
          multilinje: true,
          ruting: {
            alle: {
              type: 'gaaTil',
              steg: '2.4',
            },
          },
        },
        {
          stegnr: '2.4',
          spm: 'Inneheld skjemaet instruksjonar for betening?',
          ht: 'Gjennomgå skjemaet og sjå etter om skjemaet inneheld instruksjon for utfylling eller betening av skjemaelement.',
          type: 'jaNei',
          kilde: [],
          ruting: {
            ja: {
              type: 'gaaTil',
              steg: '3.1',
            },
            nei: {
              type: 'ikkjeForekomst',
              utfall: 'Skjema har ikkje instruksjonar for betening.',
            },
          },
        },
      ],
    };
    const model = lagSkjemaModell(testregel, [{ steg: '2.2', svar: 'Ja' }]);
    expect(model.steg.map((m) => m.stegnr)).toStrictEqual([
      '2.2',
      '2.3',
      '2.4',
    ]);
  });

  test('når et steg har delutfall, så skal det lagres i modellen', () => {
    const testregel: Testregel = {
      ...basis,
      steg: [
        {
          stegnr: '2.1',
          spm: 'Kva side testar du på?',
          ht: 'Oppgi URL eller side-ID.',
          type: 'tekst',
          label: 'URL/Side:',
          datalist: 'Sideutvalg',
          ruting: {
            alle: {
              type: 'gaaTil',
              steg: '2.2',
            },
          },
        },
        {
          stegnr: '2.2',
          spm: 'Har nettsida digitale/interaktive skjema/skjemaelement?',
          ht: 'Gjennomgå nettsida og sjå etter digitale/interaktive skjema.',
          type: 'jaNei',
          kilde: [],
          ruting: {
            ja: {
              type: 'gaaTil',
              steg: '2.3',
              delutfall: {
                fasit: 'Ja',
                nr: 0,
                tekst: 'Testside har skjema.',
              },
            },
            nei: {
              type: 'ikkjeForekomst',
              utfall: 'Testside har ikkje skjema.',
            },
          },
        },
        {
          stegnr: '2.3',
          spm: 'Beskriv skjemaet/prosessen',
          ht: 'Legg inn overskrift, eller andre stikkord som er slik at skjemaet kan identifiserast.',
          type: 'jaNei',
          ruting: {
            ja: {
              type: 'avslutt',
              fasit: 'sjekkDelutfall',
              utfall: '#delutfall(0)',
            },
            nei: {
              type: 'ikkjeForekomst',
              utfall: 'Testside har ikkje skjema.',
            },
          },
        },
      ],
    };
    const model = lagSkjemaModell(testregel, [
      { steg: '2.2', svar: 'Ja' },
      { steg: '2.3', svar: 'Ja' },
    ]);
    expect(model.delutfall[0]).toMatchObject({
      fasit: 'Ja',
      nr: 0,
      tekst: 'Testside har skjema.',
    });
    expect(model.resultat).toMatchObject({
      type: 'avslutt',
      fasit: 'Ja',
      utfall: 'Testside har skjema.',
    });
  });

  describe('regler', () => {
    test('lik', () => {
      const testregel: Testregel = {
        ...basis,
        steg: [
          {
            stegnr: '2.1',
            spm: 'Kva side testar du på?',
            ht: 'Oppgi URL eller side-ID.',
            type: 'tekst',
            label: 'URL/Side:',
            datalist: 'Sideutvalg',
            ruting: {
              alle: {
                type: 'gaaTil',
                steg: '2.2',
              },
            },
          },
          {
            stegnr: '2.2',
            spm: 'Har nettsida digitale/interaktive skjema/skjemaelement?',
            ht: 'Gjennomgå nettsida og sjå etter digitale/interaktive skjema.',
            type: 'jaNei',
            kilde: [],
            ruting: {
              alle: {
                type: 'gaaTil',
                steg: '2.3',
              },
            },
          },
          {
            stegnr: '2.3',
            spm: 'Beskriv skjemaet/prosessen',
            ht: 'Legg inn overskrift, eller andre stikkord som er slik at skjemaet kan identifiserast.',
            type: 'jaNei',
            ruting: {
              ja: {
                type: 'regler',
                regler: {
                  '1': {
                    sjekk: '2.2',
                    type: 'lik',
                    verdi: 'ja',
                    handling: {
                      type: 'gaaTil',
                      steg: '2.4',
                    },
                  },
                  '2': {
                    sjekk: '2.2',
                    type: 'lik',
                    verdi: 'nei',
                    handling: {
                      type: 'avslutt',
                      fasit: 'Nei',
                      utfall: '2.2 har svar = nei',
                    },
                  },
                },
              },
              nei: {
                type: 'avslutt',
                fasit: 'Nei',
                utfall: '2.3 har svar = nei',
              },
            },
          },
          {
            stegnr: '2.4',
            spm: 'Inneheld skjemaet instruksjonar for betening?',
            ht: 'Gjennomgå skjemaet og sjå etter om skjemaet inneheld instruksjon for utfylling eller betening av skjemaelement.',
            type: 'jaNei',
            kilde: [],
            ruting: {
              ja: {
                type: 'gaaTil',
                steg: '3.1',
              },
              nei: {
                type: 'ikkjeForekomst',
                utfall: 'Skjema har ikkje instruksjonar for betening.',
              },
            },
          },
        ],
      };

      const model = lagSkjemaModell(testregel, [
        { steg: '2.2', svar: 'Ja' },
        { steg: '2.3', svar: 'Ja' },
      ]);
      expect(model.steg.map((m) => m.stegnr)).toStrictEqual([
        '2.2',
        '2.3',
        '2.4',
      ]);

      const model2 = lagSkjemaModell(testregel, [
        { steg: '2.2', svar: 'Nei' },
        { steg: '2.3', svar: 'Ja' },
      ]);
      expect(model2.steg.map((m) => m.stegnr)).toStrictEqual(['2.2', '2.3']);
    });

    test('ulik', () => {
      const testregel: Testregel = {
        ...basis,
        steg: [
          {
            stegnr: '2.1',
            spm: 'Kva side testar du på?',
            ht: 'Oppgi URL eller side-ID.',
            type: 'tekst',
            label: 'URL/Side:',
            datalist: 'Sideutvalg',
            ruting: {
              alle: {
                type: 'gaaTil',
                steg: '2.2',
              },
            },
          },
          {
            stegnr: '2.2',
            spm: 'Har nettsida digitale/interaktive skjema/skjemaelement?',
            ht: 'Gjennomgå nettsida og sjå etter digitale/interaktive skjema.',
            type: 'jaNei',
            kilde: [],
            ruting: {
              alle: {
                type: 'gaaTil',
                steg: '2.3',
              },
            },
          },
          {
            stegnr: '2.3',
            spm: 'Beskriv skjemaet/prosessen',
            ht: 'Legg inn overskrift, eller andre stikkord som er slik at skjemaet kan identifiserast.',
            type: 'jaNei',
            ruting: {
              ja: {
                type: 'regler',
                regler: {
                  '1': {
                    sjekk: '2.2',
                    type: 'ulik',
                    verdi: 'nei',
                    handling: {
                      type: 'gaaTil',
                      steg: '2.4',
                    },
                  },
                  '2': {
                    sjekk: '2.2',
                    type: 'ulik',
                    verdi: 'ja',
                    handling: {
                      type: 'avslutt',
                      fasit: 'Nei',
                      utfall: '2.2 har svar = nei',
                    },
                  },
                },
              },
              nei: {
                type: 'avslutt',
                fasit: 'Nei',
                utfall: '2.3 har svar = nei',
              },
            },
          },
          {
            stegnr: '2.4',
            spm: 'Inneheld skjemaet instruksjonar for betening?',
            ht: 'Gjennomgå skjemaet og sjå etter om skjemaet inneheld instruksjon for utfylling eller betening av skjemaelement.',
            type: 'jaNei',
            kilde: [],
            ruting: {
              ja: {
                type: 'gaaTil',
                steg: '3.1',
              },
              nei: {
                type: 'ikkjeForekomst',
                utfall: 'Skjema har ikkje instruksjonar for betening.',
              },
            },
          },
        ],
      };
      const model = lagSkjemaModell(testregel, [
        { steg: '2.2', svar: 'Ja' },
        { steg: '2.3', svar: 'Ja' },
      ]);
      expect(model.steg.map((m) => m.stegnr)).toStrictEqual([
        '2.2',
        '2.3',
        '2.4',
      ]);
    });

    test('mellom', () => {
      const testregel: Testregel = {
        ...basis,
        steg: [
          {
            stegnr: '2.1',
            spm: 'Kva side testar du på?',
            ht: 'Oppgi URL eller side-ID.',
            type: 'tekst',
            label: 'URL/Side:',
            datalist: 'Sideutvalg',
            ruting: {
              alle: {
                type: 'gaaTil',
                steg: '2.2',
              },
            },
          },
          {
            stegnr: '2.2',
            spm: 'Har nettsida digitale/interaktive skjema/skjemaelement?',
            ht: 'Gjennomgå nettsida og sjå etter digitale/interaktive skjema.',
            type: 'tekst',
            filter: 'tall',
            kilde: [],
            ruting: {
              alle: {
                type: 'regler',
                regler: {
                  '1': {
                    sjekk: '2.2',
                    type: 'mellom',
                    verdi: 0,
                    verdi2: 10,
                    handling: {
                      type: 'gaaTil',
                      steg: '2.3',
                    },
                  },
                  '2': {
                    sjekk: '2.2',
                    type: 'mellom',
                    verdi: 10,
                    verdi2: 100,
                    handling: {
                      type: 'avslutt',
                      fasit: 'Nei',
                      utfall: '2.2 har svar mellom 10 og 100',
                    },
                  },
                },
              },
            },
          },
          {
            stegnr: '2.3',
            spm: 'Beskriv skjemaet/prosessen',
            ht: 'Legg inn overskrift, eller andre stikkord som er slik at skjemaet kan identifiserast.',
            type: 'jaNei',
            ruting: {
              alle: {
                type: 'avslutt',
                fasit: 'Nei',
                utfall: '2.2 har svar mellom 0 og 10',
              },
            },
          },
        ],
      };
      const model = lagSkjemaModell(testregel, [{ steg: '2.2', svar: '0' }]);
      expect(model.steg.map((m) => m.stegnr)).toStrictEqual(['2.2', '2.3']);

      const model2 = lagSkjemaModell(testregel, [{ steg: '2.2', svar: '15' }]);
      expect(model2.steg.map((m) => m.stegnr)).toStrictEqual(['2.2']);
    });

    test('talDersom', () => {
      const testregel: Testregel = {
        ...basis,
        steg: [
          {
            stegnr: '2.1',
            spm: 'Kva side testar du på?',
            ht: 'Oppgi url eller side-ID.',
            type: 'tekst',
            label: 'Url/Side:',
            datalist: 'Sideutvalg',
            ruting: {
              alle: {
                type: 'gaaTil',
                steg: '3.1',
              },
            },
          },
          {
            stegnr: '3.1',
            spm: 'Har nettsida valideringsfeil?',
            ht: '<p>For å sjekke sida for valideringsfeil kan du bruke <a href="https://validator.w3.org/" target="_blank" rel="noopener">W3C sin kodevalidator</a>.</p>\n<p>Sjekk om validatoren gir feil av type "Errors".</p>',
            type: 'jaNei',
            kilde: ['G134'],
            ruting: {
              ja: {
                type: 'gaaTil',
                steg: '3.2',
              },
              nei: {
                type: 'avslutt',
                fasit: 'Ja',
                utfall: 'Testsida har ikkje syntaksfeil.',
              },
            },
          },
          {
            stegnr: '3.2',
            spm: 'Kor mange tilfelle er det av feil nøsting av element?',
            ht: '<p>Feilbeskrivinga vil innehalde noko av det følgjande:</p>\n<ul>\n<li>"Element [navn på element] not allowed…"</li>\n<li>"The element [navn på element] must not appear as a descendant of the [navn på element] element"</li>\n</ul>',
            kilde: ['H74'],
            type: 'tekst',
            label: 'Tal element',
            ruting: {
              alle: {
                type: 'regler',
                regler: {
                  '1': {
                    sjekk: '3.2',
                    type: 'mellom',
                    verdi: 0,
                    verdi2: 0,
                    handling: {
                      type: 'gaaTil',
                      steg: '3.3',
                      delutfall: {
                        nr: 0,
                        tekst: '',
                        fasit: 'Ja',
                      },
                    },
                  },
                  '2': {
                    sjekk: '3.2',
                    type: 'mellom',
                    verdi: 1,
                    verdi2: 2000000,
                    handling: {
                      type: 'gaaTil',
                      steg: '3.3',
                      delutfall: {
                        nr: 0,
                        tekst: '<br>- Element som ikkje er nøsta korrekt',
                        fasit: 'Nei',
                      },
                    },
                  },
                },
              },
            },
          },
          {
            stegnr: '3.3',
            spm: 'Kor mange tilfelle er det av element som ikkje er avslutta korrekt?',
            ht: '<p>Feilbeskrivinga vil innehalde noko av det følgjande:</p><ul><li>"Unclosed element [navn på element]".</li><li>"End tag for [navn på element] omitted".</li><li>"End tag for [navn på element] which is not finished".</li></ul>',
            kilde: ['H74', 'F70'],
            type: 'tekst',
            filter: 'tal',
            label: 'Tal element',
            multilinje: false,
            ruting: {
              alle: {
                type: 'regler',
                regler: {
                  '1': {
                    sjekk: '3.3',
                    type: 'mellom',
                    verdi: 0,
                    verdi2: 0,
                    handling: {
                      type: 'gaaTil',
                      steg: '3.4',
                      delutfall: {
                        nr: 1,
                        tekst: '',
                        fasit: 'Ja',
                      },
                    },
                  },
                  '2': {
                    sjekk: '3.3',
                    type: 'mellom',
                    verdi: 1,
                    verdi2: 2000000,
                    handling: {
                      type: 'gaaTil',
                      steg: '3.4',
                      delutfall: {
                        nr: 1,
                        tekst: '<br>- Element som ikkje er avslutta korrekt',
                        fasit: 'Nei',
                      },
                    },
                  },
                },
              },
            },
          },
          {
            stegnr: '3.4',
            spm: 'Kor mange tilfelle er det av element som har same attributt fleire gonger?',
            ht: '<p>Feilbeskrivinga vil innehalde noko av det følgjande:</p><ul><li>"Duplicate attribute [navn på attributt]".</li><li>"Duplicate specification of attribute [navn på attributt]".</li></ul>',
            type: 'tekst',
            filter: 'tal',
            kilde: ['H94'],
            label: 'Tal element',
            multilinje: false,
            ruting: {
              alle: {
                type: 'regler',
                regler: {
                  '1': {
                    sjekk: '3.4',
                    type: 'mellom',
                    verdi: 0,
                    verdi2: 0,
                    handling: {
                      type: 'gaaTil',
                      steg: '3.5',
                      delutfall: {
                        nr: 2,
                        tekst: '',
                        fasit: 'Ja',
                      },
                    },
                  },
                  '2': {
                    sjekk: '3.4',
                    type: 'mellom',
                    verdi: 1,
                    verdi2: 2000000,
                    handling: {
                      type: 'gaaTil',
                      steg: '3.5',
                      delutfall: {
                        nr: 2,
                        tekst:
                          '<br>- Element som har same attributt fleire gonger',
                        fasit: 'Nei',
                      },
                    },
                  },
                },
              },
            },
          },
          {
            stegnr: '3.5',
            spm: 'Kor mange tilfelle er det av element som har ID-ar som ikkje er unike?',
            ht: '<p>Feilbeskrivinga vil innehalde noko av det følgjande:</p><ul><li>"Duplicate ID [navn på ID]".</li><li>"ID [navn på element] already defined".</li></ul>',
            type: 'tekst',
            filter: 'tal',
            kilde: ['H93', 'F77'],
            label: 'Tal element',
            multilinje: false,
            ruting: {
              alle: {
                type: 'regler',
                regler: {
                  '1': {
                    sjekk: '3.5',
                    type: 'mellom',
                    verdi: 0,
                    verdi2: 0,
                    handling: {
                      type: 'gaaTil',
                      steg: '3.6',
                      delutfall: {
                        nr: 3,
                        tekst: '',
                        fasit: 'Ja',
                      },
                    },
                  },
                  '2': {
                    sjekk: '3.5',
                    type: 'mellom',
                    verdi: 1,
                    verdi2: 2000000,
                    handling: {
                      type: 'gaaTil',
                      steg: '3.6',
                      delutfall: {
                        nr: 3,
                        tekst: '<br>- Element som har ID-ar som ikkje er unike',
                        fasit: 'Nei',
                      },
                    },
                  },
                },
              },
            },
          },
          {
            stegnr: '3.6',
            spm: 'Får du ein "Fatal Error" ved validering av nettsida?',
            ht: '<p>Ein "Fatal Error" gjer at validatoren stoppar opp og ikkje får til å validere resten av koden på nettsida. "Fatal Error" kan for eksempel oppstå på grunn av script.</p><p>Det kan hende at det ligg fleire syntaksfeil etter ein "Fatal Error", men dei er ikkje mogleg å oppdage.</p>',
            type: 'jaNei',
            kilde: ['G134'],
            ruting: {
              ja: {
                type: 'avslutt',
                fasit: 'Nei',
                utfall: 'Testside med valideringsfeilen "Fatal Error".',
              },
              nei: {
                type: 'regler',
                regler: {
                  '1': {
                    type: 'talDersom',
                    sjekk: ['3.2', '3.3', '3.4', '3.5'],
                    verdi: '0',
                    mellom1: 4,
                    mellom2: 4,
                    handling: {
                      type: 'avslutt',
                      fasit: 'Ja',
                      utfall: 'Testsida har ikkje syntaksfeil.',
                    },
                  },
                  '2': {
                    type: 'talDersom',
                    sjekk: ['3.2', '3.3', '3.4', '3.5'],
                    verdi: '0',
                    mellom1: 0,
                    mellom2: 3,
                    handling: {
                      type: 'avslutt',
                      fasit: 'Nei',
                      utfall:
                        'Testside med syntaksfeil av typen #delutfall(0)#delutfall(1)#delutfall(2)#delutfall(3).',
                    },
                  },
                },
              },
            },
          },
        ],
      };

      const model = lagSkjemaModell(testregel, [
        {
          steg: '3.1',
          svar: 'Ja',
        },
        {
          steg: '3.2',
          svar: '0',
        },
        {
          steg: '3.3',
          svar: '0',
        },
        {
          steg: '3.4',
          svar: '0',
        },
        {
          steg: '3.5',
          svar: '0',
        },
        {
          steg: '3.6',
          svar: 'Nei',
        },
      ]);
      expect(model.resultat).toMatchObject({
        type: 'avslutt',
        fasit: 'Ja',
        utfall: 'Testsida har ikkje syntaksfeil.',
      });
    });

    test('nøstede regler', () => {
      const testregel: Testregel = {
        ...basis,
        steg: [
          {
            stegnr: '2.1',
            spm: 'Kva side testar du på?',
            ht: 'Oppgi URL eller side-ID.',
            type: 'tekst',
            label: 'URL/Side:',
            datalist: 'Sideutvalg',
            ruting: {
              alle: {
                type: 'gaaTil',
                steg: '2.2',
              },
            },
          },
          {
            stegnr: '2.2',
            spm: 'Har nettsida digitale/interaktive skjema/skjemaelement?',
            ht: 'Gjennomgå nettsida og sjå etter digitale/interaktive skjema.',
            type: 'jaNei',
            kilde: [],
            ruting: {
              ja: { type: 'gaaTil', steg: '2.3' },
              nei: { type: 'gaaTil', steg: '2.3' },
            },
          },
          {
            stegnr: '2.3',
            spm: 'Beskriv skjemaet/prosessen',
            ht: 'Legg inn overskrift, eller andre stikkord som er slik at skjemaet kan identifiserast.',
            type: 'jaNei',
            ruting: {
              alle: {
                type: 'regler',
                regler: {
                  '1': {
                    sjekk: '2.2',
                    type: 'lik',
                    verdi: 'ja',
                    handling: {
                      type: 'regler',
                      regler: {
                        '1': {
                          sjekk: '2.3',
                          type: 'lik',
                          verdi: 'ja',
                          handling: {
                            type: 'avslutt',
                            fasit: 'Ja',
                            utfall: '2.2 og 2.3 har svar ja',
                          },
                        },
                        '2': {
                          sjekk: '2.3',
                          type: 'lik',
                          verdi: 'nei',
                          handling: {
                            type: 'avslutt',
                            fasit: 'Nei',
                            utfall: '2.2 har svar ja og 2.3 har svar nei',
                          },
                        },
                      },
                    },
                  },
                  '2': {
                    sjekk: '2.2',
                    type: 'lik',
                    verdi: 'nei',
                    handling: {
                      type: 'regler',
                      regler: {
                        '1': {
                          sjekk: '2.3',
                          type: 'lik',
                          verdi: 'ja',
                          handling: {
                            type: 'avslutt',
                            fasit: 'Nei',
                            utfall: '2.2 har svar nei og 2.3 har svar ja',
                          },
                        },
                        '2': {
                          sjekk: '2.3',
                          type: 'lik',
                          verdi: 'nei',
                          handling: {
                            type: 'avslutt',
                            fasit: 'Nei',
                            utfall: '2.2 og 2.3 har svar nei',
                          },
                        },
                      },
                    },
                  },
                },
              },
            },
          },
        ],
      };
      const model = lagSkjemaModell(testregel, [
        { steg: '2.2', svar: 'Ja' },
        { steg: '2.3', svar: 'Ja' },
      ]);
      expect(model.resultat).toMatchObject({
        type: 'avslutt',
        fasit: 'Ja',
        utfall: '2.2 og 2.3 har svar ja',
      });

      const model2 = lagSkjemaModell(testregel, [
        { steg: '2.2', svar: 'Ja' },
        { steg: '2.3', svar: 'Nei' },
      ]);
      expect(model2.resultat).toMatchObject({
        type: 'avslutt',
        fasit: 'Nei',
        utfall: '2.2 har svar ja og 2.3 har svar nei',
      });

      const model3 = lagSkjemaModell(testregel, [
        { steg: '2.2', svar: 'Nei' },
        { steg: '2.3', svar: 'Ja' },
      ]);
      expect(model3.resultat).toMatchObject({
        type: 'avslutt',
        fasit: 'Nei',
        utfall: '2.2 har svar nei og 2.3 har svar ja',
      });

      const model4 = lagSkjemaModell(testregel, [
        { steg: '2.2', svar: 'Nei' },
        { steg: '2.3', svar: 'Nei' },
      ]);
      expect(model4.resultat).toMatchObject({
        type: 'avslutt',
        fasit: 'Nei',
        utfall: '2.2 og 2.3 har svar nei',
      });
    });

    test('vurderDelutfall', () => {
      const testregel: Testregel = {
        ...basis,
        steg: [
          {
            stegnr: '2.1',
            spm: 'Kva side testar du på?',
            ht: 'Oppgi URL eller side-ID.',
            type: 'tekst',
            label: 'URL/Side:',
            datalist: 'Sideutvalg',
            ruting: {
              alle: {
                type: 'gaaTil',
                steg: '2.2',
              },
            },
          },
          {
            stegnr: '2.2',
            spm: 'Har nettsida digitale/interaktive skjema/skjemaelement?',
            ht: 'Gjennomgå nettsida og sjå etter digitale/interaktive skjema.',
            type: 'jaNei',
            kilde: [],
            ruting: {
              ja: {
                type: 'gaaTil',
                steg: '2.3',
                delutfall: {
                  fasit: 'Ja',
                  nr: 0,
                  tekst: 'Testside har skjema.',
                },
              },
              nei: {
                type: 'gaaTil',
                steg: '2.3',
                delutfall: {
                  fasit: 'Nei',
                  nr: 0,
                  tekst: 'Testside har ikkje skjema.',
                },
              },
            },
          },
          {
            stegnr: '2.3',
            spm: 'Beskriv skjemaet/prosessen',
            ht: 'Legg inn overskrift, eller andre stikkord som er slik at skjemaet kan identifiserast.',
            type: 'jaNei',
            ruting: {
              ja: {
                type: 'regler',
                regler: {
                  '1': {
                    type: 'vurderDelutfall',
                    id: 0,
                    verdi: 'Nei',
                    handling: {
                      type: 'avslutt',
                      fasit: 'Nei',
                      utfall: '#delutfall(0)',
                    },
                  },
                  '2': {
                    type: 'vurderDelutfall',
                    id: 0,
                    verdi: 'Ja',
                    handling: {
                      type: 'avslutt',
                      fasit: 'Ja',
                      utfall: '#delutfall(0)',
                    },
                  },
                },
              },
              nei: {
                type: 'avslutt',
                fasit: 'Nei',
                utfall: '2.3 har svar nei',
              },
            },
          },
        ],
      };
      const model = lagSkjemaModell(testregel, [
        { steg: '2.2', svar: 'Ja' },
        { steg: '2.3', svar: 'Ja' },
      ]);
      expect(model.resultat).toMatchObject({
        type: 'avslutt',
        fasit: 'Ja',
        utfall: 'Testside har skjema.',
      });

      const model2 = lagSkjemaModell(testregel, [
        { steg: '2.2', svar: 'Nei' },
        { steg: '2.3', svar: 'Ja' },
      ]);
      expect(model2.resultat).toMatchObject({
        type: 'avslutt',
        fasit: 'Nei',
        utfall: 'Testside har ikkje skjema.',
      });
    });
  });
});

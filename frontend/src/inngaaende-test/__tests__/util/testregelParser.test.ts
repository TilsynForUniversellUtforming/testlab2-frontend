import { Svar } from '@test/api/types';
import { Testregel } from '@test/util/testregel-interface/Testregel';
import * as fs from 'fs';
import * as path from 'path';
import { describe, expect, test } from 'vitest';

import { evaluateTestregel } from '../../util/testregelParser';

describe('makeViewModel spec', () => {
  function getTestregel(navn: string): Testregel {
    const filePath = path.resolve(__dirname, `test-data/${navn}.json`);
    const buffer = fs.readFileSync(filePath);
    return JSON.parse(buffer.toString());
  }

  test('når ingen svar er gitt, så skal modellen bare inneholde første steg', () => {
    const testregel = getTestregel('1.3.3a');
    const model = evaluateTestregel(testregel, []);

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
    const testregel = getTestregel('1.4.4a');
    const modell = evaluateTestregel(testregel, [
      { steg: '2.2', svar: 'Ja' },
      { steg: '3.3', svar: 'Ja' },
    ]);

    expect(modell.steg.map((s) => s.stegnr)).toMatchObject([
      '2.2',
      '2.3',
      '3.2',
      '3.3',
    ]);
    expect(modell.resultat).toMatchObject({
      type: 'avslutt',
      fasit: 'Ja',
      utfall:
        'Tekst kan forstørrast til minst 200 %, utan tap av innhald eller funksjonalitet.',
    });
  });

  test('gitt at det er ja/nei-ruting, når et svar er gitt, så skal modellen inneholde neste steg', () => {
    const testregel = getTestregel('1.3.3a');
    const model = evaluateTestregel(testregel, [{ steg: '2.2', svar: 'Ja' }]);

    expect(model.steg.map((s) => s.stegnr)).toStrictEqual(['2.2', '2.3']);
  });

  test('når det er ruting med radioboks, så skal vi få det resultatet som hører til den valgte radioboksen', () => {
    const testregel: Testregel = getTestregel('1.4.5a');
    const fellesSvar: Svar[] = [
      { steg: '2.2', svar: 'Ja' },
      { steg: '2.3', svar: 'Ja' },
      { steg: '3.1', svar: 'det øverste bildet' },
      { steg: '3.2', svar: 'Ja' },
    ];

    const modelJa = evaluateTestregel(testregel, [
      ...fellesSvar,
      { steg: '3.3', svar: 'Ja' },
    ]);
    const modelNei = evaluateTestregel(testregel, [
      ...fellesSvar,
      { steg: '3.3', svar: 'Nei' },
    ]);
    const modelIkkjeMogleg = evaluateTestregel(testregel, [
      ...fellesSvar,
      {
        steg: '3.3',
        svar: 'Ikkje mogleg å verifisere',
      },
    ]);

    expect(modelJa.resultat).toMatchObject({
      type: 'ikkjeForekomst',
      utfall: 'Bilde av tekst, som let seg tilpasse.',
    });

    expect(modelNei.steg.map((s) => s.stegnr)).toStrictEqual([
      '2.2',
      '2.3',
      '3.1',
      '3.2',
      '3.3',
      '3.4',
    ]);
    expect(modelNei.resultat).toBeUndefined();

    expect(modelIkkjeMogleg.steg.map((s) => s.stegnr)).toStrictEqual([
      '2.2',
      '2.3',
      '3.1',
      '3.2',
      '3.3',
      '3.4',
    ]);
    expect(modelIkkjeMogleg.resultat).toBeUndefined();
  });

  test('når et svar er gitt, så skal vi gå videre til neste input', () => {
    const testregel: Testregel = getTestregel('1.4.5a');
    const model = evaluateTestregel(testregel, [
      { steg: '2.2', svar: 'Ja' },
      { steg: '2.3', svar: 'Ja' },
    ]);

    expect(model.steg.map((m) => m.stegnr)).toStrictEqual([
      '2.2',
      '2.3',
      '3.1',
    ]);
  });

  test('når et steg har delutfall, så skal det lagres i modellen', () => {
    const testregel = getTestregel('nett-1.4.12a');
    const model = evaluateTestregel(testregel, [
      { steg: '2.2', svar: 'Ja' },
      { steg: '2.3', svar: 'Ja' },
      { steg: '2.4', svar: 'Ja' },
      { steg: '3.1', svar: 'bla bla' },
      { steg: '3.2', svar: 'Meny' },
      { steg: '3.3', svar: 'Ja' },
    ]);

    expect(model.delutfall[0]).toMatchObject({
      fasit: 'Ja',
      nr: 0,
      tekst:
        'Det er mulig å justere tekstegenskaper, uten tap av innhold eller funksjonalitet,',
    });
  });

  describe('regler', () => {
    test('lik', () => {
      const testregel = getTestregel('1.3.3a');
      const model = evaluateTestregel(testregel, [
        { steg: '2.2', svar: 'Ja' },
        { steg: '2.3', svar: 'bla bla' },
        { steg: '2.4', svar: 'Ja' },
        { steg: '3.1', svar: 'bla bla' },
        { steg: '3.2', svar: 'Ja' },
        { steg: '3.3', svar: 'Nei' },
        { steg: '3.4', svar: 'Nei' },
        { steg: '3.5', svar: 'Nei' },
        { steg: '3.6', svar: 'Nei' },
        { steg: '3.7', svar: 'Nei' },
      ]);
      expect(model.resultat).toMatchObject({
        type: 'ikkjeForekomst',
        utfall:
          'Tekstlege instruksjon utan tilvising til sensoriske eigenskapar.',
      });

      const model2 = evaluateTestregel(testregel, [
        { steg: '2.2', svar: 'Ja' },
        { steg: '2.3', svar: 'bla bla' },
        { steg: '2.4', svar: 'Ja' },
        { steg: '3.1', svar: 'bla bla' },
        { steg: '3.2', svar: 'Ja' },
        { steg: '3.3', svar: 'Nei' },
        { steg: '3.4', svar: 'Nei' },
        { steg: '3.5', svar: 'Nei' },
        { steg: '3.6', svar: 'Nei' },
        { steg: '3.7', svar: 'Ja' },
      ]);
      expect(model2.steg.map((m) => m.stegnr)).toStrictEqual([
        '2.2',
        '2.3',
        '2.4',
        '3.1',
        '3.2',
        '3.3',
        '3.4',
        '3.5',
        '3.6',
        '3.7',
        '3.8',
      ]);
    });

    test('ulik', () => {
      const testregel = getTestregel('3.1.1a');
      const model = evaluateTestregel(testregel, [
        { steg: '3.1', svar: 'Ja' },
        { steg: '3.4', svar: 'Ja' },
        { steg: '3.7', svar: 'Ja' },
        { steg: '3.8', svar: 'nb' },
        { steg: '3.9', svar: 'Nynorsk' },
      ]);
      expect(model.steg.map((m) => m.stegnr)).toStrictEqual([
        '3.1',
        '3.4',
        '3.7',
        '3.8',
        '3.9',
        '3.11',
      ]);
    });

    test('mellom', () => {
      const testregel = getTestregel('4.1.1a');
      const alleSvar = [
        { steg: '3.1', svar: 'Ja' },
        { steg: '3.2', svar: '0' },
      ];
      const model = evaluateTestregel(testregel, alleSvar);

      expect(model.steg.map((m) => m.stegnr)).toStrictEqual([
        '3.1',
        '3.2',
        '3.3',
      ]);
      expect(model.delutfall[0]).toMatchObject({
        nr: 0,
        tekst: '',
        fasit: 'Ja',
      });

      const model2 = evaluateTestregel(testregel, [
        { steg: '3.1', svar: 'Ja' },
        { steg: '3.2', svar: '10' },
      ]);

      expect(model2.steg.map((m) => m.stegnr)).toStrictEqual([
        '3.1',
        '3.2',
        '3.3',
      ]);
      expect(model2.delutfall[0]).toMatchObject({
        nr: 0,
        tekst: '<br>- Element som ikkje er nøsta korrekt',
        fasit: 'Nei',
      });
    });

    test('talDersom', () => {
      const testregel = getTestregel('4.1.1a');
      const model = evaluateTestregel(testregel, [
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

    test('vurderDelutfall', () => {
      const testregel = getTestregel('1.3.1b');
      const model = evaluateTestregel(testregel, [
        { steg: '2.2', svar: 'Ja' },
        { steg: '3.1', svar: 'bla bla' },
        { steg: '3.2', svar: 'Ja' },
        { steg: '3.3', svar: 'Nei' },
        { steg: '3.13', svar: 'Ja' },
        { steg: '3.14', svar: 'Ja' },
        { steg: '3.15', svar: 'Ja' },
      ]);

      expect(model.delutfall[0]).toMatchObject({
        nr: 0,
        tekst: 'Tabell er koda med &#x3C;table&#x3E;.',
        fasit: 'Ja',
      });
      expect(model.resultat).toMatchObject({
        type: 'avslutt',
        fasit: 'Ja',
        utfall:
          'Tabelltittel identifiserer innhaldet i tabellen. Tabell er koda med &#x3C;table&#x3E;.',
      });
    });
  });

  describe('delutfall med to parametere', () => {
    test('når delutfall er satt, og fasit stemmer med malen, så skal vi sette in teksten fra delutfallet', () => {
      const testregel = getTestregel('1.3.1b');
      const svar = [
        // vi trenger å havne på 3.14 med delutfall 0 = Nei
        { steg: '2.2', svar: 'Ja' },
        { steg: '3.1', svar: 'bla bla' },
        { steg: '3.2', svar: 'Ja' },
        { steg: '3.3', svar: 'Ja' },
        { steg: '3.4', svar: 'Nei' }, // dette steget gir delutfall 0 = Nei
        { steg: '3.13', svar: 'Ja' },
        { steg: '3.14', svar: 'Nei' },
      ];
      const model = evaluateTestregel(testregel, svar);

      expect(model.resultat).toMatchObject({
        type: 'avslutt',
        utfall:
          'Visuell tabelltittel er ikkje koda med &#x3C;caption&#x3E;. Tabell har overskriftsceller som ikkje er koda med &#x3C;th&#x3E;.',
        fasit: 'Nei',
      });
    });

    test('når delutfall er satt, og fasit ikke stemmer med malen, så skal vi ikke sette in teksten fra delutfallet', () => {
      const testregel = getTestregel('1.3.1b');
      const svar = [
        // vi trenger å havne på 3.14 med delutfall 0 = Ja
        { steg: '2.2', svar: 'Ja' },
        { steg: '3.1', svar: 'bla bla' },
        { steg: '3.2', svar: 'Ja' },
        { steg: '3.3', svar: 'Nei' }, // dette gir delutfall 0 = Ja
        { steg: '3.13', svar: 'Ja' },
        { steg: '3.14', svar: 'Nei' },
      ];
      const model = evaluateTestregel(testregel, svar);

      expect(model.resultat).toMatchObject({
        type: 'avslutt',
        utfall: 'Visuell tabelltittel er ikkje koda med &#x3C;caption&#x3E;. ',
        fasit: 'Nei',
      });
    });
  });

  test('når delutfall begynner med nr 1, så skal vi fortsatt kunne hente ut delutfall', () => {
    const testregel = getTestregel('nett-3.3.4b');
    const svar = [
      { steg: '2.2', svar: 'Ja' },
      { steg: '2.3', svar: 'Ja' },
      { steg: '3.1', svar: 'bla bla' },
      { steg: '3.3', svar: 'Ja' },
      { steg: '3.4', svar: 'Nei' },
      { steg: '3.7', svar: 'Ja' },
      { steg: '3.9', svar: 'Nei' },
    ];
    const model = evaluateTestregel(testregel, svar);

    expect(model.resultat).toMatchObject({
      type: 'avslutt',
      fasit: 'Nei',
      utfall:
        'Testsiden har funksjonalitet for sletting av brukerstyrt data:<br>- Testsiden har en mekanisme for å bekrefte sletting av brukterstyrt data. Mekanismen er ikke separat fra funksjonaliteten for å fullføre sletting.<br>- Det er ikke mulig å angre slettingen.',
    });
  });
});

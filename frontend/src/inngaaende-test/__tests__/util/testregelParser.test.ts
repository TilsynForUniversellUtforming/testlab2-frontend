import { describe, expect, it } from 'vitest';

import { TestingStepProperties } from '../../types';
import { parseTestregel } from '../../util/testregelParser';

const json =
  '{"namn":"1.3.2a Meiningsfylt leserekkefølge er ivareteken i koden.","id":"1.3.2a","testlabId":235,"versjon":"1.0","type":"Nett","spraak":"nn","kravTilSamsvar":"<p>Kravet kan oppfyllast på fleire måtar.</p>\\r\\n<ul>\\r\\n<li>Leserekkefølge på innhaldet i visning med CSS slått av, samanlikna med vanleg visning, er anten:\\r\\n<ul>\\r\\n<li>Den same, eller</li>\\r\\n<li>ei leserekkefølge som på annan måte presenterer det same meiningsinnhaldet.</li>\\r\\n</ul>\\r\\n</li>\\r\\n</ul>","side":"2.1","element":"3.1","kolonner":[{"title":"2.2"},{"title":"2.4"},{"title":"3.2"},{"title":"3.3"},{"title":"3.4"}],"steg":[{"stegnr":"2.1","spm":"Kva side testar du på?","ht":"Oppgi URL eller side-ID.","type":"tekst","label":"URL/Side:","datalist":"Sideutvalg","oblig":true,"ruting":{"alle":{"type":"gaaTil","steg":"2.2"}}},{"stegnr":"2.2","spm":"Finst det innhald på nettsida kor meiningsinnhaldet blir påvirka av rekkefølgjen som innhaldet blir presentert i?","ht":"<p>Ei rekkefølgje er meiningsfull dersom rekkefølga på innhaldet ikkje kan endrast utan å endre meiningsinnhaldet. </p><p>Eksempel på innhald som står i ei meiningsfylt rekkefølgje er tekst, tabellar og nummererte lister.</p><p>Unummererte lister er ikkje i ei meiningsfylt rekkefølgje.</p>","type":"jaNei","kilde":[],"ruting":{"ja":{"type":"gaaTil","steg":"2.3"},"nei":{"type":"ikkjeForekomst","utfall":"Testside har ikkje innhald der meiningsinnhaldet blir påvirka av rekkefølgja som innhaldet blir presentert i."}}},{"stegnr":"2.3","spm":"Opne nettsida i eit nytt nettlesarvindauge og slå av stilarket (CSS).","ht":"<p>Korleis du slår av CSS, avheng av kva nettlesar du brukar.</p>","type":"instruksjon","kilde":["C6"],"ruting":{"alle":{"type":"gaaTil","steg":"2.4"}}},{"stegnr":"2.4","spm":"Beskriv det lenka bilde","ht":"Du kan for eksempel beskrive motiv, plassering på sida, element som er i nærleiken.","type":"tekst","label":"Bilde:","multilinje":true,"oblig":true,"ruting":{"alle":{"type":"gaaTil","steg":"3.1"}}},{"stegnr":"3.1","spm":"Kva type funksjonalitet er elementet ein del av?","ht":"Velg frå alternativa under.","type":"radio","svarArray":["Skjema","Mediaspelar","Meny","Modalvindauge","Anna"],"ruting":{"alle":{"type":"gaaTil","steg":"3.2"}}},{"stegnr":"3.2","spm":"Må innhaldet vere i ei bestemt rekkefølgje for at du skal kunne forstå innhaldet?","ht":"<p>Meiningsinnhaldet skal ikkje vere endra, sjølv om rekkefølgja er ulik.</p><p>Merk at det kan vere fleire rekkefølgjer som gir same mening.</p>","type":"radio","svarArray":["Ja","Nei","Ikkje mogleg å verifisere"],"kilde":["SK"],"ruting":{"alt0":{"type":"ikkjeForekomst","utfall":"Bilde av tekst, som let seg tilpasse."},"alt1":{"type":"gaaTil","steg":"3.4"},"alt2":{"type":"gaaTil","steg":"3.4"}}},{"stegnr":"3.4","spm":"Beskriv det lenka bilde","ht":"Du kan for eksempel beskrive motiv, plassering på sida, element som er i nærleiken.","type":"tekst","label":"Bilde:","oblig":true,"ruting":{"alle":{"type":"avslutt","fasit":"Ja","utfall":"Nettside har mekanisme for forstørring til 200 %, utan tap av innhald eller funksjonalitet."}}}]}';

describe('parseJSONAndValidateSteg', () => {
  it('should get the keys sorted order and correct length', () => {
    const resultMap = parseTestregel(json);
    const keys = Array.from(resultMap.keys());

    expect(keys).toStrictEqual(['2.2', '2.3', '2.4', '3.1', '3.2', '3.4']);
  });

  it('should parse testregel with tekst', () => {
    const resultMap = parseTestregel(json);
    const expected: TestingStepProperties = {
      heading: 'Beskriv det lenka bilde',
      description:
        'Du kan for eksempel beskrive motiv, plassering på sida, element som er i nærleiken.',
      input: {
        inputType: 'tekst',
        inputSelectionOutcome: [
          {
            label: 'Bilde:',
            action: 'avslutt',
            fasit: 'Ja',
            utfall:
              'Nettside har mekanisme for forstørring til 200 %, utan tap av innhald eller funksjonalitet.',
          },
        ],
        required: true,
      },
    };

    const result = resultMap.get('3.4');

    expect(result).toMatchObject(expected);
  });

  it('should parse testregel with multiline', () => {
    const resultMap = parseTestregel(json);
    const expected: TestingStepProperties = {
      heading: 'Beskriv det lenka bilde',
      description:
        'Du kan for eksempel beskrive motiv, plassering på sida, element som er i nærleiken.',
      input: {
        inputType: 'multiline',
        inputSelectionOutcome: [
          { label: 'Bilde:', action: 'gaaTil', target: '3.1' },
        ],
        required: true,
      },
    };

    const result = resultMap.get('2.4');

    expect(result).toMatchObject(expected);
  });

  it('should parse testregel - jaNei', () => {
    const resultMap = parseTestregel(json);
    const expected: TestingStepProperties = {
      heading:
        'Finst det innhald på nettsida kor meiningsinnhaldet blir påvirka av rekkefølgjen som innhaldet blir presentert i?',
      description:
        'Ei rekkefølgje er meiningsfull dersom rekkefølga på innhaldet ikkje kan endrast utan å endre meiningsinnhaldet. Eksempel på innhald som står i ei meiningsfylt rekkefølgje er tekst, tabellar og nummererte lister. Unummererte lister er ikkje i ei meiningsfylt rekkefølgje.',
      input: {
        inputType: 'jaNei',
        inputSelectionOutcome: [
          { label: 'Ja', action: 'gaaTil', target: '2.3' },
          {
            label: 'Nei',
            action: 'ikkjeForekomst',
            utfall:
              'Testside har ikkje innhald der meiningsinnhaldet blir påvirka av rekkefølgja som innhaldet blir presentert i.',
          },
        ],
        required: false,
      },
    };

    const result = resultMap.get('2.2');

    expect(result).toMatchObject(expected);
  });

  it('should parse testregel - instruksjon', () => {
    const resultMap = parseTestregel(json);
    const expected: TestingStepProperties = {
      heading:
        'Opne nettsida i eit nytt nettlesarvindauge og slå av stilarket (CSS).',
      description: 'Korleis du slår av CSS, avheng av kva nettlesar du brukar.',
      input: {
        inputType: 'instruksjon',
        inputSelectionOutcome: [{ label: '', action: 'gaaTil', target: '2.4' }],
        required: false,
      },
    };

    const result = resultMap.get('2.3');

    expect(result).toMatchObject(expected);
  });

  it('should parse testregel - radio - alle', () => {
    const resultMap = parseTestregel(json);
    const expected: TestingStepProperties = {
      heading: 'Kva type funksjonalitet er elementet ein del av?',
      description: 'Velg frå alternativa under.',
      input: {
        inputType: 'radio',
        inputSelectionOutcome: [
          { label: 'Skjema', action: 'gaaTil', target: '3.2' },
          { label: 'Mediaspelar', action: 'gaaTil', target: '3.2' },
          { label: 'Meny', action: 'gaaTil', target: '3.2' },
          { label: 'Modalvindauge', action: 'gaaTil', target: '3.2' },
          { label: 'Anna', action: 'gaaTil', target: '3.2' },
        ],
        required: false,
      },
    };

    const result = resultMap.get('3.1');

    expect(result).toMatchObject(expected);
  });

  it('should parse testregel - radio - alternatives', () => {
    const resultMap = parseTestregel(json);
    const expected: TestingStepProperties = {
      heading:
        'Må innhaldet vere i ei bestemt rekkefølgje for at du skal kunne forstå innhaldet?',
      description:
        'Meiningsinnhaldet skal ikkje vere endra, sjølv om rekkefølgja er ulik. Merk at det kan vere fleire rekkefølgjer som gir same mening.',
      input: {
        inputType: 'radio',
        inputSelectionOutcome: [
          {
            label: 'Ja',
            action: 'ikkjeForekomst',
            utfall: 'Bilde av tekst, som let seg tilpasse.',
          },
          { label: 'Nei', action: 'gaaTil', target: '3.4' },
          {
            label: 'Ikkje mogleg å verifisere',
            action: 'gaaTil',
            target: '3.4',
          },
        ],
        required: false,
      },
    };

    const result = resultMap.get('3.2');

    expect(result).toMatchObject(expected);
  });
});

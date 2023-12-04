import { describe, expect, it } from 'vitest';

import { TestingStep } from '../../types';
import { parseJSONAndValidateSteg } from '../../util/translateUtil';

const json =
  '{"namn":"4.1.2c Iframe er identifiserte i koden","id":"4.1.2c","testlabId":248,"versjon":"1.0","type":"Nett","spraak":"nn","kravTilSamsvar":"<p>Der det er brukt iframe-elementet i koden, har iframe ein ledetekst som identifiserer innhaldet.</p>","side":"2.1","element":"3.1","kolonner":[{"title":"2.2"},{"title":"3.2"},{"title":"3.3"},{"title":"3.4"},{"title":"3.5"},{"title":"3.6"}],"steg":[{"stegnr":"2.1","spm":"Kva side testar du på?","ht":"Oppgi URL eller side-ID.","type":"tekst","label":"URL/Side:","datalist":"Sideutvalg","oblig":true,"ruting":{"alle":{"type":"gaaTil","steg":"2.2"}}},{"stegnr":"2.2","spm":"Har nettsida  &#x3C;iframe&#x3E;-element?","ht":"<p>Søk etter <code>&#x3C;iframe&#x3E;</code>-elementet i kjeldekoden til nettsida.</p>","type":"jaNei","kilde":[],"ruting":{"ja":{"type":"gaaTil","steg":"3.1"},"nei":{"type":"ikkjeForekomst","utfall":"Testside har ikkje iframe."}}},{"stegnr":"3.1","spm":"Beskriv iframen som skal vurderast.","ht":"<p>Du skal registrere og legge til data for kvart enkelt <code>&#x3C;iframe&#x3E;</code>-element.</p><p>Legg inn overskrift, eller andre stikkord som er slik at innhaldet kan identifiserast.</p>","type":"tekst","label":"Iframe element:","multilinje":true,"oblig":true,"ruting":{"alle":{"type":"gaaTil","steg":"3.2"}}},{"stegnr":"3.2","spm":"Har &#x3C;iframe&#x3E;-elementet attributtet \\"aria-label\\" ?","ht":"<p>Sjå i koden om du finn attributtet \\"aria-label\\" på <code>&#x3C;iframe&#x3E;</code>-elementet.</p><p><strong>MERK:</strong> Du skal ikkje vurdere kvaliteten på teksten.</p>","type":"jaNei","kilde":["ARIA14"],"ruting":{"ja":{"type":"gaaTil","steg":"3.6"},"nei":{"type":"gaaTil","steg":"3.3"}}},{"stegnr":"3.3","spm":"Har &#x3C;iframe&#x3E;-elementet attributtet \\"aria-labelledby\\" ?","ht":"Velg frå alternativa under.","type":"jaNei","kilde":["ARIA16"],"ruting":{"ja":{"type":"gaaTil","steg":"3.4"},"nei":{"type":"gaaTil","steg":"3.5"}}},{"stegnr":"3.4","spm":"Er aria-labelledby attributtet kopla til annan tekst på sida (lenkekontekst)?","ht":"<p>Gjer eit søk i koden på id i aria-labelledby. Dersom det finst fleire id-ar, skal du undersøke alle. Id-ane vil då vere skilt med mellomrom. (Aria-labelledby=\\"id1 id2\\").</p>","type":"jaNei","kilde":["ARIA16"],"ruting":{"ja":{"type":"gaaTil","steg":"3.6"},"nei":{"type":"gaaTil","steg":"3.5"}}},{"stegnr":"3.5","spm":"Har &#x3C;iframe&#x3E;-elementet eit title-attributt?","ht":"Du kan nytte kodeverktøyet i nettlesaren til å sjekke dette.","type":"jaNei","kilde":["H64"],"ruting":{"ja":{"type":"gaaTil","steg":"3.6"},"nei":{"type":"avslutt","fasit":"Nei","utfall":"Iframe er ikkje er kopla til ein ledetekst i koden."}}},{"stegnr":"3.6","spm":"Identifiserar ledeteksten innhaldet som ligg i &#x3C;iframe&#x3E;?","ht":"<p>Ta utgangspunktet i ledeteksten du fann i førre steg. Det er tilstrekkeleg at ledeteksten identifiserar innhaldet. Ledeteksten treng ikkje gi ei utfyllande skildring av innhaldet.</p><p>For reklame er det tilstrekkeleg at ledeteksten seier at det handlar om reklame.</p><p><strong>Merk:</strong> Ledeteksten skal vere på same språk som nettsida.</p>","type":"jaNei","kilde":["G108"],"ruting":{"ja":{"type":"avslutt","fasit":"Ja","utfall":"Iframe er kopla til ein ledetekst i koden. Ledeteksten identifiserar innhaldet i iframe."},"nei":{"type":"avslutt","fasit":"Nei","utfall":"Ledeteksten identifiserar ikkje innhaldet i iframe."}}}]}';

describe('parseJSONAndValidateSteg', () => {
  it('should parse an validatate json', () => {
    const resultMap = parseJSONAndValidateSteg(json);
    const expected: TestingStep = {
      heading: 'Kva side testar du på?',
      description: 'Oppgi URL eller side-ID.',
      input: {
        valueLabelList: ['URL/Side:'],
        required: true,
      },
      selectionOutcome: [{ action: 'gaaTil', target: '2.2' }],
    };

    const iterator = resultMap.entries();
    const firstStep = iterator.next().value;

    const [_, result] = firstStep;

    const resultJSON = JSON.stringify(result);
    const expectedJSON = JSON.stringify(expected);
    expect(resultJSON).toBe(expectedJSON);

    expect(resultMap.size).toBe(8);
  });
});

import { describe, expect, it } from 'vitest';

import {
  customUtfallValue,
  testformForenklaValidationSchema,
} from '../testformForenklaValidationSchema';

describe('testformForenklaValidationSchema', () => {
  it('accepts payload without svar', () => {
    const result = testformForenklaValidationSchema.safeParse({
      id: 1,
      testgrunnlagId: 2,
      loeysingId: 3,
      testregelId: 4,
      sideutvalId: 5,
      status: 'UnderArbeid',
      sistLagra: '2026-08-12T10:00:00.000Z',
      kommentar: 'Valfri kommentar',
      valgtUtfallIndex: 0,
      elementOmtale: 'Beskriving av elementet',
    });

    expect(result.success).toBe(true);
  });

  it('accepts payload with svar array', () => {
    const result = testformForenklaValidationSchema.safeParse({
      id: 1,
      testgrunnlagId: 2,
      loeysingId: 3,
      testregelId: 4,
      sideutvalId: 5,
      status: 'Ferdig',
      sistLagra: '2026-08-12T10:00:00.000Z',
      svar: [{ steg: '1', svar: 'ja' }],
      valgtUtfallIndex: 1,
      elementOmtale: 'Beskriving av elementet',
    });

    expect(result.success).toBe(true);
  });

  it('rejects payload missing elementOmtale', () => {
    const result = testformForenklaValidationSchema.safeParse({
      id: 1,
      testgrunnlagId: 2,
      loeysingId: 3,
      testregelId: 4,
      sideutvalId: 5,
      status: 'UnderArbeid',
      sistLagra: '2026-08-12T10:00:00.000Z',
      valgtUtfallIndex: 0,
    });

    expect(result.success).toBe(false);
  });

  it('accepts payload with optional elementOmtaleHtml', () => {
    const result = testformForenklaValidationSchema.safeParse({
      id: 1,
      testgrunnlagId: 2,
      loeysingId: 3,
      testregelId: 4,
      sideutvalId: 5,
      status: 'Ferdig',
      sistLagra: '2026-08-12T10:00:00.000Z',
      valgtUtfallIndex: 1,
      elementOmtale: 'Beskriving av elementet',
      elementOmtaleHtml: '<p>Beskriving</p>',
    });

    expect(result.success).toBe(true);
  });

  it('accepts payload with custom utfall', () => {
    const result = testformForenklaValidationSchema.safeParse({
      id: 1,
      testgrunnlagId: 2,
      loeysingId: 3,
      testregelId: 4,
      sideutvalId: 5,
      status: 'Ferdig',
      sistLagra: '2026-08-12T10:00:00.000Z',
      valgtUtfallIndex: customUtfallValue,
      customUtfallTestresultat: 'brot',
      customUtfallBeskrivelse: 'Eigendefinert beskrivelse',
      elementOmtale: 'Beskriving av elementet',
    });

    expect(result.success).toBe(true);
  });

  it('rejects custom utfall without required custom fields', () => {
    const result = testformForenklaValidationSchema.safeParse({
      id: 1,
      testgrunnlagId: 2,
      loeysingId: 3,
      testregelId: 4,
      sideutvalId: 5,
      status: 'Ferdig',
      sistLagra: '2026-08-12T10:00:00.000Z',
      valgtUtfallIndex: customUtfallValue,
      elementOmtale: 'Beskriving av elementet',
    });

    expect(result.success).toBe(false);
    expect(result.error?.flatten().fieldErrors.customUtfallTestresultat).toEqual([
      'Vel resultat for eigendefinert utfall',
    ]);
    expect(result.error?.flatten().fieldErrors.customUtfallBeskrivelse).toEqual([
      'Skriv inn eigendefinert utfall',
    ]);
  });
});


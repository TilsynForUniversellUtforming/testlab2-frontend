import { describe, expect, it } from 'vitest';

import { testreglarValidationSchema } from './testreglarValidationSchema';

type TestregelInput = Record<string, unknown>;

const createValidBase = (overrides: Partial<TestregelInput> = {}): TestregelInput => ({
  namn: 'Testregel namn',
  kravId: 1,
  modus: 'manuell',
  testregelSchema: '{"steg":[]}',
  testregelId: 'TR-001',
  versjon: 1,
  status: 'publisert',
  type: 'nett',
  spraak: 'nn',
  ...overrides,
});

describe('testreglarValidationSchema conditional required fields', () => {
  it('fails when modus is manuell-forenkla and definition.description is blank', () => {
    const result = testreglarValidationSchema.safeParse(
      createValidBase({
        modus: 'manuell-forenkla',
        testregelSchema: undefined,
        definition: {
          description: '   ',
          utfall: [],
        },
      })
    );

    expect(result.success).toBe(false);

    if (!result.success) {
      expect(result.error.issues).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            message: 'Instruksjon kan ikkje vera tom',
            path: ['definition', 'description'],
          }),
        ])
      );
    }
  });

  it('passes when modus is manuell-forenkla with definition.description and no testregelSchema', () => {
    const result = testreglarValidationSchema.safeParse(
      createValidBase({
        modus: 'manuell-forenkla',
        testregelSchema: undefined,
        definition: {
          description: 'Instruksjon for testen',
          utfall: [],
        },
      })
    );

    expect(result.success).toBe(true);
  });

  it('fails when modus is not manuell-forenkla and testregelSchema is blank', () => {
    const result = testreglarValidationSchema.safeParse(
      createValidBase({
        modus: 'semi-automatisk',
        testregelSchema: '  ',
      })
    );

    expect(result.success).toBe(false);

    if (!result.success) {
      expect(result.error.issues).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            message: 'Testregel kan ikkje vera tom',
            path: ['testregelSchema'],
          }),
        ])
      );
    }
  });

  it('passes when modus is not manuell-forenkla and testregelSchema is set', () => {
    const result = testreglarValidationSchema.safeParse(
      createValidBase({
        modus: 'semi-automatisk',
        testregelSchema: 'schema',
      })
    );

    expect(result.success).toBe(true);
  });
});

